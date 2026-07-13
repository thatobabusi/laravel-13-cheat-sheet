# Validation

> Validate incoming request data with Laravel's flexible validation system.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Validation

## Manual Validation

```php
$validator = Validator::make($request->all(), [
    'email' => ['required', 'email', 'unique:users,email'],
    'name'  => ['required', 'string', 'max:255'],
]);
if ($validator->fails()) {
    return back()->withErrors($validator)->withInput();
}
$validated = $validator->validated();
```

## Quick Validation in Controller

```php
$validated = $request->validate([
    'title' => 'required|max:255',
    'body'  => 'required',
]);
```

## Custom Messages

```php
$request->validate(
    ['title' => 'required'],
    ['title.required' => 'Please enter a title.']
);
```

## Stopping on First Failure

```php
$request->validate(['title' => ['bail', 'required', 'max:255']]);
```

## Conditional Rules

```php
Rule::when($isAdmin, ['sometimes', 'min:10'], ['max:5']);
$request->validate([
    'role' => 'required',
    'admin_code' => Rule::when(fn($input) => $input->role === 'admin', 'required|min:8'),
]);
```

## Common Rules

```php
'required'
'required_if:field,value'
'required_unless:field,value'
'required_with:foo,bar'
'required_without:foo,bar'
'required_with_all:foo,bar'
'required_without_all:foo,bar'
'nullable'
'sometimes'                         // only validate if present
'filled'                            // must not be empty if present
'present'                           // must be present (even if empty)
'prohibited'
'prohibited_if:field,value'
'prohibited_unless:field,value'
'string'
'integer'
'numeric'
'boolean'
'array'
'array:key1,key2'                   // allowed keys
'list'                              // array with sequential keys
'email'
'email:rfc,dns'
'url'
'active_url'                        // DNS check
'ip'
'ipv4'
'ipv6'
'uuid'
'ulid'
'alpha'
'alpha_num'
'alpha_dash'
'ascii'
'min:3'
'max:255'
'size:10'
'between:1,100'
'digits:4'
'digits_between:4,8'
'decimal:2'
'decimal:1,3'
'gt:other_field'
'gte:other_field'
'lt:other_field'
'lte:other_field'
'same:password'
'different:username'
'confirmed'                         // field_confirmation must match
'in:foo,bar,baz'
'not_in:foo,bar'
Rule::in(['admin','editor'])
Rule::notIn(['banned'])
'exists:table,column'
Rule::exists('users','email')
Rule::exists('users','email')->where('is_active', 1)->whereNull('deleted_at')
'unique:table,column'
Rule::unique('users','email')
Rule::unique('users','email')->ignore($user->id)
Rule::unique('users','email')->where('company_id', $companyId)
'date'
'date_format:Y-m-d'
'before:tomorrow'
'before_or_equal:today'
'after:2024-01-01'
'after_or_equal:start_date'
'date_equals:2025-01-01'
'timezone'
'file'
'image'
'mimes:jpg,png,gif'
'mimetypes:image/jpeg,image/png'
'max:2048'                          // kilobytes for files
'min:1'                             // kilobytes
'dimensions:min_width=100,min_height=100'
'dimensions:ratio=3/2'
'extensions:jpg,png'               // file extension whitelist
'password'
'password:min=8,letters,numbers,symbols,uncompromised'
'regex:/^[a-z]+$/i'
'not_regex:/bad_pattern/'
'json'
'lowercase'
'uppercase'
'starts_with:foo,bar'
'ends_with:foo,bar'
'doesnt_start_with:admin'
'doesnt_end_with:.exe'
'multiple_of:5'
'missing'
'missing_if:field,value'
'missing_unless:field,value'
'missing_with:other'
'exclude'
'exclude_if:field,value'
'exclude_unless:field,value'
'exclude_with:field'
'exclude_without:field'
Rule::forEach(fn($v,$attr,$data) => ['string','max:100'])
```

## Custom Rules

```php
class Uppercase implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (strtoupper($value) !== $value) {
            $fail("The :attribute must be uppercase.");
        }
    }
}

$request->validate(['name' => ['required', new Uppercase]]);
```

---

**See Also:** [[requests]] | [[form-requests]]
