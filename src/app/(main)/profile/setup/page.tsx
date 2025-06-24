
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Book, Clapperboard, CookingPot, Dumbbell, Gamepad2, Headphones, Mic, Mountain, Palette, Plane, Tv2, Video, Goal } from 'lucide-react';


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

const availabilityDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const availabilityTimes = ['Matin', 'Après-midi', 'Soirée', 'Tard dans la nuit'];

const interests = {
    sports: [ {id: 'foot', label:'Foot', icon: <Goal />}, {id: 'basket', label: 'Basket', icon: <Dumbbell />}, {id: 'danse', label:'Danse', icon: <Mic />}, {id: 'muscu', label:'Muscu', icon: <Dumbbell />}, {id: 'yoga', label:'Yoga', icon: <Mountain />} ],
    hobbies: [ {id: 'gaming', label: 'Jeux vidéo', icon: <Gamepad2 />}, {id: 'series', label: 'Séries', icon: <Tv2 />}, {id: 'music', label: 'Musique', icon: <Headphones />}, {id: 'reading', label: 'Lecture', icon: <Book />}, {id: 'cooking', label: 'Cuisine', icon: <CookingPot />}, {id: 'travel', label: 'Voyages', icon: <Plane />} ],
    creative: [ {id: 'drawing', label: 'Dessin', icon: <Palette />}, {id: 'photo', label: 'Photo', icon: <Video />}, {id: 'video', label: 'Montage vidéo', icon: <Clapperboard />}, {id: 'writing', label: 'Écriture', icon: <Book />}, {id: 'singing', label: 'Chant', icon: <Mic />} ],
}


const Section = ({ title, description, children }: { title: string, description: string, children: React.ReactNode }) => (
    <div className="space-y-4 rounded-lg border p-6">
        <h3 className="text-xl font-headline font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        {children}
    </div>
)

const ToggleButton = ({ label, selected, onClick, icon: Icon }: { label: string, selected: boolean, onClick: () => void, icon?: React.ReactNode }) => (
    <Button variant={selected ? 'secondary' : 'outline'} onClick={onClick} className="flex items-center gap-2">
        {Icon}
        {label}
    </Button>
)


