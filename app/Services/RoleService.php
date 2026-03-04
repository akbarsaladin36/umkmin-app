<?php

namespace App\Services;

use App\Helper\Helper;
use App\Interfaces\Repositories\RoleRepositoryInterface;
use App\Interfaces\Services\RoleServiceInterface;
use Throwable;

class RoleService implements RoleServiceInterface
{
    protected $roleRepository;

    public function __construct(RoleRepositoryInterface $roleRepository)
    {
        $this->roleRepository = $roleRepository;
    }

    public function GetRolesService()
    {
        try {
            $roles = $this->roleRepository->GetAll();
            if(count($roles) > 0) {
                return Helper::GetResponse(200, 'All roles are succesfully appeared!', $roles);
            } else {
                return Helper::GetResponse(400, 'All roles are empty!');
            }
        } catch(Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function GetRoleService($roleName)
    {
        try {
            $role = $this->roleRepository->GetOne($roleName);
            if($role) {
                return Helper::GetResponse(200, 'A role data is succesfully appeared!', $role);
            } else {
                return Helper::GetResponse(400, 'A role data is not found!');
            }
        } catch(Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function CreateRoleService($request)
    {
        try {
            $role = $this->roleRepository->GetOne($request->name);
            if($role) {
                return Helper::GetResponse(400, 'A role data is registered!');
            } else {
                $authUser = Helper::GetAuthUser($request);
                $data = [
                    'name' => $request->name,
                    'description' => $request->description,
                    'created_at' => date("Y-m-d H:i:s"),
                    'created_by' => $authUser->uuid,
                    'created_by_username' => $authUser->username
                ];
                $this->roleRepository->Create($data);
                return Helper::GetResponse(200, 'A new role is succesfully created!', $data);
            }
        } catch(Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function UpdateRoleService($roleName, $request)
    {
        try {
            $role = $this->roleRepository->GetOne($roleName);
            if($role) {
                $authUser = Helper::GetAuthUser($request);
                $data = [
                    'name' => $request->name ? $request->name : $role->name,
                    'description' => $request->description ? $request->description : $role->description,
                    'updated_at' => date("Y-m-d H:i:s"),
                    'updated_by' => $authUser->uuid,
                    'updated_by_username' => $authUser->username
                ];
                $this->roleRepository->Update($roleName, $data);
                return Helper::GetResponse(200, 'An existing role is succesfully updated!', $data);
            } else {
                return Helper::GetResponse(400, 'A role data is not found!');
            }
        } catch(Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function DeleteRoleService($roleName)
    {
        try {
            $role = $this->roleRepository->GetOne($roleName);
            if($role) {
                $this->roleRepository->Delete($roleName);
                return Helper::GetResponse(200, 'A role data is succesfully deleted!');
            } else {
                return Helper::GetResponse(400, 'A role data is not found!');
            }
        } catch(Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }
}