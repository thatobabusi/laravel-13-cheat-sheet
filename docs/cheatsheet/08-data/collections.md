# Collections

> Work with collections of items using Laravel's fluent API.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Data Processing

## Creating Collections

```php
$c = collect([1, 2, 3, 4, 5]);
collect(['key' => 'value']);
```

## Basics

```php
$c->all();                          // plain array
$c->count();
$c->isEmpty();
$c->isNotEmpty();
$c->first();
$c->first(fn($v) => $v > 2);
$c->last();
$c->last(fn($v) => $v < 4);
$c->nth(2);                         // every 2nd item
$c->get(0);
$c->has(0);                         // has key
$c->contains(3);
$c->contains('name', 'John');
$c->doesntContain(6);
```

## Transformation

```php
$c->map(fn($v) => $v * 2);
$c->mapWithKeys(fn($v, $k) => [$k => $v * 2]);
$c->flatMap(fn($v) => [$v, $v * 2]);
$c->transform(fn($v) => $v * 2);    // mutates in place
$c->filter(fn($v) => $v > 2);
$c->reject(fn($v) => $v > 2);
$c->reduce(fn($carry, $item) => $carry + $item, 0);
$c->each(fn($v) => logger($v));
$c->eachSpread(fn($first, $second) => ...);
$c->tap(fn($c) => logger($c->count()));  // inspect without breaking chain
```

## Sorting

```php
$c->sort();
$c->sortDesc();
$c->sortBy('name');
$c->sortByDesc('age');
$c->sortBy([['name','asc'],['age','desc']]);
$c->sortKeys();
$c->reverse();
$c->shuffle();
```

## Grouping & Partitioning

```php
$c->groupBy('type');
$c->groupBy(fn($v) => $v->type);
$c->keyBy('id');
$c->partition(fn($v) => $v > 3);    // returns [$pass, $fail]
$c->chunk(3);
$c->chunkWhile(fn($v, $k, $chunk) => $v === $chunk->last() + 1);
$c->sliding(3);                     // rolling window of 3
```

## Searching

```php
$c->search(3);                      // key of value
$c->search(fn($v) => $v > 3);
$c->firstWhere('status', 'active');
$c->where('status', 'active');
$c->whereIn('status', ['a','b']);
$c->whereNotIn('status', ['draft']);
$c->whereNull('deleted_at');
$c->whereNotNull('published_at');
$c->whereBetween('age', [18, 65]);
```

## Aggregates

```php
$c->sum();
$c->sum('price');
$c->sum(fn($v) => $v->price * $v->qty);
$c->avg('price');
$c->min('price');
$c->max('price');
$c->median('price');
$c->mode('price');
$c->countBy(fn($v) => $v->status);
```

## Slicing

```php
$c->take(3);
$c->skip(2);
$c->slice(2, 3);                    // offset, length
$c->take(-3);                       // last 3
$c->takeWhile(fn($v) => $v < 4);
$c->skipWhile(fn($v) => $v < 3);
$c->takeUntil(fn($v) => $v > 3);
$c->skipUntil(fn($v) => $v > 3);
```

## Combining

```php
$c->merge([6, 7]);
$c->concat([[6, 7]]);
$c->push(6);
$c->prepend(0);
$c->put('key', 'value');
$c->zip([10, 20, 30]);
$c->combine(['a','b','c']);         // use as values, param as keys
$c->crossJoin(['x','y']);
```

## Extracting

```php
$c->pluck('name');
$c->pluck('name', 'id');            // key => value
$c->keys();
$c->values();                       // re-index
$c->flatten();
$c->flatten(1);                     // one level deep
$c->collapse();                     // collapse array of arrays
```

## Unique & Duplicates

```php
$c->unique();
$c->unique('email');
$c->duplicates('email');
```

## String-like

```php
$c->implode(', ');
$c->implode('name', ', ');
$c->join(', ');
$c->join(', ', ' and ');
```

## Conversion

```php
$c->toArray();
$c->toJson();
$c->jsonSerialize();
```

## Higher-Order Messages

```php
$c->each->save();
$c->filter->isActive();
$c->reject->isExpired();
$c->map->format('Y-m-d');
```

## Lazy Collections

Memory-efficient for large datasets:

```php
LazyCollection::make(function () {
    $handle = fopen('large.csv', 'r');
    while ($line = fgets($handle)) yield $line;
})->chunk(1000)->each(function ($chunk) { /* ... */ });

Post::query()->lazy()->each(fn($post) => ...);
Post::query()->lazyById()->each(fn($post) => ...);
```

---

**See Also:** [[arrays]] | [[strings]] | [[helpers]]
