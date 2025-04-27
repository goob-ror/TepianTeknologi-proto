<?php

namespace App\Http\Middleware;

use App\enum\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleCheckAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        
        if(auth()->check() && auth()->user()->role === UserRole::admin) {
            return $next($request);
        }
        abort(403, "Unauthorized Access!");
    }
}
