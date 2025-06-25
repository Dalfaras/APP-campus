
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Building2, MapPin, Calendar, MessageCircle, Share2, Flag, Paperclip, type LucideIcon } from 'lucide-react';
import Link from 'next/link';

// Mock data, in a real app this would be fetched based on params.id
const announcement = {
    id: '1', 
    type: 'pro' as const, 
    category: 'Alternance - Dev Web', 
    title: 'Développeur Web Full-Stack (H/F)', 
    author: 'Société XYZ', 
    location: 'Reims, France', 
    image: 'https://placehold.co/1200x400.png', 
    'data-ai-hint': 'office computer',
    date: '2024-09-01',
    description: "Société XYZ, leader dans le secteur de la tech, recherche un développeur web full-stack en alternance pour rejoindre son équipe dynamique. Vous travaillerez sur des projets innovants et utiliserez les dernières technologies (React, Node.js, TypeScript). \n\n Missions : \n - Participer à la conception et au développement de nouvelles fonctionnalités. \n - Maintenir et améliorer les applications existantes. \n - Collaborer avec les équipes produit et design. \n\n Profil recherché : \n - Étudiant en informatique (Bac+3 à Bac+5). \n - Bonne connaissance de JavaScript. \n - Motivé, curieux et autonome.",
    tags: ["alternance", "dev web", "react", "full-stack", "reims"],
    attachments: [
        { name: "Description_de_poste.pdf", url: "#" }
    ]
};

const typeDetails: Record<'pro' | 'student', { Icon: LucideIcon, label: string }> = {
  pro: {
    Icon: Building2,
    label: 'Annonce professionnelle'
  },
  student: {
    Icon: User,
    label: 'Annonce étudiante'
  }
};


export default function AnnouncementDetailPage({ params }: { params: { id: string } }) {
  const details = typeDetails[announcement.type];
  const { Icon } = details;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-8">
            <Image src={announcement.image} alt={announcement.title} fill className="object-cover" data-ai-hint={announcement['data-ai-hint']} />
            <div className="absolute inset-0 bg-black/50 flex items-end p-6">
                <h1 className="text-3xl md:text-4xl font-bold font-headline text-white">{announcement.title}</h1>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Description</CardTitle>
                        <div className="flex items-center gap-4 text-muted-foreground pt-2 flex-wrap">
                            <div className="flex items-center gap-2"><MapPin className="h-5 w-5" /> <span>{announcement.location}</span></div>
                            <div className="flex items-center gap-2"><Calendar className="h-5 w-5" /> <span>Publiée le 1er Septembre</span></div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-foreground/90 whitespace-pre-wrap">{announcement.description}</p>
                         <div className="flex flex-wrap gap-2">
                            {announcement.tags.map(k => <Badge key={k} variant="secondary">{k}</Badge>)}
                        </div>
                    </CardContent>
                </Card>
                 {announcement.attachments && announcement.attachments.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Pièces jointes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {announcement.attachments.map((file, index) => (
                                    <li key={index}>
                                        <a href={file.url} className="flex items-center gap-2 text-primary hover:underline">
                                            <Paperclip className="h-4 w-4" />
                                            <span>{file.name}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}
            </div>
            <div className="space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                         <Button className="w-full" size="lg"><MessageCircle className="mr-2 h-5 w-5" /> Contacter l'annonceur</Button>
                         <Button className="w-full" size="lg" variant="secondary"><Share2 className="mr-2 h-5 w-5" /> Partager</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Icon className="h-6 w-6" /> À propos de l'annonceur</CardTitle>
                    </CardHeader>
                     <CardContent className="space-y-2">
                        <p className="font-semibold text-lg">{announcement.author}</p>
                        <p className="text-sm text-muted-foreground">{details.label}</p>
                        <Button variant="outline" className="w-full mt-2">Voir le profil</Button>
                    </CardContent>
                </Card>
                <div className="text-center">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                        <Flag className="mr-2 h-4 w-4" /> Signaler l'annonce
                    </Button>
                </div>
            </div>
        </div>
    </div>
  )
}
