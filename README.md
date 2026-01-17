# Quiz: Da hora de pôr a mesa, éramos cinco

A Real-time Multiplayer Quiz built with **Next.js** and **Firebase**.

## 🚀 Deploy to Vercel

This project is ready to be deployed to Vercel.

### Steps:
1.  **Improt Project**: Select this repository in your Vercel Dashboard.
2.  **Environment Variables**: You **MUST** add the following environment variables in the Vercel Project Settings for the app to work:

    - `NEXT_PUBLIC_FIREBASE_API_KEY`
    - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
    - `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
    - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
    - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
    - `NEXT_PUBLIC_FIREBASE_APP_ID`

    *You can find these values in your Firebase Console > Project Settings.*

3.  **Build Command**: Next.js defaults are fine (`next build`).
4.  **Install Command**: Next.js defaults are fine (`npm install` or `yarn install`).

## 🛠 Features
- **Real-time Gameplay**: Powered by Firebase Realtime Database.
- **Scoring System**: Points based on speed.
- **Dynamic Leaderboard**: Updates after every question.
- **Podium**: Celebration animation for top 3 players.

## 📂 Project Structure
- `/pages`: Next.js routes (Home, Host, Game).
- `/lib`: Firebase and Game Logic.
- `/data`: Quiz questions content.
