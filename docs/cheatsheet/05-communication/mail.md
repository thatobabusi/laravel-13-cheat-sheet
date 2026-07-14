# Mail

## Configuration

```php
// .env file
MAIL_DRIVER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=465
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=from@example.com
MAIL_FROM_NAME="Example App"
```

## Available Drivers

- smtp
- mailgun
- postmark
- ses
- sendmail
- array (for testing)
- log (for debugging)

## Sending Mail

### Basic Mail

```php
use Illuminate\Support\Facades\Mail;

Mail::to('user@example.com')->send(new WelcomeMail());

// Multiple recipients
Mail::to(['user1@example.com', 'user2@example.com'])->send(new NotificationMail());

// CC and BCC
Mail::to('user@example.com')
    ->cc('cc@example.com')
    ->bcc('bcc@example.com')
    ->send(new Mail());

// Reply-to
Mail::to('user@example.com')
    ->replyTo('reply@example.com')
    ->send(new WelcomeMail());
```

### From Address

```php
Mail::from('sender@example.com')->send(new WelcomeMail());
Mail::mailer('postmark')->to('user@example.com')->send(new Mail());
```

## Generating Mailables

```bash
php artisan make:mail WelcomeMail
php artisan make:mail OrderShipped --markdown=emails.orders.shipped
```

## Mailable Class

```php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;

    public function __construct($user)
    {
        $this->user = $user;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to Our Site',
            from: 'hello@example.com'
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.welcome',
            text: 'emails.welcome_text',
        );
    }

    public function attachments(): array
    {
        return [];
    }

    public function build()
    {
        return $this->view('emails.welcome')
                    ->with(['user' => $this->user])
                    ->attach('/path/to/file.pdf');
    }
}
```

## Mail Templates

### Blade Template

```blade
<!-- resources/views/emails/welcome.blade.php -->
<h1>Welcome {{ $user->name }}!</h1>

<p>Thank you for joining our community.</p>

<a href="{{ url('/') }}">Visit our site</a>
```

### Markdown Template

```blade
<!-- resources/views/emails/orders/shipped.blade.php -->
@component('mail::message')
# Order Shipped

Your order has been shipped!

@component('mail::button', ['url' => url('/orders/'.$order->id)])
View Order
@endcomponent

Thanks,
{{ config('app.name') }}
@endcomponent
```

## Sending Mail

### From Controller

```php
use App\Mail\WelcomeMail;

public function register(Request $request)
{
    $user = User::create($request->validated());
    
    Mail::to($user->email)->send(new WelcomeMail($user));
    
    return redirect('/');
}
```

### Queued Mail

```php
// Async sending
Mail::to('user@example.com')->queue(new WelcomeMail());

// With delay
Mail::to('user@example.com')->later(now()->addMinutes(10), new WelcomeMail());
```

## Attachments

```php
// File attachment
$this->attach('/path/to/file.pdf');

// With custom name
$this->attach('/path/to/file.pdf', ['as' => 'custom-name.pdf']);

// From memory
$this->attachData('file content', 'filename.txt');

// In mailable
public function attachments(): array
{
    return [
        Attachment::fromPath('/path/to/file.pdf')
            ->as('filename.pdf'),
    ];
}
```

## Local Development

### Using Log Driver

```php
// .env
MAIL_DRIVER=log

// Emails will be logged to storage/logs/
```

### Using Array Driver

```php
// .env
MAIL_DRIVER=array

// In tests
Mail::fake();
Mail::assertSent(WelcomeMail::class);
```

### Using Mailtrap

1. Sign up at mailtrap.io
2. Get credentials from dashboard
3. Add to .env
4. Check inbox at mailtrap.io

## Testing Mail

```php
use Illuminate\Support\Facades\Mail;

public function test_welcome_mail_sent()
{
    Mail::fake();
    
    // Perform action that sends mail
    User::factory()->create();
    
    // Assert mail was sent
    Mail::assertSent(WelcomeMail::class);
    
    // Assert sent to specific address
    Mail::assertSent(WelcomeMail::class, function ($mail) {
        return $mail->hasTo('user@example.com');
    });
}
```

## Markdown Components

```blade
@component('mail::button', ['url' => $url])
Button Text
@endcomponent

@component('mail::panel')
Panel content
@endcomponent

@component('mail::table')
| Column | Value |
| --- | --- |
| Name | John Doe |
@endcomponent
```
