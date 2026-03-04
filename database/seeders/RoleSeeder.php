<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'name' => 'Admin',
                'description' => 'Role admin',
                'created_at' => date("Y-m-d H:i:s")
            ],
            [
                'name' => 'Kasir',
                'description' => 'Role kasir',
                'created_at' => date("Y-m-d H:i:s")
            ],
            [
                'name' => 'Pengadaan',
                'description' => 'Role pengadaan',
                'created_at' => date("Y-m-d H:i:s")
            ],
        ];
        DB::table('roles')->insert($data);
    }
}
