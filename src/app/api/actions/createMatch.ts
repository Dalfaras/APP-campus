"use server";

import { adminDb } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

export async function createMatch(studentId: string, companyId: string) {
  const matchRef = adminDb.collection("matches").doc();
  await matchRef.set({
    studentId,
    companyId,
    status: "interested",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  const chatRef = adminDb.collection("chats").doc();
  await chatRef.set({
    matchId: matchRef.id,
    participants: [studentId, companyId],
    audience: "pro",
    lastMessageAt: Timestamp.now(),
  });

  return { matchId: matchRef.id, chatId: chatRef.id };
}
