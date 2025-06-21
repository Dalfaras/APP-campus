import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mountain } from "lucide-react"

export default function ForgotPasswordPage() {
  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader className="space-y-1 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
           <Mountain className="h-8 w-8 text-primary" />
           <span className="text-2xl font-bold font-headline">Cowork Campus</span>
        </div>
        <CardTitle className="text-2xl font-bold">Mot de passe oublié</CardTitle>
        <CardDescription>Entrez votre email pour recevoir un lien de réinitialisation</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@exemple.com" required />
          </div>
          <Button type="submit" className="w-full">
            Envoyer le lien
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link href="/login" className="underline">
            Retour à la connexion
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
