# Query Builder

> Build database queries without writing raw SQL.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Database

## Basic Queries

```php
use Illuminate\Support\Facades\DB;

// Select
DB::table('posts')->get();
DB::table('posts')->select('id', 'title')->get();
DB::table('posts')->selectRaw('price * qty as total')->get();
DB::table('posts')->distinct()->get();
DB::table('posts')->addSelect('published_at')->get();
```

## Where Clauses

```php
DB::table('posts')
    ->where('status', 'published')
    ->where('views', '>', 100)
    ->orWhere('featured', true)
    ->whereNull('deleted_at')
    ->whereBetween('price', [10, 100])
    ->whereIn('category', ['tech', 'life'])
    ->whereLike('title', '%laravel%')           // L11+
    ->whereNotLike('title', '%spam%')
    ->get();
```

## Joins

```php
DB::table('posts')
    ->join('users', 'posts.user_id', '=', 'users.id')
    ->leftJoin('comments', 'posts.id', '=', 'comments.post_id')
    ->crossJoin('tags')
    ->get();
```

## Aggregates

```php
DB::table('posts')->count();
DB::table('posts')->max('price');
DB::table('posts')->min('price');
DB::table('posts')->avg('price');
DB::table('posts')->sum('views');
```

## Ordering & Limits

```php
DB::table('posts')->orderBy('created_at', 'desc')->get();
DB::table('posts')->orderByRaw('FIELD(status, "featured", "published")')->get();
DB::table('posts')->latest('published_at')->first();
DB::table('posts')->inRandomOrder()->first();
DB::table('posts')->limit(10)->offset(20)->get();
```

## Insert

```php
DB::table('posts')->insert(['title' => 'Hi', 'created_at' => now()]);
DB::table('posts')->insertOrIgnore([['title' => 'A'], ['title' => 'B']]);
DB::table('posts')->insertGetId(['title' => 'Hi']);
DB::table('posts')->upsert(
    [['email' => 'a@b.com', 'name' => 'A']],
    ['email'],
    ['name'],
);
```

## Update

```php
DB::table('posts')->where('id', 1)->update(['title' => 'Updated']);
DB::table('posts')->where('id', 1)->updateOrInsert(['email' => $e], ['name' => $n]);
DB::table('posts')->where('id', 1)->increment('views', 1);
DB::table('posts')->where('id', 1)->decrement('stock');
```

## Delete

```php
DB::table('posts')->where('id', 1)->delete();
DB::table('posts')->truncate();
```

## Transactions

```php
DB::transaction(function () {
    DB::table('orders')->update(['status' => 'processing']);
    DB::table('inventory')->decrement('qty');
});

DB::beginTransaction();
try {
    // ...
    DB::commit();
} catch (\Throwable $e) {
    DB::rollBack();
    throw $e;
}

// After commit hooks (L11+)
DB::afterCommit(fn() => event(new OrderPlaced()));
```

## Raw Expressions

```php
DB::table('posts')->where(DB::raw('LOWER(title)'), 'hello')->get();
DB::select('SELECT * FROM posts WHERE id = ?', [1]);
DB::insert('INSERT INTO posts (title) VALUES (?)', ['Hello']);
DB::update('UPDATE posts SET views = views + 1 WHERE id = ?', [1]);
DB::delete('DELETE FROM posts WHERE id = ?', [1]);
DB::statement('DROP TABLE posts');
```

## Debugging

```php
DB::table('posts')->toSql();
DB::table('posts')->dd();                // dump SQL and die
DB::table('posts')->dump();              // dump without dying
DB::enableQueryLog();
$log = DB::getQueryLog();
DB::listen(fn($q) => logger($q->sql));
```

---

**See Also:** [[eloquent-orm]] | [[schema-migrations]]
