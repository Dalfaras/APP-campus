import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle } from 'lucide-react';

export default function MatchFoundPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
            <div className="flex justify-center items-center relative mb-4">
                <Avatar className="h-24 w-24 border-4 border-background">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="User 1" data-ai-hint="profile picture" />
                    <AvatarFallback>U1</AvatarFallback>
                </Avatar>
                 <div className="absolute bg-primary rounded-full p-2 -m-4 z-10 shadow-lg">
                    <Heart className="h-6 w-6 text-primary-foreground" fill="currentColor" />
                </div>
                <Avatar className="h-24 w-24 border-4 border-background -ml-8">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="User 2" data-ai-hint="woman scientist" />
                    <AvatarFallback>MC</AvatarFallback>
                </Avatar>
            </div>
          <CardTitle className="text-3xl font-headline">C'est un Match !</CardTitle>
          <CardDescription>Vous et Marie Curie avez montré un intérêt mutuel. Lancez la conversation pour briser la glace !</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Button size="lg" className="w-full" asChild>
                <Link href="/messages/1">
                    <MessageCircle className="mr-2 h-4 w-4" /> Envoyer un message
                </Link>
            </Button>
            <Button variant="ghost" className="w-full" asChild>
                <Link href="/match">
                    Continuer à chercher
                </Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
