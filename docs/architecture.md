# CampusConnect Architecture Specification

## 1. Modèle de données (Firestore + Storage)

### Firestore Collections

```
users/{uid} {
  role: "etudiant" | "entreprise",
  email, displayName, photoURL,
  school: string|null,
  location: string|null,
  companyName: string|null,
  isVerified: boolean,
  createdAt, updatedAt
}

announcements/{id} {
  title, body, tags: string[], createdBy: uidEntreprise,
  createdAt
}

matches/{id} {
  studentId: uidEtudiant,
  companyId: uidEntreprise,
  status: "interested" | "connected" | "blocked",
  createdAt, updatedAt
}

chats/{roomId} {
  matchId, participants: [uidEtudiant, uidEntreprise],
  audience: "pro" | "etudiant",
  lastMessageAt
}

chats/{roomId}/messages/{msgId} {
  authorId, text, createdAt
}

events/{id} {
  title, start: Timestamp, end: Timestamp, place, audience: "etudiant"|"entreprise"|"tous",
  expiresAt: Timestamp
}

verifications/{uid} {
  uid, role,
  status: "pending"|"approved"|"rejected",
  submittedAt, reviewedAt, reviewerId?,
  schoolProofPath: string,
  idDocPath: string
}
```

### Storage Structure

```
/verifications/{uid}/ecole.pdf | .jpg
/verifications/{uid}/id.pdf    | .jpg
```

## 2. Règles Firestore (confidentialité stricte)

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() { return request.auth != null; }
    function isUser(uid) { return isSignedIn() && request.auth.uid == uid; }
    function hasRole(r) { return isSignedIn() && request.auth.token.role == r; }
    function isAdmin() { return isSignedIn() && request.auth.token.admin == true; }

    match /users/{uid} {
      allow read: if isSignedIn();
      allow create: if isUser(uid);
      allow update: if isUser(uid) || isAdmin();
    }

    match /announcements/{id} {
      allow read: if true;
      allow create, update, delete: if hasRole("entreprise");
    }

    match /matches/{id} {
      allow read: if isSignedIn() &&
        (resource.data.studentId == request.auth.uid || resource.data.companyId == request.auth.uid);
      allow create: if hasRole("etudiant") && request.resource.data.studentId == request.auth.uid;
      allow update: if isSignedIn() &&
        (request.auth.uid == resource.data.studentId || request.auth.uid == resource.data.companyId);
      allow delete: if isAdmin() || request.auth.uid == resource.data.studentId;
    }

    match /chats/{roomId} {
      allow read, create, update: if isSignedIn() && (request.resource.data.participants hasAny [request.auth.uid]);
    }
    match /chats/{roomId}/messages/{msgId} {
      allow read, create: if isSignedIn() && (get(/databases/$(database)/documents/chats/$(roomId)).data.participants hasAny [request.auth.uid]);
      allow update, delete: if isAdmin() || request.auth.uid == resource.data.authorId;
    }

    match /events/{id} {
      allow read: if true;
      allow create, update, delete: if hasRole("entreprise") || isAdmin();
    }

    match /verifications/{uid} {
      allow read, create, update: if isUser(uid) || isAdmin();
    }
  }
}
```

### Storage Rules

```js
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /verifications/{uid}/{fileName} {
      allow write: if request.auth != null && request.auth.uid == uid;
      allow read: if request.auth != null && (request.auth.uid == uid || request.auth.token.admin == true);
    }
  }
}
```

## 3. Authentification & redirections par rôle

### Création de compte

- Formulaire avec choix du rôle et champs conditionnels (`school`, `location`, `companyName`).
- Validation stricte des mots de passe côté client.
- Prise en charge de la réinitialisation des mots de passe via `sendPasswordResetEmail`.

Exemple Next.js (App Router) :

```tsx
// src/app/signup/page.tsx
"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function SignUp() {
  // ... logique décrite dans la spécification
}
```

### Redirection après connexion

- Middleware/layout client qui lit le document `users/{uid}` et redirige vers `/etudiant/matches` ou `/entreprise/annonces` selon `role`.

## 4. Flux « Match »

- L’étudiant parcourt `announcements` et déclenche un match via un bouton « Je suis intéressé ».
- L’action serveur `createMatch` crée un document `matches` et un `chat` associé.
- L’entreprise accède uniquement aux conversations liées à ses matches.

## 5. Messagerie Pro vs Étudiant

- Chats `audience: "pro"` pour les échanges étudiant ↔ entreprise.
- Chats `audience: "etudiant"` pour les conversations entre étudiants.
- L’interface étudiant filtre ses rooms via deux requêtes Firestore utilisant `array-contains` sur `participants` et un `where` supplémentaire sur `audience`.

## 6. Vérification d’identité

- Upload de deux fichiers (certificat de scolarité et pièce d’identité) vers Storage.
- Création/mise à jour de `verifications/{uid}` avec `status: "pending"`.
- Page admin `/admin/verif` pour traiter les demandes. Cloud Function `approveVerification` met `users/{uid}.isVerified` à `true`.

## 7. Page Événements & TTL

- Activation du TTL Firestore sur `events.expiresAt` (défini sur `end`).
- Action serveur `createEvent` insère un événement avec `createdAt` et `expiresAt`.

## 8. Séparation stricte des vues

- Étudiants : accès à `/etudiant/matches`, onglets messages Pro/Étudiants, absence d’annuaire d’étudiants.
- Entreprises : accès à `/entreprise/annonces`, messagerie limitée aux matches, pas de liste d’étudiants.

## 9. Détails supplémentaires

- Possibilité d’ajouter du rate limiting.
- Profils minimalistes côté entreprise.
- Bannière incitant à la vérification lorsque `isVerified = false`.
- Journalisation optionnelle (`logs/{id}`).
- Feedback utilisateur clair via toasts/validations côté client et serveur.
```
