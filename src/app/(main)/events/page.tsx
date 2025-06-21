
import { Button } from '@/components/ui/button';
import EventCard from '@/components/event-card';

const events = [
    { id: 1, type: 'Travail' as const, category: "Révision BTS", title: "Session de révision intensive", description: "", keywords: [], image: "https://placehold.co/600x400.png", date: "2024-09-15T10:00:00", location: "Bibliothèque", participants: { current: 12, max: 20 }, "data-ai-hint": "study group" },
    { id: 2, type: 'Chill' as const, category: "Détente", title: "Pique-nique au parc", description: "", keywords: [], image: "https://placehold.co/600x400.png", date: "2024-09-18T12:30:00", location: "Parc Monceau", participants: { current: 8, max: 25 }, "data-ai-hint": "picnic park" },
    { id: 3, type: 'Mixte' as const, category: "Projet & Fun", title: "Hackathon & Pizza", description: "", keywords: [], image: "https://placehold.co/600x400.png", date: "2024-09-20T09:00:00", location: "Campus ESGI", participants: { current: 15, max: 30 }, "data-ai-hint": "hackathon pizza" },
    { id: 4, type: 'Travail' as const, category: "Projet Web", title: "Développement d'une app en Next.js", description: "", keywords: [], image: "https://placehold.co/600x400.png", date: "2024-09-22T14:00:00", location: "Salle B-102", participants: { current: 5, max: 10 }, "data-ai-hint": "web development" },
    { id: 5, type: 'Chill' as const, category: "Jeux", title: "Soirée jeux de société", description: "", keywords: [], image: "https://placehold.co/600x400.png", date: "2024-09-24T19:00:00", location: "Cafétéria", participants: { current: 20, max: 40 }, "data-ai-hint": "board games" },
];

export default function EventsPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl md:text-4xl font-bold font-headline">Tous les événements</h1>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button variant="outline">Type</Button>
                    <Button variant="outline">Lieu</Button>
                    <Button variant="outline">Date</Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </div>
    );
}

    