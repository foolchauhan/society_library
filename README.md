# Society Library Management System

A web-based, frontend-only library management system designed for residential societies. This app allows community members to share books, submit borrow requests, track active loans, and manage returns. 

It uses a **Google Sheet as a relational database** and a **Google Apps Script Web App** as a secure, serverless API proxy. This ensures your spreadsheet remains private and secure, and residents do not need to grant full Google Drive access permissions.

---

## 🌟 Premium Features

- **Google Sheets Database**: Zero database server setup. All data is written directly to a Google Sheet in your personal Google Drive.
- **Secure Google Sign-In**: Uses Google's official Identity Services SDK. Residents prove who they are safely.
- **Local Onboarding Queue**: Admin must approve users before they can see phone numbers or request books.
- **ISBN Metadata Auto-Fetch**: Lenders can type or scan a book's ISBN. The app queries the Open Library API to auto-fill title, author, description, and cover artwork.
- **Due Date Tracking**: Borrowers get visual progress bars showing time remaining. Overdue books are highlighted in red.
- **Copy Management**: Lenders can add multiple copies of the same book, and the system distinguishes each copy.
- **Mock Mode / Offline Demo**: Run the app instantly! When `MOCK_MODE: true` is set in `app.js`, the app uses a rich seed database stored in the browser's `LocalStorage` so you can evaluate all features without setting up Google Sheets first.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Single Page Application (SPA) built with pure HTML5, Vanilla CSS (Modern Literary design tokens, glassmorphism, responsive grid), and modular ES6 JavaScript. No framework compilation or build actions required.
- **Backend API**: Google Apps Script running on your Google Drive.
- **Database**: Google Sheet.
- **OAuth Identity**: Google Cloud OAuth Consent client.

---

## 🚀 Quick Start (Instant Local Demo)

To run the application locally right now:

1. Clone or download this project.
2. In terminal, navigate to the directory and run a local web server (e.g. `npx serve` or python's server):
   ```bash
   npx serve .
   ```
   or
   ```bash
   python3 -m http.server 5000
   ```
3. Open the browser at the address shown (usually `http://localhost:5000` or `http://localhost:3000`).
4. Since `MOCK_MODE` is enabled by default in `src/js/app.js`, the app will load immediately. Click **Start Explorer Demo**.
5. Use the dropdown selector in the top banner to quickly switch roles (Borrower, Lender, Admin, Unapproved Resident) and test the full lifecycle of lending and borrowing!

---

## 📋 Production Setup (Google Sheets Integration)

To connect this to your society's Google Sheet:

1. Follow the step-by-step setup in the [google-apps-script/setup.md](google-apps-script/setup.md) file.
2. In [src/js/app.js](src/js/app.js), set the configuration values:
   ```javascript
   const CONFIG = {
     API_URL: 'YOUR_DEPLOYED_GOOGLE_APPS_SCRIPT_WEB_APP_URL',
     GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
     MOCK_MODE: false // Set this to false for live Sheets database
   };
   ```
3. Host on GitHub Pages by going to your GitHub Repository Settings > **Pages** and selecting the `main` branch.
