<?php

use App\enum\UserRole;
use App\Models\User;

/**
 * Create a user with the 'user' role for testing
 */
function createUserWithUserRole(): User
{
    return User::factory()->create([
        'role' => UserRole::user->value,
    ]);
}

/**
 * Create a user with the 'admin' role for testing
 */
function createUserWithAdminRole(): User
{
    return User::factory()->create([
        'role' => UserRole::admin->value,
    ]);
}
