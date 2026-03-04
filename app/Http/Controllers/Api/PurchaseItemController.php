<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Interfaces\Services\PurchaseItemServiceInterface;

class PurchaseItemController extends Controller
{
    protected $purchaseItemService;

    public function __construct(PurchaseItemServiceInterface $purchaseItemService)
    {
        $this->purchaseItemService = $purchaseItemService;
    }

    public function GetPurchaseItemsByPurchaseCodeController($purchaseCode)
    {
        return $this->purchaseItemService->GetPurchaseItemsByPurchaseCodeService($purchaseCode);
    }

    public function DeletePurchaseItemController($purchaseCodeItems)
    {
        return $this->purchaseItemService->DeletePurchaseItemsService($purchaseCodeItems);
    }
}
