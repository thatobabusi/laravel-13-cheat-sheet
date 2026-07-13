# Testing — Pest / PHPUnit

> Write tests using Pest or PHPUnit to ensure code quality.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Advanced

## PHPUnit Feature Test

```php
class PostTest extends TestCase
{
    use RefreshDatabase;           // wrap in transaction, rollback after each test
    // use DatabaseMigrations;     // full migrate:fresh each test (slow)
    // use DatabaseTruncation;     // truncate tables (faster than migrations)

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_user_can_view_posts(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
                         ->get(route('posts.show', $post));

        $response->assertStatus(200);
        $response->assertOk();
        $response->assertViewIs('posts.show');
        $response->assertViewHas('post', $post);
        $response->assertSee($post->title);
        $response->assertDontSee('Draft');
    }
}
```

## Pest Equivalent

```php
it('shows posts to authenticated users', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create(['user_id' => $user->id]);

    actingAs($user)
        ->get(route('posts.show', $post))
        ->assertOk()
        ->assertViewIs('posts.show')
        ->assertSee($post->title);
});
```

## HTTP Assertions

```php
$response->assertOk();                       // 200
$response->assertCreated();                  // 201
$response->assertAccepted();                 // 202
$response->assertNoContent();                // 204
$response->assertNotFound();                 // 404
$response->assertForbidden();                // 403
$response->assertUnauthorized();             // 401
$response->assertUnprocessable();            // 422
$response->assertStatus(302);
$response->assertRedirect('/home');
$response->assertRedirectToRoute('home');
$response->assertRedirectContains('/posts');
$response->assertHeader('Content-Type', 'application/json');
$response->assertJsonPath('data.0.name', 'John');
$response->assertJsonCount(3, 'data');
$response->assertJsonMissingPath('data.0.password');
$response->assertJsonStructure(['data' => [['id','name','email']]]);
$response->assertJson(fn(AssertableJson $j) =>
    $j->where('id', 1)
      ->where('name', 'John')
      ->missing('password')
      ->has('posts', 3)
      ->has('posts.0', fn($j) => $j->where('title', 'Hello')->etc())
      ->etc()                                // allow extra keys
);
$response->assertSessionHas('status', 'done');
$response->assertSessionMissing('error');
$response->assertCookie('name', 'value');
$response->assertCookieMissing('name');
```

## Database Assertions

```php
$this->assertDatabaseHas('posts', ['title' => 'Hello', 'user_id' => 1]);
$this->assertDatabaseMissing('posts', ['title' => 'Deleted']);
$this->assertDatabaseCount('posts', 5);
$this->assertDatabaseEmpty('posts');
$this->assertSoftDeleted('posts', ['id' => 1]);
$this->assertNotSoftDeleted('posts', ['id' => 1]);
$this->assertModelExists($post);
$this->assertModelMissing($post);
```

## Mocking

```php
$this->mock(PaymentGateway::class, function (MockInterface $mock) {
    $mock->shouldReceive('charge')->once()->with(100)->andReturn(true);
});
$this->partialMock(PaymentGateway::class, ...);
$this->spy(PaymentGateway::class);
```

## Faking Services

```php
Mail::fake();
Mail::assertSent(OrderShipped::class);
Mail::assertSent(OrderShipped::class, fn($m) => $m->hasTo('a@b.com'));
Mail::assertSentCount(2);
Mail::assertNotSent(OrderShipped::class);
Mail::assertQueued(OrderShipped::class);
Mail::assertNothingSent();

Notification::fake();
Notification::assertSentTo($user, InvoicePaid::class);
Notification::assertNothingSent();
Notification::assertCount(3);

Queue::fake();
Queue::assertPushed(ProcessPodcast::class);
Queue::assertPushed(ProcessPodcast::class, fn($job) => $job->podcast->id === 1);
Queue::assertPushedOn('high', ProcessPodcast::class);
Queue::assertPushedWithChain(ProcessPodcast::class, [OptimizePodcast::class]);
Queue::assertNotPushed(ProcessPodcast::class);
Queue::assertCount(2);

Storage::fake('avatars');
Storage::disk('avatars')->assertExists('photo.jpg');
Storage::disk('avatars')->assertMissing('photo.jpg');
```

## Time Control

```php
$this->freezeTime();
$this->travelTo(now()->addDays(5));
$this->travelBack();
$this->travel(5)->days();
```

## Pest Syntax

```php
pest()->extends(TestCase::class)->use(RefreshDatabase::class)->in('Feature');

describe('posts', function () {
    beforeEach(fn() => $this->user = User::factory()->create());

    it('can be created', function () {
        actingAs($this->user)
            ->post(route('posts.store'), ['title' => 'Hello', 'body' => 'World'])
            ->assertCreated();
        expect(Post::count())->toBe(1);
    });

    it('requires authentication')->get('/posts')->assertRedirect('/login');
});
```

## Pest Expectations

```php
expect($value)->toBe(42);
expect($value)->toEqual('42');
expect($value)->toBeTrue();
expect($value)->toBeFalse();
expect($value)->toBeNull();
expect($value)->toBeEmpty();
expect($value)->toContain('hello');
expect($arr)->toHaveCount(3);
expect($arr)->toHaveKey('name');
expect($obj)->toHaveProperty('title', 'Hello');
expect($value)->toBeGreaterThan(0);
expect($value)->toBeLessThan(100);
expect($value)->toBeInstanceOf(User::class);
expect(fn() => risky())->toThrow(RuntimeException::class);
expect($value)->when($condition, fn($e) => $e->toBeTrue());
```

---

**See Also:** [[pest]] | [[phpunit]] | [[testing-overview]]
