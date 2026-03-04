<?php

namespace App\Interfaces\Repositories;

interface ProductRepositoryInterface
{
    public function GetAll();
    public function GetPaginate($search, $page, $limit);
    public function GetOne($productCode);
    public function Create(array $data);
    public function Update($productCode, array $data);
    public function Delete($productCode);
}
