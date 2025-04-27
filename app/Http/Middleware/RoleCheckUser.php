<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\enum\UserRole;

class RoleCheckUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        if(auth()->check() && auth()->user()->role === UserRole::user) {
            return $next($request);
        }
        abort(403, 'You Are Not Recognized!');
    }
}
