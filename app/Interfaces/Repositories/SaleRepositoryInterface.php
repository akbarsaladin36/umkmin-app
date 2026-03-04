<?php

namespace App\Interfaces\Repositories;

interface SaleRepositoryInterface
{
    public function GetAll();
    public function GetSaleItems($saleCode);
    public function GetOne($saleCode);
    public function Create(array $data);
    public function CreateSaleItems(array $data);
    public function Update($saleCode, array $data);
    public function UpdateProduct($productCode, $qty);
    public function Delete($saleCode);
    public function DeleteSaleItem($saleCode);
}