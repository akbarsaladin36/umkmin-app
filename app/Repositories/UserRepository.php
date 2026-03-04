<?php

namespace App\Repositories;

use App\Interfaces\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;

class UserRepository implements UserRepositoryInterface
{
    public function GetAll()
    {
        $users = DB::table('users')->get();
        return $users;
    }

    public function GetPaginate($search, $page, $limit)
    {
        $query = DB::table('users');
        if($search) {
            $query->where(function($a) use($search) {
                $a->where('username', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%');
            });
        }
        $total = (clone $query)->count();
        $users = $query->orderBy('created_at', 'desc')
                       ->offset(($page - 1) * $limit)
                       ->limit($limit)
                       ->get();
        $last_page = ceil($total / $limit);
        $from = ($page - 1) * $limit + 1;
        $to = min($page * $limit, $total);
        $pagination = [
            'data' => $users,
            'total' => $total,
            'per_page' => $limit,
            'current_page' => $page,
            'last_page' => $last_page,
            'from' => $from,
            'to' => $to,
        ];
        return $pagination;
    }

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

    public function Update($username, array $data)
    {
        $user = DB::table('users')->where('username', $username)->update($data);
        return $user;
    }

    public function Delete($username)
    {
        $user = DB::table('users')->where('username', $username)->delete();
        return $user;
    }
}