<?php

namespace App\Repositories;

use App\Interfaces\Repositories\SupplierRepositoryInterface;
use Illuminate\Support\Facades\DB;

class SupplierRepository implements SupplierRepositoryInterface
{
    public function GetAll()
    {
        $suppliers = DB::table('suppliers')->get();
        return $suppliers;
    }

    public function GetOne($supplierCode)
    {
        $supplier = DB::table('suppliers')->where('code', $supplierCode)->first();
        return $supplier;
    }

    public function Create(array $data)
    {
        $supplier = DB::table('suppliers')->insert($data);
        return $supplier;
    }

    public function Update($supplierCode, array $data)
    {
        $supplier = DB::table('suppliers')->where('code', $supplierCode)->update($data);
        return $supplier;
    }

    public function Delete($supplierCode)
    {
        $supplier = DB::table('suppliers')->where('code', $supplierCode)->delete();
        return $supplier;
    }
}