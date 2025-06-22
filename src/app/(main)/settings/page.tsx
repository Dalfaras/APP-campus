'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';


const objectives = [
  { id: 'reviser', label: '📚 Réviser un examen' },
  { id: 'projet', label: '💻 Travailler sur un projet' },
  { id: 'apprendre', label: '🧠 Apprendre ensemble' },
  { id: 'rencontres', label: '💬 Faire de nouvelles rencontres' },
  { id: 'startup', label: '🚀 Monter un projet / start-up' },
  { id: 'autre', label: '🔁 Autre' },
];

const skills = ['Python', 'Maths', 'Droit', 'Anglais', 'PHP', 'Comptabilité', 'Design', 'Histoire', 'Économie', 'Cyber sécu', 'Réseaux', 'Bureautique'];

const workStyles = [
  { id: 'chill', label: '☕ Chill' },
  { id: 'structured', label: '💼 Structuré' },
  { id: 'silent', label: '🔇 Silencieux' },
  { id: 'music', label: '🎧 Musique' },
  { id: 'remote', label: '💬 En visio' },
  { id: 'presentiel', label: '🏫 En présentiel' },
];

const workAmbiances = [
    { id: 'music', label: 'Avec musique' },
    { id: 'silent', label: 'Silence total' },
    { id: 'cafe', label: 'Ambiance café' },
];

const availabilityDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const availabilityTimes = ['Matin', 'Après-midi', 'Soirée', 'Tard dans la nuit'];

const interests = {
    sports: [ {id: 'foot', label:'Foot'}, {id: 'basket', label: 'Basket'}, {id: 'danse', label:'Danse'}, {id: 'muscu', label:'Muscu'}, {id: 'yoga', label:'Yoga'} ],
    hobbies: [ {id: 'gaming', label: 'Jeux vidéo'}, {id: 'series', label: 'Séries'}, {id: 'music', label: 'Musique'}, {id: 'reading', label: 'Lecture'}, {id: 'cooking', label: 'Cuisine'}, {id: 'travel', label: 'Voyages'} ],
    creative: [ {id: 'drawing', label: 'Dessin'}, {id: 'photo', label: 'Photo'}, {id: 'video', label: 'Montage vidéo'}, {id: 'writing', label: 'Écriture'}, {id: 'singing', label: 'Chant'} ],
}

const ToggleButton = ({ label, selected, onClick }: { label: string, selected: boolean, onClick: () => void }) => (
    <Button variant={selected ? 'secondary' : 'outline'} onClick={onClick} type="button">
        {label}
    </Button>
);

