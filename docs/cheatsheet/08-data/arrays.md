# Arrays — Arr

> Manipulate arrays using the Arr helper class.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Data Processing

```php
use Illuminate\Support\Arr;

Arr::accessible(['a','b']);
Arr::add(['name' => 'John'], 'age', 30);       // only if key missing
Arr::collapse([[1,2],[3,4]]);                  // [[1,2],[3,4]] → [1,2,3,4]
Arr::crossJoin([1,2], ['a','b']);              // cartesian product
Arr::divide(['a' => 1, 'b' => 2]);            // [keys, values]
Arr::dot(['foo' => ['bar' => 'baz']]);        // ['foo.bar' => 'baz']
Arr::undot(['foo.bar' => 'baz']);
Arr::except(['a'=>1,'b'=>2], ['a']);           // ['b'=>2]
Arr::exists($arr, 'key');
Arr::first([1,2,3,4], fn($v) => $v > 2);
Arr::last([1,2,3,4], fn($v) => $v < 3);
Arr::flatten(['a'=>[1,2],'b'=>[3,4]]);        // [1,2,3,4]
Arr::flatten(['a'=>[1,['b'=>2]]], depth: 1);
Arr::forget($arr, 'products.0.price');         // remove by dot path
Arr::get($arr, 'user.name', 'default');
Arr::has($arr, 'user.name');
Arr::has($arr, ['user.name', 'user.email']);   // all must exist
Arr::hasAny($arr, ['user.name', 'user.age']);  // any must exist
Arr::isAssoc(['a'=>1,'b'=>2]);
Arr::isList([1,2,3]);
Arr::join([1,2,3], ', ');                     // '1, 2, 3'
Arr::join([1,2,3], ', ', ' and ');            // '1, 2 and 3'
Arr::keyBy($arr, 'id');
Arr::keys($arr);
Arr::map($arr, fn($v, $k) => $v * 2);
Arr::mapWithKeys($arr, fn($v,$k) => [$v => $k]);
Arr::only($arr, ['a','b']);
Arr::pluck($arr, 'name');
Arr::pluck($arr, 'name', 'id');               // key → value
Arr::prepend($arr, 'zero');
Arr::pull($arr, 'key');                        // get + remove
Arr::query(['name' => 'John', 'age' => 30]);  // 'name=John&age=30'
Arr::random([1,2,3,4,5]);
Arr::random([1,2,3,4,5], 3);                  // 3 random items
Arr::set($arr, 'user.name', 'John');
Arr::shuffle([1,2,3]);
Arr::sort([3,1,2]);
Arr::sort($arr, fn($v) => $v['name']);
Arr::sortDesc([3,1,2]);
Arr::sortRecursive($arr);
Arr::take([1,2,3,4,5], 3);                   // first 3
Arr::take([1,2,3,4,5], -2);                  // last 2
Arr::toCssClasses(['active' => $isActive, 'disabled' => $isDisabled, 'btn']);
Arr::toCssStyles(['color:red' => $isError]);
Arr::where([1,2,3,4], fn($v) => $v > 2);
Arr::whereNotNull([1, null, 2, null, 3]);
Arr::wrap(null);                              // []
Arr::wrap('string');                          // ['string']
Arr::wrap([1,2,3]);                           // [1,2,3]
```

---

**See Also:** [[strings]] | [[collections]] | [[helpers]]
