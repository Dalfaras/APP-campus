import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileCard, { type Profile } from '@/components/profile-card';

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


export default async function DashboardPage() {
  const workProfiles = profiles.filter(p => p.type === 'Travail');
  const chillProfiles = profiles.filter(p => p.type === 'Chill');
  const mixteProfiles = profiles.filter(p => p.type === 'Mixte');

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">Trouve ton binôme</h1>
        <p className="text-lg text-muted-foreground">Découvrez des profils compatibles pour travailler, échanger ou vous détendre.</p>
      </div>

      <Tabs defaultValue="work" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-max md:mx-auto mb-8">
          <TabsTrigger value="work">Travail</TabsTrigger>
          <TabsTrigger value="chill">Chill</TabsTrigger>
          <TabsTrigger value="mixed">Mixte</TabsTrigger>
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
        <TabsContent value="mixed">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mixteProfiles.map(profile => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}