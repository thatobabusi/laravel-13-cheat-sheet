# Requests

> Access and validate incoming HTTP request data.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** HTTP

## Accessing Input

```php
$request->input('name');
$request->input('user.email');            // dot notation for nested
$request->input('products.*.price');      // wildcard
$request->input('name', 'default');       // with default
$request->string('name')->upper();        // fluent string
$request->integer('page');
$request->float('amount');
$request->boolean('active');
$request->date('birthday');
$request->date('birthday', 'Y-m-d', 'Africa/Johannesburg');
$request->enum('status', Status::class);
$request->collect('ids');                 // returns Collection
```

## Multiple Input

```php
$request->all();
$request->only(['name', 'email']);
$request->except(['_token', 'password']);
```

## Checking Input

```php
$request->filled('name');                 // present AND not empty
$request->isNotEmpty('name');
$request->missing('name');
$request->has('name');
$request->has(['name', 'email']);         // all must be present
$request->hasAny(['name', 'username']);   // any present
$request->whenHas('name', fn($v) => ...);
$request->whenFilled('name', fn($v) => ...);
```

## Query & Body

```php
$request->query('page');                  // query string only
$request->post('name');                   // POST body only
```

## Request Meta

```php
$request->path();                         // posts/1
$request->url();                          // https://example.com/posts/1
$request->fullUrl();                      // with query string
$request->fullUrlWithQuery(['page' => 2]);
$request->fullUrlWithoutQuery(['page']);
$request->host();
$request->method();                       // GET, POST, etc.
$request->isMethod('post');
$request->ip();
$request->ips();
$request->userAgent();
```

## Headers

```php
$request->header('X-Custom');
$request->bearerToken();
$request->expectsJson();
$request->wantsJson();
$request->isJson();
$request->accepts(['text/html', 'application/json']);
$request->ajax();                         // X-Requested-With: XMLHttpRequest
$request->secure();                       // HTTPS?
$request->pjax();
```

## Route Info

```php
$request->route('id');                    // get route parameter
$request->routeIs('posts.*');
$request->is('admin/*');                  // URL pattern match
```

## Files

```php
$request->hasFile('avatar');
$file = $request->file('avatar');
$file->isValid();
$file->getClientOriginalName();
$file->getClientOriginalExtension();
$file->getMimeType();
$file->getSize();
$file->store('avatars');                  // store in default disk
$file->store('avatars', 'public');
$file->storeAs('avatars', 'user-1.jpg', 'public');
$file->storePublicly('avatars');
```

## Form Request Validation

```php
// app/Http/Requests/StorePostRequest.php
class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Post::class);
    }

    public function rules(): array
    {
        return [
            'title'   => ['required', 'string', 'max:255'],
            'body'    => ['required', 'string'],
            'tags'    => ['array'],
            'tags.*'  => ['string', 'max:50'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['slug' => Str::slug($this->title)]);
    }

    public function messages(): array
    {
        return ['title.required' => 'A title is required.'];
    }

    public function attributes(): array
    {
        return ['body' => 'post body'];
    }

    protected function passedValidation(): void
    {
        // runs after successful validation
    }
}

// Usage in controller
public function store(StorePostRequest $request)
{
    $validated = $request->validated();
    // ...
}
```

---

**See Also:** [[responses]] | [[validation]] | [[controllers]]
