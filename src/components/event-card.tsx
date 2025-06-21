'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, BrainCircuit } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';

type Event = {
  id: number;
  type: 'Travail' | 'Chill' | 'Mixte';
  category: string;
  title: string;
  description: string;
  keywords: string[];
  image: string;
  date: string;
  location: string;
  participants: {
    current: number;
    max: number;
  };
  "data-ai-hint"?: string;
};

type EventCardProps = {
  event: Event;
};

const badgeColors = {
  Travail: 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200',
  Chill: 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200',
  Mixte: 'bg-violet-100 text-violet-800 hover:bg-violet-200 border-violet-200',
};

export default function EventCard({ event }: EventCardProps) {
  const formattedDate = format(new Date(event.date), "d MMMM 'à' HH:mm", { locale: fr });

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-xl duration-300">
      <CardHeader className="p-0 relative">
        <Badge className={`absolute top-3 right-3 z-10 ${badgeColors[event.type]}`}>
          {event.type === 'Travail' && <BrainCircuit className="mr-1 h-3 w-3" />}
          {event.type}
        </Badge>
        <Link href={`/events/${event.id}`}>
            <Image
            src={event.image}
            alt={event.title}
            width={600}
            height={400}
            className="object-cover w-full h-48"
            data-ai-hint={event['data-ai-hint']}
            />
        </Link>
      </CardHeader>
      <CardContent className="pt-6 flex-1 flex flex-col">
        <p className="text-sm font-medium text-primary mb-1">{event.category.toUpperCase()}</p>
        <CardTitle className="text-xl font-headline mb-2 leading-tight">
            <Link href={`/events/${event.id}`} className="hover:underline">
                {event.title}
            </Link>
        </CardTitle>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center mt-auto">
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{event.participants.current} / {event.participants.max}</span>
        </div>
        <Button asChild>
            <Link href={`/events/${event.id}`}>Rejoindre</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
