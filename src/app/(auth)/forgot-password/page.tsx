"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mountain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await sendPasswordResetEmail(auth, email.trim());
      toast({
        title: "Email envoyé",
        description: "Consultez votre boîte de réception pour réinitialiser votre mot de passe.",
      });
      setEmail("");
    } catch (error) {
      console.error(error);
      toast({
        title: "Impossible d'envoyer le lien",
        description:
          error instanceof Error ? error.message : "Vérifiez votre adresse email ou contactez le support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader className="space-y-1 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Mountain className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-bold">APP Campus</span>
        </div>
        <CardTitle className="text-2xl font-bold">Mot de passe oublié</CardTitle>
        <CardDescription>Entrez votre email pour recevoir un lien de réinitialisation</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@exemple.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Envoi en cours…" : "Envoyer le lien"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link href="/login" className="underline">
            Retour à la connexion
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
