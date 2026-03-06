<?php

namespace App\Interfaces\Repositories;

interface SupplierRepositoryInterface
{
    public function GetAll();
    public function GetPaginate($search, $page, $limit);
    public function GetOne($supplierCode);
    public function Create(array $data);
    public function Update($supplierCode, array $data);
    public function Delete($supplierCode);
}
