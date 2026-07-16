# TA-14 Exchange — GitHub and Deployment Steps

## 1. Create the GitHub repository

1. Sign in to GitHub.
2. Select **New repository**.
3. Repository name: `ta14-exchange-platform`.
4. Description: `TA-14 Global Admissible Execution Exchange`.
5. Choose **Private** while production accounts, keys, and terms are unfinished.
6. Do not add a README, .gitignore, or license because this package already contains them.
7. Create the repository and leave the GitHub setup page open.

## 2. Upload from your computer

Extract this ZIP into a folder, open a terminal in that folder, and run:

```bash
git init
git add .
git commit -m "Launch TA-14 Exchange single-route website"
git branch -M main
git remote add origin https://github.com/greggbutlerac-debug/ta14-exchange-platform.git
git push -u origin main
```

Replace `YOUR-GITHUB-USERNAME` with the name shown in your GitHub profile URL.

## 3. Test locally

Install Node.js 20 or newer. In the project folder run:

```bash
npm install
npm run verify
npm run dev
```

Open `http://localhost:3000`.

## 4. Create the hosting project

Vercel is the easiest host for this Next.js release.

1. Sign in to Vercel with GitHub.
2. Choose **Add New → Project**.
3. Import `ta14-exchange-platform`.
4. Framework preset: **Next.js**.
5. Build command: `npm run build`.
6. Install command: `npm install`.
7. Deploy only as a private preview first.

## 5. Important current limitation

The present local JSON persistence is not appropriate for a production multi-instance deployment. A Vercel preview can demonstrate the design, but route continuity may not persist reliably across serverless invocations. Before accepting real $9 payments, replace the local store with managed PostgreSQL and connect production signing, Stripe, email, backups, terms, and privacy controls.

## 6. Production sequence

1. GitHub private repository.
2. Local verification.
3. Vercel preview deployment.
4. Managed PostgreSQL integration.
5. Authentication and tenant isolation.
6. Stripe test mode.
7. Production signing-key service.
8. Email receipts and public registry continuity.
9. Legal terms, privacy notice, refund language, and data map.
10. End-to-end test purchase, refund, restoration, and registry verification.
