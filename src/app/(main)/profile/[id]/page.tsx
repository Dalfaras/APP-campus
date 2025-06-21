import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare, UserPlus, Edit } from "lucide-react";
import Link from 'next/link';

export default function ProfilePage({ params }: { params: { id: string } }) {
  const isOwnProfile = params.id === 'me';
  
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="flex flex-col md:flex-row items-center gap-6 p-6">
                <Avatar className="h-32 w-32 border-4 border-primary">
                    <AvatarImage src="https://placehold.co/128x128.png" alt="User avatar" data-ai-hint="profile picture" />
                    <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold font-headline">Alex Dupont</h1>
                    <p className="text-muted-foreground">Étudiant @ ESGI</p>
                    <p className="mt-2 text-foreground/80 max-w-prose">Passionné par le développement web et l'innovation. Toujours prêt à collaborer sur des projets excitants !</p>
                    
                    {!isOwnProfile && (
                        <div className="mt-4 flex gap-2 justify-center md:justify-start">
                            <Button><MessageSquare className="mr-2 h-4 w-4" /> Envoyer un message</Button>
                            <Button variant="outline"><UserPlus className="mr-2 h-4 w-4" /> Ajouter comme ami</Button>
                        </div>
                    )}
                     {isOwnProfile && (
                        <div className="mt-4 flex gap-2 justify-center md:justify-start">
                           <Button asChild>
                             <Link href="/settings">
                                <Edit className="mr-2 h-4 w-4"/>
                                Modifier le profil
                             </Link>
                           </Button>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-8">
                 <div >
                    <h2 className="text-xl mb-4 font-headline">Compétences</h2>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">React</Badge>
                        <Badge variant="secondary">Node.js</Badge>
                        <Badge variant="secondary">TypeScript</Badge>
                        <Badge variant="secondary">Gestion de projet</Badge>
                        <Badge variant="secondary">UI/UX Design</Badge>
                    </div>
                </div>
                 <div>
                    <h2 className="text-xl mb-4 font-headline">Intérêts</h2>
                    <div className="flex flex-wrap gap-2">
                         <Badge variant="secondary">Hackathons</Badge>
                         <Badge variant="secondary">Entrepreneuriat</Badge>
                         <Badge variant="secondary">Musique live</Badge>
                         <Badge variant="secondary">Écologie</Badge>
                         <Badge variant="secondary">Jeux de société</Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
  );
}
