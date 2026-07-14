# How to View the Cheat Sheet

## Option 1: Local Web Server (Recommended)

### Python 3
```bash
cd laravel-13-cheat-sheet
python -m http.server 8000
```

Then open: **http://localhost:8000/public/**

### Node.js
```bash
cd laravel-13-cheat-sheet
npx http-server public -p 8000
```

Then open: **http://localhost:8000/**

### PHP
```bash
cd laravel-13-cheat-sheet/public
php -S localhost:8000
```

Then open: **http://localhost:8000/**

---

## Option 2: GitHub Pages

The `public/index.html` will be automatically served when pushed to GitHub.

Configure GitHub Pages:
1. Go to repo Settings → Pages
2. Select **Source**: "Deploy from branch"
3. Branch: `main`, Folder: `/public`
4. Save

Site will be available at: `https://thatobabusi.github.io/laravel-13-cheat-sheet/`

---

## Features

✅ **Browse by Category** - 10 organized sections  
✅ **Search** - Full-text search across all 34 sections  
✅ **Dark Mode** - Automatically follows system preference  
✅ **Responsive** - Works on desktop, tablet, mobile  
✅ **Keyboard Shortcuts** - Cmd+K or Ctrl+K to search  
✅ **No Build Process** - Pure HTML/CSS/JavaScript  

---

## File Structure

```
public/
├── index.html          # Main app (everything is self-contained)
└── ../docs/cheatsheet/ # Markdown files it loads
```

The HTML file loads markdown files on-demand from the `docs/cheatsheet/` directory.

---

## Troubleshooting

### "Cannot load file" error
- Make sure you're using a web server (not `file://`)
- The browser blocks file:// requests for security reasons
- Use Python/Node/PHP server above

### Markdown not loading
- Check browser console (F12) for errors
- Verify markdown files exist in `docs/cheatsheet/`
- Check the file paths in index.html match actual paths

### Search not working
- Make sure JavaScript is enabled
- Clear browser cache (Ctrl+Shift+R)
- Check console for errors
