# Admin Scripts

## Setting a user's role

After creating a user in Firebase Console, use this script to mark them as **leader** or **parent**.

### First-time setup (one time only)

1. **Install firebase-admin:**
   ```bash
   npm install firebase-admin --save-dev
   ```

2. **Download your service account key:**
   - Go to [Firebase Console](https://console.firebase.google.com/project/daisy-troop-80364/settings/serviceaccounts/adminsdk)
   - Click **"Generate new private key"** → confirm
   - A JSON file downloads
   - **Rename it to `service-account.json`** and move it into the `scripts/` folder
   - ⚠️ **Never commit this file** — it's already in `.gitignore`

### Running the script

From the project root:

```bash
# Promote a user to leader
node scripts/set-role.js mom@example.com leader

# Set a user as parent (default, but you can set it explicitly)
node scripts/set-role.js dad@example.com parent
```

### After running

The user must **sign out and sign in again** for the role change to take effect. Firebase caches the token locally for up to an hour otherwise.