export default function SettingsPage() {
    const router = useRouter();

    // Mock initial data, in a real app this would be fetched for the user
    const [selectedObjectives, setSelectedObjectives] = useState<string[]>(['reviser']);
    const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python', 'Design']);
    const [selectedWorkStyles, setSelectedWorkStyles] = useState<string[]>(['structured', 'presentiel']);
    const [selectedDays, setSelectedDays] = useState<string[]>(['Lundi', 'Mercredi', 'Vendredi']);
    const [selectedTimes, setSelectedTimes] = useState<string[]>(['Après-midi', 'Soirée']);
    const [selectedInterests, setSelectedInterests] = useState<string[]>(['gaming', 'series', 'drawing']);
    const [workAmbiance, setWorkAmbiance] = useState('cafe');
    const [privacyVisible, setPrivacyVisible] = useState(true);
    const [distance, setDistance] = useState([20]);
    const [groupSize, setGroupSize] = useState('duo');


    const handleMultiToggle = (item: string, list: string[], setList: (list: string[]) => void) => {
        const newList = list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
        setList(newList);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would save all the state to your backend
        console.log("Saving profile...");
        toast({
            title: "Profil sauvegardé !",
            description: "Vos informations ont été mises à jour avec succès.",
        });
        router.push('/profile/me');
    };

    const handleReset = () => {
        // Reset to initial state (or empty)
        setSelectedObjectives([]);
        setSelectedSkills([]);
        setSelectedWorkStyles([]);
        setSelectedDays([]);
        setSelectedTimes([]);
        setSelectedInterests([]);
        setWorkAmbiance('cafe');
        setPrivacyVisible(true);
        setDistance([20]);
        setGroupSize('duo');
        
        toast({
            title: "Champs réinitialisés",
            variant: "default",
        });
    }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold font-headline mb-2">Modifier mon profil</h1>
      <p className="text-muted-foreground mb-8">Personnalisez votre profil pour obtenir les meilleures recommandations de binômes.</p>

      <form onSubmit={handleSave} className="space-y-8">
        
        <Card>
            <CardHeader>
                <CardTitle>Infos académiques & Identité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src="https://placehold.co/100x100.png" alt="User avatar" data-ai-hint="profile picture" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="picture">Photo de profil</Label>
                        <Input id="picture" type="file" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="school">École / Université</Label>
                        <Input id="school" defaultValue="ESGI" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="major">Filière / Spécialisation</Label>
                        <Input id="major" defaultValue="Mastère Développement Web" />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" placeholder="Une petite description de vous..."/>
                 </div>
            </CardContent>
        </Card>

        
        <Card>
            <CardHeader><CardTitle>Objectifs</CardTitle><CardDescription>Pourquoi cherches-tu à rencontrer d'autres étudiants ?</CardDescription></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                {objectives.map((obj) => (
                    <ToggleButton key={obj.id} label={obj.label} selected={selectedObjectives.includes(obj.id)} onClick={() => handleMultiToggle(obj.id, selectedObjectives, setSelectedObjectives)} />
                ))}
            </CardContent>
        </Card>
        
        
        <Card>
            <CardHeader><CardTitle>Compétences / Matières</CardTitle><CardDescription>Dans quels domaines peux-tu aider (ou veux-tu progresser) ?</CardDescription></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                 {skills.map((skill) => (
                    <ToggleButton key={skill} label={skill} selected={selectedSkills.includes(skill)} onClick={() => handleMultiToggle(skill, selectedSkills, setSelectedSkills)} />
                ))}
            </CardContent>
        </Card>

        
        <Card>
            <CardHeader><CardTitle>Style de travail préféré</CardTitle></CardHeader>
             <CardContent className="flex flex-wrap gap-2">
                {workStyles.map((style) => (
                    <ToggleButton key={style.id} label={style.label} selected={selectedWorkStyles.includes(style.id)} onClick={() => handleMultiToggle(style.id, selectedWorkStyles, setSelectedWorkStyles)} />
                ))}
            </CardContent>
        </Card>
        
        
        <Card>
            <CardHeader><CardTitle>Ambiance de travail</CardTitle></CardHeader>
            <CardContent>
                 <RadioGroup value={workAmbiance} onValueChange={setWorkAmbiance} className="flex flex-wrap gap-4">
                    {workAmbiances.map(amb => (
                        <div className="flex items-center space-x-2" key={amb.id}>
                            <RadioGroupItem value={amb.id} id={`amb-${amb.id}`} />
                            <Label htmlFor={`amb-${amb.id}`}>{amb.label}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </CardContent>
        </Card>

        
        <Card>
            <CardHeader><CardTitle>Disponibilités</CardTitle><CardDescription>Quand es-tu généralement dispo pour coworker ?</CardDescription></CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label className="mb-2 block font-medium">Jours</Label>
                    <div className="flex flex-wrap gap-2">
                        {availabilityDays.map((day) => (
                            <ToggleButton key={day} label={day} selected={selectedDays.includes(day)} onClick={() => handleMultiToggle(day, selectedDays, setSelectedDays)} />
                        ))}
                    </div>
                </div>
                <div>
                    <Label className="mb-2 block font-medium">Plages horaires</Label>
                    <div className="flex flex-wrap gap-2">
                        {availabilityTimes.map((time) => (
                                <ToggleButton key={time} label={time} selected={selectedTimes.includes(time)} onClick={() => handleMultiToggle(time, selectedTimes, setSelectedTimes)} />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>

        
        <Card>
            <CardHeader><CardTitle>Centres d'intérêt</CardTitle><CardDescription>Parle-nous un peu de toi 😄</CardDescription></CardHeader>
            <CardContent className="space-y-4">
                {Object.entries(interests).map(([category, items]) => (
                    <div key={category}>
                        <Label className="text-md font-medium capitalize">{category.charAt(0).toUpperCase() + category.slice(1)}</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {items.map((interest) => <ToggleButton key={interest.id} label={interest.label} selected={selectedInterests.includes(interest.id)} onClick={() => handleMultiToggle(interest.id, selectedInterests, setSelectedInterests)} />)}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
        
        
        <Card>
            <CardHeader><CardTitle>Préférences de matching</CardTitle><CardDescription>Quel type de profil recherches-tu ?</CardDescription></CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label className="text-md font-medium">Taille du groupe préféré</Label>
                    <RadioGroup value={groupSize} onValueChange={setGroupSize} className="mt-2 space-y-1">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="duo" id="duo" /><Label htmlFor="duo">En duo</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="small" id="small" /><Label htmlFor="small">En petit groupe (3-5)</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="large" id="large" /><Label htmlFor="large">Groupe large</Label></div>
                    </RadioGroup>
                </div>
                <div>
                    <Label htmlFor="distance" className="text-md font-medium">Distance max : {distance[0]} km</Label>
                        <Slider id="distance" value={distance} onValueChange={setDistance} max={100} step={1} className="mt-2" />
                </div>
            </CardContent>
        </Card>

        
        <Card>
            <CardHeader><CardTitle>Paramètres de confidentialité</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
                <Label htmlFor="privacy-switch" className="flex-grow pr-4">Rendre mon profil visible à tous les utilisateurs</Label>
                <Switch id="privacy-switch" checked={privacyVisible} onCheckedChange={setPrivacyVisible} />
            </CardContent>
        </Card>


        <div className="flex flex-wrap gap-4">
            <Button size="lg" type="submit" className="flex-1 min-w-[200px]">Sauvegarder les modifications</Button>
            <Button size="lg" variant="outline" type="button" onClick={() => router.back()} className="flex-1 min-w-[150px]">Annuler</Button>
            <Button size="lg" variant="destructive" type="button" onClick={handleReset} className="flex-1 min-w-[150px]">Réinitialiser</Button>
        </div>
      </form>
    </div>
  );
}