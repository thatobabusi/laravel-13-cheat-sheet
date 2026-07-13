# Storage

> Store and retrieve files on local or cloud storage disks.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Utilities

## Writing Files

```php
use Illuminate\Support\Facades\Storage;

Storage::put('file.txt', 'Contents');
Storage::put('file.txt', $stream);
Storage::putFile('photos', $request->file('photo'));         // auto filename
Storage::putFileAs('photos', $request->file('photo'), 'user.jpg');
Storage::prepend('file.log', 'First line');
Storage::append('file.log', 'Last line');
```

## Reading Files

```php
Storage::get('file.txt');
Storage::json('data.json');                // decode JSON file
Storage::exists('file.txt');
Storage::missing('file.txt');
Storage::size('file.txt');
Storage::lastModified('file.txt');
Storage::mimeType('file.txt');
Storage::path('file.txt');                 // absolute local path
```

## URLs

```php
Storage::url('file.txt');                  // public URL
Storage::temporaryUrl('file.txt', now()->addMinutes(5));   // S3 presigned
Storage::temporaryUploadUrl('file.txt', now()->addMinutes(5));  // upload URL
```

## Deleting Files

```php
Storage::delete('file.txt');
Storage::delete(['a.txt', 'b.txt']);
```

## Moving & Copying

```php
Storage::move('old.txt', 'new.txt');
Storage::copy('source.txt', 'dest.txt');
```

## Directories

```php
Storage::makeDirectory('photos');
Storage::deleteDirectory('photos');
Storage::files('photos');                  // files in directory
Storage::allFiles('photos');               // recursive
Storage::directories('photos');
Storage::allDirectories('photos');
```

## Visibility

```php
Storage::setVisibility('file.txt', 'public');
Storage::visibility('file.txt');           // 'public' | 'private'
```

## Disk Selection

```php
Storage::disk('s3')->put('file.txt', 'contents');
Storage::disk('local')->get('file.txt');
```

## Streaming

```php
Storage::readStream('large.zip');
Storage::writeStream('large.zip', $stream);
```

---

**See Also:** [[requests]] | [[responses]]
