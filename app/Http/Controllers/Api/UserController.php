<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Interfaces\Services\UserServiceInterface;
use Illuminate\Http\Request;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserServiceInterface $userService)
    {
        $this->userService = $userService;
    }

    public function GetUsersController()
    {
        return $this->userService->GetUsersService();
    }

    public function GetUsersPaginateController(Request $request)
    {
        return $this->userService->GetUsersPaginateService($request);
    }

    public function GetUserController($username)
    {
        return $this->userService->GetUserService($username);
    }

    public function CreateUserController(Request $request)
    {
        return $this->userService->CreateUserService($request);
    }

    public function UpdateUserController($username, Request $request)
    {
        return $this->userService->UpdateUserService($username, $request);
    }

    public function DeleteUserController($username)
    {
        return $this->userService->DeleteUserService($username);
    }
}
