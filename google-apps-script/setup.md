# Google Sheets & Google Sign-In Setup Guide

To run this application, you need to set up two things:
1. **Google Sheets Backend**: Where all book, user, and loan data is stored.
2. **Google Cloud OAuth Credentials**: To enable secure Google Sign-in for society residents.

Follow these step-by-step instructions.

---

## Step 1: Initialize Your Google Sheet & Apps Script

1. Open your browser and go to [Google Sheets](https://sheets.new) to create a new spreadsheet.
2. Name your spreadsheet (e.g., `Society Library Database`).
3. In the top menu, select **Extensions** > **Apps Script**.
4. In the Apps Script project editor, replace all code in `Code.gs` with the contents of the `google-apps-script/code.js` file in this repository.
5. Save the project (click the disk icon or press `Cmd/Ctrl + S`).
6. Select **`setupDatabase`** from the function drop-down list at the top and click **Run**.
7. Google will prompt you to authorize permissions. Click **Review permissions**, select your Google account, click **Advanced**, and then click **Go to Untitled project (unsafe)** (this is safe since it's your own script). Click **Allow**.
8. Go back to your Google Sheet. You will see three tabs created automatically: `users`, `books`, and `loans` with colored header rows!

---

## Step 2: Deploy the Apps Script as a Web App

To make the spreadsheet accessible as a database API for your frontend:

1. In the Apps Script editor, click the **Deploy** button in the top right and select **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Configure the deployment details:
   - **Description**: `Society Library API`
   - **Execute as**: `Me (your-email@gmail.com)` (This allows the script to read/write to the sheet using your admin account).
   - **Who has access**: `Anyone` (This is required so the frontend can hit the endpoint. Don't worry, the script requires a valid Google Sign-In token to perform any actions, making it highly secure).
4. Click **Deploy**.
5. Once deployed, copy the **Web App URL** (it ends in `/exec`). Save this URL; you will paste it into the frontend code configuration.

---

## Step 3: Configure Google Cloud for Google Sign-In

To allow users to log in with Google, you need a Client ID.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (name it something like `Society Library`).
3. Navigate to **APIs & Services** > **OAuth consent screen**:
   - Select **External** and click **Create**.
   - Fill in the required fields:
     - **App name**: `Society Library`
     - **User support email**: Your email.
     - **Developer contact information**: Your email.
   - Click **Save and Continue** through the scopes and test users sections.
   - *Note*: If you keep the project in "Testing" status, you must add your neighbors' emails as "Test Users" in the consent screen. To avoid this, click **Publish App** on the OAuth consent screen dashboard to make it available to any resident without manual registration.
4. Navigate to **APIs & Services** > **Credentials**:
   - Click **+ Create Credentials** at the top and select **OAuth client ID**.
   - Select **Web application** as the application type.
   - Under **Authorized JavaScript origins**, add:
     - `http://localhost:5000` (for local development)
     - `http://127.0.0.1:5000` (for local development)
     - `https://your-github-username.github.io` (replace with your GitHub Pages domain)
   - Click **Create**.
5. Copy the generated **Client ID**.

---

## Step 4: Configure the Frontend Web App

1. In your project files, open [src/js/app.js](file:///Users/chetan_mac/DoNotTouch/Antigravity/society_library/src/js/app.js).
2. Look for the configuration object at the top of the file:
   ```javascript
   const CONFIG = {
     // Paste your Google Apps Script Web App URL here
     API_URL: 'YOUR_APPS_SCRIPT_WEB_APP_URL',
     
     // Paste your Google OAuth Client ID here
     GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
     
     // Enable this to test the app without setting up Google Sheets/OAuth!
     // When true, all data is mocked and stored in your browser's LocalStorage.
     MOCK_MODE: false
   };
   ```
3. Replace the placeholders with your URL and Client ID.
4. If you just want to demo the application first without doing Google setup, set `MOCK_MODE: true`.

---

## Step 5: Host on GitHub Pages

1. Create a repository on GitHub and push these files.
2. In the repository settings, go to **Pages** (in the sidebar under "Code and automation").
3. Under "Build and deployment", set the source to **Deploy from a branch** and select the `main` (or `master`) branch.
4. Click **Save**.
5. After a few minutes, your site will be live at `https://your-github-username.github.io/society_library/`!
