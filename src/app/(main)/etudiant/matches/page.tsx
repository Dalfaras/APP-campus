"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from "firebase/firestore";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { db } from "@/lib/firebase";

interface MatchItem {
  id: string;
  companyId: string;
  status: string;
  updatedAt?: Date | null;
  companyName?: string | null;
}

export default function StudentMatchesPage() {
  const { user } = useRequireAuth();
  const { toast } = useToast();
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }

    const matchesQuery = query(
      collection(db, "matches"),
      where("studentId", "==", user.uid),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(
      matchesQuery,
      async (snapshot) => {
        const baseMatches: MatchItem[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            companyId: data.companyId as string,
            status: data.status as string,
            updatedAt: data.updatedAt?.toDate?.() ?? null,
          };
        });

        const uniqueCompanyIds = Array.from(new Set(baseMatches.map((item) => item.companyId))).filter(Boolean);
        const companyDocs = await Promise.all(
          uniqueCompanyIds.map(async (companyId) => {
            const companySnap = await getDoc(doc(db, "users", companyId));
            return {
              companyId,
              companyName: companySnap.exists() ? (companySnap.data()?.companyName as string | undefined) ?? companySnap.data()?.displayName ?? null : null,
            };
          })
        );

        const companyNameMap = new Map(companyDocs.map((item) => [item.companyId, item.companyName]));

        setMatches(
          baseMatches.map((item) => ({
            ...item,
            companyName: companyNameMap.get(item.companyId) ?? null,
          }))
        );
        setIsLoading(false);
      },
      (error) => {
        console.error(error);
        toast({
          title: "Chargement des matchs impossible",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [toast, user]);

  const groupedMatches = useMemo(() => {
    return matches.reduce(
      (acc, match) => {
        acc[match.status] = acc[match.status] ? [...acc[match.status], match] : [match];
        return acc;
      },
      {} as Record<string, MatchItem[]>
    );
  }, [matches]);

  return (
    <div className="container mx-auto flex flex-col gap-8 px-4 py-8 md:py-12">
      <div className="space-y-2 text-center">
        <h1 className="font-headline text-3xl font-bold">Mes matchs</h1>
        <p className="text-muted-foreground">
          Retrouvez les entreprises avec lesquelles vous avez manifesté votre intérêt et suivez vos conversations.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild variant="secondary">
            <Link href="/annonces">Explorer les annonces</Link>
          </Button>
          <Button asChild>
            <Link href="/messages">Ouvrir la messagerie</Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="rounded-2xl">
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="mt-2 h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : matches.length === 0 ? (
        <Card className="rounded-2xl border-dashed">
          <CardHeader>
            <CardTitle>Aucun match pour le moment</CardTitle>
            <CardDescription>
              Cliquez sur "Je suis intéressé" depuis les annonces pour démarrer une conversation avec une entreprise.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/annonces">Voir les annonces disponibles</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {Object.entries(groupedMatches).map(([status, items]) => (
            <div key={status} className="space-y-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold capitalize">{status}</h2>
                <Badge variant="secondary">{items.length}</Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {items.map((match) => (
                  <Card key={match.id} className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-xl">
                        {match.companyName ?? "Entreprise confidentielle"}
                      </CardTitle>
                      <CardDescription>ID du match : {match.id}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                      <p>Statut : {match.status}</p>
                      {match.updatedAt && (
                        <p>Mis à jour le {match.updatedAt.toLocaleDateString("fr-FR")}</p>
                      )}
                      <Button asChild variant="outline" className="mt-2">
                        <Link href={`/messages?match=${match.id}`}>Continuer la discussion</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
