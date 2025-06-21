import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send } from "lucide-react";
import Link from "next/link";

export default function ChatPage({ params }: { params: { id: string } }) {
    // In a real app, you would fetch chat history based on params.id
    const chatPartner = { name: "Marie Curie", avatar: "https://placehold.co/40x40.png" };

    return (
        <div className="container mx-auto h-[calc(100vh-4rem)] flex flex-col p-0">
            <div className="flex items-center gap-4 p-4 border-b">
                <Avatar>
                    <AvatarImage src={chatPartner.avatar} alt={chatPartner.name} data-ai-hint="woman scientist"/>
                    <AvatarFallback>{chatPartner.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold font-headline">{chatPartner.name}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Incoming message */}
                <div className="flex items-end gap-2">
                    <Avatar className="h-8 w-8">
                         <AvatarImage src={chatPartner.avatar} alt={chatPartner.name} data-ai-hint="woman scientist" />
                         <AvatarFallback>{chatPartner.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg bg-muted p-3 max-w-xs">
                        <p>Salut ! C'est un match. Prêt(e) à réviser pour le BTS ?</p>
                    </div>
                </div>
                 {/* Outgoing message */}
                <div className="flex items-end gap-2 justify-end">
                     <div className="rounded-lg bg-primary text-primary-foreground p-3 max-w-xs">
                        <p>Salut Marie ! Oui carrément, quand es-tu dispo ?</p>
                    </div>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://placehold.co/40x40.png" alt="My avatar" data-ai-hint="profile picture" />
                        <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                </div>
            </div>
            <div className="p-4 border-t bg-background">
                <form className="flex items-center gap-2">
                    <Input placeholder="Écrivez votre message..." className="flex-1" />
                    <Button type="button" variant="ghost" size="icon">
                        <Paperclip className="h-5 w-5" />
                        <span className="sr-only">Joindre un fichier</span>
                    </Button>
                    <Button type="submit" size="icon">
                        <Send className="h-5 w-5" />
                         <span className="sr-only">Envoyer</span>
                    </Button>
                </form>
            </div>
        </div>
    )
}
