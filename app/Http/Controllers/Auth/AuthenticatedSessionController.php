<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use App\Enum\UserRole;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        // Check if there's an email in the session to check rate limiting
        $email = $request->session()->get('login_email', '');
        $rateLimitSeconds = 0;

        if ($email) {
            // Create the same throttle key as in LoginRequest
            $throttleKey = Str::transliterate(Str::lower($email).'|'.$request->ip());

            // Check if rate limited and get remaining seconds
            if (RateLimiter::tooManyAttempts($throttleKey, 3)) {
                $rateLimitSeconds = RateLimiter::availableIn($throttleKey);
            }
        }

        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
            'role' => $request->session()->get('role'),
            'rateLimitSeconds' => $rateLimitSeconds,
            'rateLimitEmail' => $email,
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();

        if ($user->role === UserRole::admin) {
            return redirect()->intended(route('admin.dashboard', absolute: false));
        }

        if ($user->role === UserRole::user) {
            return redirect()->intended('/');
        }

        abort(403, 'Unauthorized User!');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
