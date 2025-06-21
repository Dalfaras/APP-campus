import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, Users, MessageCircle } from 'lucide-react';
import Link from 'next/link';

// Mock data, in a real app this would be fetched based on params.id
const event = {
  id: 1,
  type: 'Travail',
  category: "Révision BTS",
  title: "Session de révision intensive pour le BTS",
  description: "Rejoignez-nous pour une session de révision de groupe intensive avant les examens du BTS. Nous couvrirons les sujets clés et partagerons des astuces pour réussir. Apportez vos notes et vos questions !",
  keywords: ["révision", "bts", "étude", "groupe"],
  image: "https://placehold.co/1200x400.png",
  date: "2024-09-15T10:00:00",
  location: "Bibliothèque Universitaire",
  participants: {
    current: 12,
    max: 20,
    list: [
        { id: 'marie', name: 'Marie Curie', avatar: 'https://placehold.co/40x40.png?text=MC' },
        { id: 'louis', name: 'Louis Pasteur', avatar: 'https://placehold.co/40x40.png?text=LP' },
        { id: 'albert', name: 'Albert Einstein', avatar: 'https://placehold.co/40x40.png?text=AE' },
    ]
  },
  "data-ai-hint": "study group library"
};

export default function EventDetailPage({ params }: { params: { id: string } }) {
  // You can use params.id to fetch the specific event data
  
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-8">
            <Image src={event.image} alt={event.title} fill className="object-cover" data-ai-hint={event['data-ai-hint']} />
            <div className="absolute inset-0 bg-black/50 flex items-end p-6">
                <h1 className="text-3xl md:text-4xl font-bold font-headline text-white">{event.title}</h1>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Détails de l'événement</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center flex-wrap gap-4 text-muted-foreground">
                            <div className="flex items-center gap-2"><Calendar className="h-5 w-5" /> <span>15 Septembre à 10:00</span></div>
                            <div className="flex items-center gap-2"><MapPin className="h-5 w-5" /> <span>{event.location}</span></div>
                            <div className="flex items-center gap-2"><Users className="h-5 w-5" /> <span>{event.participants.current} / {event.participants.max} participants</span></div>
                        </div>
                        <p className="text-foreground/90">{event.description}</p>
                         <div className="flex flex-wrap gap-2">
                            {event.keywords.map(k => <Badge key={k} variant="secondary">{k}</Badge>)}
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Discussion</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">La discussion de l'événement sera bientôt disponible ici.</p>
                    </CardContent>
                 </Card>
            </div>
            <div className="space-y-6">
                 <Card>
                    <CardHeader>
                         <Button className="w-full" size="lg">Rejoindre l'événement</Button>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Participants ({event.participants.current})</CardTitle>
                    </CardHeader>
                     <CardContent className="space-y-4">
                        {event.participants.list.map(p => (
                             <div key={p.id} className="flex items-center justify-between">
                                <Link href={`/profile/${p.id}`} className="flex items-center gap-3 group">
                                     <Avatar>
                                        <AvatarImage src={p.avatar} alt={p.name} />
                                        <AvatarFallback>{p.name.substring(0,2)}</AvatarFallback>
                                     </Avatar>
                                    <span className="font-medium group-hover:underline">{p.name}</span>
                                </Link>
                                <Button variant="ghost" size="icon"><MessageCircle className="h-5 w-5 text-muted-foreground" /></Button>
                            </div>
                        ))}
                        <Link href="#" className="text-sm text-primary hover:underline">Voir tous les participants</Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  )
}
