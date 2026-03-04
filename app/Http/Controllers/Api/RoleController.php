<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Interfaces\Services\RoleServiceInterface;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    protected $roleService;

    public function __construct(RoleServiceInterface $roleService)
    {
        $this->roleService = $roleService;
    }

    public function GetRolesController()
    {
        return $this->roleService->GetRolesService();
    }

    public function GetRoleController($roleName)
    {
        return $this->roleService->GetRoleService($roleName);
    }

    public function CreateRoleController(Request $request)
    {
        return $this->roleService->CreateRoleService($request);
    }

    public function UpdateRoleController($roleName, Request $request)
    {
        return $this->roleService->UpdateRoleService($roleName, $request);
    }

    public function DeleteRoleController($roleName)
    {
        return $this->roleService->DeleteRoleService($roleName);
    }
}
