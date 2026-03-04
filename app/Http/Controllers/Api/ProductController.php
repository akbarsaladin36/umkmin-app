<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Interfaces\Services\ProductServiceInterface;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductServiceInterface $productService)
    {
        $this->productService = $productService;
    }

    public function GetProductsController()
    {
        return $this->productService->GetProductsService();
    }

    public function GetProductsPaginateController(Request $request)
    {
        return $this->productService->GetProductsPaginateService($request);
    }

    public function GetProductController($productCode)
    {
        return $this->productService->GetProductService($productCode);
    }

    public function CreateProductController(Request $request)
    {
        return $this->productService->CreateProductService($request);
    }

    public function UpdateProductController($productCode, Request $request)
    {
        return $this->productService->UpdateProductService(
            $productCode,
            $request,
        );
    }

    public function DeleteProductController($productCode)
    {
        return $this->productService->DeleteProductService($productCode);
    }
}
