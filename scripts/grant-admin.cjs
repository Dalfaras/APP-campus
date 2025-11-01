const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FB_ADMIN_PROJECT_ID,
    clientEmail: process.env.FB_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FB_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

async function main() {
  const uid = process.argv[2];
  if (!uid) {
    throw new Error("Usage: node scripts/grant-admin.cjs <UID>");
  }

  await admin.auth().setCustomUserClaims(uid, { admin: true, role: "admin" });

  console.log(`OK: ${uid} est admin.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
