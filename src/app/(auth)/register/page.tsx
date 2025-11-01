"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mountain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/lib/firebase";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "etudiant" as "etudiant" | "entreprise",
  school: "",
  location: "",
  companyName: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(initialForm);

  const handleChange = (key: keyof typeof initialForm) =>
    (value: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const credential = await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);
      await updateProfile(credential.user, {
        displayName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
      });

      const profileDoc = doc(db, "users", credential.user.uid);
      await setDoc(profileDoc, {
        role: form.role,
        email: form.email.trim().toLowerCase(),
        displayName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
        photoURL: credential.user.photoURL ?? null,
        school: form.role === "etudiant" ? form.school || null : null,
        location: form.role === "etudiant" ? form.location || null : null,
        companyName: form.role === "entreprise" ? form.companyName || null : null,
        isVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast({
        title: "Bienvenue sur APP Campus",
        description: "Votre compte a été créé avec succès. Configurez votre profil dès maintenant.",
      });

      router.push(form.role === "entreprise" ? "/entreprise/annonces" : "/etudiant/matches");
    } catch (error) {
      console.error(error);
      toast({
        title: "Impossible de créer le compte",
        description:
          error instanceof Error ? error.message : "Une erreur inattendue est survenue. Merci de réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Mountain className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-bold">APP Campus</span>
        </div>
        <CardTitle className="text-2xl font-bold">Créer un compte</CardTitle>
        <CardDescription>Rejoignez la communauté et commencez à collaborer.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first-name">Prénom</Label>
              <Input
                id="first-name"
                placeholder="Alex"
                value={form.firstName}
                onChange={(event) => handleChange("firstName")(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Nom</Label>
              <Input
                id="last-name"
                placeholder="Dupont"
                value={form.lastName}
                onChange={(event) => handleChange("lastName")(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@exemple.com"
              value={form.email}
              onChange={(event) => handleChange("email")(event.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Select value={form.role} onValueChange={(value) => handleChange("role")(value)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="etudiant">Étudiant</SelectItem>
                  <SelectItem value="entreprise">Entreprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.role === "etudiant" ? (
              <div className="space-y-2">
                <Label htmlFor="school">École</Label>
                <Select value={form.school} onValueChange={(value) => handleChange("school")(value)}>
                  <SelectTrigger id="school">
                    <SelectValue placeholder="Sélectionnez une école" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ESGI">ESGI</SelectItem>
                    <SelectItem value="EPITA">EPITA</SelectItem>
                    <SelectItem value="HETIC">HETIC</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="companyName">Entreprise</Label>
                <Input
                  id="companyName"
                  placeholder="Nom de votre entreprise"
                  value={form.companyName}
                  onChange={(event) => handleChange("companyName")(event.target.value)}
                  required
                />
              </div>
            )}
          </div>

          {form.role === "etudiant" && (
            <div className="space-y-2">
              <Label htmlFor="location">Ville ou campus</Label>
              <Input
                id="location"
                placeholder="Paris, Campus République…"
                value={form.location}
                onChange={(event) => handleChange("location")(event.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              minLength={8}
              placeholder="Au moins 8 caractères"
              value={form.password}
              onChange={(event) => handleChange("password")(event.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Incluez des lettres majuscules, minuscules et un chiffre pour renforcer la sécurité.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Création en cours…" : "Créer mon compte"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          Vous avez déjà un compte?{" "}
          <Link href="/login" className="underline">
            Se connecter
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
