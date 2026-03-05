<?php

namespace App\Interfaces\Services;

interface UserServiceInterface
{
    public function GetUsersService();
    public function GetUsersPaginateService($request);
    public function GetUsersByKasirService();
    public function GetUserService($username);
    public function CreateUserService($request);
    public function UpdateUserService($username, $request);
    public function DeleteUserService($username);
}
