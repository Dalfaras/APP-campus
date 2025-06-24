
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import AnnouncementCard from '@/components/announcement-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
                     <Select>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Type (Pro/Étudiant)" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les types</SelectItem>
                            <SelectItem value="pro">Professionnel</SelectItem>
                            <SelectItem value="student">Étudiant</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toutes les catégories</SelectItem>
                            <SelectItem value="alternance">Alternance</SelectItem>
                            <SelectItem value="stage">Stage</SelectItem>
                            <SelectItem value="job">Job étudiant</SelectItem>
                            <SelectItem value="colocation">Colocation</SelectItem>
                            <SelectItem value="entraide">Entraide</SelectItem>
                            <SelectItem value="covoiturage">Covoiturage</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        Plus de filtres
                    </Button>
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
