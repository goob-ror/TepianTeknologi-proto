<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

class HandleAppearance
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if this is an admin route
        $isAdminRoute = $request->is('admin/*') || $request->is('admin');

        if ($isAdminRoute) {
            // Admin pages are always in dark mode
            View::share('appearance', 'dark');
        } else {
            // Regular pages use the user's preference
            View::share('appearance', $request->cookie('appearance') ?? 'system');
        }

        return $next($request);
    }
}
