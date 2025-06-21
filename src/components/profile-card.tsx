'use client';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, UserPlus } from 'lucide-react';

export type Profile = {
    id: string;
    name: string;
    avatar: string;
    formation: string;
    availability: string;
    objective: string;
    type: 'Travail' | 'Chill' | 'Mixte';
    "data-ai-hint"?: string;
};

type ProfileCardProps = {
    profile: Profile;
};

export default function ProfileCard({ profile }: ProfileCardProps) {
    return (
        <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-xl duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center flex-1">
                <Avatar className="h-24 w-24 mb-4 border-4 border-primary/50">
                    <AvatarImage src={profile.avatar} alt={profile.name} data-ai-hint={profile['data-ai-hint']} />
                    <AvatarFallback>{profile.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold font-headline">{profile.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{profile.formation}</p>
                
                <Badge variant="secondary" className="mb-2">Dispo: {profile.availability}</Badge>
                <p className="text-sm text-foreground/90 flex-1">&quot;{profile.objective}&quot;</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 p-4 pt-0">
                <Button asChild className="w-full">
                    <Link href={`/profile/${profile.id}`}>
                        <Eye className="mr-2 h-4 w-4" /> Voir le profil
                    </Link>
                </Button>
                <Button asChild className="w-full">
                     <Link href={`/match/match-found`}>
                        <UserPlus className="mr-2 h-4 w-4" /> Matcher
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
