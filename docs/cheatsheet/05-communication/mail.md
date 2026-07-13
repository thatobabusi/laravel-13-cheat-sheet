# Mail

> Send emails with Laravel Mail using mailables and markdown templates.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Communication

## Create Mailable

```bash
php artisan make:mail OrderShipped --markdown=emails.orders.shipped
```

## Define Mailable

```php
class OrderShipped extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Order $order) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Order Shipped',
            from: new Address('shop@example.com', 'My Shop'),
            replyTo: [new Address('noreply@example.com')],
            tags: ['order-shipped'],
            metadata: ['order_id' => $this->order->id],
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.orders.shipped',
            // OR: view: 'emails.orders.shipped',
            with: ['trackingNumber' => $this->order->tracking],
        );
    }

    public function attachments(): array
    {
        return [
            Attachment::fromPath('/path/to/file.pdf')->as('Invoice.pdf')->withMime('application/pdf'),
            Attachment::fromStorage('uploads/invoice.pdf'),
            Attachment::fromStorageDisk('s3', 'invoices/1.pdf'),
            Attachment::fromData(fn() => $this->order->generatePdf(), 'Invoice.pdf'),
        ];
    }
}
```

## Send Mail

```php
Mail::to($user)->send(new OrderShipped($order));
Mail::to('user@example.com')->cc($manager)->bcc($admin)->send(new OrderShipped($order));
Mail::to($user)->queue(new OrderShipped($order));
Mail::to($user)->later(now()->addHour(), new OrderShipped($order));
Mail::to($user)->sendNow(new OrderShipped($order));  // bypass queue

// Multiple recipients
Mail::to($users)->send(new OrderShipped($order));
```

## Markdown Mail Template

```blade
{{-- resources/views/emails/orders/shipped.blade.php --}}
@component('mail::message')
# Order Shipped

@component('mail::button', ['url' => $url])
Track Order
@endcomponent

@endcomponent
```

---

**See Also:** [[notifications]] | [[queues]]
