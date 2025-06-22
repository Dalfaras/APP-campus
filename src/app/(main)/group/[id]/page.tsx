
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, MessageCircle, PlusCircle } from "lucide-react";

export default function GroupDetailPage({ params }: { params: { id: string } }) {
  // Mock data for a group
  const group = {
    name: "Révisions BTS SIO - Groupe A",
    description: "Groupe dédié à l'entraide pour les révisions du BTS SIO. Partage de fiches, sessions de travail et bonne humeur !",
    members: [
      { id: '1', name: 'Léa Martin', avatar: 'https://placehold.co/40x40.png' },
      { id: '2', name: 'Tom Durand', avatar: 'https://placehold.co/40x40.png' },
      { id: '4', name: 'Chloé Petit', avatar: 'https://placehold.co/40x40.png' },
    ],
    tags: ["BTS SIO", "Développement", "Base de données"]
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-headline">{group.name}</CardTitle>
            <CardDescription>{group.description}</CardDescription>
            <div className="flex flex-wrap gap-2 pt-2">
                {group.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            </div>
          </CardHeader>
          <CardContent>
            <Button size="lg" className="w-full md:w-auto">
                <PlusCircle className="mr-2 h-5 w-5" />
                Rejoindre le groupe
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Discussion du groupe</CardTitle>
                    </CardHeader>
                     <CardContent>
                        <p className="text-muted-foreground">La discussion est en cours de développement...</p>
                    </CardContent>
                </Card>
            </div>
            <div>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users /> Membres ({group.members.length})
                        </CardTitle>
                    </CardHeader>
                     <CardContent className="space-y-4">
                        {group.members.map(member => (
                            <div key={member.id} className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{member.name}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
