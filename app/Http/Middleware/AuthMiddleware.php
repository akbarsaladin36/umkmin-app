<?php

namespace App\Http\Middleware;

use App\Helper\Helper;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        $token = $request->cookie('token');


        if(!$token) {
            return Helper::GetResponse(401, 'Unauthorized!');
        }

        $session = Helper::CheckSession($token);

        if(!$session) {
            return Helper::GetResponse(401, 'Session expired!');
        }

        $auth = json_decode($session->data);

        $request->attributes->set('auth', $auth);

        return $next($request);
    }
}
