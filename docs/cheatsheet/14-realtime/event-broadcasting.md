# Event Broadcasting & WebSockets

## Broadcasting Configuration

### Setup Broadcasting
```php
// config/broadcasting.php
'default' => env('BROADCAST_DRIVER', 'log'),

'connections' => [
    'pusher' => [
        'driver' => 'pusher',
        'key' => env('PUSHER_APP_KEY'),
        'secret' => env('PUSHER_APP_SECRET'),
        'app_id' => env('PUSHER_APP_ID'),
        'options' => [
            'cluster' => env('PUSHER_APP_CLUSTER'),
            'useTLS' => true,
        ],
    ],

    'ably' => [
        'driver' => 'ably',
        'key' => env('ABLY_KEY'),
    ],

    'redis' => [
        'driver' => 'redis',
        'connection' => 'default',
    ],
]
```

## Creating Broadcastable Events

### Generate Event
```bash
php artisan make:event PostCreated
```

### Event Structure
```php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class PostCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Post $post) {}

    public function broadcastOn()
    {
        return new Channel('posts');
    }

    public function broadcastAs()
    {
        return 'post.created';
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->post->id,
            'title' => $this->post->title,
        ];
    }
}
```

## Channel Types

### Public Channels
```php
// Anyone can join
public function broadcastOn()
{
    return new Channel('posts');
}

// JavaScript
Echo.channel('posts')
    .listen('PostCreated', (e) => {
        console.log('Post created:', e);
    });
```

### Private Channels
```php
// Only authenticated users
public function broadcastOn()
{
    return new PrivateChannel('user.' . $this->user->id);
}

// Must authorize in routes
Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
```

### Presence Channels
```php
// Track user presence
public function broadcastOn()
{
    return new PresenceChannel('chat');
}

// Authorization
Broadcast::channel('chat', function ($user) {
    return ['id' => $user->id, 'name' => $user->name];
});

// JavaScript
Echo.join('chat')
    .here((users) => {
        console.log('Users in room:', users);
    })
    .joining((user) => {
        console.log('User joined:', user);
    })
    .leaving((user) => {
        console.log('User left:', user);
    })
    .listen('MessageSent', (e) => {
        console.log('Message:', e.message);
    });
```

## Broadcasting Events

### Dispatch Event
```php
// Broadcast to all
event(new PostCreated($post));

// Broadcast except current user
event(new PostCreated($post))->exceptCurrentUser();
```

## Using Laravel Echo

### Setup Echo
```bash
npm install laravel-echo pusher-js
```

### Configure Echo
```javascript
// resources/js/echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    wsHost: import.meta.env.VITE_PUSHER_HOST,
    wsPort: import.meta.env.VITE_PUSHER_PORT,
    wssPort: import.meta.env.VITE_PUSHER_PORT,
    forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
});
```

### Listen to Events
```javascript
// Public channel
Echo.channel('posts')
    .listen('PostCreated', (data) => {
        console.log('New post:', data.title);
    });

// Private channel
Echo.private('user.1')
    .listen('NotificationSent', (data) => {
        console.log('Notification:', data.message);
    });

// Presence channel
Echo.join('chat')
    .here((users) => {
        // Initial users list
    })
    .joining((user) => {
        // User joined
    })
    .leaving((user) => {
        // User left
    })
    .listen('MessageSent', (data) => {
        // New message
    });
```

## Real-time Notifications

### Broadcast Notifications
```php
namespace App\Notifications;

class UserMentioned extends Notification implements ShouldBroadcast
{
    public function via()
    {
        return ['broadcast', 'database'];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'user_id' => $this->user->id,
            'message' => "{$this->user->name} mentioned you",
        ]);
    }
}

// Listen in JavaScript
Echo.private('App.Models.User.' + userId)
    .notification((notification) => {
        console.log('New notification:', notification);
    });
```

## Pusher Configuration

### Environment Variables
```env
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=123456
PUSHER_APP_KEY=your-key
PUSHER_APP_SECRET=your-secret
PUSHER_APP_CLUSTER=mt1
```

### Local Broadcasting
```bash
npm install -D laravel-echo-server
./node_modules/.bin/laravel-echo-server init
./node_modules/.bin/laravel-echo-server start
```

## See Also
- [[notifications]]
- [[queues-jobs]]
- [[real-time-features]]
