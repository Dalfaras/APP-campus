import { Button } from '@/components/ui/button';
import CoworkingSpaceCard from '@/components/coworking-space-card';

const spaces = [
    { 
      id: '1', 
      name: 'Le Hub Bastille', 
      image: 'https://placehold.co/600x400.png', 
      address: '12 Rue de la Roquette, 75011 Paris', 
      description: 'Un espace de travail moderne et lumineux au cœur de Paris, parfait pour les étudiants et les freelances.', 
      amenities: ['wifi', 'coffee', 'plugs', 'meeting-room'], 
      price: 'À partir de 5€/heure', 
      'data-ai-hint': 'modern coworking space' 
    },
    { 
      id: '2', 
      name: 'Café Studieux', 
      image: 'https://placehold.co/600x400.png', 
      address: '45 Rue des Écoles, 75005 Paris', 
      description: 'Ambiance café studieuse avec de grandes tables. Idéal pour travailler seul ou en petit groupe.', 
      amenities: ['wifi', 'coffee', 'plugs'], 
      price: 'Une consommation minimum', 
      'data-ai-hint': 'study cafe' 
    },
    { 
      id: '3', 
      name: 'La Permanence', 
      image: 'https://placehold.co/600x400.png', 
      address: '2 Rue du Faubourg Saint-Martin, 75010 Paris', 
      description: 'Ouvert 24/7, cet espace est parfait pour les noctambules et les sessions de révisions intensives.', 
      amenities: ['wifi', 'plugs', 'kitchen'], 
      price: 'À partir de 1.50€/heure', 
      'data-ai-hint': '24/7 library' 
    },
];

export default function CoworkingPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl md:text-4xl font-bold font-headline">Espaces de Coworking</h1>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button variant="outline">Ville</Button>
                    <Button variant="outline">Services</Button>
                    <Button variant="outline">Prix</Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {spaces.map(space => (
                    <CoworkingSpaceCard key={space.id} space={space} />
                ))}
            </div>
        </div>
    );
}
