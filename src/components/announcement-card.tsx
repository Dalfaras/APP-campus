'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Building2, MapPin } from 'lucide-react';

type Announcement = {
  id: string;
  type: 'pro' | 'student';
  category: string;
  title: string;
  author: string;
  location: string;
  image: string;
  'data-ai-hint'?: string;
};

type AnnouncementCardProps = {
  announcement: Announcement;
};

const typeDetails = {
  pro: {
    icon: <Building2 className="h-4 w-4" />,
    badgeClass: 'bg-sky-100 text-sky-800 hover:bg-sky-200 border-sky-200',
    label: 'Pro'
  },
  student: {
    icon: <User className="h-4 w-4" />,
    badgeClass: 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200',
    label: 'Étudiant'
  }
};

export default function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const details = typeDetails[announcement.type];

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-xl duration-300">
      <CardHeader className="p-0 relative">
        <Badge className={`absolute top-3 right-3 z-10 flex items-center gap-1.5 ${details.badgeClass}`}>
          {details.icon}
          <span>{details.label}</span>
        </Badge>
        <Link href={`/annonces/${announcement.id}`}>
          <Image
            src={announcement.image}
            alt={announcement.title}
            width={600}
            height={400}
            className="object-cover w-full h-48"
            data-ai-hint={announcement['data-ai-hint']}
          />
        </Link>
      </CardHeader>
      <CardContent className="pt-6 flex-1 flex flex-col">
        <p className="text-sm font-medium text-primary mb-1">{announcement.category.toUpperCase()}</p>
        <CardTitle className="text-xl font-headline mb-2 leading-tight">
          <Link href={`/annonces/${announcement.id}`} className="hover:underline">
            {announcement.title}
          </Link>
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <MapPin className="h-4 w-4" />
            <span>{announcement.location}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center mt-auto">
        <div className="text-sm text-muted-foreground">
            Par <span className="font-semibold text-foreground">{announcement.author}</span>
        </div>
        <Button asChild>
          <Link href={`/annonces/${announcement.id}`}>Voir l'annonce</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
