<?php

namespace App\Repositories;

use App\Interfaces\Repositories\AuthRepositoryInterface;
use Illuminate\Support\Facades\DB;

class AuthRepository implements AuthRepositoryInterface
{
    public function GetOne($username)
    {
        $user = DB::table('users')->where('username', $username)->first();
        return $user;
    }

    public function Create(array $data)
    {
        $user = DB::table('users')->insert($data);
        return $user;
    }

    public function GetSession($token)
    {
        $session = DB::table('sessions')->where('token', $token)->first();
        return $session;
    }
    
    public function CreateSession(array $data)
    {
        $session = DB::table('sessions')->insert($data);
        return $session;
    }

    public function DeleteSession($token)
    {
        $session = DB::table('sessions')->where('token', $token)->delete();
        return $session;
    }
}