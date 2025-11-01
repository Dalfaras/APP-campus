"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { db } from "@/lib/firebase";

interface AnnouncementItem {
  id: string;
  title: string;
  body: string;
  createdAt?: Date | null;
  tags?: string[];
  location?: string;
}

export default function CompanyAnnouncementsPage() {
  const { user } = useRequireAuth();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }

    const announcementsQuery = query(
      collection(db, "announcements"),
      where("createdBy", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      announcementsQuery,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title as string,
            body: data.body as string,
            tags: (data.tags as string[]) ?? [],
            location: data.location as string | undefined,
            createdAt: data.createdAt?.toDate?.() ?? null,
          } satisfies AnnouncementItem;
        });
        setAnnouncements(items);
        setIsLoading(false);
      },
      (error) => {
        console.error(error);
        toast({
          title: "Impossible de récupérer vos annonces",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [toast, user]);

  return (
    <div className="container mx-auto flex flex-col gap-8 px-4 py-8 md:py-12">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold">Mes annonces</h1>
          <p className="text-muted-foreground">
            Publiez des opportunités, suivez l'intérêt des étudiants et gérez vos offres en temps réel.
          </p>
        </div>
        <Button asChild>
          <Link href="/annonces/nouvelle">Créer une annonce</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="rounded-2xl">
              <CardHeader className="space-y-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <Card className="rounded-2xl border-dashed">
          <CardHeader>
            <CardTitle>Pas encore d'annonces</CardTitle>
            <CardDescription>
              Créez votre première opportunité pour attirer des étudiants intéressés par votre entreprise.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/annonces/nouvelle">Publier une annonce</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="rounded-2xl">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-xl">{announcement.title}</CardTitle>
                  {announcement.location && <Badge variant="secondary">{announcement.location}</Badge>}
                </div>
                {announcement.createdAt && (
                  <CardDescription>
                    Publiée le {announcement.createdAt.toLocaleDateString("fr-FR")}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>{announcement.body}</p>
                {announcement.tags && announcement.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {announcement.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button asChild variant="outline">
                    <Link href={`/annonces/${announcement.id}`}>Voir les détails</Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link href={`/annonces/${announcement.id}/editer`}>Modifier</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
