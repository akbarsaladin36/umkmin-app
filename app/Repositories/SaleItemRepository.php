<?php

namespace App\Repositories;

use App\Interfaces\Repositories\SaleItemRepositoryInterface;
use Illuminate\Support\Facades\DB;

class SaleItemRepository implements SaleItemRepositoryInterface
{
    public function GetBySaleCode($saleCode)
    {
        $saleItems = DB::table('sale_items')->where('sale_code', $saleCode)->get();
        return $saleItems;
    }

    public function GetOneBySaleCode($saleCode)
    {
        $sales = DB::table('sales')->where('code', $saleCode)->first();
        return $sales;
    }

    public function GetOne($saleItemCode)
    {
        $saleItem = DB::table('sale_items')->where('sale_item_code', $saleItemCode)->first();
        return $saleItem;
    }

    public function Create(array $data)
    {
        $saleItem = DB::table('sale_items')->insert($data);
        return $saleItem;
    }

    public function Delete($saleItemCode)
    {
        $saleItem = DB::table('sale_items')->where('sale_item_code', $saleItemCode)->delete();
        return $saleItem;
    }
}