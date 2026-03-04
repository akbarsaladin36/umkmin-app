<?php

namespace App\Interfaces\Repositories;

interface RoleRepositoryInterface
{
    public function GetAll();
    public function GetOne($roleName);
    public function Create(array $data);
    public function Update($roleName, array $data);
    public function Delete($roleName);
}