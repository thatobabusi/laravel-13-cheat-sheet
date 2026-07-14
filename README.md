<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:ff2d20,50:eb6f34,100:f97316&height=180&section=header&text=Laravel%2013%20Cheat%20Sheet&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=34%20Sections%20%7C%20Complete%20API%20Reference%20%7C%20Quick%20Lookup%20%E2%80%94%20everything%20Laravel%2013%20in%20one%20place&descAlignY=55&descSize=16" alt="Laravel 13 Cheat Sheet banner" />

<a href="https://github.com/thatobabusi/laravel-13-cheat-sheet">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=18&pause=1200&color=ff2d20&center=true&vCenter=true&width=650&lines=Artisan+%E2%80%A2+Routing+%E2%80%A2+Eloquent;Authentication+%E2%80%A2+Validation+%E2%80%A2+Testing;Pest+%E2%80%A2+Collections+%E2%80%A2+Queues" alt="Typing intro" />
</a>

<br/><br/>

<a href="https://github.com/thatobabusi/laravel-13-cheat-sheet/stargazers"><img src="https://img.shields.io/github/stars/thatobabusi/laravel-13-cheat-sheet?style=flat-square&logo=github&labelColor=1a1b27&color=ff2d20" alt="Repo stars" /></a>
<a href="https://github.com/thatobabusi/laravel-13-cheat-sheet/forks"><img src="https://img.shields.io/github/forks/thatobabusi/laravel-13-cheat-sheet?style=flat-square&logo=github&labelColor=1a1b27&color=eb6f34" alt="Repo forks" /></a>
<a href="https://github.com/thatobabusi/laravel-13-cheat-sheet/watchers"><img src="https://img.shields.io/github/watchers/thatobabusi/laravel-13-cheat-sheet?style=flat-square&logo=github&labelColor=1a1b27&color=f97316" alt="Repo watchers" /></a>

<br/>

<a href="https://github.com/thatobabusi/laravel-13-cheat-sheet/releases"><img src="https://img.shields.io/github/v/release/thatobabusi/laravel-13-cheat-sheet?style=flat-square&logo=github&labelColor=1a1b27&color=eb6f34" alt="Latest release" /></a>
<a href="https://github.com/thatobabusi/laravel-13-cheat-sheet/commits/main"><img src="https://img.shields.io/github/last-commit/thatobabusi/laravel-13-cheat-sheet?style=flat-square&logo=git&logoColor=white&labelColor=1a1b27&color=22c55e" alt="Last commit" /></a>
<a href="https://github.com/thatobabusi/laravel-13-cheat-sheet/issues"><img src="https://img.shields.io/github/issues/thatobabusi/laravel-13-cheat-sheet?style=flat-square&logo=github&labelColor=1a1b27&color=f97316" alt="Open issues" /></a>
<a href="https://github.com/thatobabusi/laravel-13-cheat-sheet/pulls"><img src="https://img.shields.io/github/issues-pr/thatobabusi/laravel-13-cheat-sheet?style=flat-square&logo=github&labelColor=1a1b27&color=ec4899" alt="Open pull requests" /></a>
<a href="LICENSE"><img src="https://img.shields.io/github/license/thatobabusi/laravel-13-cheat-sheet?style=flat-square&labelColor=1a1b27&color=64748b" alt="License" /></a>
<a href="https://github.com/thatobabusi/laravel-13-cheat-sheet/graphs/contributors"><img src="https://img.shields.io/github/contributors/thatobabusi/laravel-13-cheat-sheet?style=flat-square&logo=github&labelColor=1a1b27&color=14b8a6" alt="Contributors" /></a>

<br/>

