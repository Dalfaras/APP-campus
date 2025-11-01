"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, FileText, ShieldCheck, UploadCloud } from "lucide-react";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { db, storage } from "@/lib/firebase";

const requiredDocuments = [
  {
    id: "idDocument",
    title: "Carte d'identité ou passeport",
    description:
      "Document officiel et lisible comprenant ta photo, ton nom complet et la date d'expiration. Le document doit être en cours de validité.",
    acceptedFormats: ".pdf,.jpg,.jpeg,.png",
  },
  {
    id: "schoolCertificate",
    title: "Attestation de scolarité",
    description:
      "Document délivré par ton établissement pour l'année en cours. Les certificats de scolarité ou relevés de frais d'inscription sont acceptés.",
    acceptedFormats: ".pdf,.jpg,.jpeg,.png",
  },
] as const;

type DocumentIdentifier = (typeof requiredDocuments)[number]["id"];

type DocumentStatus = "idle" | "selected" | "uploading" | "uploaded";

type DocumentState = {
  file?: File;
  status: DocumentStatus;
  fileName?: string;
  storagePath?: string | null;
};

type VerificationStatus = "not_submitted" | "pending" | "approved" | "rejected";

const documentStatusLabels: Record<DocumentStatus, { label: string; description: string }> = {
  idle: {
    label: "Non envoyé",
    description: "Aucun fichier n'a encore été sélectionné.",
  },
  selected: {
    label: "Prêt à envoyer",
    description: "Fichier sélectionné, clique sur Envoyer pour vérifier.",
  },
  uploading: {
    label: "En cours d'envoi",
    description: "Téléversement sécurisé sur nos serveurs Firebase…",
  },
  uploaded: {
    label: "Envoyé",
    description: "Document reçu, en attente de validation manuelle.",
  },
};

const verificationStatusConfig: Record<VerificationStatus, { label: string; description: string; badgeVariant: "default" | "secondary" | "destructive" | "outline" }> = {
  not_submitted: {
    label: "Documents requis",
    description: "Ajoute tes pièces justificatives pour démarrer la vérification.",
    badgeVariant: "outline",
  },
  pending: {
    label: "En cours de revue",
    description: "Notre équipe contrôle actuellement la conformité de tes documents.",
    badgeVariant: "secondary",
  },
  approved: {
    label: "Compte vérifié",
    description: "Toutes les fonctionnalités premium de CampusConnect sont débloquées.",
    badgeVariant: "default",
  },
  rejected: {
    label: "Documents rejetés",
    description: "Tes pièces n'ont pas pu être validées. Consulte le détail ci-dessous.",
    badgeVariant: "destructive",
  },
};

const verificationSteps = [
  {
    id: "upload",
    title: "Téléversement des pièces",
    description: "Carte d'identité et attestation de scolarité obligatoires.",
    icon: UploadCloud,
  },
  {
    id: "review",
    title: "Contrôle de conformité",
    description: "Un membre de l'équipe APP-Campus vérifie les documents et compare les informations.",
    icon: ShieldCheck,
  },
  {
    id: "result",
    title: "Résultat et activation",
    description: "Le statut du compte est mis à jour automatiquement (approved / rejected).",
    icon: CheckCircle2,
  },
] as const;

const progressByStatus: Record<VerificationStatus, number> = {
  not_submitted: 20,
  pending: 60,
  approved: 100,
  rejected: 60,
};

const stepIndexByStatus: Record<VerificationStatus, number> = {
  not_submitted: 0,
  pending: 1,
  approved: 2,
  rejected: 2,
};

