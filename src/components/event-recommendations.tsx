
import { getEventRecommendations } from "@/ai/flows/event-recommendations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { Button } from "./ui/button";

// In a real app, this data would come from the logged-in user and the event database.
const mockUserProfile = {
  interests: ['développement web', 'hackathons', 'jeux de société', 'entrepreneuriat'],
  skills: ['React', 'Node.js', 'TypeScript', 'Gestion de projet'],
  courses: ['BTS SIO', 'Licence Info'],
};

const mockEvents = [
    { type: 'Travail' as const, category: "Révision BTS", title: "Session de révision intensive SIO", description: "On se retrouve pour revoir ensemble les points clés du programme de BTS SIO avant les examens. Amenez vos fiches !", keywords: ["bts", "sio", "révision", "examen"] },
    { type: 'Chill' as const, category: "Détente", title: "Pique-nique au parc", description: "Une pause bien méritée ! Chacun ramène quelque chose à grignoter et on se détend au soleil.", keywords: ["détente", "parc", "social"] },
    { type: 'Mixte' as const, category: "Projet & Fun", title: "Hackathon & Pizza sur le thème du Web3", description: "Un week-end pour développer une idée d'app décentralisée, avec des pizzas pour tenir le coup. Ouvert à tous les niveaux.", keywords: ["hackathon", "pizza", "web3", "react", "solidity"] },
    { type: 'Travail' as const, category: "Projet Web", title: "Développement d'une app en Next.js", description: "Atelier pratique pour construire une application complète avec Next.js, de la configuration à la mise en production.", keywords: ["next.js", "web", "développement", "typescript"] },
    { type: 'Chill' as const, category: "Jeux", title: "Soirée jeux de société", description: "Venez découvrir de nouveaux jeux ou ramenez les vôtres. Ambiance conviviale garantie.", keywords: ["jeux de société", "chill", "fun"] },
    { type: 'Mixte' as const, category: "Apprentissage & Réseautage", title: "Conférence sur l'entrepreneuriat étudiant", description: "Des anciens de l'école viennent partager leur expérience de création de startup. Suivi d'un verre pour networker.", keywords: ["entrepreneuriat", "startup", "réseautage", "conférence"] },
];

export default async function EventRecommendations() {
  let recommendations = [];
  let error = null;

  try {
    recommendations = await getEventRecommendations({
      userProfile: mockUserProfile,
      events: mockEvents,
    });
  } catch (e: any) {
    console.error("Error getting event recommendations:", e);
    // Only show a user-friendly error if it's a known issue
    if (e.message.includes('API key not valid')) {
        error = "Les suggestions IA sont indisponibles (clé API invalide).";
    } else {
        error = "Impossible de récupérer les suggestions pour le moment."
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-primary" /> Suggestions IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : recommendations.length > 0 ? (
          <ul className="space-y-3">
            {recommendations.map((rec, index) => (
              <li key={index} className="p-3 bg-accent/50 rounded-lg border border-accent">
                <p className="font-semibold text-foreground">{rec.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{rec.reason}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            Aucune suggestion pour le moment. Participez à plus d'événements pour en recevoir !
          </p>
        )}
        <Button variant="secondary" className="mt-4">Affiner mes préférences</Button>
      </CardContent>
    </Card>
  );
}
