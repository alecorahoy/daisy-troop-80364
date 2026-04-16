#!/usr/bin/env node
/**
 * Set a user's role (leader or parent) in Firebase.
 *
 * Usage:
 *   node scripts/set-role.js <email> <leader|parent>
 *
 * Example:
 *   node scripts/set-role.js mom@example.com leader
 *   node scripts/set-role.js dad@example.com parent
 *
 * Requires scripts/service-account.json (see scripts/README.md for setup).
 */

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import admin from 'firebase-admin';

const __dirname = dirname(fileURLToPath(import.meta.url));
const keyPath = join(__dirname, 'service-account.json');

if (!existsSync(keyPath)) {
  console.error('\n❌ Missing scripts/service-account.json');
  console.error('   Follow the instructions in scripts/README.md to download it.\n');
  process.exit(1);
}

const [, , email, role] = process.argv;

if (!email || !['leader', 'parent'].includes(role)) {
  console.error('\nUsage: node scripts/set-role.js <email> <leader|parent>\n');
  console.error('Examples:');
  console.error('  node scripts/set-role.js mom@example.com leader');
  console.error('  node scripts/set-role.js dad@example.com parent\n');
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

try {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { role });
  console.log(`\n✅ Set role for ${email}`);
  console.log(`   UID:  ${user.uid}`);
  console.log(`   Role: ${role}`);
  console.log(`\nℹ️  The user must sign out and sign in again for the change to take effect.\n`);
  process.exit(0);
} catch (err) {
  if (err.code === 'auth/user-not-found') {
    console.error(`\n❌ No user found with email: ${email}`);
    console.error(`   Create the user first in Firebase Console → Authentication → Users\n`);
  } else {
    console.error('\n❌ Error:', err.message, '\n');
  }
  process.exit(1);
}
