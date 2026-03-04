<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Interfaces\Services\SaleServiceInterface;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    protected $saleService;

    public function __construct(SaleServiceInterface $saleService)
    {
        $this->saleService = $saleService;
    }

    public function GetSalesController()
    {
        return $this->saleService->GetSalesService();
    }

    public function GetSaleController($saleCode)
    {
        return $this->saleService->GetSaleService($saleCode);
    }

    public function CreateSaleController(Request $request)
    {
        return $this->saleService->CreateSaleService($request);
    }

    public function UpdateSaleController($saleCode, Request $request)
    {
        return $this->saleService->UpdateSaleService($saleCode, $request);
    }

    public function DeleteSaleController($saleCode)
    {
        return $this->saleService->DeleteSaleService($saleCode);
    }
}
