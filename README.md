# Laravel 13 Cheat Sheet

> A comprehensive quick-reference for **Laravel 13** (PHP 8.2+) covering every major feature from routing to testing.
> Inspired by [summerblue/laravel5-cheatsheet](https://github.com/summerblue/laravel5-cheatsheet).

---

## Contents — 34 Sections

| # | Section | # | Section |
|---|---|---|---|
| 1 | [Artisan](#artisan) | 18 | [HTTP Client](#http-client) |
| 2 | [Application Bootstrap](#application-bootstrap) | 19 | [Cache](#cache) |
| 3 | [Config](#config) | 20 | [Session](#session) |
| 4 | [Routing](#routing) | 21 | [Cookies](#cookies) |
| 5 | [Middleware](#middleware) | 22 | [Storage](#storage) |
| 6 | [Controllers](#controllers) | 23 | [Logging & Context](#logging--context) |
| 7 | [Requests](#requests) | 24 | [Service Container](#service-container) |
| 8 | [Responses](#responses) | 25 | [Service Providers](#service-providers) |
| 9 | [Redirects](#redirects) | 26 | [Collections](#collections) |
| 10 | [Views & Blade](#views--blade) | 27 | [Strings — Str](#strings--str) |
| 11 | [Eloquent ORM](#eloquent-orm) | 28 | [Arrays — Arr](#arrays--arr) |
| 12 | [Query Builder](#query-builder) | 29 | [Helpers](#helpers) |
| 13 | [Schema & Migrations](#schema--migrations) | 30 | [Validation](#validation) |
| 14 | [Authentication & Sanctum](#authentication--sanctum) | 31 | [Events & Listeners](#events--listeners) |
| 15 | [Authorization](#authorization) | 32 | [Jobs & Queues](#jobs--queues) |
| 16 | [Notifications](#notifications) | 33 | [Task Scheduling](#task-scheduling) |
| 17 | [Mail](#mail) | 34 | [Testing — Pest / PHPUnit](#testing--pest--phpunit) |

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

## Usage

**Browse on GitHub** — rendered Markdown with anchor links for each section.

**Clone locally:**
```bash
git clone https://github.com/thatobabusi/laravel-13-cheat-sheet.git
```

**Open the cheat sheet:**
```
LARAVEL-13-CHEATSHEET.md
```

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

## License

MIT © [thatobabusi](https://github.com/thatobabusi)
