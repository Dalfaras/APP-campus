'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock3, FileText, ShieldCheck, UploadCloud } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const requiredDocuments = [
  {
    id: 'idDocument',
    title: "Carte d'identité ou passeport",
    description:
      "Document officiel et lisible comprenant ta photo, ton nom complet et la date d'expiration. Le document doit être en cours de validité.",
    acceptedFormats: '.pdf,.jpg,.jpeg,.png',
  },
  {
    id: 'schoolCertificate',
    title: 'Attestation de scolarité',
    description:
      "Document délivré par ton établissement pour l'année en cours. Les certificats de scolarité ou relevés de frais d'inscription sont acceptés.",
    acceptedFormats: '.pdf,.jpg,.jpeg,.png',
  },
] as const;

type DocumentStatus = 'idle' | 'selected' | 'uploading' | 'uploaded';

type DocumentState = {
  file?: File;
  status: DocumentStatus;
};

type VerificationStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected';

const documentStatusLabels: Record<DocumentStatus, { label: string; description: string }> = {
  idle: {
    label: 'Non envoyé',
    description: 'Aucun fichier n\'a encore été sélectionné.',
  },
  selected: {
    label: 'Prêt à envoyer',
    description: 'Fichier sélectionné, clique sur Envoyer pour vérifier.',
  },
  uploading: {
    label: 'En cours d\'envoi',
    description: 'Téléversement sécurisé sur nos serveurs Firebase…',
  },
  uploaded: {
    label: 'Envoyé',
    description: 'Document reçu, en attente de validation manuelle.',
  },
};

const verificationStatusConfig: Record<VerificationStatus, { label: string; description: string; badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  not_submitted: {
    label: 'Documents requis',
    description: 'Ajoute tes pièces justificatives pour démarrer la vérification.',
    badgeVariant: 'outline',
  },
  pending: {
    label: 'En cours de revue',
    description: 'Notre équipe contrôle actuellement la conformité de tes documents.',
    badgeVariant: 'secondary',
  },
  approved: {
    label: 'Compte vérifié',
    description: 'Toutes les fonctionnalités premium de CampusConnect sont débloquées.',
    badgeVariant: 'default',
  },
  rejected: {
    label: 'Documents rejetés',
    description: 'Tes pièces n\'ont pas pu être validées. Consulte le détail ci-dessous.',
    badgeVariant: 'destructive',
  },
};

