<?php

namespace Thatobabusi\LaravelCheatSheet;

use Illuminate\Support\ServiceProvider;

class LaravelCheatSheetServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->publishDocs();
        }
    }

    private function publishDocs(): void
    {
        $this->publishes([
            __DIR__ . '/../docs' => base_path('docs'),
        ], 'laravel13-cheatsheet');
    }
}
