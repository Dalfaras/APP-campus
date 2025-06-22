'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { X, Heart, Settings, Undo2 } from 'lucide-react';

const mockProfiles = [
    {
        id: '9',
        name: 'Isaac Newton',
        avatar: 'https://placehold.co/200x200.png',
        formation: 'Philosophie Naturelle',
        availability: 'Quand une pomme tombe',
        objective: 'Formuler les lois de la gravitation universelle. Recherche un partenaire pour des expériences optiques.',
        type: 'Travail' as const,
        "data-ai-hint": "scientist thinking"
    },
    {
        id: '3',
        name: 'Marie Curie',
        avatar: 'https://placehold.co/200x200.png',
        formation: 'Master Physique',
        availability: 'Flexible',
        objective: 'Découvrir le polonium. Ouvert aux collaborations sur le radium.',
        type: 'Travail',
        "data-ai-hint": "woman scientist"
    },
    {
        id: '7',
        name: 'Arthur Simon',
        avatar: 'https://placehold.co/200x200.png',
        formation: 'STAPS',
        availability: 'Matin',
        objective: 'Me motiver pour lire mes cours. J\'aime bien faire des pauses pour une partie de foot ou un jogging.',
        type: 'Chill',
        "data-ai-hint": "man jogging"
    },
     {
        id: '1',
        name: 'Léa Martin',
        avatar: 'https://placehold.co/200x200.png',
        formation: 'BTS SIO',
        availability: 'Soirs & WE',
        objective: 'Réviser les partiels de dev web et de base de données. Prête pour des sessions intensives !',
        type: 'Travail',
        "data-ai-hint": "woman studying"
    },
];


export default function MatchPage() {
    const [profiles, setProfiles] = useState(mockProfiles);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [history, setHistory] = useState<number[]>([]);

    const currentProfile = profiles[currentIndex];

    const handleSwipe = () => {
        setHistory(prev => [...prev, currentIndex]);
        if (currentIndex < profiles.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(profiles.length); // Go to "end of profiles" state
        }
    };

    const handleUndo = () => {
        if (history.length > 0) {
            const lastIndex = history[history.length - 1];
            setHistory(prev => prev.slice(0, -1));
            setCurrentIndex(lastIndex);
        }
    };
    
    if (!currentProfile) {
        return (
             <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
                <Card className="w-full max-w-sm text-center p-8">
                    <h3 className="text-2xl font-bold font-headline mb-4">Plus de profils !</h3>
                    <p className="text-muted-foreground mb-6">Vous avez vu tout le monde. Revenez plus tard pour de nouvelles suggestions.</p>
                     <Button onClick={handleUndo} disabled={history.length === 0}>
                        <Undo2 className="mr-2 h-4 w-4" />
                        Revenir au dernier profil
                    </Button>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
            <div className="w-full max-w-sm relative">
                <Link href="/match/settings" className="absolute top-2 right-2 z-10">
                    <Button variant="ghost" size="icon">
                        <Settings className="h-6 w-6 text-muted-foreground" />
                    </Button>
                </Link>

                <Card className="overflow-hidden shadow-2xl">
                     <CardContent className="p-6 flex flex-col items-center text-center">
                        <Link href={`/profile/${currentProfile.id}`}>
                            <Avatar className="h-32 w-32 mb-4 border-4 border-primary/50 cursor-pointer">
                                <AvatarImage src={currentProfile.avatar} alt={currentProfile.name} data-ai-hint={currentProfile['data-ai-hint']} />
                                <AvatarFallback>{currentProfile.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                        </Link>
                        <h3 className="text-2xl font-bold font-headline">{currentProfile.name}</h3>
                        <p className="text-md text-muted-foreground mb-4">{currentProfile.formation}</p>
                        
                        <Badge variant="secondary" className="mb-4">Dispo: {currentProfile.availability}</Badge>
                        <p className="text-md text-foreground/90 flex-1">&quot;{currentProfile.objective}&quot;</p>
                    </CardContent>
                </Card>

                <div className="flex justify-around items-center mt-8">
                    <Button variant="outline" size="icon" className="h-20 w-20 rounded-full border-4 border-destructive text-destructive hover:bg-destructive/10" onClick={handleSwipe}>
                        <X className="h-10 w-10" />
                        <span className="sr-only">Passer</span>
                    </Button>
                     <Button variant="outline" size="icon" className="h-16 w-16 rounded-full" onClick={handleUndo} disabled={history.length === 0}>
                        <Undo2 className="h-8 w-8 text-muted-foreground" />
                        <span className="sr-only">Annuler</span>
                    </Button>
                     <Button size="icon" asChild className="h-24 w-24 rounded-full border-4 border-primary bg-primary/20 text-primary hover:bg-primary/30" onClick={handleSwipe}>
                         <Link href={`/match/match-found`} title="Matcher">
                            <Heart className="h-12 w-12" />
                            <span className="sr-only">Matcher</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}