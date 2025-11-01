"use server";

import { adminDb } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

type Audience = "etudiant" | "entreprise" | "tous";

interface EventInput {
  title: string;
  start: string;
  end: string;
  place: string;
  audience: Audience;
}

export async function createEvent(event: EventInput) {
  const startTimestamp = Timestamp.fromDate(new Date(event.start));
  const endTimestamp = Timestamp.fromDate(new Date(event.end));

  await adminDb.collection("events").add({
    title: event.title.trim(),
    start: startTimestamp,
    end: endTimestamp,
    place: event.place.trim(),
    audience: event.audience,
    expiresAt: endTimestamp,
    createdAt: Timestamp.now(),
  });
}
