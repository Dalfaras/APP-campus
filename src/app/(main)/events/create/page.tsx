import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { redirect } from "next/navigation";

export default function CreateEventPage() {

    const createEvent = async () => {
        'use server'
        // In a real app, you would save the event and get its ID
        const newEventId = 1; // Placeholder ID
        redirect(`/events/${newEventId}`);
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-headline">Créer un nouvel événement</CardTitle>
                    <CardDescription>Remplissez les détails pour organiser votre prochain rassemblement.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6" action={createEvent}>
                        <div className="space-y-2">
                            <Label htmlFor="title">Titre de l'événement</Label>
                            <Input id="title" placeholder="Ex: Session de révision pour le partiel de..." required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="Décrivez le but, le programme, etc." required/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label htmlFor="type">Type d'événement</Label>
                                <Select required>
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="Sélectionnez un type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="travail">Travail</SelectItem>
                                        <SelectItem value="chill">Chill</SelectItem>
                                        <SelectItem value="mixte">Mixte</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Catégorie</Label>
                                <Input id="category" placeholder="Révision BTS, Projet Web, Pique-nique..." required />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date et heure</Label>
                                <Input id="date" type="datetime-local" required/>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="location">Lieu</Label>
                                <Input id="location" placeholder="Bibliothèque, Parc Monceau..." required/>
                            </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label htmlFor="max-participants">Participants max</Label>
                                <Input id="max-participants" type="number" placeholder="20" required/>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="image">Image de l'événement</Label>
                                <Input id="image" type="file" />
                            </div>
                        </div>
                        <Button type="submit" className="w-full" size="lg">Publier l'événement</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
