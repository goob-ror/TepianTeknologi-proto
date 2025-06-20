<?php

use App\Models\User;
use Illuminate\Support\Facades\RateLimiter;

test('login is rate limited after 3 failed attempts', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('correct-password'),
    ]);

    // Make 3 failed login attempts
    for ($i = 0; $i < 3; $i++) {
        $response = $this->post('/login', [
            'email' => 'test@example.com',
            'password' => 'wrong-password',
        ]);
        
        $response->assertSessionHasErrors('email');
    }

    // The 4th attempt should be rate limited
    $response = $this->post('/login', [
        'email' => 'test@example.com',
        'password' => 'wrong-password',
    ]);

    $response->assertSessionHasErrors('email');
    expect($response->getSession()->get('errors')->get('email')[0])
        ->toContain('Too many login attempts');
});

test('successful login clears rate limiting', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('correct-password'),
        'email_verified_at' => now(), // Ensure email is verified
    ]);

    // Make 2 failed attempts
    for ($i = 0; $i < 2; $i++) {
        $this->post('/login', [
            'email' => 'test@example.com',
            'password' => 'wrong-password',
        ]);
    }

    // Successful login should clear the rate limiter
    $response = $this->post('/login', [
        'email' => 'test@example.com',
        'password' => 'correct-password',
    ]);

    $response->assertRedirect('/');

    // Should be able to make failed attempts again
    $response = $this->post('/login', [
        'email' => 'test@example.com',
        'password' => 'wrong-password',
    ]);

    $response->assertSessionHasErrors('email');
    expect($response->getSession()->get('errors')->get('email')[0])
        ->not->toContain('Too many login attempts');
});

test('rate limiting is per email and IP combination', function () {
    User::factory()->create([
        'email' => 'test1@example.com',
        'password' => bcrypt('password'),
    ]);

    User::factory()->create([
        'email' => 'test2@example.com',
        'password' => bcrypt('password'),
    ]);

    // Make 3 failed attempts for first email
    for ($i = 0; $i < 3; $i++) {
        $this->post('/login', [
            'email' => 'test1@example.com',
            'password' => 'wrong-password',
        ]);
    }

    // First email should be rate limited
    $response = $this->post('/login', [
        'email' => 'test1@example.com',
        'password' => 'wrong-password',
    ]);

    expect($response->getSession()->get('errors')->get('email')[0])
        ->toContain('Too many login attempts');

    // Second email should not be rate limited
    $response = $this->post('/login', [
        'email' => 'test2@example.com',
        'password' => 'wrong-password',
    ]);

    expect($response->getSession()->get('errors')->get('email')[0])
        ->not->toContain('Too many login attempts');
});
