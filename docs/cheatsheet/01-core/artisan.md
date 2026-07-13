# Artisan

> PHP artisan commands for common Laravel tasks: migrations, model generation, queues, caching, and more.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Core Framework

## Help & Meta

```bash
php artisan                          # list all commands
php artisan help migrate             # help for a specific command
php artisan --version
php artisan about                    # framework, environment, drivers summary
php artisan env                      # display current environment
```

## Application

```bash
php artisan key:generate
php artisan storage:link             # create public/storage symlink
php artisan down [--secret=token]    # maintenance mode
php artisan up
```

## Dev Server

```bash
php artisan serve
php artisan serve --port=8080
```

## Make

```bash
php artisan make:model Post
php artisan make:model Post -m          # + migration
php artisan make:model Post -mfsc       # + migration, factory, seeder, controller
php artisan make:model Post --all       # everything above + policy, resource
php artisan make:controller PostController
php artisan make:controller PostController --resource
php artisan make:controller PostController --api   # resource without create/edit
php artisan make:controller PostController --singleton
php artisan make:migration create_posts_table
php artisan make:migration add_status_to_posts_table --table=posts
php artisan make:seeder PostSeeder
php artisan make:factory PostFactory
php artisan make:request StorePostRequest
php artisan make:resource PostResource
php artisan make:resource PostCollection --collection
php artisan make:event PostPublished
php artisan make:listener SendPostNotification --event=PostPublished
php artisan make:observer PostObserver --model=Post
php artisan make:job ProcessPodcast
php artisan make:mail WelcomeMail --markdown=emails.welcome
php artisan make:notification InvoicePaid
php artisan make:policy PostPolicy --model=Post
php artisan make:provider AppServiceProvider
php artisan make:middleware EnsureTokenIsValid
php artisan make:command SendEmails
php artisan make:channel OrderChannel
php artisan make:rule Uppercase
php artisan make:scope ActiveScope
php artisan make:enum Status
php artisan make:class Support/Helpers/CurrencyConverter
php artisan make:interface Contracts/PaymentGateway
php artisan make:trait Concerns/HasUuid
php artisan make:view posts.index
```

## Database

```bash
php artisan migrate
php artisan migrate --force           # run in production
php artisan migrate:fresh             # drop all + re-migrate
php artisan migrate:fresh --seed
php artisan migrate:refresh           # rollback all + re-migrate
php artisan migrate:rollback          # rollback last batch
php artisan migrate:rollback --step=3
php artisan migrate:reset             # rollback all
php artisan migrate:status
php artisan db:seed
php artisan db:seed --class=PostSeeder
php artisan db:wipe                   # drop all tables, views, types
php artisan db                        # open DB CLI (mysql/psql/sqlite3)
php artisan model:show Post           # show model info (columns, relations, etc.)
php artisan model:prune               # delete prunable models
```

## Route

```bash
php artisan route:list
php artisan route:list --path=api
php artisan route:cache
php artisan route:clear
```

## Config / Cache

```bash
php artisan config:cache
php artisan config:clear
php artisan config:publish            # publish vendor config files
php artisan view:cache
php artisan view:clear
php artisan event:cache
php artisan event:clear
php artisan optimize                  # config + route + view cache
php artisan optimize:clear
```

## Queue

```bash
php artisan queue:work
php artisan queue:work --queue=high,default
php artisan queue:listen
php artisan queue:restart
php artisan queue:failed
php artisan queue:retry all
php artisan queue:flush               # delete all failed jobs
php artisan queue:prune-failed --hours=48
```

## Schedule

```bash
php artisan schedule:run              # run due scheduled tasks
php artisan schedule:work             # run scheduler in foreground (local dev)
php artisan schedule:list
```

## API / Broadcasting Setup

```bash
php artisan install:api               # Sanctum + api.php route file
php artisan install:broadcasting      # Reverb + channels.php
```

## Misc

```bash
php artisan tinker
php artisan channel:list
php artisan inspect:events            # list unused event listeners
php artisan vendor:publish --provider="Vendor\Package\ServiceProvider"
php artisan vendor:publish --tag=config
```

---

**See Also:** [[application-bootstrap]] | [[config]] | [[routing]]
