# Laravel Design Patterns

## Repository Pattern

### Repository Interface
```php
interface PostRepository
{
    public function all();
    public function find($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
}
```

### Repository Implementation
```php
class EloquentPostRepository implements PostRepository
{
    public function all()
    {
        return Post::all();
    }

    public function find($id)
    {
        return Post::findOrFail($id);
    }

    public function create(array $data)
    {
        return Post::create($data);
    }

    public function update($id, array $data)
    {
        $post = $this->find($id);
        $post->update($data);
        return $post;
    }

    public function delete($id)
    {
        return $this->find($id)->delete();
    }
}
```

### Register in Service Provider
```php
public function register()
{
    $this->app->bind(PostRepository::class, EloquentPostRepository::class);
}
```

### Use in Controller
```php
class PostController extends Controller
{
    public function __construct(protected PostRepository $posts) {}

    public function index()
    {
        return $this->posts->all();
    }
}
```

## Service Layer Pattern

### Service Class
```php
class PostService
{
    public function __construct(protected PostRepository $posts) {}

    public function createWithAuthor(array $data, User $author)
    {
        $data['user_id'] = $author->id;
        return $this->posts->create($data);
    }

    public function publishPost(Post $post)
    {
        $post->update(['published_at' => now()]);
        event(new PostPublished($post));
        return $post;
    }

    public function deleteWithCleanup(Post $post)
    {
        $post->comments()->delete();
        $post->delete();
    }
}
```

## Strategy Pattern

### Payment Strategy
```php
interface PaymentStrategy
{
    public function pay($amount);
}

class CreditCardPayment implements PaymentStrategy
{
    public function pay($amount)
    {
        // Process credit card payment
    }
}

class PayPalPayment implements PaymentStrategy
{
    public function pay($amount)
    {
        // Process PayPal payment
    }
}

class PaymentProcessor
{
    public function __construct(protected PaymentStrategy $strategy) {}

    public function checkout($amount)
    {
        return $this->strategy->pay($amount);
    }
}
```

## Observer Pattern

### Custom Events & Listeners
```php
class UserCreated
{
    public function __construct(public User $user) {}
}

class SendWelcomeEmail
{
    public function handle(UserCreated $event)
    {
        Mail::send(new WelcomeEmail($event->user));
    }
}

// Register in EventServiceProvider
protected $listen = [
    UserCreated::class => [
        SendWelcomeEmail::class,
    ],
];
```

## Factory Pattern

### Model Factory
```php
class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition()
    {
        return [
            'title' => $this->faker->sentence,
            'content' => $this->faker->paragraph,
            'user_id' => User::factory(),
        ];
    }
}

// Use
$post = Post::factory()->create();
```

## Singleton Pattern

### Single Instance
```php
class ConfigManager
{
    protected static $instance;

    public static function getInstance()
    {
        return static::$instance ?? (static::$instance = new static());
    }

    private function __construct() {}
}

// Use
$config = ConfigManager::getInstance();
```

## Decorator Pattern

### Add Functionality Dynamically
```php
interface QueryBuilder
{
    public function build();
}

class SqlQueryBuilder implements QueryBuilder
{
    public function build()
    {
        return 'SELECT * FROM posts';
    }
}

class FilterQueryDecorator
{
    public function __construct(protected QueryBuilder $query) {}

    public function build()
    {
        return $this->query->build() . ' WHERE published = 1';
    }
}
```

## Model Scopes

### Query Scopes
```php
class Post extends Model
{
    public function scopePublished($query)
    {
        return $query->where('published_at', '<=', now());
    }

    public function scopeByAuthor($query, User $author)
    {
        return $query->where('user_id', $author->id);
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }
}

// Usage
$posts = Post::published()->byAuthor($user)->recent()->get();
```

## Polymorphic Relations

### Polymorphic Relationships
```php
class Comment extends Model
{
    public function commentable()
    {
        return $this->morphTo();
    }
}

class Post extends Model
{
    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}

class Video extends Model
{
    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}
```

## Trait Pattern

### Reusable Functionality
```php
trait Timestamps
{
    public function getCreatedAtAttribute()
    {
        return $this->attributes['created_at']->format('Y-m-d H:i');
    }
}

class Post extends Model
{
    use Timestamps;
}
```

## Value Object Pattern

### Immutable Value Objects
```php
class Price
{
    public function __construct(
        public readonly float $amount,
        public readonly string $currency = 'USD'
    ) {}

    public function add(Price $other): Price
    {
        if ($this->currency !== $other->currency) {
            throw new Exception('Cannot add different currencies');
        }
        return new Price($this->amount + $other->amount, $this->currency);
    }

    public function __toString(): string
    {
        return $this->amount . ' ' . $this->currency;
    }
}
```

## Pipeline Pattern

### Middleware Chain
```php
// Process through pipeline
Pipeline::send($request)
    ->through([
        ValidateRequest::class,
        AuthorizeRequest::class,
        LogRequest::class,
    ])
    ->then(function ($request) {
        return response()->json(['success' => true]);
    });
```

## See Also
- [[service-providers]]
- [[custom-commands]]
- [[macros-helpers]]
