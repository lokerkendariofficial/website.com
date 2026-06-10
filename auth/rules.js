// auth/rules.js - Dokumentasi aturan keamanan (mirip Firebase Rules)
/*
  RULES_VERSION = '1';
  service loker {
    match /lowongan {
      allow read: if true;
      allow write: if request.auth.role in ['pemilik', 'admin'];
    }
    match /pendingIklan {
      allow read: if request.auth.role in ['pemilik', 'admin'];
      allow create: if request.auth != null;
      allow update, delete: if request.auth.role in ['pemilik', 'admin'];
    }
    match /users {
      allow read: if request.auth.role in ['pemilik', 'admin'];
      allow write: if request.auth.role in ['pemilik', 'admin'];
    }
    match /lamaran/{userId} {
      allow read: if request.auth.uid == userId || request.auth.role in ['pemilik', 'admin'];
      allow create: if request.auth != null;
    }
    match /logs {
      allow read: if request.auth.role == 'pemilik';
    }
    // ... dst
  }
*/
console.log('Firebase-like rules loaded (static version)');