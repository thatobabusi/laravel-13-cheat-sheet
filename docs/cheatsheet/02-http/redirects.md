# Redirects

> Redirect users to different URLs with optional flash data.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** HTTP

## Basic Redirects

```php
return redirect('/home');
return redirect()->to('/home');
return redirect()->route('posts.show', $post);
return redirect()->action([PostController::class, 'show'], $post);
return redirect()->away('https://external.com');
return redirect()->back();
```

## Redirects with Input

```php
return redirect()->back()->withInput();
return back()->with('status', 'Profile updated!');
```

## Flash Data

```php
return redirect('/home')->with('success', 'Done!');
return redirect('/home')->withErrors($validator);
return redirect('/home')->withErrors(['email' => 'Wrong email.']);
```

## Intended Redirect

After login, redirect to originally intended page:

```php
return redirect()->intended('/dashboard');
```

---

**See Also:** [[responses]] | [[requests]] | [[session]]
