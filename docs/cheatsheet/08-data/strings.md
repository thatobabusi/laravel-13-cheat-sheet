# Strings — Str

> Manipulate and analyze strings using the Str helper class.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Data Processing

## Fluent String Builder

```php
use Illuminate\Support\Str;

Str::of('hello world')
    ->title()
    ->words(3)
    ->append(' suffix');
```

## Case Conversion

```php
Str::camel('foo_bar');             // fooBar
Str::snake('FooBar');              // foo_bar
Str::kebab('FooBar');              // foo-bar
Str::studly('foo_bar');            // FooBar
Str::title('hello world');         // Hello World
Str::headline('email_verified_at'); // Email Verified At
Str::upper('hello');
Str::lower('HELLO');
Str::ucfirst('hello world');
Str::lcfirst('Hello World');
```

## Analysis

```php
Str::length('hello');
Str::wordCount('hello world');
Str::contains('hello world', 'world');
Str::contains('hello world', ['world', 'earth']);  // any
Str::containsAll('hello world', ['hello', 'world']);
Str::startsWith('hello', 'hel');
Str::endsWith('hello', 'llo');
Str::is('foo*', 'foobar');         // glob-style match
Str::isUrl('https://example.com');
Str::isEmail('a@b.com');
Str::isUuid('...');
Str::isUlid('...');
Str::isJson('{"a":1}');
Str::isAscii('hello');
Str::ascii('Ä');                   // transliterate → 'A'
```

## Manipulation

```php
Str::limit('Long string...', 50);
Str::limit('Long string...', 50, '...');
Str::words('Many words here', 3, '...');
Str::before('user@example.com', '@');   // 'user'
Str::after('user@example.com', '@');    // 'example.com'
Str::beforeLast('a/b/c.jpg', '/');      // 'a/b'
Str::afterLast('a/b/c.jpg', '/');       // 'c.jpg'
Str::between('(value)', '(', ')');      // 'value'
Str::betweenFirst('[a][b]', '[', ']');  // 'a'
Str::chopStart('https://foo.com', 'https://');
Str::chopEnd('image.jpeg', '.jpeg');
Str::replace('World', 'Laravel', 'Hello World');
Str::replaceFirst('the', 'a', 'the cat');
Str::replaceLast('the', 'a', 'the cat');
Str::replaceArray('?', ['a','b'], '? and ?');
Str::replaceStart('Hello', 'Hi', 'Hello World');
Str::replaceEnd('World', 'Earth', 'Hello World');
Str::replaceMatches('/[^a-z]/i', '', 'Hello World 123');
Str::remove('o', 'hello world');
Str::start('path/file.txt', '/');       // ensure starts with
Str::finish('path', '/');               // ensure ends with
Str::wrap('value', '"');                // "value"
Str::unwrap('"value"', '"');
Str::pad('5', 5, '0', STR_PAD_LEFT);   // 00005
Str::padLeft('5', 5, '0');
Str::padRight('5', 5, '0');
Str::trim('  hello  ');
Str::ltrim('  hello  ');
Str::rtrim('  hello  ');
Str::squish('  too   many   spaces  ');  // 'too many spaces'
Str::reverse('hello');
Str::repeat('ab', 3);                   // 'ababab'
Str::substr('hello', 1, 3);            // 'ell'
Str::substrCount('hello', 'l');        // 2
Str::substrReplace('hello', 'a', 1, 3); // 'hao'
```

## URLs & IDs

```php
Str::slug('Hello World!');             // 'hello-world'
Str::slug('Héllo', '_');               // 'hello'  
Str::ulid();                           // 01HX...
Str::uuid();                           // 550e8400-e29b...
Str::random(40);                       // random alphanumeric
Str::orderedUuid();
Str::createUuidsUsing(fn() => '...'); // fake UUIDs in tests
```

## Pluralization

```php
Str::plural('child');                  // 'children'
Str::plural('child', 1);              // 'child'
Str::singular('children');            // 'child'
Str::pluralStudly('UserGroup');        // 'UserGroups'
```

## Excerpts & Markdown

```php
Str::excerpt('Full text here', 'text', ['radius' => 5]);
Str::markdown('# Hello');             // convert to HTML
Str::inlineMarkdown('**bold**');      // no block wrapping
```

## Masking

```php
Str::mask('john@example.com', '*', 4);  // john**************
Str::mask('john@example.com', '*', 4, 4); // john****ple.com
```

## Password

```php
Str::password(32);                    // secure random password
```

---

**See Also:** [[arrays]] | [[collections]] | [[helpers]]
