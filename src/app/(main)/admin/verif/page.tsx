"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Timestamp,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { getDownloadURL, ref as storageRef } from "firebase/storage";
import { CheckCircle2, FileText, ShieldCheck, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRequireAdmin } from "@/hooks/useRequireAdmin";
import { useToast } from "@/hooks/use-toast";
import { db, functions, storage } from "@/lib/firebase";

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  dateStyle: "short",
  timeStyle: "short",
};

type VerifStatus = "pending" | "approved" | "rejected";

type VerifDoc = {
  uid?: string;
  role?: "etudiant" | "entreprise";
  status?: VerifStatus;
  idDocPath?: string;
  schoolProofPath?: string;
  submittedAt?: Timestamp | null;
  reviewedAt?: Timestamp | null;
  reviewerId?: string | null;
};

type VerifItem = VerifDoc & { id: string };

const STATUS_VARIANTS: Record<VerifStatus, "default" | "secondary" | "destructive" | "outline"> = {
  approved: "default",
  pending: "secondary",
  rejected: "destructive",
};

export default function AdminVerifPage() {
  const { ready } = useRequireAdmin();
  const { toast } = useToast();
  const [items, setItems] = useState<VerifItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [acting, setActing] = useState<string | null>(null);
  const setVerificationStatus = httpsCallable<
    { uid: string; status: Exclude<VerifStatus, "pending"> },
    { ok: boolean }
  >(functions, "setVerificationStatus");

  useEffect(() => {
    if (!ready) {
      return;
    }

    setLoading(true);
    const q = query(collection(db, "verifications"), orderBy("submittedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const nextItems = snapshot.docs.map(mapVerificationDoc);
      setItems(nextItems);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [ready]);

  async function handleAction(targetUid: string, status: Exclude<VerifStatus, "pending">) {
    try {
      setActing(`${targetUid}:${status}`);
      await setVerificationStatus({ uid: targetUid, status });
      toast({
        title: status === "approved" ? "Vérification approuvée" : "Vérification rejetée",
        description:
          status === "approved"
            ? "L’utilisateur est désormais marqué comme vérifié."
            : "Le dossier a été rejeté. L’utilisateur sera notifié.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Action impossible",
        description: "Une erreur est survenue lors de la mise à jour du statut.",
      });
    } finally {
      setActing(null);
    }
  }

  async function openFile(path?: string | null) {
    if (!path) return;

    try {
      setDownloading(path);
      const url = await getDownloadURL(storageRef(storage, path));
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error(error);
      toast({
        title: "Téléchargement impossible",
        description: "Vérifie les règles Storage ou réessaie plus tard.",
      });
    } finally {
      setDownloading(null);
    }
  }

  if (!ready) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border-none shadow-lg">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <CardTitle>Vérifications d’identité</CardTitle>
          </div>
          <div className="text-sm text-muted-foreground">
            {loading ? "Chargement…" : `${items.length} dossier${items.length > 1 ? "s" : ""}`}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!loading && items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun dossier pour le moment.</p>
          ) : (
            items.map((item) => {
              const status: VerifStatus = item.status ?? "pending";
              const submitted = item.submittedAt?.toDate().toLocaleString("fr-FR", DATE_FORMAT) ?? "—";
              const reviewed = item.reviewedAt?.toDate().toLocaleString("fr-FR", DATE_FORMAT) ?? "—";
              const uid = item.uid ?? item.id;
              return (
                <div key={item.id} className="rounded-2xl border bg-card p-4 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex flex-1 flex-col gap-3">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                        <Badge variant={STATUS_VARIANTS[status]} className="capitalize w-fit">
                          {status}
                        </Badge>
                        <div className="space-y-1 text-sm">
                          <p className="font-semibold">UID : {uid}</p>
                          <p className="text-muted-foreground">
                            Rôle : <span className="capitalize">{item.role ?? "etudiant"}</span>
                            {" • "}Soumis : {submitted}
                            {" • "}Examiné : {reviewed}
                            {item.reviewerId ? ` • Relecteur : ${item.reviewerId}` : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openFile(item.idDocPath)}
                        disabled={!item.idDocPath || downloading === item.idDocPath}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Carte / Passeport
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openFile(item.schoolProofPath)}
                        disabled={!item.schoolProofPath || downloading === item.schoolProofPath}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Attestation
                      </Button>
                      <Separator orientation="vertical" className="hidden h-8 sm:block" />
                      <Button
                        size="sm"
                        onClick={() => handleAction(uid, "approved")}
                        disabled={status === "approved" || acting === `${uid}:approved`}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approuver
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleAction(uid, "rejected")}
                        disabled={status === "rejected" || acting === `${uid}:rejected`}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Rejeter
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function mapVerificationDoc(doc: QueryDocumentSnapshot<DocumentData>): VerifItem {
  return { id: doc.id, ...(doc.data() as VerifDoc) };
}
