# Unit & Feature Testing

## Test Directory Structure

```
tests/
├── Unit/
│   ├── Models/
│   ├── Services/
│   └── Helpers/
├── Feature/
│   ├── Auth/
│   ├── Posts/
│   └── Api/
├── CreatesApplication.php
└── TestCase.php
```

## Writing Unit Tests

### Basic Unit Test
```php
namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Models\User;

class UserTest extends TestCase
{
    public function test_user_has_email()
    {
        $user = new User(['email' => 'test@example.com']);
        $this->assertEquals('test@example.com', $user->email);
    }

    public function test_user_full_name()
    {
        $user = new User([
            'first_name' => 'John',
            'last_name' => 'Doe'
        ]);
        
        $this->assertEquals('John Doe', $user->full_name);
    }
}
```

### Testing Models
```php
class PostTest extends TestCase
{
    use RefreshDatabase;

    public function test_post_can_be_created()
    {
        $post = Post::factory()->create();
        
        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'title' => $post->title,
        ]);
    }

    public function test_post_belongs_to_user()
    {
        $post = Post::factory()->create();
        
        $this->assertInstanceOf(User::class, $post->user);
    }
}
```

## Feature Testing

### HTTP Tests
```php
class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login()
    {
        $user = User::factory()->create([
            'password' => Hash::make('password'),
        ]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticatedAs($user);
        $response->assertRedirect('/dashboard');
    }

    public function test_user_cannot_login_with_invalid_password()
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }
}
```

### Testing Database Changes
```php
public function test_post_can_be_updated()
{
    $post = Post::factory()->create();

    $response = $this->put("/posts/{$post->id}", [
        'title' => 'Updated Title',
        'content' => 'Updated content',
    ]);

    $this->assertDatabaseHas('posts', [
        'id' => $post->id,
        'title' => 'Updated Title',
    ]);
}

public function test_post_can_be_deleted()
{
    $post = Post::factory()->create();

    $this->delete("/posts/{$post->id}");

    $this->assertDatabaseMissing('posts', ['id' => $post->id]);
}
```

## Test Factories

### Create Factory
```php
class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition()
    {
        return [
            'title' => $this->faker->sentence,
            'content' => $this->faker->paragraphs(3, true),
            'user_id' => User::factory(),
            'published_at' => $this->faker->dateTime,
        ];
    }

    public function published()
    {
        return $this->state([
            'published_at' => now(),
        ]);
    }
}

// Usage
$post = Post::factory()->create();
$posts = Post::factory()->count(10)->create();
$post = Post::factory()->published()->create();
```

## Database Seeders

### Create Seeder
```php
class PostSeeder extends Seeder
{
    public function run()
    {
        User::factory(10)
            ->has(Post::factory(5))
            ->create();
    }
}

// Run seeder
php artisan db:seed
php artisan db:seed --class=PostSeeder
```

## Mocking & Stubbing

### Mock Dependencies
```php
public function test_post_notification_sent()
{
    Notification::fake();

    $post = Post::factory()->create();

    Notification::assertSentTo(
        $post->user,
        PostCreated::class
    );
}
```

### Mock External APIs
```php
public function test_weather_service()
{
    Http::fake([
        'api.weather.com/*' => Http::response(['temp' => 25]),
    ]);

    $temp = WeatherService::getTemperature('London');
    
    $this->assertEquals(25, $temp);
}
```

## Testing JSON APIs

### API Response Testing
```php
public function test_api_returns_posts()
{
    $posts = Post::factory(3)->create();

    $response = $this->getJson('/api/posts');

    $response->assertStatus(200)
        ->assertJsonCount(3)
        ->assertJsonStructure([
            '*' => ['id', 'title', 'content', 'created_at'],
        ]);
}

public function test_api_validates_input()
{
    $response = $this->postJson('/api/posts', [
        'title' => '',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['title']);
}
```

## Test Coverage

### Generate Coverage Report
```bash
php artisan test --coverage
php artisan test --coverage --min=80
```

### Coverage Configuration
```php
// phpunit.xml
<coverage>
    <include>
        <directory suffix=".php">app</directory>
    </include>
    <exclude>
        <directory>app/Http/Controllers</directory>
    </exclude>
</coverage>
```

## Running Tests

### Run All Tests
```bash
php artisan test
php artisan test --parallel

# Specific test file
php artisan test tests/Feature/AuthTest.php

# Specific test method
php artisan test --filter=test_user_can_login
```

## Test Traits

### Common Assertions
```php
class TestCase extends BaseTestCase
{
    protected function signIn($user = null)
    {
        $user = $user ?? User::factory()->create();
        $this->actingAs($user);
        return $user;
    }

    protected function assertValidationError($response, $field)
    {
        $response->assertSessionHasErrors($field);
    }
}
```

## See Also
- [[test-factories-seeders]]
- [[debugging-monitoring]]
- [[api-testing]]
