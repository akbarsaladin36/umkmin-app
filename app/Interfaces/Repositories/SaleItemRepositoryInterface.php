<?php

namespace App\Interfaces\Repositories;

interface SaleItemRepositoryInterface
{
    public function GetBySaleCode($saleCode);
    public function GetOneBySaleCode($saleCode);
    public function GetOne($saleItemId);
    public function Create(array $data);
    public function Delete($saleItemid);
}