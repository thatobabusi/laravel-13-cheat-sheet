# Core Framework

> Essential Laravel setup and configuration: application bootstrap, routing, middleware, and Artisan.

**Parent:** [[Laravel 13 Cheat Sheet]] | **Category:** 01-core

## Files in This Category

| File | Topic | Purpose |
|------|-------|---------|
| [[artisan]] | Artisan CLI | Commands for scaffolding, migrations, caching, queues |
| [[application-bootstrap]] | Bootstrap App | Configure middleware, routing, exception handling |
| [[config]] | Configuration | Read/write application config values |
| [[routing]] | Routing | Define routes, groups, parameters, model binding |
| [[middleware]] | Middleware | Create and apply request middleware |

## Quick Reference

### Most Used Commands
- `php artisan make:model Post -m` — Create model with migration
- `php artisan make:controller PostController --resource` — Resourceful controller
- `php artisan migrate` — Run database migrations
- `php artisan serve` — Start dev server

### Routing Essentials
- [[routing#basic-routes|Basic Routes]] — GET, POST, PUT, DELETE
- [[routing#route-parameters|Route Parameters]] — Path variables and constraints
- [[routing#route-groups|Route Groups]] — Prefix, middleware, namespaces
- [[routing#route-model-binding|Model Binding]] — Implicit and explicit

### Middleware
- [[middleware#basic-middleware|Create Middleware]] — Request/response filtering
- [[middleware#register-middleware|Register & Apply]] — Global, groups, routes

---

**Related Categories:** [[02-http]] | [[04-auth]]
