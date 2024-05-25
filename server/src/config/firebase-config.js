import admin from 'firebase-admin';
import 'dotenv/config';

const serviceAccount = {
  type: process.env.VITE_FIREBASE_TYPE,
  project_id: process.env.VITE_FIREBASE_PROJECT_ID,
  private_key_id: process.env.VITE_FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.VITE_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.VITE_FIREBASE_CLIENT_EMAIL,
  client_id: process.env.VITE_FIREBASE_CLIENT_ID,
  auth_uri: process.env.VITE_FIREBASE_AUTH_URI,
  token_uri: process.env.VITE_FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.VITE_FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.VITE_FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.VITE_FIREBASE_UNIVERSE_DOMAIN,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export { admin };
