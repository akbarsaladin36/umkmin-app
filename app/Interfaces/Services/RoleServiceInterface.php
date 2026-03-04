<?php

namespace App\Interfaces\Services;

interface RoleServiceInterface
{
    public function GetRolesService();
    public function GetRoleService($roleName);
    public function CreateRoleService($request);
    public function UpdateRoleService($roleName, $request);
    public function DeleteRoleService($roleName);
}