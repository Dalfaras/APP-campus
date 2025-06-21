
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

export default function MatchSettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Préférences de matching</h1>
            <p className="text-muted-foreground">Aidez-nous à vous trouver le binôme parfait.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Objectifs</CardTitle>
            <CardDescription>Quel est votre principal objectif en ce moment ?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center space-x-2">
                <Checkbox id="revisions" />
                <Label htmlFor="revisions">Révisions d'examens</Label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="projet" />
                <Label htmlFor="projet">Projet de groupe</Label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="devoirs" />
                <Label htmlFor="devoirs">Devoirs / Exercices</Label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="motivation" />
                <Label htmlFor="motivation">Se motiver à plusieurs</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Style de travail</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup defaultValue="flexible" className="space-y-2">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="focus" id="r1" />
                    <Label htmlFor="r1">Focus : sessions intenses et productives</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="chill" id="r2" />
                    <Label htmlFor="r2">Chill : travail détendu avec des pauses</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="flexible" id="r3" />
                    <Label htmlFor="r3">Flexible : un peu des deux !</Label>
                </div>
            </RadioGroup>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Distance</CardTitle>
                <CardDescription>Rayon de recherche maximum.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    <span>1 km</span>
                    <Slider defaultValue={[20]} max={100} step={1} />
                    <span>100 km</span>
                </div>
            </CardContent>
        </Card>
        
        <Button size="lg" className="w-full">Enregistrer mes préférences</Button>

      </div>
    </div>
  );
}

    