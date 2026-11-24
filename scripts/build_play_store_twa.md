# Google Play Store Packaging Guide (Trusted Web Activity / TWA)

This step-by-step owner's guide packages **The History Revision Hub** (`https://historyrevisionhub.co.uk`) into an official Google Play Store Android App Bundle (`.aab`) using Google's official `@bubblewrap/cli` Trusted Web Activity (TWA) builder.

Because the web app already ships with:
- Crisp `192x192`, `512x512`, and adaptive `maskable` `512x512` PNG icons (`public/icon-192.png`, `public/icon-512.png`, `public/icon-maskable-512.png`),
- A Play-Store-ready Web App Manifest (`https://historyrevisionhub.co.uk/manifest.json`),
- A dedicated Privacy & Data Safety page (`https://historyrevisionhub.co.uk/privacy.html`), and
- Digital Asset Links endpoint (`https://historyrevisionhub.co.uk/.well-known/assetlinks.json`),

you only need **4 steps** to build and publish to Google Play Console.

---

## Before You Start (One-Time Prerequisites)
1. Ensure your latest site changes (`manifest.json`, PNG icons, `privacy.html`, and `.well-known/assetlinks.json`) are deployed live at `https://historyrevisionhub.co.uk`.
2. Create an empty folder **outside** this repository for your Android build workspace (so Android keystores and build files never mix into Git):
   ```powershell
   mkdir C:\Projects\history-hub-android-twa
   cd C:\Projects\history-hub-android-twa
   ```

---

## Step 1 — Initialize the TWA Project (`bubblewrap init`)

Run Bubblewrap pointed at your live manifest:

```powershell
npx @bubblewrap/cli init --manifest=https://historyrevisionhub.co.uk/manifest.json
```

- On first run, if Bubblewrap asks to download a local copy of **JDK 17** and **Android SDK Command Line Tools**, answer **`Yes`** (`Y`) — it handles everything automatically.
- Confirm or enter these exact values when prompted:
  - **Domain:** `historyrevisionhub.co.uk`
  - **Application ID (Package Name):** `uk.co.historyrevisionhub.app` *(must match `public/.well-known/assetlinks.json`)*
  - **App Name:** `The History Revision Hub`
  - **Short Name:** `History Hub`
  - **Display Mode:** `standalone`
  - **Status Bar / Navigation Bar / Splash Color:** `#0f172a`
  - **Icon URL:** `https://historyrevisionhub.co.uk/icon-512.png`
  - **Maskable Icon URL:** `https://historyrevisionhub.co.uk/icon-maskable-512.png`
  - **Signing Key:** Choose to create a new keystore (`android.keystore`) and store your keystore password safely in your password manager.

---

## Step 2 — Build the Signed `.aab` Bundle (`bubblewrap build`)

Inside `C:\Projects\history-hub-android-twa`, run:

```powershell
npx @bubblewrap/cli build
```

Bubblewrap outputs two signed files in that folder:
1. **`app-release-bundle.aab`** — Upload this file to **Google Play Console**.
2. **`app-release-signed.apk`** — Optional file you can install directly onto an Android phone/tablet via USB to preview immediately.

---

## Step 3 — Paste the SHA-256 Fingerprint into `assetlinks.json`

Android hides the Chrome address bar inside your app **only** when `https://historyrevisionhub.co.uk/.well-known/assetlinks.json` lists Google Play's **App Signing certificate SHA-256 fingerprint**.

1. Log in to [Google Play Console](https://play.google.com/console), create your app (**The History Revision Hub**), and upload `app-release-bundle.aab` to **Internal testing** (or Production) so Play App Signing generates your production signing certificate.
2. In Google Play Console, open **Test and release -> Setup -> App signing** (or **Release -> Setup -> App integrity -> App signing**).
3. Under **App signing key certificate**, copy the **SHA-256 certificate fingerprint** (it looks like `14:6D:E9:83:C5:73:...`).
   *(Tip: If you also test the local `app-release-signed.apk` before Play Store download, you can view your local upload key SHA-256 via `keytool -list -v -keystore android.keystore` and include both strings in the `sha256_cert_fingerprints` array.)*
4. Open `public/.well-known/assetlinks.json` in this web repository and replace `"REPLACE_WITH_GOOGLE_PLAY_APP_SIGNING_SHA256_CERT_FINGERPRINT"` with that exact SHA-256 string:
   ```json
   [
     {
       "relation": [
         "delegate_permission/common.handle_all_urls"
       ],
       "target": {
         "namespace": "android_app",
         "package_name": "uk.co.historyrevisionhub.app",
         "sha256_cert_fingerprints": [
           "PASTE_YOUR_PLAY_CONSOLE_SHA256_FINGERPRINT_HERE"
         ]
       }
     }
   ]
   ```
5. Deploy the updated web repository so `https://historyrevisionhub.co.uk/.well-known/assetlinks.json` serves the live fingerprint over HTTPS.

---

## Step 4 — Upload `.aab` & Complete Play Console Store Listing

In **Google Play Console** (`App content` & `Main store listing`):

1. **Privacy Policy URL:** Enter:
   ```text
   https://historyrevisionhub.co.uk/privacy.html
   ```
2. **App Access:** Select **"All functionality is available without special access"** (pupils can open all History courses, quizzes, and audio lessons with zero login).
3. **Ads:** Select **"No, my app does not contain ads."**
4. **Data Safety Questionnaire:**
   - *Does your app collect or share any of the required user data types?* -> **No** (all quiz mastery, bookmarks, and offline lessons stay strictly in local device storage with zero serverside PII).
5. **Store Listing Assets:**
   - **App Icon (`512x512`):** Upload `public/icon-512.png`.
   - **Phone & Tablet Screenshots:** Generate clean Portrait (`390x844`) and Landscape (`896x414`) screenshots anytime using:
     ```powershell
     node scripts/audit_mobile_app_mode.cjs --screenshots-dir=./temp_backups/play_store_screenshots
     ```
6. Promote your `.aab` release from **Internal testing** to **Production** and submit for review.
