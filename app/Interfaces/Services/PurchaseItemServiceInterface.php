<?php

namespace App\Interfaces\Services;

interface PurchaseItemServiceInterface
{
    public function GetPurchaseItemsByPurchaseCodeService($purchaseCode);
    public function DeletePurchaseItemsService($purchaseItemCode);
}