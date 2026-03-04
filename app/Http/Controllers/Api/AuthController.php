<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Interfaces\Services\AuthServiceInterface;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthServiceInterface $authService)
    {
        $this->authService = $authService;
    }

    public function RegisterController(Request $request)
    {
        return $this->authService->RegisterService($request);
    }

    public function LoginController(Request $request)
    {
        return $this->authService->LoginService($request);
    }

    public function LogoutController(Request $request)
    {
        return $this->authService->LogoutService($request);
    }

    public function AuthUserController(Request $request)
    {
        return $this->authService->AuthUserService($request);
    }
}
