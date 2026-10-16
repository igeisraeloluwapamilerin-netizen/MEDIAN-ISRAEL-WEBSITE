# MEDIA ISRAEL website

```
index.html            page structure (all your original words)
css/style.css         design
js/config.js          Supabase URL + anon key  (fill in)
js/media.js           add photos & videos here
js/main.js            navigation, AI chat, gallery
assets/images/        photos
assets/videos/        videos
supabase/functions/chat/index.ts   AI backend (deploy in Supabase)
```

## 1. Publish (GitHub → Cloudflare Pages)
1. Upload everything in this folder to a GitHub repository (never upload `.env`).
2. Cloudflare → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
3. Framework: None. Build command: leave empty. Output directory: `/`. Deploy.
Every change you commit to GitHub updates the live site automatically.

## 2. Turn on the AI (Supabase)
1. Supabase → Edge Functions → create a function named `chat`, paste `supabase/functions/chat/index.ts`, deploy.
2. Edge Functions → Secrets → add `OPENAI_API_KEY` = your OpenAI key.
3. Supabase → Project Settings → API: copy the Project URL and the `anon` key into `js/config.js`.
4. Commit `js/config.js` to GitHub. Test the AI page on your live link.
Set a monthly spending limit in your OpenAI account so nobody can run up your bill.

## 3. Add photos and videos
1. Put files in `assets/images/` or `assets/videos/`.
2. Add one line per file in `js/media.js` (examples are inside the file).
3. Commit to GitHub. They appear under Portfolio & Services.
Videos in the gallery were compressed for the web (each under 25 MB, the Cloudflare limit) and only load when a visitor presses play. For bigger videos, upload to YouTube and use the `youtube` line.
