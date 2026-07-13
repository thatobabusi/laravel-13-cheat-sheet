# Schema & Migrations

> Define database schema and manage changes over time with migrations.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Database

## Create Table

```php
Schema::create('posts', function (Blueprint $table) {
    $table->id();                              // BIGINT UNSIGNED AUTO_INCREMENT PK
    $table->ulid('id')->primary();             // ULID primary key
    $table->uuid('id')->primary();             // UUID primary key
    $table->string('title');
    $table->string('slug')->unique();
    $table->text('body');
    $table->longText('content');
    $table->tinyText('excerpt');
});
```

## Data Types

```php
$table->integer('views')->default(0);
$table->unsignedInteger('qty');
$table->bigInteger('total');
$table->float('price', precision: 8);
$table->decimal('price', total: 8, places: 2);
$table->boolean('is_active')->default(true);
$table->date('published_on');
$table->dateTime('published_at');
$table->timestamp('verified_at')->nullable();
$table->timestampTz('scheduled_at');
$table->year('year');
$table->time('start_time');
$table->json('metadata')->nullable();
$table->jsonb('settings');                 // PostgreSQL
$table->enum('status', ['draft','published','archived'])->default('draft');
$table->set('permissions', ['read','write','admin']);
$table->char('country_code', 2);
$table->tinyInteger('rating');
$table->smallInteger('priority');
$table->mediumInteger('score');
$table->double('latitude');
$table->binary('data');
$table->ipAddress('ip');
$table->macAddress('mac');
$table->uuid('token');
$table->ulid('tracking_id');
$table->rememberToken();                   // VARCHAR(100) nullable
$table->softDeletes();                     // deleted_at TIMESTAMP nullable
$table->timestamps();                      // created_at + updated_at
```

## Foreign Keys

```php
$table->foreignId('user_id')->constrained()->cascadeOnDelete();
$table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
$table->foreignUlid('team_id')->constrained();
$table->foreignUuid('plan_id')->constrained();
$table->foreign('author_id')->references('id')->on('users')->onDelete('cascade');
```

## Morphs (Polymorphic)

```php
$table->morphs('commentable');             // commentable_id + commentable_type
$table->nullableMorphs('imageable');
$table->ulidMorphs('taggable');
```

## Indexes

```php
$table->index('status');
$table->index(['status', 'published_at']); // composite
$table->unique(['email', 'tenant_id']);
$table->primary(['user_id', 'role_id']);
$table->fullText('body');                  // MySQL FULLTEXT
```

## Column Modifiers

```php
$table->string('middle_name')->nullable();
$table->integer('views')->default(0)->unsigned();
$table->string('title')->after('id');
$table->string('title')->first();
$table->string('bio')->invisible();        // MySQL — hidden from SELECT *
$table->string('code')->virtualAs("UPPER(title)");
$table->string('slug')->storedAs("LOWER(REPLACE(title,' ','-'))");
```

## Modify Table

```php
Schema::table('posts', function (Blueprint $table) {
    $table->string('summary')->nullable()->after('title');
    $table->string('title', 500)->change();    // change column definition
    $table->renameColumn('body', 'content');
    $table->dropColumn('views');
    $table->dropColumn(['views', 'clicks']);
    $table->dropSoftDeletes();
    $table->dropTimestamps();
    $table->dropRememberToken();
    $table->dropForeign(['user_id']);
    $table->dropIndex(['status']);
    $table->dropUnique(['email']);
    $table->dropPrimary();
});
```

## Drop Tables

```php
Schema::drop('posts');
Schema::dropIfExists('posts');
Schema::rename('posts', 'articles');
```

## Inspection

```php
Schema::hasTable('posts');
Schema::hasColumn('posts', 'title');
Schema::hasColumns('posts', ['title', 'body']);
Schema::getColumnType('posts', 'title');
Schema::getColumns('posts');
Schema::getIndexes('posts');
Schema::getForeignKeys('posts');
```

## Migration Class

```php
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
```

## Common Commands

```bash
php artisan migrate
php artisan migrate --force           # run in production
php artisan migrate:fresh             # drop all + re-migrate
php artisan migrate:refresh           # rollback all + re-migrate
php artisan migrate:rollback
php artisan migrate:status
php artisan db:seed
```

---

**See Also:** [[eloquent-orm]] | [[query-builder]]
