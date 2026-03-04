<?php

namespace App\Interfaces\Repositories;

interface AuthRepositoryInterface
{
    public function GetOne($username);
    public function Create(array $data);
    public function CreateSession(array $data);
    public function DeleteSession($token);
}