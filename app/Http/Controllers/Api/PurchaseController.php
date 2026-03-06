<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Interfaces\Services\PurchaseServiceInterface;
use Illuminate\Http\Request;

class PurchaseController extends Controller
{
    protected $purchaseService;

    public function __construct(PurchaseServiceInterface $purchaseService)
    {
        $this->purchaseService = $purchaseService;
    }

    public function GetPurchasesController()
    {
        return $this->purchaseService->GetPurchasesService();
    }

    public function GetPurchasesPaginateController(Request $request)
    {
        return $this->purchaseService->GetPurchasesPaginateService($request);
    }

    public function GetPurchaseController($purchaseCode)
    {
        return $this->purchaseService->GetPurchaseService($purchaseCode);
    }

    public function CreatePurchaseController(Request $request)
    {
        return $this->purchaseService->CreatePurchaseService($request);
    }

    public function UpdatePurchaseController($purchaseCode, Request $request)
    {
        return $this->purchaseService->UpdatePurchaseService(
            $purchaseCode,
            $request,
        );
    }

    public function DeletePurchaseController($purchaseCode)
    {
        return $this->purchaseService->DeletePurchaseService($purchaseCode);
    }
}
