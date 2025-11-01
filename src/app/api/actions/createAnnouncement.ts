"use server";

import { adminDb } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

interface AnnouncementInput {
  title: string;
  body: string;
  tags: string[];
  createdBy: string;
  location?: string;
}

export async function createAnnouncement(input: AnnouncementInput) {
  const payload = {
    ...input,
    title: input.title.trim(),
    body: input.body.trim(),
    createdAt: Timestamp.now(),
  };

  await adminDb.collection("announcements").add(payload);
}
