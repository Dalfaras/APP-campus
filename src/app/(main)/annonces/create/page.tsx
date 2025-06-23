import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { redirect } from "next/navigation";

export default function CreateAnnouncementPage() {

    const createAnnouncement = async () => {
        'use server'
        // In a real app, you would save the announcement and get its ID
        const newAnnouncementId = 1; // Placeholder ID
        redirect(`/annonces/${newAnnouncementId}`);
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-headline">Publier une nouvelle annonce</CardTitle>
                    <CardDescription>Remplissez les détails pour partager votre annonce avec la communauté.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6" action={createAnnouncement}>
                        <div className="space-y-2">
                            <Label htmlFor="title">Titre de l'annonce</Label>
                            <Input id="title" placeholder="Ex: Cherche colocataire, Stage en marketing..." required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="Décrivez votre annonce en détail." rows={5} required/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label htmlFor="type">Type d'annonce</Label>
                                <Select required>
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="Sélectionnez un type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student">Annonce étudiante</SelectItem>
                                        <SelectItem value="pro">Annonce professionnelle</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Catégorie</Label>
                                <Input id="category" placeholder="Colocation, Stage, Job, Entraide..." required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Lieu</Label>
                            <Input id="location" placeholder="Paris, En ligne, Reims..." required/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image">Image pour l'annonce</Label>
                            <Input id="image" type="file" />
                        </div>
                        <Button type="submit" className="w-full" size="lg">Publier mon annonce</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
