<?php

namespace App\Repositories;

use App\Interfaces\Repositories\PurchaseItemRepositoryInterface;
use Illuminate\Support\Facades\DB;

class PurchaseItemRepository implements PurchaseItemRepositoryInterface
{
    public function GetByPurchaseCode($purchaseCode)
    {
        $purchaseItems = DB::table('purchase_items')->where('purchase_code', $purchaseCode)->get();
        return $purchaseItems;
    }

    public function GetOne($purchaseItemCode)
    {
        $purchaseItem = DB::table('purchase_items')->where('code', $purchaseItemCode)->first();
        return $purchaseItem;
    }
    
    public function GetPurchaseCode($purchaseCode)
    {
        $purchase = DB::table('purchases')->where('code', $purchaseCode)->first();
        return $purchase;
    }

    public function UpdatePurchaseTotalAmount($purchaseCode, $totalAmount) {
        $purchase = DB::table('purchases')->where('code', $purchaseCode)->decrement('total_amount', $totalAmount);
    }

    public function Delete($purchaseItemCode)
    {
        $purchaseItem = DB::table('purchase_items')->where('code', $purchaseItemCode)->delete();
        return $purchaseItem;
    }
}