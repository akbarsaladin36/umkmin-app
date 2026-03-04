<?php

namespace App\Repositories;

use App\Interfaces\Repositories\PurchaseRepositoryInterface;
use Illuminate\Support\Facades\DB;

class PurchaseRepository implements PurchaseRepositoryInterface
{
    public function GetAll()
    {
        $purchases = DB::table('purchases')->get();
        return $purchases;
    }

    public function GetPurchaseItemsByPurchaseCode($purchaseCode)
    {
        $purchaseItems = DB::table('purchase_items')->where('purchase_code', $purchaseCode)->get();
        return $purchaseItems;
    }

    public function GetOne($purchaseCode)
    {
        $purchase = DB::table('purchases')->where('code', $purchaseCode)->first();
        return $purchase;
    }

    public function Create(array $data)
    {
        $purchase = DB::table('purchases')->insert($data);
        return $purchase;
    }

    public function CreatePurchaseItem(array $data)
    {
        $purchaseItem = DB::table('purchase_items')->insert($data);
        return $purchaseItem;
    }

    public function Update($purchaseCode, array $data)
    {
        $purchase = DB::table('purchases')->where('code', $purchaseCode)->update($data);
        return $purchase;
    }

    public function UpdateProduct($productCode, $qty)
    {
        $product = DB::table('products')->where('code', $productCode)->increment('stock', $qty);
        return $product;
    }

    public function Delete($purchaseCode)
    {
        $purchase = DB::table('purchases')->where('code', $purchaseCode)->delete();
        return $purchase;
    }

    public function DeletePurchaseItem($purchaseCode)
    {
        $purchaseItem = DB::table('purchase_items')->where('purchase_code', $purchaseCode)->delete();
        return $purchaseItem;
    }
}