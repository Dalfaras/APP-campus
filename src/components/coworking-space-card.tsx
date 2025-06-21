'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wifi, Coffee, Zap, Mic2 } from 'lucide-react';

type Amenity = 'wifi' | 'coffee' | 'plugs' | 'meeting-room' | 'kitchen';

type Space = {
  id: string;
  name: string;
  image: string;
  address: string;
  description: string;
  amenities: Amenity[];
  price: string;
  'data-ai-hint'?: string;
};

type CoworkingSpaceCardProps = {
  space: Space;
};

const amenityIcons: Record<Amenity, React.ReactNode> = {
  wifi: <Wifi className="h-4 w-4" />,
  coffee: <Coffee className="h-4 w-4" />,
  plugs: <Zap className="h-4 w-4" />,
  'meeting-room': <Mic2 className="h-4 w-4" />,
  kitchen: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-fridge"><path d="M5 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H5Zm0 4h14"/><path d="M5 10h14"/><path d="M8 14v4"/><path d="M8 6v1"/></svg>,
};
const amenityLabels: Record<Amenity, string> = {
    wifi: 'Wifi',
    coffee: 'Café',
    plugs: 'Prises',
    'meeting-room': 'Salle de réunion',
    kitchen: 'Cuisine',
}

export default function CoworkingSpaceCard({ space }: CoworkingSpaceCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-xl duration-300">
      <CardHeader className="p-0 relative">
        <Link href={`/coworking/${space.id}`}>
          <Image
            src={space.image}
            alt={space.name}
            width={600}
            height={400}
            className="object-cover w-full h-48"
            data-ai-hint={space['data-ai-hint']}
          />
        </Link>
      </CardHeader>
      <CardContent className="pt-6 flex-1 flex flex-col">
        <CardTitle className="text-xl font-headline mb-1 leading-tight">
          <Link href={`/coworking/${space.id}`} className="hover:underline">
            {space.name}
          </Link>
        </CardTitle>
        <CardDescription className="mb-4">{space.address}</CardDescription>
        <p className="text-sm text-muted-foreground flex-1 mb-4">{space.description}</p>
        <div className="flex flex-wrap gap-2">
            {space.amenities.map(amenity => (
                <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                    {amenityIcons[amenity]}
                    {amenityLabels[amenity]}
                </Badge>
            ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center mt-auto">
        <div className="font-semibold">{space.price}</div>
        <Button asChild>
          <Link href={`/coworking/${space.id}`}>Voir plus</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
