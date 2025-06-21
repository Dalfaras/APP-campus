
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { X, Heart, Settings } from 'lucide-react';

const profile = {
    id: '9',
    name: 'Isaac Newton',
    avatar: 'https://placehold.co/200x200.png',
    formation: 'Philosophie Naturelle',
    availability: 'Quand une pomme tombe',
    objective: 'Formuler les lois de la gravitation universelle. Recherche un partenaire pour des expériences optiques.',
    type: 'Travail' as const,
    "data-ai-hint": "scientist thinking"
};

export default function MatchPage() {
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
                        <Avatar className="h-32 w-32 mb-4 border-4 border-primary/50">
                            <AvatarImage src={profile.avatar} alt={profile.name} data-ai-hint={profile['data-ai-hint']} />
                            <AvatarFallback>{profile.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-2xl font-bold font-headline">{profile.name}</h3>
                        <p className="text-md text-muted-foreground mb-4">{profile.formation}</p>
                        
                        <Badge variant="secondary" className="mb-4">Dispo: {profile.availability}</Badge>
                        <p className="text-md text-foreground/90 flex-1">&quot;{profile.objective}&quot;</p>
                    </CardContent>
                </Card>

                <div className="flex justify-around items-center mt-8">
                    <Button variant="outline" size="icon" className="h-20 w-20 rounded-full border-4 border-destructive text-destructive hover:bg-destructive/10">
                        <X className="h-10 w-10" />
                        <span className="sr-only">Passer</span>
                    </Button>
                     <Button size="icon" asChild className="h-24 w-24 rounded-full border-4 border-primary bg-primary/20 text-primary hover:bg-primary/30">
                         <Link href={`/match/match-found`} title="Matcher">
                            <Heart className="h-12 w-12" />
                            <span className="sr-only">Matcher</span>
                        </Link>
                    </Button>
                </div>
            </div>
             <Button variant="link" asChild className="mt-8">
                <Link href="/dashboard">Retour au Dashboard</Link>
            </Button>
        </div>
    );
}
