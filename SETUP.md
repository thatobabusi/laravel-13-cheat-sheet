# Setup Guide — Local Development

Instructions for setting up and testing the Laravel 13 Cheat Sheet locally.

## Prerequisites

- Ruby 3.0+ ([download](https://www.ruby-lang.org/en/downloads/))
- Bundler (`gem install bundler`)
- Git

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/thatobabusi/laravel-13-cheat-sheet.git
cd laravel-13-cheat-sheet
```

### 2. Install Dependencies

```bash
bundle install
```

This installs Jekyll and all required plugins from `Gemfile`.

## Local Development

### Start the Local Server

```bash
bundle exec jekyll serve
```

The site will be available at: **http://localhost:4000/laravel-13-cheat-sheet**

### Build for Production

```bash
bundle exec jekyll build
```

Generated site in `_site/` directory.

## Features to Test

### Organized Cheatsheet
- Visit: **http://localhost:4000/laravel-13-cheat-sheet/docs/cheatsheet/**
- Navigate through 10 category folders
- Click backlinks between related topics

### Search Functionality
- Visit: **http://localhost:4000/laravel-13-cheat-sheet/docs/search/**
- Type to search topics (e.g., "routing", "database", "auth")
- Try keyboard shortcut: **Cmd+K** or **Ctrl+K**
- Verify results show category emoji labels

### Responsive Design
- Test on desktop (1920px)
- Test on tablet (768px)
- Test on mobile (375px)
- Verify search input is usable on all sizes

### Dark Mode
- Enable dark mode in browser developer tools
- Verify colors and contrast remain readable

## File Structure

```
.
├── _config.yml              # Jekyll configuration
├── _layouts/
│   └── search.html          # Search page template
├── assets/
│   ├── css/search.css       # Search styling
│   └── js/search.js         # Search functionality
├── docs/
│   ├── cheatsheet/          # Organized 34 sections
│   │   ├── 01-core/
│   │   ├── 02-http/
│   │   ├── ... (8 more categories)
│   │   └── 10-advanced/
│   ├── search.md            # Search page
│   └── search-index.json    # Search index
├── Gemfile                  # Ruby dependencies
└── README.md                # Main documentation
```

## Troubleshooting

### Port Already in Use

If port 4000 is busy:
```bash
bundle exec jekyll serve --port 4001
```

### Search Not Working

1. Rebuild the site:
```bash
bundle exec jekyll clean
bundle exec jekyll build
```

2. Clear browser cache (Ctrl+Shift+R)

3. Check browser console for errors (F12 → Console tab)

### Bundle Issues

Update gems:
```bash
bundle update
```

Reinstall dependencies:
```bash
rm Gemfile.lock
bundle install
```

## Deployment

The site automatically deploys to GitHub Pages when you push to `main`:

1. Push changes: `git push origin main`
2. GitHub Actions builds the site
3. Deployed to: `https://thatobabusi.github.io/laravel-13-cheat-sheet`

See `.github/workflows/pages-build.yml` for workflow details.

## Contributing

### Adding New Content

1. Edit or create `.md` files in `docs/cheatsheet/`
2. Use backlink syntax: `[[linked-file]]`
3. Add "See Also" section at bottom referencing related topics
4. Test locally before pushing
5. Create a pull request

### Updating Search Index

Search index is auto-generated. No action needed — just push changes to trigger rebuild.

## Development Tips

### Fast Iteration

Use `--incremental` flag for faster rebuilds:
```bash
bundle exec jekyll serve --incremental
```

### Regenerate Only Changed Files

```bash
bundle exec jekyll build --incremental
```

### Debug Mode

Add `--verbose` for detailed build output:
```bash
bundle exec jekyll build --verbose
```

## Questions?

See `.github/workflows/pages-build.yml` for automated deployment details, or check the main [README.md](README.md).
