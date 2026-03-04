<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Interfaces\Services\SaleItemServiceInterface;

class SaleItemController extends Controller
{
    protected $saleItemService;

    public function __construct(SaleItemServiceInterface $saleItemService)
    {
        $this->saleItemService = $saleItemService;
    }

    public function GetSaleItemsBySaleCodeController($saleCode)
    {
        return $this->saleItemService->GetSaleItemsBySaleCodeService($saleCode);
    }

    public function GetSaleItemController($saleItemCode)
    {
        return $this->saleItemService->GetSaleItemService($saleItemCode);
    }

    public function DeleteSaleItemController($saleItemCode)
    {
        return $this->saleItemService->DeleteSaleItemService($saleItemCode);
    }
}
