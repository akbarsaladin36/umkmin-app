<?php

namespace App\Interfaces\Services;

interface ProductServiceInterface
{
    public function GetProductsService();
    public function GetProductsPaginateService($request);
    public function GetProductService($productCode);
    public function CreateProductService($request);
    public function UpdateProductService($productCode, $request);
    public function DeleteProductService($productCode);
}
