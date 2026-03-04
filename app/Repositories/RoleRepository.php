<?php

namespace App\Repositories;

use App\Interfaces\Repositories\RoleRepositoryInterface;
use Illuminate\Support\Facades\DB;

class RoleRepository implements RoleRepositoryInterface
{
    public function GetAll()
    {
        $roles = DB::table('roles')->get();
        return $roles;
    }

    public function GetOne($roleName)
    {
        $role = DB::table('roles')->where('name', $roleName)->first();
        return $role;
    }

    public function Create(array $data)
    {
        $role = DB::table('roles')->insert($data);
        return $role;
    }

    public function Update($roleName, array $data)
    {
        $role = DB::table('roles')->where('name', $roleName)->update($data);
        return $role;
    }

    public function Delete($roleName)
    {
        $role = DB::table('roles')->where('name', $roleName)->delete();
        return $role;
    }
}