# Database

> Query and manipulate data: Eloquent ORM, Query Builder, migrations, and factories.

**Parent:** [[Laravel 13 Cheat Sheet]] | **Category:** 03-database

## Files in This Category

| File | Topic | Purpose |
|------|-------|---------|
| [[eloquent-orm]] | Eloquent Models | Models, querying, relationships, eager loading |
| [[eloquent-scopes]] | Scopes & Events | Local/global scopes, model observers |
| [[factories]] | Factories | Generate test data with factories |
| [[query-builder]] | Query Builder | Raw SQL-free queries without models |
| [[schema-migrations]] | Schema & Migrations | Create tables, migrations, indexes |

## Quick Reference

### Model Essentials
- [[eloquent-orm#model-definition|Define Model]] — Properties, casting, timestamps
- [[eloquent-orm#querying|Query Methods]] — find(), where(), first(), all()
- [[eloquent-orm#relationships|Relationships]] — hasMany, belongsTo, many-to-many
- [[eloquent-orm#eager-loading|Eager Loading]] — with(), load() to prevent N+1

### Database Operations
- [[query-builder|Query Builder]] — DB::table() for non-model queries
- [[schema-migrations|Migrations]] — Schema::create(), Schema::table()
- [[schema-migrations#data-types|Data Types]] — All column types and modifiers

### Testing & Seeding
- [[factories]] — Post::factory()->create()
- Seeders — Populate tables with test data

---

**Related Categories:** [[02-http]] | [[09-validation]]