export default function ProfileSetupPage() {
    const router = useRouter();

    const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectedWorkStyles, setSelectedWorkStyles] = useState<string[]>([]);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    
    const [level, setLevel] = useState('same');
    const [groupSize, setGroupSize] = useState('duo');
    const [distance, setDistance] = useState([20]);

    const handleMultiToggle = (item: string, list: string[], setList: (list: string[]) => void) => {
        const newList = list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
        setList(newList);
    };
    
    const completeProfile = () => {
        // Here you would typically save all the state to your backend
        console.log({
            selectedObjectives,
            selectedSkills,
            selectedWorkStyles,
            selectedDays,
            selectedTimes,
            selectedInterests,
            level,
            groupSize,
            distance,
        });
        router.push('/match');
    };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-3xl">Créez votre profil de coworker</CardTitle>
                <CardDescription>Cliquez pour sélectionner vos préférences. C'est rapide, promis !</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                     <Section title="1. Identité de base" description="Qui êtes-vous ?">
                         <div className="space-y-6">
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
                                    <Label htmlFor="name">Prénom</Label>
                                    <Input id="name" placeholder="Alex" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Localisation</Label>
                                    <Input id="location" placeholder="Paris, France" />
                                </div>
                             </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="formation">Formation</Label>
                                     <Select>
                                        <SelectTrigger><SelectValue placeholder="Sélectionnez votre formation" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bts_sio">BTS SIO</SelectItem>
                                            <SelectItem value="but_mmi">BUT MMI</SelectItem>
                                            <SelectItem value="licence_info">Licence Informatique</SelectItem>
                                            <SelectItem value="master_marketing">Master Marketing</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="school">École / Université</Label>
                                     <Select>
                                        <SelectTrigger><SelectValue placeholder="Sélectionnez votre école" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="esgi">ESGI</SelectItem>
                                            <SelectItem value="epita">EPITA</SelectItem>
                                            <SelectItem value="hetic">HETIC</SelectItem>
                                            <SelectItem value="sorbonne">Sorbonne Université</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                             </div>
                         </div>
                    </Section>

                     <Section title="2. Objectifs" description="Pourquoi cherches-tu à rencontrer d'autres étudiants ?">
                        <div className="flex flex-wrap gap-2">
                            {objectives.map((obj) => (
                                <ToggleButton key={obj.id} label={obj.label} selected={selectedObjectives.includes(obj.id)} onClick={() => handleMultiToggle(obj.id, selectedObjectives, setSelectedObjectives)} />
                            ))}
                        </div>
                    </Section>

                    <Section title="3. Compétences / matières" description="Dans quels domaines peux-tu aider (ou veux-tu progresser) ?">
                         <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <ToggleButton key={skill} label={skill} selected={selectedSkills.includes(skill)} onClick={() => handleMultiToggle(skill, selectedSkills, setSelectedSkills)} />
                            ))}
                        </div>
                    </Section>

                    <Section title="4. Style de travail préféré" description="Quelle est votre ambiance de travail idéale ?">
                         <div className="flex flex-wrap gap-2">
                            {workStyles.map((style) => (
                                <ToggleButton key={style.id} label={style.label} selected={selectedWorkStyles.includes(style.id)} onClick={() => handleMultiToggle(style.id, selectedWorkStyles, setSelectedWorkStyles)} />
                            ))}
                        </div>
                    </Section>

                    <Section title="5. Disponibilités" description="Quand es-tu généralement disponible pour coworker ?">
                        <div className="space-y-4">
                            <div>
                                <Label className="mb-2 block">Jours</Label>
                                <div className="flex flex-wrap gap-2">
                                    {availabilityDays.map((day) => (
                                        <ToggleButton key={day} label={day} selected={selectedDays.includes(day)} onClick={() => handleMultiToggle(day, selectedDays, setSelectedDays)} />
                                    ))}
                                </div>
                            </div>
                             <div>
                                <Label className="mb-2 block">Plages horaires</Label>
                                <div className="flex flex-wrap gap-2">
                                    {availabilityTimes.map((time) => (
                                         <ToggleButton key={time} label={time} selected={selectedTimes.includes(time)} onClick={() => handleMultiToggle(time, selectedTimes, setSelectedTimes)} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Section>

                    <Section title="6. Centres d'intérêt" description="Parle-nous un peu de toi 😄">
                        <div className="space-y-4">
                            <div>
                                <Label className="text-md font-medium">🏀 Sports</Label>
                                 <div className="flex flex-wrap gap-2 mt-2">
                                    {interests.sports.map((interest) => <ToggleButton key={interest.id} label={interest.label} selected={selectedInterests.includes(interest.id)} onClick={() => handleMultiToggle(interest.id, selectedInterests, setSelectedInterests)} icon={interest.icon} />)}
                                 </div>
                            </div>
                             <div>
                                <Label className="text-md font-medium">🎮 Loisirs</Label>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {interests.hobbies.map((interest) => <ToggleButton key={interest.id} label={interest.label} selected={selectedInterests.includes(interest.id)} onClick={() => handleMultiToggle(interest.id, selectedInterests, setSelectedInterests)} icon={interest.icon} />)}
                                 </div>
                            </div>
                              <div>
                                <Label className="text-md font-medium">🎨 Activités créatives</Label>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {interests.creative.map((interest) => <ToggleButton key={interest.id} label={interest.label} selected={selectedInterests.includes(interest.id)} onClick={() => handleMultiToggle(interest.id, selectedInterests, setSelectedInterests)} icon={interest.icon} />)}
                                 </div>
                            </div>
                        </div>
                    </Section>

                    <Section title="7. Préférences de matching" description="Quel type de profil recherches-tu pour bosser ensemble ?">
                        <div className="space-y-6">
                            <div>
                                <Label className="text-md font-medium">Niveau souhaité</Label>
                                <RadioGroup value={level} onValueChange={setLevel} className="mt-2">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="same" id="same" /><Label htmlFor="same">Même niveau</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="higher" id="higher" /><Label htmlFor="higher">Niveau supérieur</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="any" id="any" /><Label htmlFor="any">Peu importe</Label></div>
                                </RadioGroup>
                            </div>
                            <div>
                                <Label className="text-md font-medium">Taille du groupe préféré</Label>
                                <RadioGroup value={groupSize} onValueChange={setGroupSize} className="mt-2">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="duo" id="duo" /><Label htmlFor="duo">En duo</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="small" id="small" /><Label htmlFor="small">En petit groupe (3-5)</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="large" id="large" /><Label htmlFor="large">Groupe large</Label></div>
                                </RadioGroup>
                            </div>
                            <div>
                                <Label htmlFor="distance" className="text-md font-medium">Distance max : {distance[0]} km</Label>
                                 <Slider id="distance" value={distance} onValueChange={setDistance} max={100} step={1} className="mt-2" />
                            </div>
                        </div>
                    </Section>
                    
                    <Button onClick={completeProfile} className="w-full" size="lg">Sauvegarder mon profil et commencer à matcher</Button>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
