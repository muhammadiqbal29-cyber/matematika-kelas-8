const admin = require('firebase-admin');

function getDatabase() {
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
    if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email || !process.env.FIREBASE_DATABASE_URL) {
      throw new Error('Konfigurasi Firebase belum lengkap.');
    }
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
  }
  return admin.database();
}

module.exports = { getDatabase };