export default function IdentityVerificationPage() {
  const { user } = useRequireAuth();
  const [documents, setDocuments] = useState<Record<DocumentIdentifier, DocumentState>>(() =>
    requiredDocuments.reduce((acc, docConfig) => {
      acc[docConfig.id] = { status: "idle" } satisfies DocumentState;
      return acc;
    }, {} as Record<DocumentIdentifier, DocumentState>)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("not_submitted");
  const [submittedAt, setSubmittedAt] = useState<Date | null>(null);
  const [userMessage, setUserMessage] = useState("");
  const [adminComment, setAdminComment] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const unsubscribeUser = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      const data = snapshot.data();
      setUserRole((data?.role as string | undefined) ?? null);
    });

    return () => unsubscribeUser();
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const unsubscribe = onSnapshot(doc(db, "verifications", user.uid), (snapshot) => {
      if (!snapshot.exists()) {
        setVerificationStatus("not_submitted");
        setSubmittedAt(null);
        setAdminComment(null);
        return;
      }

      const data = snapshot.data();
      const status = (data.status as VerificationStatus | undefined) ?? "not_submitted";
      setVerificationStatus(status);
      setSubmittedAt(data.submittedAt?.toDate?.() ?? null);
      setAdminComment((data.adminComment as string | undefined) ?? null);
      setUserMessage((data.userMessage as string | undefined) ?? "");

      setDocuments((prev) => {
        const nextState: Record<DocumentIdentifier, DocumentState> = { ...prev };
        nextState.idDocument = {
          ...nextState.idDocument,
          status: data.idDocPath ? "uploaded" : nextState.idDocument.status,
          storagePath: (data.idDocPath as string | undefined) ?? null,
          fileName: (data.idDocFileName as string | undefined) ?? nextState.idDocument.fileName,
        };
        nextState.schoolCertificate = {
          ...nextState.schoolCertificate,
          status: data.schoolProofPath ? "uploaded" : nextState.schoolCertificate.status,
          storagePath: (data.schoolProofPath as string | undefined) ?? null,
          fileName: (data.schoolProofFileName as string | undefined) ?? nextState.schoolCertificate.fileName,
        };
        return nextState;
      });
    });

    return () => unsubscribe();
  }, [user]);

  const handleFileChange = (id: DocumentIdentifier, file?: File) => {
    setDocuments((prev) => ({
      ...prev,
      [id]: {
        file,
        fileName: file?.name,
        status: file ? "selected" : "idle",
        storagePath: prev[id]?.storagePath ?? null,
      },
    }));
  };

  const resetForResubmission = useCallback(() => {
    setVerificationStatus("not_submitted");
    setAdminComment(null);
    setSubmittedAt(null);
    setUserMessage("");
    setDocuments((prev) => {
      const nextState: Record<DocumentIdentifier, DocumentState> = { ...prev };
      requiredDocuments.forEach((docConfig) => {
        nextState[docConfig.id] = {
          status: "idle",
        };
      });
      return nextState;
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || !user) return;

    const missingDocuments = requiredDocuments.filter((docConfig) => !documents[docConfig.id]?.file);

    if (missingDocuments.length > 0) {
      toast({
        title: "Documents manquants",
        description: "Merci de sélectionner la carte d'identité et l'attestation de scolarité.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setDocuments((prev) => {
        const nextState: Record<DocumentIdentifier, DocumentState> = { ...prev };
        requiredDocuments.forEach((docConfig) => {
          nextState[docConfig.id] = {
            ...nextState[docConfig.id],
            status: "uploading",
          };
        });
        return nextState;
      });

      const uploads = await Promise.all(
        requiredDocuments.map(async (docConfig) => {
          const file = documents[docConfig.id]?.file;
          if (!file) {
            throw new Error("Fichier manquant pour " + docConfig.title);
          }
          const storagePath = `verifications/${user.uid}/${docConfig.id}-${Date.now()}-${file.name}`;
          const storageRef = ref(storage, storagePath);
          await uploadBytes(storageRef, file, {
            contentType: file.type || undefined,
          });
          return [docConfig.id, { storagePath, fileName: file.name }] as const;
        })
      );

      const uploadMap = Object.fromEntries(uploads) as Record<DocumentIdentifier, { storagePath: string; fileName: string }>;

      await setDoc(
        doc(db, "verifications", user.uid),
        {
          uid: user.uid,
          role: userRole ?? "etudiant",
          status: "pending",
          idDocPath: uploadMap.idDocument.storagePath,
          idDocFileName: uploadMap.idDocument.fileName,
          schoolProofPath: uploadMap.schoolCertificate.storagePath,
          schoolProofFileName: uploadMap.schoolCertificate.fileName,
          userMessage: userMessage.trim() ? userMessage.trim() : null,
          submittedAt: serverTimestamp(),
          reviewedAt: null,
          reviewerId: null,
        },
        { merge: true }
      );

      toast({
        title: "Documents envoyés avec succès",
        description: "Ta demande est maintenant en cours d'examen par notre équipe.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Échec de l'envoi",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors du téléversement.",
        variant: "destructive",
      });
      setDocuments((prev) => {
        const nextState: Record<DocumentIdentifier, DocumentState> = { ...prev };
        requiredDocuments.forEach((docConfig) => {
          nextState[docConfig.id] = {
            ...nextState[docConfig.id],
            status: prev[docConfig.id]?.file ? "selected" : "idle",
          };
        });
        return nextState;
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeStepIndex = stepIndexByStatus[verificationStatus];
  const overallStatus = verificationStatusConfig[verificationStatus];

  const nextAction = useMemo(() => {
    switch (verificationStatus) {
      case "not_submitted":
        return "Téléverse tes deux documents pour lancer l'examen.";
      case "pending":
        return "Nous validons manuellement ta carte d'identité et ton attestation. Compte 24h ouvrées.";
      case "approved":
        return "Ton identité est confirmée. Profite des fonctionnalités premium (match pro, messages illimités, etc.).";
      case "rejected":
        return "Ajoute des documents mis à jour ou contacte le support CampusConnect.";
      default:
        return "";
    }
  }, [verificationStatus]);

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="flex flex-col gap-8">
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Vérification d'identité</CardTitle>
              <CardDescription>
                Assure la sécurité de la communauté en validant ton profil avec deux documents obligatoires.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-start justify-between gap-4 rounded-2xl bg-muted/40 p-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Statut actuel</p>
                  <div className="mt-2 flex items-center gap-3">
                    <Badge variant={overallStatus.badgeVariant}>{overallStatus.label}</Badge>
                    <span className="text-sm text-muted-foreground">{overallStatus.description}</span>
                  </div>
                </div>
                <div className="hidden text-right text-sm text-muted-foreground sm:block">
                  {submittedAt ? (
                    <p>
                      Demandé le {" "}
                      <span className="font-medium text-foreground">
                        {submittedAt.toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </p>
                  ) : (
                    <p>Aucun envoi pour le moment.</p>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6">
                  {requiredDocuments.map((docConfig) => {
                    const state = documents[docConfig.id];
                    const statusInfo = documentStatusLabels[state?.status ?? "idle"];

                    return (
                      <div key={docConfig.id} className="rounded-2xl border bg-card p-5 shadow-sm">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-base font-semibold text-foreground">{docConfig.title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{docConfig.description}</p>
                            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Formats acceptés : {docConfig.acceptedFormats.split(",").join(", ")}
                            </p>
                          </div>
                          <Badge variant={state?.status === "uploaded" ? "default" : state?.status === "uploading" ? "secondary" : "outline"}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1">
                            <Label htmlFor={`file-${docConfig.id}`} className="sr-only">
                              {docConfig.title}
                            </Label>
                            <Input
                              id={`file-${docConfig.id}`}
                              type="file"
                              accept={docConfig.acceptedFormats}
                              onChange={(event) => handleFileChange(docConfig.id, event.target.files?.[0])}
                              disabled={isSubmitting || verificationStatus === "pending"}
                            />
                            <p className="mt-2 text-xs text-muted-foreground">{statusInfo.description}</p>
                          </div>
                          {state?.file || state?.fileName ? (
                            <div className="rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">
                              <p className="font-medium text-foreground">{state.file?.name ?? state.fileName}</p>
                              {state.file && (
                                <p className="text-xs">
                                  {(state.file.size / 1024).toFixed(0)} Ko • {state.file.type || "Format détecté automatiquement"}
                                </p>
                              )}
                              {!state.file && state.fileName && <p className="text-xs">Document transmis précédemment</p>}
                            </div>
                          ) : (
                            <div className="rounded-xl border border-dashed border-muted-foreground/20 p-4 text-center text-xs text-muted-foreground">
                              Aucun fichier sélectionné pour le moment.
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">Les téléversements sont chiffrés et stockés sur Firebase Storage (région Europe-West).</p>
                  <Button type="submit" disabled={isSubmitting || verificationStatus === "pending"} className="sm:w-auto">
                    {isSubmitting ? "Envoi en cours…" : "Envoyer pour vérification"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <CardTitle>Suivi en temps réel</CardTitle>
              <CardDescription>Comprends où en est ton dossier et ce que tu dois faire ensuite.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-2xl bg-muted/50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Prochaine étape</p>
                    <p className="mt-1 text-base font-semibold text-foreground">{nextAction}</p>
                  </div>
                  <Clock3 className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">Progression</span>
                  <span className="text-muted-foreground">{progressByStatus[verificationStatus]}%</span>
                </div>
                <Progress value={progressByStatus[verificationStatus]} />
              </div>

              <div className="space-y-6">
                {verificationSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = activeStepIndex > index;
                  const isCurrent = activeStepIndex === index;

                  return (
                    <div key={step.id} className="flex gap-4">
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border ${
                          isCompleted
                            ? "border-primary bg-primary text-primary-foreground"
                            : isCurrent
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : "border-muted bg-background text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">{step.title}</p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                        {isCurrent && verificationStatus === "rejected" && adminComment && (
                          <p className="text-xs font-medium text-destructive">{adminComment}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator />

              <div className="space-y-4 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">Contact vérification</p>
                <p>
                  Besoin d'aide ? Écris à <span className="font-medium text-foreground">verification@app-campus.fr</span>.
                </p>
                <p>Délai moyen : <span className="font-medium text-foreground">24h ouvrées</span>.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Pourquoi demander ces documents ?</CardTitle>
              <CardDescription>Garantir un espace de confiance entre étudiants, écoles et entreprises partenaires.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" aria-hidden="true" />
                <div>
                  <p className="font-medium text-foreground">Sécurité renforcée</p>
                  <p>Empêche la création de faux comptes et protège les membres lors des matchs et des rencontres.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-5 w-5 text-primary" aria-hidden="true" />
                <div>
                  <p className="font-medium text-foreground">Obligation contractuelle</p>
                  <p>Les écoles partenaires exigent la validation de l'identité pour accéder aux espaces premium (coworking, offres, etc.).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" aria-hidden="true" />
                <div>
                  <p className="font-medium text-foreground">Activation automatique</p>
                  <p>
                    Une fois validé, ton profil passe en <span className="font-medium text-foreground">isVerified = true</span> dans Firestore et déverrouille les fonctionnalités avancées.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes et commentaires du support</CardTitle>
              <CardDescription>En cas de rejet, un commentaire explicatif sera affiché ici.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {verificationStatus === "rejected" ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertTriangle className="mt-0.5 h-4 w-4" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-destructive">Action requise</p>
                      <p>{adminComment ?? "Documents illisibles. Merci de renvoyer une version en haute qualité."}</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={resetForResubmission}>
                    Réessayer l'envoi
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>
                    Aucun commentaire pour le moment. Lorsque ton dossier sera examiné, tu recevras une notification et un éventuel message ici.
                  </p>
                  <Textarea
                    placeholder="Besoin d'ajouter une précision pour l'équipe vérification (facultatif)."
                    value={userMessage}
                    onChange={(event) => setUserMessage(event.target.value)}
                    disabled={verificationStatus === "approved" || verificationStatus === "pending"}
                  />
                  <p className="text-xs">Les informations ajoutées sont transmises lors de la prochaine soumission.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
