"use server";

import { adminDb } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

export async function sendMessage(roomId: string, authorId: string, text: string) {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("Le message ne peut pas être vide.");
  }

  const messageRef = adminDb.collection("chats").doc(roomId).collection("messages").doc();
  await messageRef.set({
    authorId,
    text: trimmed,
    createdAt: Timestamp.now(),
  });

  await adminDb.collection("chats").doc(roomId).set(
    {
      lastMessageAt: Timestamp.now(),
    },
    { merge: true }
  );
}
