<?php

namespace App\Interfaces\Repositories;

interface PurchaseItemRepositoryInterface
{
    public function GetByPurchaseCode($purchaseCode);
    public function GetOne($purchaseItemCode);
    public function GetPurchaseCode($purchaseCode);
    public function UpdatePurchaseTotalAmount($purchaseCode, $totalAmount);
    public function Delete($purchaseItemCode);
}