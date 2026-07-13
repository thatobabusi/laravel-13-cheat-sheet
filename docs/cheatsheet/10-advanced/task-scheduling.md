# Task Scheduling

> Schedule tasks to run at specific intervals using cron expressions.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Advanced

## Define Scheduled Tasks

```php
// routes/console.php (L11+ — replaces App\Console\Kernel)
Schedule::call(fn() => DB::table('logs')->delete())->daily();
Schedule::command('inspire')->hourly()->withoutOverlapping();
Schedule::command('emails:send')->everyFiveMinutes()->runInBackground();
Schedule::job(new ProcessPodcast)->everyFifteenMinutes()->onQueue('default');
Schedule::exec('node /home/forge/script.js')->daily();
```

## Frequencies

```php
->everySecond()
->everyTwoSeconds()
->everyFiveSeconds()
->everyTenSeconds()
->everyThirtySeconds()
->everyMinute()
->everyTwoMinutes()
->everyFiveMinutes()
->everyTenMinutes()
->everyFifteenMinutes()
->everyThirtyMinutes()
->hourly()
->hourlyAt(17)                      // at :17 past each hour
->everyOddHour()
->everyTwoHours()
->daily()
->dailyAt('13:00')
->twiceDaily(1, 13)
->weeklyOn(Schedule::MONDAY, '8:00')
->monthly()
->monthlyOn(4, '15:00')
->quarterly()
->yearly()
->cron('* * * * *')                 // custom cron expression
```

## Constraints

```php
->weekdays()
->weekends()
->mondays()
->tuesdays()
->wednesdays()
->thursdays()
->fridays()
->saturdays()
->sundays()
->between('8:00', '17:00')
->unlessBetween('23:00', '4:00')
->when(fn() => Carbon::now()->day === 1)
->skip(fn() => Carbon::now()->isHoliday())
->environments(['production'])
->onOneServer()                     // only one server (requires cache driver)
```

## Output & Hooks

```php
->sendOutputTo('/tmp/out.log')
->appendOutputTo('/tmp/out.log')
->emailOutputTo('ops@example.com')
->emailOutputOnFailure('ops@example.com')

->before(fn() => logger('starting'))
->after(fn() => logger('done'))
->onSuccess(fn() => Notification::send(...))
->onFailure(fn() => Notification::send(...))
->pingBefore('https://healthcheck.io/ping/...')
->thenPing('https://healthcheck.io/ping/.../complete')
->withoutOverlapping()
->withoutOverlapping(10)            // lock expires in 10 min
->runInBackground()
```

## Running the Scheduler

```bash
php artisan schedule:run              # run due scheduled tasks
php artisan schedule:work             # run scheduler in foreground (local dev)
php artisan schedule:list
```

---

**See Also:** [[jobs-queues]] | [[artisan]]