**[🌐 View Live](https://thatobabusi.github.io/laravel-13-cheat-sheet/)** · **[📚 Full Reference](LARAVEL-13-CHEATSHEET.md)** · **[📜 Changelog](docs/CHANGELOG.md)** · **[⚙️ Setup](docs/GITHUB-PAGES-SETUP.md)**

</div>

<hr/>

# Laravel 13 Cheat Sheet

> A comprehensive quick-reference for **Laravel 13** (PHP 8.2+) covering every major feature from routing to testing.
> Inspired by [summerblue/laravel5-cheatsheet](https://github.com/summerblue/laravel5-cheatsheet).

---

## 📚 Content Organization

**New!** The cheat sheet is now organized into **10 categories** for easy navigation:

- **[🌐 Organized by Category](docs/cheatsheet/)** — Explore topics grouped into logical sections with backlinks
- **[🔍 Full-Text Search](docs/search/)** — Find what you need instantly with fast client-side search
- **[📖 Classic Reference](LARAVEL-13-CHEATSHEET.md)** — Original monolithic format with all 34 sections

### 10 Categories

| Category | Topics |
|----------|--------|
| **📌 Core Framework** | Artisan, Bootstrap, Config, Routing, Middleware |
| **🌐 HTTP** | Controllers, Requests, Responses, Redirects, Views & Blade |
| **💾 Database** | Eloquent ORM, Scopes, Factories, Query Builder, Migrations |
| **🔐 Auth & Authorization** | Authentication, Sanctum, Policies, Gates |
| **💬 Communication** | Notifications, Mail |
| **🛠️ Utilities** | HTTP Client, Cache, Session, Cookies, Storage, Logging |
| **🏗️ Patterns** | Service Container, Service Providers |
| **📊 Data Processing** | Collections, Strings, Arrays, Helpers |
| **✅ Validation** | Rules, Custom Validation |
| **🚀 Advanced** | Events, Jobs, Scheduling, Testing |

---

## What's covered

- **Slim skeleton** — `bootstrap/app.php` replaces `RouteServiceProvider`, `HttpKernel`, and `ExceptionHandler`
- **PHP 8.2+** — constructor property promotion, enums, readonly properties, intersection types, fibers
- **Routing** — basic, named, resource, API, grouping, model binding, rate limiting, signed URLs
- **Eloquent** — all query scopes, relationships (all types inc. `hasManyThrough`, `morphMany`), casting, observers, pruning, upserts, cursor/lazy loading
- **Query Builder** — all query methods, joins, aggregates, JSON columns, raw expressions
- **Schema & Migrations** — all column types, modifiers, indexes, foreign keys, virtual columns, zero-downtime strategies
- **Authentication** — guards, gates, policies, Sanctum token & SPA auth
- **Notifications** — mail, database, broadcast, Slack, SMS channels + on-demand notifications
- **HTTP Client** — requests, retries, concurrency, faking in tests
- **Queue** — jobs, chains, batches, middleware, rate limiting, horizon hints
- **Cache** — tags, locks, flexible cache, remember patterns
- **Collections** — all 70+ methods with signatures
- **Testing** — Pest + PHPUnit, HTTP tests, database assertions, mocking, fakes

---

## 🌐 Access the Cheat Sheet

### Option 1: Live Website (Recommended)
**🔗 https://thatobabusi.github.io/laravel-13-cheat-sheet/**

Automatically deployed on every push via GitHub Actions.

### Option 2: Local Development
```bash
# Start local server (pick one)
python -m http.server 8000              # Python
npx http-server public -p 8000          # Node.js
php -S localhost:8000 (in public/)      # PHP

# Then open http://localhost:8000
```

### Option 3: Classic Reference
View the full markdown file: `LARAVEL-13-CHEATSHEET.md`

## ✨ Features

- 📖 **Browse by Category** — 10 organized sections with sidebar navigation
- 🔍 **Full-Text Search** — Real-time search across all 34 Laravel topics
- 🌙 **Dark Mode** — Automatically follows system preference
- 📱 **Responsive Design** — Works perfectly on desktop, tablet, mobile
- ⌨️ **Keyboard Shortcuts** — Press Cmd+K or Ctrl+K to search
- ⚡ **No Build Required** — Pure HTML/CSS/JavaScript, instant load
- 🚀 **GitHub Pages Ready** — Deployed automatically on push

---

## Install in your Laravel project

Copy the file into your project root so it lives alongside your `composer.json`:

```bash
curl -o LARAVEL-13-CHEATSHEET.md \
  https://raw.githubusercontent.com/thatobabusi/laravel-13-cheat-sheet/main/LARAVEL-13-CHEATSHEET.md
```

Or bookmark the raw URL for browser access:
```
https://raw.githubusercontent.com/thatobabusi/laravel-13-cheat-sheet/main/LARAVEL-13-CHEATSHEET.md
```

---

## Versions

| Branch / Tag | Laravel | PHP |
|---|---|---|
| `main` | 13.x | 8.2+ |

---

## Contributing

Pull requests are welcome. Please keep entries concise — this is a cheat sheet, not documentation.

1. Fork the repo
2. Create a branch: `git checkout -b add/my-section`
3. Edit `LARAVEL-13-CHEATSHEET.md`
4. Open a pull request

---

<h2 align="center">📜 License</h2>

<div align="center">

MIT © [Thato Babusi](https://github.com/thatobabusi)  
Built with care for the Laravel community. ❤️

</div>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:ff2d20,50:eb6f34,100:f97316&height=100&section=footer" alt="Footer wave" />
