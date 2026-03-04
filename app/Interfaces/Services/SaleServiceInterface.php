<?php

namespace App\Interfaces\Services;

interface SaleServiceInterface
{
    public function GetSalesService();
    public function GetSaleService($saleCode);
    public function CreateSaleService($request);
    public function UpdateSaleService($saleCode, $request);
    public function DeleteSaleService($saleCode);

}