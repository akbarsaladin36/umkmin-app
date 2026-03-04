<?php

namespace App\Interfaces\Services;

interface SaleItemServiceInterface
{
    public function GetSaleItemsBySaleCodeService($saleCode);
    public function GetSaleItemService($saleItemCode);
    public function DeleteSaleItemService($saleItemCode);
}