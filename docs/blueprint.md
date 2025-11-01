# APP Campus — Blueprint produit & UX

## 1. Vision
- Plateforme dédiée à la rencontre entre **étudiants** et **entreprises** tout en préservant la confidentialité du profil étudiant.
- Fonctionnalités clés : **messagerie cloisonnée**, **matchs par intérêt**, **événements**, **espaces de coworking**, **vérification d'identité** et suivi administratif.
- Valeurs d'interface : **thème orange chaleureux**, typographies **Manrope/Inter**, arrondis généreux (`rounded-2xl`), ombres douces et accessibilité (contrastes AA, focus visibles).

## 2. Rôles et parcours
- **Étudiant** : crée un compte, découvre les annonces, déclenche un match (“Je suis intéressé”), échange avec l’entreprise sans exposition de son profil complet, discute dans le canal étudiant, participe à des événements, gère la vérification (carte + attestation).
- **Entreprise** : publie des annonces et des événements, gère ses espaces de coworking, répond aux conversations déclenchées par les étudiants, n’accède jamais à un annuaire global d’étudiants.
- **Admin** : modère le contenu, valide les vérifications, suit les logs et peut intervenir sur les annonces/événements.

## 3. Stack cible
- **Frontend** : Next.js App Router + React + TypeScript + Tailwind CSS, UI kit Shadcn.
- **Backend** : Firebase (Auth, Firestore, Storage, Cloud Functions, Hosting, TTL Firestore pour `events.expiresAt`).
- **Server Actions/API Routes** : orchestrent la logique métier (`createMatch`, `sendMessage`, `createEvent`, etc.) via le Firebase Admin SDK.
- **IA optionnelle** : Firebase Genkit / Vertex AI pour recommandations ou modération.

## 4. Modèle de données Firestore
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
  participants: string[],
  audience: "pro" | "etudiant",
  lastMessageAt
}
chats/{roomId}/messages/{msgId} {
  authorId, text, createdAt
}

events/{id} {
  title, start: Timestamp, end: Timestamp, place,
  audience: "etudiant"|"entreprise"|"tous",
  expiresAt: Timestamp
}

verifications/{uid} {
  uid, role,
  status: "pending"|"approved"|"rejected",
  idDocPath, schoolProofPath,
  submittedAt, reviewedAt?, reviewerId?
}

coworking/{id} {
  name, address, capacity, hours,
  services: string[], ownerId,
  createdAt
}

reports/{id} {
  reporterId, target, reason, createdAt
}

logs/{id} { actorId, action, target, meta, createdAt }
```

## 5. Règles de sécurité (extraits)
- `users` : lecture pour tout utilisateur connecté, mise à jour par le propriétaire ou un admin.
- `announcements` : création/édition/suppression par les entreprises, lecture publique.
- `matches` : création par l’étudiant concerné, lecture & édition par les deux parties, suppression par l’étudiant ou admin.
- `chats`/`messages` : accès strict aux `participants`; séparation des audiences "pro" et "etudiant".
- `events` : lecture publique, écriture entreprise/admin, TTL activé sur `expiresAt`.
- `verifications` : lecture/écriture uniquement pour l’utilisateur propriétaire et les admins.
- Storage `/verifications/{uid}/…` : upload par `uid`, lecture limitée à `uid` + admin.

## 6. Frontend — routes principales
- `/signup`, `/login`, `/forgot-password` avec choix du rôle, règles de mot de passe et lien reset.
- Redirections après login : `etudiant → /etudiant/matches`, `entreprise → /entreprise/annonces`, `admin → /admin/dashboard`.
- **Étudiant** : `/annonces`, `/etudiant/matches`, `/messages` (onglets Pro/Étudiants), `/verif`, `/evenements`, `/coworking`, `/profil`.
- **Entreprise** : `/entreprise/annonces`, `/messages`, `/evenements`, `/coworking`, `/verif` (documents société).
- **Admin** : `/admin/verif`, `/admin/moderation`, `/admin/logs`.

## 7. Actions & automatisations
- Server Actions : `createAnnouncement`, `updateAnnouncement`, `deleteAnnouncement`, `createMatch`, `sendMessage`, `createEvent`, `createCoworking`, `roleRedirect`.
- Cloud Functions : `setVerificationStatus` (callable admin), `onVerificationApproved` (synchro `users.isVerified`), notifications (email/FCM), modération IA optionnelle, rate limiting.
- TTL Firestore : suppression automatique des événements via `expiresAt`.

## 8. Expériences critiques
1. **Inscription Étudiant** → formulaire avec métadonnées école/ville, redirection vers `/etudiant/matches`, bannière "Compte non vérifié".
2. **Match** → bouton "Je suis intéressé" crée `matches` + `chat (audience=pro)` ; l’entreprise voit la conversation sans fiche complète.
3. **Messagerie** → interface temps réel, compteur non-lus, séparation stricte Pro / Étudiants.
4. **Vérification** → upload des deux pièces, suivi en temps réel du statut (`pending`, `approved`, `rejected`), notifications à la décision.
5. **Événements & coworking** → CRUD entreprise/admin, filtres par audience/localisation, purge automatique des événements expirés.

## 9. Fonctionnalités bonus recommandées
- Notifications email/web push pour nouveaux messages, matchs, vérifications.
- Système de signalement (`reports`), logs d’audit (`logs`).
- Export/suppression RGPD, politique de confidentialité et consentement explicite.
- Accessibilité (ARIA, `prefers-reduced-motion`), SEO (métadonnées, sitemap, Open Graph), PWA optionnelle.
- Feature flags, analytics (conversion match, funnel vérif), antivirus sur les uploads.

## 10. Qualité & déploiement
- Tests unitaires (utilitaires), intégration (Server Actions), E2E (Playwright : signup → match → chat → vérification).
- CI GitHub Actions : `pnpm install`, `pnpm lint`, `pnpm test`, build puis déploiement Firebase Hosting/App Hosting.
- Gestion des secrets : fichiers `.env.local` / `.env.production`, jamais commités.
- Lint/format (ESLint, Prettier), possibilité `ignoreDuringBuilds: true` en phase initiale.

Ce blueprint synthétise l’intégralité des exigences fonctionnelles, techniques et UX pour finaliser APP Campus.
