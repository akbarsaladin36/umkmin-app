<?php

namespace App\Interfaces\Services;

interface PurchaseServiceInterface
{
    public function GetPurchasesService();
    public function GetPurchasesPaginateService($request);
    public function GetPurchaseService($purchaseCode);
    public function CreatePurchaseService($request);
    public function UpdatePurchaseService($purchaseCode, $request);
    public function DeletePurchaseService($purchaseCode);
}
