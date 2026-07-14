# GitHub Pages Setup Guide

Complete instructions for deploying the Laravel 13 Cheat Sheet to GitHub Pages.

## Automatic Setup (Recommended)

The workflow is already configured in `.github/workflows/deploy-pages.yml`.

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
   - (No need to select a branch - the workflow handles it)
4. Click **Save**

### Step 2: Push to Main

The workflow automatically deploys when you push to `main`:

```bash
git push origin main
```

### Step 3: Access Your Site

Once deployment completes (check **Actions** tab):

**Default URL:**
```
https://thatobabusi.github.io/laravel-13-cheat-sheet/
```

---

## Manual Deploy (Alternative)

If you want to deploy manually without workflow:

### Option 1: GitHub Pages from /public

1. Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: `main`, Folder: `/public`
4. Save

The site will deploy automatically on every push.

### Option 2: GitHub Pages from /docs

Move the files:
```bash
mkdir -p docs
cp -r public/* docs/
git add docs/
git commit -m "chore: add docs folder for GitHub Pages"
git push origin main
```

Then in Settings → Pages:
- Source: "Deploy from a branch"
- Branch: `main`, Folder: `/docs`

---

## Workflow Details

**File:** `.github/workflows/deploy-pages.yml`

**Triggers:**
- Push to `main` (with changes to public/, docs/cheatsheet/, or workflow)
- Manual trigger via Actions tab
- Pull requests (for preview checks)

**What it does:**
1. Checks out code
2. Uploads `./public` directory as GitHub Pages artifact
3. Deploys to GitHub Pages

**Deployment time:** ~30-60 seconds

---

## Troubleshooting

### Site Not Loading

1. **Check workflow status** → Actions tab → Look for "Deploy to GitHub Pages"
2. **Verify Settings** → Pages → Ensure "GitHub Actions" is selected
3. **Check URL** → Should be `https://YOUR-USERNAME.github.io/laravel-13-cheat-sheet/`

### Deployment Failed

1. Click the failed workflow run
2. Check the "Deploy to GitHub Pages" step output
3. Common issues:
   - Public directory is empty
   - Permissions not set (see Permissions section below)
   - Workflow syntax error

### Custom Domain

To use a custom domain:

1. Settings → Pages → Custom domain
2. Enter your domain (e.g., `cheatsheet.example.com`)
3. Add DNS records pointing to GitHub Pages
4. [Full custom domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

---

## Permissions

The workflow uses these permissions:
```yaml
permissions:
  contents: read        # Read repository contents
  pages: write          # Deploy to GitHub Pages
  id-token: write       # OIDC token for deployment
```

These are the minimum required permissions for GitHub Pages deployment.

---

## Local Testing Before Deploy

Before pushing, test locally:

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server public -p 8000

# PHP
cd public && php -S localhost:8000
```

Visit: `http://localhost:8000`

---

## File Structure for Pages

```
public/
├── index.html         ← Main entry point
└── ...               ← All static files
```

The entire `public/` folder gets deployed as-is to GitHub Pages.

---

## Force Redeploy

To force a redeploy without changes:

1. Go to Actions tab
2. Click "Deploy to GitHub Pages" workflow
3. Click "Run workflow" → "Run workflow"

---

## Monitor Deployment

1. Push code: `git push origin main`
2. Go to **Actions** tab
3. Click latest "Deploy to GitHub Pages" workflow
4. Watch deployment progress
5. Once ✅ complete, site is live!

---

## Next Steps

After deployment:

1. ✅ Verify site loads at GitHub Pages URL
2. ✅ Test search functionality
3. ✅ Try different categories
4. ✅ Test on mobile device
5. ✅ Share the link!

---

**GitHub Pages Docs:** https://docs.github.com/en/pages
