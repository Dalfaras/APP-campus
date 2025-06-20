import { getEventRecommendations, type EventRecommendationsInput, type EventRecommendationsOutput } from "@/ai/flows/event-recommendations";
import EventCard from "@/components/event-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

type Event = {
  id: number;
  type: 'Travail' | 'Chill' | 'Mixte';
  category: string;
  title: string;
  description: string;
  keywords: string[];
  image: string;
  date: string;
  location: string;
  participants: {
    current: number;
    max: number;
  };
  reason?: string;
  "data-ai-hint"?: string;
};

type RecommendedEvent = Event & { reason: string };

const userProfile = {
  interests: ['web development', 'entrepreneurship', 'live music', 'sustainability'],
  skills: ['React', 'Node.js', 'Graphic Design', 'Public Speaking'],
  courses: ['Computer Science', 'Business Management', 'Environmental Science'],
};

const events: Event[] = [
  {
    id: 1,
    type: 'Travail',
    category: "Révision BTS",
    title: "Session de révision intensive pour le BTS",
    description: "Rejoignez-nous pour une session de révision de groupe intensive avant les examens du BTS. Nous couvrirons les sujets clés et partagerons des astuces.",
    keywords: ["révision", "bts", "étude", "groupe"],
    image: "https://placehold.co/600x400.png",
    date: "2024-09-15T10:00:00",
    location: "Bibliothèque Universitaire",
    participants: { current: 12, max: 20 },
    "data-ai-hint": "study group library"
  },
  {
    id: 2,
    type: 'Chill',
    category: "Pique-nique",
    title: "Pique-nique et Frisbee au parc",
    description: "Profitons du beau temps avec un pique-nique convivial au parc. Apportez de quoi grignoter, votre bonne humeur et un frisbee si vous en avez un !",
    keywords: ["pique-nique", "détente", "parc", "frisbee"],
    image: "https://placehold.co/600x400.png",
    date: "2024-09-12T13:00:00",
    location: "Parc Monceau",
    participants: { current: 8, max: 25 },
    "data-ai-hint": "park picnic"
  },
  {
    id: 3,
    type: 'Mixte',
    category: "Projet Web",
    title: "Hackathon: Créer une app pour le campus",
    description: "Un weekend pour développer une application utile pour la vie sur le campus. On code, on brainstorm, et on finit par une présentation avec pizza.",
    keywords: ["hackathon", "développement web", "react", "pizza"],
    image: "https://placehold.co/600x400.png",
    date: "2024-09-20T18:00:00",
    location: "Incubateur de l'école",
    participants: { current: 25, max: 40 },
    "data-ai-hint": "hackathon coding"
  },
  {
    id: 4,
    type: 'Chill',
    category: "Concert",
    title: "Concert acoustique au café du coin",
    description: "Soirée chill avec des artistes locaux en acoustique. Venez découvrir de nouveaux talents autour d'un verre.",
    keywords: ["musique", "concert", "live", "acoustique"],
    image: "https://placehold.co/600x400.png",
    date: "2024-09-18T20:00:00",
    location: "Café 'La Scène'",
    participants: { current: 30, max: 50 },
    "data-ai-hint": "acoustic concert"
  },
  {
    id: 5,
    type: 'Travail',
    category: "Atelier CV",
    title: "Atelier: Pimp ton CV et profil LinkedIn",
    description: "Un atelier pour améliorer votre CV et optimiser votre profil LinkedIn pour les recherches de stage. Animé par un pro des RH.",
    keywords: ["cv", "linkedin", "carrière", "stage"],
    image: "https://placehold.co/600x400.png",
    date: "2024-09-25T17:00:00",
    location: "Salle de conférence B01",
    participants: { current: 18, max: 30 },
    "data-ai-hint": "workshop resume"
  },
  {
    id: 6,
    type: 'Mixte',
    category: "Écologie",
    title: "Clean Walk & Brainstorming Éco-projet",
    description: "On nettoie les berges de la Seine puis on se pose pour brainstormer des idées de projets écologiques pour le campus.",
    keywords: ["écologie", "clean walk", "environnement", "projet"],
    image: "https://placehold.co/600x400.png",
    date: "2024-09-22T14:00:00",
    location: "Quais de Seine",
    participants: { current: 22, max: 50 },
    "data-ai-hint": "cleaning river"
  }
];

export default async function DashboardPage() {
  let recommendedEvents: RecommendedEvent[] = [];
  let recommendationError = false;

  try {
    const eventsForAI: EventRecommendationsInput['events'] = events.map(({ type, category, title, description, keywords }) => ({ type, category, title, description, keywords }));
    if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
      const recommendations = await getEventRecommendations({ userProfile, events: eventsForAI });
      recommendedEvents = recommendations
        .map(rec => {
          const fullEvent = events.find(e => e.title === rec.title);
          if (!fullEvent) return null;
          return { ...fullEvent, reason: rec.reason };
        })
        .filter((e): e is RecommendedEvent => e !== null);
    } else {
        recommendationError = true;
        console.error("GEMINI_API_KEY or GOOGLE_API_KEY not found in environment variables.");
    }
  } catch (error) {
    console.error("Error getting event recommendations:", error);
    recommendationError = true;
  }

  const workEvents = events.filter(e => e.type === 'Travail');
  const chillEvents = events.filter(e => e.type === 'Chill');
  const mixteEvents = events.filter(e => e.type === 'Mixte');

  const forYouEvents = recommendationError ? events : recommendedEvents;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">Bonjour, Alex!</h1>
        <p className="text-lg text-muted-foreground">Voici quelques événements qui pourraient vous plaire.</p>
      </div>

      {recommendationError && (
          <Alert variant="destructive" className="mb-8">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Erreur de recommandation</AlertTitle>
          <AlertDescription>
            Impossible de charger les recommandations personnalisées. Vérifiez que votre clé API est correcte et rechargez la page. Affichage de tous les événements à la place.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="for-you" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-max md:grid-cols-4 mb-8">
          <TabsTrigger value="for-you">Pour Vous</TabsTrigger>
          <TabsTrigger value="work">Travail</TabsTrigger>
          <TabsTrigger value="chill">Chill</TabsTrigger>
          <TabsTrigger value="mixed">Mixte</TabsTrigger>
        </TabsList>
        
        <TabsContent value="for-you">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {forYouEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="work">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="chill">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chillEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="mixed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mixteEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
