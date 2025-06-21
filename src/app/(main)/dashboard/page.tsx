
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileCard, { type Profile } from '@/components/profile-card';
import EventCard from '@/components/event-card';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Lightbulb } from "lucide-react";


const profiles: Profile[] = [
  { id: '1', name: 'Léa Martin', avatar: 'https://placehold.co/100x100.png', formation: 'BTS SIO', availability: 'Soirs & WE', objective: 'Réviser les partiels de dev web et de base de données. Prête pour des sessions intensives !', type: 'Travail', "data-ai-hint": "woman studying" },
  { id: '2', name: 'Tom Durand', avatar: 'https://placehold.co/100x100.png', formation: 'Licence Info', availability: 'Après-midi', objective: 'Cherche binôme pour un projet React. Objectif: un proto fonctionnel en 2 semaines.', type: 'Travail', "data-ai-hint": "man coding" },
  { id: '3', name: 'Marie Curie', avatar: 'https://placehold.co/100x100.png', formation: 'Master Physique', availability: 'Flexible', objective: 'Découvrir le polonium. Ouvert aux collaborations sur le radium.', type: 'Travail', "data-ai-hint": "woman scientist" },
  { id: '4', name: 'Chloé Petit', avatar: 'https://placehold.co/100x100.png', formation: 'Master Marketing', availability: 'Flexible', objective: 'Travailler sur mon mémoire. J\'aime les sessions de 2h avec des pauses café pour discuter.', type: 'Mixte', "data-ai-hint": "woman coffee" },
  { id: '5', name: 'Hugo Lefebvre', avatar: 'https://placehold.co/100x100.png', formation: 'BUT MMI', availability: 'Weekends', objective: 'Faire des projets créatifs (design, montage vidéo) et finir la journée avec une partie de jeux de société.', type: 'Mixte', "data-ai-hint": "man creative" },
  { id: '6', name: 'Eva Bernard', avatar: 'https://placehold.co/100x100.png', formation: 'Licence d\'Art', availability: 'Mardi & Jeudi', objective: 'Trouver un coin tranquille pour dessiner et discuter d\'art. Ouvert à des visites de musée.', type: 'Chill', "data-ai-hint": "woman art" },
  { id: '7', name: 'Arthur Simon', avatar: 'https://placehold.co/100x100.png', formation: 'STAPS', availability: 'Matin', objective: 'Me motiver pour lire mes cours. J\'aime bien faire des pauses pour une partie de foot ou un jogging.', type: 'Chill', "data-ai-hint": "man jogging" },
  { id: '8', name: 'Jules César', avatar: 'https://placehold.co/100x100.png', formation: 'Stratégie Militaire', availability: 'Toujours', objective: 'Franchir le Rubicon, puis discuter stratégie autour d\'une bière.', type: 'Mixte', "data-ai-hint": "roman emperor" },
];

const events = [
    { id: 1, type: 'Travail' as const, category: "Révision BTS", title: "Session de révision intensive", description: "", keywords: [], image: "https://placehold.co/600x400.png", date: "2024-09-15T10:00:00", location: "Bibliothèque", participants: { current: 12, max: 20 }, "data-ai-hint": "study group" },
    { id: 2, type: 'Chill' as const, category: "Détente", title: "Pique-nique au parc", description: "", keywords: [], image: "https://placehold.co/600x400.png", date: "2024-09-18T12:30:00", location: "Parc Monceau", participants: { current: 8, max: 25 }, "data-ai-hint": "picnic park" },
    { id: 3, type: 'Mixte' as const, category: "Projet & Fun", title: "Hackathon & Pizza", description: "", keywords: [], image: "https://placehold.co/600x400.png", date: "2024-09-20T09:00:00", location: "Campus ESGI", participants: { current: 15, max: 30 }, "data-ai-hint": "hackathon pizza" },
]


export default async function DashboardPage() {
  const workProfiles = profiles.filter(p => p.type === 'Travail');
  const chillProfiles = profiles.filter(p => p.type === 'Chill');
  const mixteProfiles = profiles.filter(p => p.type === 'Mixte');

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 space-y-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">Trouve ton binôme</h1>
        <p className="text-lg text-muted-foreground">Découvrez des profils compatibles pour travailler, échanger ou vous détendre.</p>
      </div>

      <Tabs defaultValue="work" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-max md:mx-auto mb-8">
          <TabsTrigger value="work">Travail</TabsTrigger>
          <TabsTrigger value="chill">Chill</TabsTrigger>
          <TabsTrigger value="mixte">Mixte</TabsTrigger>
        </TabsList>
        
        <TabsContent value="work">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {workProfiles.map(profile => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="chill">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {chillProfiles.map(profile => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="mixte">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mixteProfiles.map(profile => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-8">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl md:text-3xl font-bold font-headline">Événements à la une</h2>
             <Button variant="outline" asChild>
                <Link href="/events">Voir tout</Link>
            </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-6 w-6" /> Groupes</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">Rejoignez des groupes de travail ou des communautés basées sur vos intérêts.</p>
                 <Button variant="secondary">Explorer les groupes</Button>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lightbulb className="h-6 w-6" /> Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">Recevez des recommandations de binômes et d'événements sur mesure.</p>
                <Button variant="secondary">Affiner mes suggestions</Button>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}

    