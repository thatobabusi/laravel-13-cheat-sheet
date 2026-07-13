# Laravel 13 Cheat Sheet

> Comprehensive reference for Laravel 13 development organized by topic
> **PHP 8.2+ · Laravel 13 · Slim skeleton (no RouteServiceProvider / HttpKernel)**
> Sources: [laravel.com/docs](https://laravel.com/docs) · [github.com/laravel/framework](https://github.com/laravel/framework)

---

## 📚 Table of Contents

The cheat sheet is organized into 10 categories for easy navigation:

### [1️⃣ Core Framework](01-core/)
Essential Laravel concepts and setup: Artisan commands, application bootstrap, configuration, routing, and middleware.
- [[artisan]] — CLI commands for scaffolding, migrations, caching
- [[application-bootstrap]] — Configure middleware, routing, exceptions in bootstrap/app.php
- [[config]] — Read and set configuration values
- [[routing]] — Routes, groups, parameters, model binding, constraints
- [[middleware]] — Create and apply middleware to routes

### [2️⃣ HTTP](02-http/)
Handle web requests and responses: controllers, requests, responses, redirects, and views.
- [[controllers]] — Single-action and resource controllers, DI
- [[requests]] — Access input, validate form data, files, meta information
- [[responses]] — JSON, views, downloads, headers, cookies
- [[redirects]] — Redirect users with flash data and intended URLs
- [[views-blade]] — Blade templates, components, inheritance, loops

### [3️⃣ Database](03-database/)
Query and manipulate database data: Eloquent ORM, Query Builder, migrations, factories.
- [[eloquent-orm]] — Models, querying, mass assignment, relationships, eager loading
- [[eloquent-scopes]] — Local/global scopes, model events, observers
- [[factories]] — Generate test data with model factories
- [[query-builder]] — Raw SQL-free queries, joins, aggregates, transactions
- [[schema-migrations]] — Create tables, modify columns, indexes, foreign keys

### [4️⃣ Authentication & Authorization](04-auth/)
Secure your application with user authentication and authorization.
- [[authentication-sanctum]] — User login/logout, Sanctum API tokens, guards
- [[authorization]] — Gates, policies, ability checks, role-based access

### [5️⃣ Communication](05-communication/)
Send notifications and emails to users.
- [[notifications]] — Multi-channel notifications, database storage, on-demand
- [[mail]] — Mailables, markdown templates, attachments, queuing

### [6️⃣ Utilities](06-utilities/)
Common utilities: HTTP client, caching, sessions, storage, logging.
- [[http-client]] — Make external API requests, macros, testing
- [[cache]] — Store/retrieve cached data, tags, atomic locking
- [[session]] — Session data management, flash data, ID regeneration
- [[cookies]] — Read/write HTTP cookies
- [[storage]] — File operations on disk or cloud storage (S3)
- [[logging]] — Log at different levels, add context information

### [7️⃣ Patterns](07-patterns/)
Architectural patterns and services.
- [[service-container]] — Binding, resolving, singletons, contextual binding
- [[service-providers]] — Register bindings, configure services

### [8️⃣ Data Processing](08-data/)
Work with collections, strings, and arrays.
- [[collections]] — Transform, filter, sort, aggregate collections
- [[strings]] — Manipulate strings with the Str helper class
- [[arrays]] — Work with arrays using the Arr helper class
- [[helpers]] — Global helper functions for common operations

### [9️⃣ Validation](09-validation/)
Validate incoming request data.
- [[validation]] — Rules, custom rules, conditional validation, error messages

### [🔟 Advanced](10-advanced/)
Advanced topics: events, queues, scheduling, and testing.
- [[events-listeners]] — Define and dispatch events, listen for them
- [[jobs-queues]] — Queue background jobs, chains, batches
- [[task-scheduling]] — Schedule tasks to run at intervals
- [[testing]] — PHPUnit and Pest testing, assertions, faking services

---

## 🔍 Quick Search

Use your editor's search (Ctrl+F / Cmd+F) to find topics across the cheat sheet:

| Topic | File | Section |
|-------|------|---------|
| Artisan commands | [01-core](01-core) | [[artisan]] |
| Database queries | [03-database](03-database) | [[eloquent-orm]], [[query-builder]] |
| API testing | [10-advanced](10-advanced) | [[testing]] |
| Authentication | [04-auth](04-auth) | [[authentication-sanctum]] |
| View rendering | [02-http](02-http) | [[views-blade]] |
| Request validation | [09-validation](09-validation) | [[validation]] |
| Caching data | [06-utilities](06-utilities) | [[cache]] |
| Email sending | [05-communication](05-communication) | [[mail]] |

---

## 📖 How to Use This Cheat Sheet

1. **Find by Category** — Start with the appropriate numbered category above
2. **Click Section Link** — Each section is a backlinked markdown file
3. **Use Backlinks** — See "See Also" links at the bottom of each file to explore related topics
4. **Copy Code** — All code examples are copy-paste ready

---

## 🔗 Backlinks & Navigation

Each file includes:
- **See Also** section at the bottom linking to related topics
- **Backlinks** to parent category using `[[link]]` notation
- Quick jumps to related files in the same category

Example:
```
---
**See Also:** [[authentication-sanctum]] | [[middleware]]
```

---

**Last Updated:** 2026-07-13  
**Version:** 1.0.0  
**License:** MIT

*Pull requests welcome: [github.com/thatobabusi/laravel-13-cheat-sheet](https://github.com/thatobabusi/laravel-13-cheat-sheet)*
