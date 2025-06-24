import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search } from 'lucide-react';
import Link from 'next/link';
import AnnouncementCard from '@/components/announcement-card';

const announcements = [
    { id: '1', type: 'pro' as const, category: 'Alternance - Dev Web', title: 'Développeur Web Full-Stack (H/F)', author: 'Société XYZ', location: 'Reims', image: 'https://placehold.co/600x400.png', 'data-ai-hint': 'office computer' },
    { id: '2', type: 'student' as const, category: 'Colocation', title: 'Cherche colocataire pour appart T2', author: 'Juliette D.', location: 'Troyes', image: 'https://placehold.co/600x400.png', 'data-ai-hint': 'apartment interior' },
    { id: '3', type: 'pro' as const, category: 'Job étudiant', title: 'Vendeur/Vendeuse équipement de sport', author: 'Décathlon', location: 'Paris', image: 'https://placehold.co/600x400.png', 'data-ai-hint': 'retail store' },
    { id: '4', type: 'student' as const, category: 'Entraide', title: 'Cours de maths gratuit pour niveau 1ère', author: 'Karim S.', location: 'En ligne', image: 'https://placehold.co/600x400.png', 'data-ai-hint': 'tutoring session' },
    { id: '5', type: 'pro' as const, category: 'Stage', title: 'Stage Assistant Marketing Digital', author: 'Innovatech', location: 'Lille', image: 'https://placehold.co/600x400.png', 'data-ai-hint': 'marketing meeting' },
    { id: '6', type: 'student' as const, category: 'Covoiturage', title: 'Trajet Paris -> Lyon le 28/09', author: 'Léa M.', location: 'Au départ de Paris', image: 'https://placehold.co/600x400.png', 'data-ai-hint': 'car road' },
];


export default function AnnouncementsPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold font-headline">Espace Annonces</h1>
                    <p className="text-muted-foreground mt-1">Trouvez des opportunités, des colocations, de l'entraide et plus encore.</p>
                </div>
                <Button asChild>
                    <Link href="/annonces/create">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Publier une annonce
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Rechercher (ex: stage, react, paris)..." className="pl-10" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button variant="outline">Étudiant / Pro</Button>
                    <Button variant="outline">Localisation</Button>
                    <Button variant="outline">Catégorie</Button>
                    <Button variant="outline">Date</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {announcements.map(ad => (
                    <AnnouncementCard key={ad.id} announcement={ad} />
                ))}
            </div>
        </div>
    );
}
