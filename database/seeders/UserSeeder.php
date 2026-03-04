<?php

namespace Database\Seeders;

use App\Helper\Helper;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'username' => 'admin',
                'email' => 'admin@mail.com',
                'password' => 'admin',
                'role_id' => 1,
                'is_active' => 1
            ],
            [
                'username' => 'kasir2',
                'email' => 'kasir2@mail.com',
                'password' => 'kasir2',
                'role_id' => 2,
                'is_active' => 1
            ],
            [
                'username' => 'pengadaan1',
                'email' => 'pengadaan1@mail.com',
                'password' => 'pengadaan1',
                'role_id' => 3,
                'is_active' => 1
            ],
            [
                'username' => 'pengadaan2',
                'email' => 'pengadaan2@mail.com',
                'password' => 'pengadaan2',
                'role_id' => 3,
                'is_active' => 1
            ]
        ];

        $users = collect($data)->map(function($item){
            $uuid = Helper::GenerateUuid();
            return [
                'uuid' => $uuid,
                'username' => $item['username'],
                'email' => $item['email'],
                'password' => Hash::make($item['password']),
                'role_id' => $item['role_id'],
                'is_active' => 1,
                'created_at' => date("Y-m-d H:i:s"),
                'created_by' => $uuid,
                'created_by_username' => $item['username']
            ];
        })->toArray();

        DB::table('users')->insert($users);
    }
}