const verificationSteps = [
  {
    id: 'upload',
    title: 'Téléversement des pièces',
    description: 'Carte d\'identité et attestation de scolarité obligatoires.',
    icon: UploadCloud,
  },
  {
    id: 'review',
    title: 'Contrôle de conformité',
    description: 'Un membre de l\'équipe APP-Campus vérifie les documents et compare les informations.',
    icon: ShieldCheck,
  },
  {
    id: 'result',
    title: 'Résultat et activation',
    description: 'Le statut du compte est mis à jour automatiquement (approved / rejected).',
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
  const [documents, setDocuments] = useState<Record<(typeof requiredDocuments)[number]['id'], DocumentState>>(() =>
    requiredDocuments.reduce(
      (acc, doc) => {
        acc[doc.id] = { status: 'idle' } satisfies DocumentState;
        return acc;
      },
      {} as Record<(typeof requiredDocuments)[number]['id'], DocumentState>
    )
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('not_submitted');
  const [submittedAt, setSubmittedAt] = useState<Date | null>(null);
  const [userMessage, setUserMessage] = useState('');

  const activeStepIndex = stepIndexByStatus[verificationStatus];

  const handleFileChange = (id: (typeof requiredDocuments)[number]['id'], file?: File) => {
    setDocuments((prev) => ({
      ...prev,
      [id]: {
        file,
        status: file ? 'selected' : 'idle',
      },
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const missingDocuments = requiredDocuments.filter((doc) => !documents[doc.id]?.file);

    if (missingDocuments.length > 0) {
      toast({
        title: 'Documents manquants',
        description: 'Merci de sélectionner la carte d\'identité et l\'attestation de scolarité.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    setDocuments((prev) => {
      const updated = { ...prev } as typeof prev;
      requiredDocuments.forEach((doc) => {
        updated[doc.id] = {
          ...updated[doc.id],
          status: 'uploading',
        };
      });
      return updated;
    });

    await new Promise((resolve) => setTimeout(resolve, 1200));

    setDocuments((prev) => {
      const updated = { ...prev } as typeof prev;
      requiredDocuments.forEach((doc) => {
        updated[doc.id] = {
          ...updated[doc.id],
          status: 'uploaded',
        };
      });
      return updated;
    });

    setSubmittedAt(new Date());
    setVerificationStatus('pending');
    toast({
      title: 'Documents envoyés avec succès',
      description: "Ta demande est maintenant en cours d'examen par notre équipe.",
    });

    setIsSubmitting(false);
  };

  const overallStatus = verificationStatusConfig[verificationStatus];

  const nextAction = useMemo(() => {
    switch (verificationStatus) {
      case 'not_submitted':
        return "Téléverse tes deux documents pour lancer l'examen.";
      case 'pending':
        return "Nous validons manuellement ta carte d'identité et ton attestation. Compte 24h ouvrées.";
      case 'approved':
        return 'Ton identité est confirmée. Profite des fonctionnalités premium (match pro, messages illimités, etc.).';
      case 'rejected':
        return 'Ajoute des documents mis à jour ou contacte le support CampusConnect.';
      default:
        return '';
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
                      Demandé le{' '}
                      <span className="font-medium text-foreground">
                        {submittedAt.toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
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
                  {requiredDocuments.map((doc) => {
                    const state = documents[doc.id];
                    const statusInfo = documentStatusLabels[state?.status ?? 'idle'];

                    return (
                      <div key={doc.id} className="rounded-2xl border bg-card p-5 shadow-sm">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-base font-semibold text-foreground">{doc.title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{doc.description}</p>
                            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Formats acceptés : {doc.acceptedFormats.split(',').join(', ')}
                            </p>
                          </div>
                          <Badge variant={state?.status === 'uploaded' ? 'default' : state?.status === 'uploading' ? 'secondary' : 'outline'}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1">
                            <Label htmlFor={`file-${doc.id}`} className="sr-only">
                              {doc.title}
                            </Label>
                            <Input
                              id={`file-${doc.id}`}
                              type="file"
                              accept={doc.acceptedFormats}
                              onChange={(event) => handleFileChange(doc.id, event.target.files?.[0])}
                              disabled={isSubmitting}
                            />
                            <p className="mt-2 text-xs text-muted-foreground">{statusInfo.description}</p>
                          </div>
                          {state?.file ? (
                            <div className="rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">
                              <p className="font-medium text-foreground">{state.file.name}</p>
                              <p className="text-xs">
                                {(state.file.size / 1024).toFixed(0)} Ko • {state.file.type || 'Format détecté automatiquement'}
                              </p>
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
                  <Button type="submit" disabled={isSubmitting} className="sm:w-auto">
                    {isSubmitting ? 'Envoi en cours…' : 'Envoyer pour vérification'}
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
                            ? 'border-primary bg-primary text-primary-foreground'
                            : isCurrent
                              ? 'border-primary/40 bg-primary/10 text-primary'
                              : 'border-muted bg-background text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">{step.title}</p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                        {isCurrent && verificationStatus === 'rejected' && (
                          <p className="text-xs font-medium text-destructive">Documents refusés : vérifie la lisibilité ou la validité.</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator />

              <div className="space-y-4 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">Contact vérification</p>
                <p>Besoin d'aide ? Écris à <span className="font-medium text-foreground">verification@app-campus.fr</span>.</p>
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
                  <p>Une fois validé, ton profil passe en <span className="font-medium text-foreground">isVerified = true</span> dans Firestore et déverrouille les fonctionnalités avancées.</p>
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
              {verificationStatus === 'rejected' ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertTriangle className="mt-0.5 h-4 w-4" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-destructive">Action requise</p>
                      <p>Documents illisibles. Merci de renvoyer une version en haute qualité.</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setVerificationStatus('not_submitted')}>
                    Réessayer l'envoi
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>Aucun commentaire pour le moment. Lorsque ton dossier sera examiné, tu recevras une notification et un éventuel message ici.</p>
                  <Textarea
                    placeholder="Besoin d\'ajouter une précision pour l\'équipe vérification (facultatif)."
                    value={userMessage}
                    onChange={(event) => setUserMessage(event.target.value)}
                    disabled={verificationStatus === 'approved'}
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
