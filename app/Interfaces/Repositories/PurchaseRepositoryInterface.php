<?php

namespace App\Interfaces\Repositories;

interface PurchaseRepositoryInterface
{
    public function GetAll();
    public function GetPaginate($search, $page, $limit);
    public function GetPurchaseItemsByPurchaseCode($purchaseCode);
    public function GetOne($purchaseCode);
    public function Create(array $data);
    public function CreatePurchaseItem(array $data);
    public function Update($purchaseCode, array $data);
    public function UpdateProduct($productCode, $qty);
    public function Delete($purchaseCode);
    public function DeletePurchaseItem($purchaseCode);
}
