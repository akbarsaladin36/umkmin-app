<?php

namespace App\Interfaces\Services;

interface AuthServiceInterface
{
    public function RegisterService($request);
    public function LoginService($request);
    public function LogoutService($request);
    public function AuthUserService($request);
}