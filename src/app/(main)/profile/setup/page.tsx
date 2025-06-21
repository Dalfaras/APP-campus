import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function ProfileSetupPage() {
  const completeProfile = async () => {
    'use server'
    redirect('/match')
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
        <CardHeader>
            <CardTitle className="font-headline text-3xl">Terminez votre profil</CardTitle>
            <CardDescription>Ces informations aideront les autres à mieux vous connaître.</CardDescription>
        </CardHeader>
        <CardContent>
            <form action={completeProfile} className="space-y-6">
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

                <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" placeholder="Parlez un peu de vous, de ce que vous étudiez, de vos passions..." />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="interests">Intérêts</Label>
                    <Input id="interests" placeholder="Développement web, entrepreneuriat, musique..." />
                    <p className="text-sm text-muted-foreground">Séparez les intérêts par des virgules.</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="skills">Compétences</Label>
                    <Input id="skills" placeholder="React, Node.js, Prise de parole en public..." />
                     <p className="text-sm text-muted-foreground">Séparez les compétences par des virgules.</p>
                </div>

                <Button type="submit" className="w-full" size="lg">Commencer à matcher</Button>
            </form>
        </CardContent>
        </Card>
    </div>
  )
}
