<?php

namespace App\Interfaces\Repositories;

interface UserRepositoryInterface
{
    public function GetAll();
    public function GetPaginate($search, $page, $limit);
    public function GetOne($username);
    public function Create(array $data);
    public function Update($username, array $data);
    public function Delete($username);
}