import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

const conversations = [
    {
        id: '1',
        partnerName: 'Marie Curie',
        avatar: 'https://placehold.co/40x40.png',
        lastMessage: "Salut Marie ! Oui carrément, quand es-tu dispo ?",
        time: "2m",
        unread: 0,
        "data-ai-hint": "woman scientist"
    },
    {
        id: '2',
        partnerName: 'Hackathon: App Campus',
        avatar: 'https://placehold.co/40x40.png',
        lastMessage: "N'oubliez pas la pizza party ce soir !",
        time: "1h",
        unread: 2,
        "data-ai-hint": "group coding"
    },
    {
        id: '3',
        partnerName: 'Louis Pasteur',
        avatar: 'https://placehold.co/40x40.png',
        lastMessage: "Tu as bien reçu le document pour le projet ?",
        time: "Hier",
        unread: 0,
        "data-ai-hint": "man scientist"
    }
];

export default function MessagesPage() {
    return (
         <div className="container mx-auto px-4 py-8 md:py-12">
            <h1 className="text-3xl font-bold font-headline mb-8">Messages</h1>
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Vos conversations</CardTitle>
                </CardHeader>
                <CardContent>
                     {conversations.length > 0 ? (
                        <ul className="space-y-1">
                            {conversations.map((conv) => (
                                <li key={conv.id}>
                                    <Link href={`/messages/${conv.id}`} className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent -mx-4">
                                         <Avatar className="h-12 w-12">
                                            <AvatarImage src={conv.avatar} alt={conv.partnerName} data-ai-hint={conv['data-ai-hint']} />
                                            <AvatarFallback>{conv.partnerName.substring(0,2)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 truncate">
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold">{conv.partnerName}</p>
                                                <p className="text-xs text-muted-foreground">{conv.time}</p>
                                            </div>
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                                                {conv.unread > 0 && (
                                                    <span className="flex items-center justify-center bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 ml-2">
                                                        {conv.unread}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                            <p>Vous n'avez aucune conversation.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
