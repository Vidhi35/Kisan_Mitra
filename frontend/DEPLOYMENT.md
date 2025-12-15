# Deployment Guide (Vercel)

This application is built with **Next.js**, making **Vercel** the ideal platform for deployment (`zero-config`).

## 1. Prerequisites
*   A [GitHub](https://github.com/) account.
*   A [Vercel](https://vercel.com/) account (Free).
*   Your project pushed to a GitHub repository.

## 2. Environment Variables
Before deploying, ensure you have the following API keys ready. You will need to add these to Vercel's "Environment Variables" section.

| Variable Name | Description | Where to get it |
| :--- | :--- | :--- |
| `GROQ_API_KEY` | For AI Advice (Llama 3) | [Groq Console](https://console.groq.com/keys) (Free) |
| `HF_ACCESS_TOKEN` | For Disease Detection | [Hugging Face Settings](https://huggingface.co/settings/tokens) (Free) |
| `NEXT_PUBLIC_SUPABASE_URL` | Database URL | Supabase Dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Database Key | Supabase Dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin Key (Server-side) | Supabase Dashboard |
| `SUPABASE_JWT_SECRET` | Auth Secret | Supabase Dashboard |
| `NEXT_PUBLIC_APP_URL` | Your live site URL | e.g. `https://your-app.vercel.app` |

## 3. Deployment Steps

1.  **Push Code to GitHub**:
    *   Initialize git if not done: `git init`
    *   Add files: `git add .`
    *   Commit: `git commit -m "Ready for deploy"`
    *   Push to your GitHub repository.

2.  **Import to Vercel**:
    *   Go to [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click **"Add New..."** -> **"Project"**.
    *   Select your GitHub repository and click **"Import"**.

3.  **Configure Project**:
    *   **Framework Preset**: Next.js (Default).
    *   **Root Directory**: `frontend` (Important! Only if your folder structure has `frontend` inside root). **If your repo IS the frontend folder itself, leave this as `./`.**
    *   **Environment Variables**:
        *   Expand the "Environment Variables" section.
        *   Copy-paste all keys from your local `.env` file (or the list above).

4.  **Deploy**:
    *   Click **"Deploy"**.
    *   Wait for the build to complete (usually 1-2 minutes).

## 4. Troubleshooting

*   **Build Failing?** Check the "Logs" tab in Vercel. Often it's due to Type errors (TypeScript).
    *   *Quick Fix:* You can disable strict type checking during build by adding `ignoreBuildErrors: true` in `next.config.mjs` (typescript section), but it's better to fix the errors.
*   **AI Not Working?** Check if you added `GROQ_API_KEY` and `HF_ACCESS_TOKEN` correctly in Vercel settings. Repopulate them if needed and redeploy.

## 5. Post-Deployment
*   Go to your Supabase Dashboard -> Authentication -> URL Configuration.
*   Add your new Vercel URL (e.g., `https://kisaan-mitra.vercel.app`) to "Site URL" and "Redirect URLs" so login works correctly.
