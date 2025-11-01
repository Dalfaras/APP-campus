# APP Campus — Architecture & Sécurité

## 1. Modèle de données Firestore & Storage

### Collections principales
```
users/{uid} {
  role: "etudiant" | "entreprise" | "admin",
  email, displayName, photoURL,
  school?: string, location?: string,
  companyName?: string,
  isVerified: boolean,
  createdAt, updatedAt
}

announcements/{id} {
  title, body, tags: string[],
  createdBy: uidEntreprise,
  location?: string,
  createdAt
}

matches/{id} {
  studentId, companyId,
  status: "interested" | "connected" | "blocked",
  createdAt, updatedAt
}

chats/{roomId} {
  matchId,
  participants: [uid...],
  audience: "pro" | "etudiant",
  lastMessageAt
}
chats/{roomId}/messages/{msgId} {
  authorId, text, createdAt
}

events/{id} {
  title, start, end, place,
  audience: "etudiant"|"entreprise"|"tous",
  expiresAt: Timestamp // utilisé pour le TTL Firestore
}

verifications/{uid} {
  uid, role,
  status: "pending"|"approved"|"rejected",
  idDocPath, schoolProofPath,
  submittedAt, reviewedAt?, reviewerId?
}

coworking/{id} {
  name, address, capacity, hours,
  services: string[], ownerId, createdAt
}

reports/{id} { reporterId, target, reason, createdAt }
logs/{id}    { actorId, action, target, meta, createdAt }
```

### Storage
```
/verifications/{uid}/id-card.(pdf|jpg|png)
/verifications/{uid}/school-proof.(pdf|jpg|png)
```

### Indexes recommandés
- `matches`: `(studentId, updatedAt desc)` et `(companyId, updatedAt desc)`.
- `chats`: `participants array-contains` + `audience`.
- `announcements`: `(createdBy, createdAt desc)`.
- `events`: `(audience, start asc)`.

## 2. Règles de sécurité (Firestore & Storage)
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() { return request.auth != null; }
    function isUser(uid) { return signedIn() && request.auth.uid == uid; }
    function hasRole(role) { return signedIn() && request.auth.token.role == role; }
    function isAdmin() { return signedIn() && request.auth.token.admin == true; }

    match /users/{uid} {
      allow read: if signedIn();
      allow create: if isUser(uid);
      allow update: if isUser(uid) || isAdmin();
    }

    match /announcements/{id} {
      allow read: if true;
      allow create, update, delete: if hasRole("entreprise") || isAdmin();
    }

    match /matches/{id} {
      allow read: if signedIn() &&
        (resource.data.studentId == request.auth.uid || resource.data.companyId == request.auth.uid);
      allow create: if hasRole("etudiant") && request.resource.data.studentId == request.auth.uid;
      allow update: if signedIn() &&
        (request.auth.uid == resource.data.studentId || request.auth.uid == resource.data.companyId);
      allow delete: if isAdmin() || request.auth.uid == resource.data.studentId;
    }

    match /chats/{roomId} {
      allow read, create: if signedIn() && (request.resource.data.participants hasAny [request.auth.uid]);
      allow update: if isAdmin();
    }

    match /chats/{roomId}/messages/{msgId} {
      allow read, create: if signedIn() &&
        (get(/databases/$(database)/documents/chats/$(roomId)).data.participants hasAny [request.auth.uid]);
      allow update, delete: if isAdmin() || request.auth.uid == resource.data.authorId;
    }

    match /events/{id} {
      allow read: if true;
      allow create, update, delete: if hasRole("entreprise") || isAdmin();
    }

    match /verifications/{uid} {
      allow read, create, update: if isUser(uid) || isAdmin();
    }

    match /coworking/{id} {
      allow read: if true;
      allow create, update, delete: if (hasRole("entreprise") && request.resource.data.ownerId == request.auth.uid) || isAdmin();
    }

    match /reports/{id} {
      allow create: if signedIn();
      allow read: if isAdmin();
    }

    match /logs/{id} {
      allow read: if isAdmin();
      allow create: if signedIn();
    }
  }
}
```

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

## 3. Flux applicatifs clefs
1. **Inscription** : formulaire rôle + données spécifiques, création du document `users/{uid}`, bannière "Compte non vérifié".
2. **Match** : bouton "Je suis intéressé" → server action `createMatch` → document `matches` + `chat (audience="pro")`.
3. **Messagerie** : requêtes Firestore filtrées par `participants` + `audience`, badge non-lu, séparation Pro/Étudiants.
4. **Vérification** : upload Storage, document `verifications` `status=pending`, fonction `setVerificationStatus` pour l’admin.
5. **Événements** : création via action serveur (définit `expiresAt=end`), TTL Firestore supprime automatiquement après expiration.
6. **Coworking** : fiches publiques, édition par l’entreprise propriétaire.
7. **Notifications** : Cloud Functions (email/FCM) déclenchées sur `matches` et `messages`, option d’activation via feature flag.

## 4. Automatisations & extensibilité
- **Cloud Functions** :
  - `setVerificationStatus({ uid, status })` callable admin.
  - `onVerificationApproved` (trigger Firestore) pour synchroniser `users.isVerified`.
  - Hooks de modération IA (analyse texte) et purge des documents refusés.
  - Rate limiting (ex. verrou par IP/UID sur création matchs/messages).
- **Server Actions** : `createAnnouncement`, `updateAnnouncement`, `deleteAnnouncement`, `createEvent`, `createCoworking`, `sendMessage`, `listMyConversations`, `roleRedirect`.
- **Logs** : écrire `logs/{id}` pour actions sensibles (modération, validation vérif, suppression).

## 5. Qualité, tests & déploiement
- **Tests** : unitaires (utilitaires), intégration (Server Actions + Firestore mock), E2E Playwright.
- **CI/CD** : GitHub Actions → `pnpm install`, `pnpm lint`, `pnpm test`, `pnpm build`, déploiement Firebase Hosting/App Hosting.
- **Observabilité** : Firebase Analytics + export BigQuery (option), instrumentation des conversions (match, vérif approuvée).
- **Sécurité** : audit régulier des règles, rotation des clés de service, chiffrement côté client optionnel pour les documents sensibles.

Ce document décrit la structure technique nécessaire pour garantir la confidentialité étudiante, la séparation des rôles et l’automatisation des parcours APP Campus.
