import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const setVerificationStatus = functions.https.onCall(async (data, context) => {
  if (!context.auth?.token?.admin) {
    throw new functions.https.HttpsError("permission-denied", "Admins only");
  }

  const { uid, status } = data as { uid: string; status: "approved" | "rejected" };

  await admin
    .firestore()
    .doc(`verifications/${uid}`)
    .set(
      {
        status,
        reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
        reviewerId: context.auth!.uid,
      },
      { merge: true }
    );

  await admin
    .firestore()
    .doc(`users/${uid}`)
    .set(
      {
        isVerified: status === "approved",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

  return { ok: true };
});
