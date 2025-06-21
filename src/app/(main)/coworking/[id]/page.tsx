import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wifi, Coffee, Zap, Mic2, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';

// Mock data, in a real app this would be fetched based on params.id
const space = {
  id: '1',
  name: 'Le Hub Bastille',
  image: 'https://placehold.co/1200x400.png',
  address: '12 Rue de la Roquette, 75011 Paris',
  description: "Un espace de travail moderne et lumineux au cœur de Paris, parfait pour les étudiants et les freelances. Profitez d'un environnement stimulant avec une connexion haut débit, du café à volonté et des salles de réunion pour vos projets de groupe.",
  amenities: [
    { icon: <Wifi />, label: 'Wifi Haut Débit' },
    { icon: <Coffee />, label: 'Café & Thé inclus' },
    { icon: <Zap />, label: 'Prises électriques à chaque poste' },
    { icon: <Mic2 />, label: 'Salles de réunion équipées' },
  ],
  hours: 'Lundi - Vendredi : 9h00 - 19h00',
  pricing: [
    { plan: 'Heure', price: '5€' },
    { plan: 'Demi-journée', price: '15€' },
    { plan: 'Journée complète', price: '25€' },
  ],
  'data-ai-hint': 'modern coworking space'
};

export default function CoworkingDetailPage({ params }: { params: { id: string } }) {
  
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-8">
            <Image src={space.image} alt={space.name} fill className="object-cover" data-ai-hint={space['data-ai-hint']} />
            <div className="absolute inset-0 bg-black/50 flex items-end p-6">
                <h1 className="text-3xl md:text-4xl font-bold font-headline text-white">{space.name}</h1>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>À propos de l'espace</CardTitle>
                        <div className="flex items-center gap-2 pt-2 text-muted-foreground"><MapPin className="h-5 w-5" /> <span>{space.address}</span></div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-foreground/90">{space.description}</p>
                         <h3 className="font-semibold text-lg">Équipements inclus</h3>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {space.amenities.map(item => (
                                <div key={item.label} className="flex items-center gap-3">
                                    <div className="text-primary">{item.icon}</div>
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                 <Card>
                    <CardHeader>
                         <Button className="w-full" size="lg">Réserver une place</Button>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Tarifs & Horaires</CardTitle>
                    </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-5 w-5" /> <span>{space.hours}</span></div>
                        <ul className="space-y-2">
                            {space.pricing.map(p => (
                                <li key={p.plan} className="flex justify-between items-center">
                                    <span>{p.plan}</span>
                                    <span className="font-semibold">{p.price}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  )
}
