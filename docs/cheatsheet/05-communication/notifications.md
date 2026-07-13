# Notifications

> Send notifications via multiple channels (mail, database, SMS, etc.).
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Communication

## Create Notification

```bash
php artisan make:notification InvoicePaid
```

## Define Notification

```php
class InvoicePaid extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private Invoice $invoice) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Invoice Paid')
            ->greeting('Hello '.$notifiable->name.'!')
            ->line('Your invoice has been paid.')
            ->action('View Invoice', url('/invoices/'.$this->invoice->id))
            ->line('Thank you!')
            ->salutation('Regards, '.config('app.name'));
    }

    public function toDatabase(object $notifiable): array
    {
        return ['invoice_id' => $this->invoice->id, 'amount' => $this->invoice->total];
    }

    public function toArray(object $notifiable): array
    {
        return $this->toDatabase($notifiable);
    }
}
```

## Send Notifications

```php
$user->notify(new InvoicePaid($invoice));
Notification::send($users, new InvoicePaid($invoice));   // collection
Notification::sendNow($user, new InvoicePaid($invoice)); // skip queue
```

## On-Demand Notifications

Without a notifiable model:

```php
Notification::route('mail', 'taylor@example.com')
            ->route('vonage', '5555555555')
            ->notify(new InvoicePaid($invoice));
```

## Database Notifications

Setup:

```bash
php artisan notifications:table
php artisan migrate
```

Access:

```php
$user->notifications;                       // all
$user->unreadNotifications;
$user->readNotifications;
$user->unreadNotifications()->count();
$notification->markAsRead();
$user->unreadNotifications()->update(['read_at' => now()]);
$user->notifications()->delete();
```

---

**See Also:** [[mail]] | [[events-listeners]]
