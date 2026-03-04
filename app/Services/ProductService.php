<?php

namespace App\Services;

use App\Helper\Helper;
use App\Interfaces\Repositories\ProductRepositoryInterface;
use App\Interfaces\Services\ProductServiceInterface;
use Throwable;

class ProductService implements ProductServiceInterface
{
    protected $productRepository;

    public function __construct(ProductRepositoryInterface $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function GetProductsPaginateService($request)
    {
        try {
            $search = $request->search ? $request->search : null;
            $page = $request->page ? $request->page : 1;
            $limit = $request->limit ? $request->limit : 5;
            $page = max((int) $page, 1);
            $limit = max((int) $limit, 1);
            $products = $this->productRepository->GetPaginate(
                $search,
                $page,
                $limit,
            );
            if ($products["total"] > 0) {
                return Helper::GetResponse(
                    200,
                    "All products data are succesfully appeared!",
                    $products,
                );
            } else {
                return Helper::GetResponse(400, "All products data are empty!");
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function GetProductsService()
    {
        try {
            $products = $this->productRepository->GetAll();
            if (count($products) > 0) {
                return Helper::GetResponse(
                    200,
                    "All products are succesfully appeared!",
                    $products,
                );
            } else {
                return Helper::GetResponse(400, "All products are empty!");
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function GetProductService($productCode)
    {
        try {
            $product = $this->productRepository->GetOne($productCode);
            if ($product) {
                return Helper::GetResponse(
                    200,
                    "A product data is succesfully appeared!",
                    $product,
                );
            } else {
                return Helper::GetResponse(400, "A product data is not found!");
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function CreateProductService($request)
    {
        try {
            $productCode = Helper::GenerateCode("products");
            $product = $this->productRepository->GetOne($productCode);
            if ($product) {
                return Helper::GetResponse(
                    400,
                    "A product data is registered!",
                );
            } else {
                $authUser = Helper::GetAuthUser($request);
                $productBarcode = Helper::GenerateCode("products-barcode");
                $data = [
                    "category_id" => $request->category_id,
                    "code" => $productCode,
                    "name" => $request->name,
                    "barcode" => $productBarcode,
                    "cost_price" => $request->cost_price,
                    "selling_price" => $request->selling_price,
                    "stock" => $request->stock,
                    "min_stock" => $request->min_stock,
                    "created_at" => date("Y-m-d H:i:s"),
                    "created_by" => $authUser->uuid,
                    "created_by_username" => $authUser->username,
                ];
                $this->productRepository->Create($data);
                return Helper::GetResponse(
                    200,
                    "A new product data is succesfully registered!",
                    $data,
                );
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function UpdateProductService($productCode, $request)
    {
        try {
            $product = $this->productRepository->GetOne($productCode);
            if ($product) {
                $authUser = Helper::GetAuthUser($request);
                $data = [
                    "category_id" => $request->category_id
                        ? $request->category_id
                        : $product->category_id,
                    "name" => $request->name ? $request->name : $product->name,
                    "cost_price" => $request->cost_price
                        ? $request->cost_price
                        : $product->cost_price,
                    "selling_price" => $request->selling_price
                        ? $request->selling_price
                        : $product->selling_price,
                    "stock" => $request->stock
                        ? $request->stock
                        : $product->stock,
                    "min_stock" => $request->min_stock
                        ? $request->min_stock
                        : $product->min_stock,
                    "updated_at" => date("Y-m-d H:i:s"),
                    "updated_by" => $authUser->uuid,
                    "updated_by_username" => $authUser->username,
                ];
                $this->productRepository->Update($productCode, $data);
                return Helper::GetResponse(
                    200,
                    "A product data is succesfully updated!",
                    $data,
                );
            } else {
                return Helper::GetResponse(400, "A product data is not found!");
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function DeleteProductService($productCode)
    {
        try {
            $product = $this->productRepository->GetOne($productCode);
            if ($product) {
                $this->productRepository->Delete($productCode);
                return Helper::GetResponse(
                    200,
                    "A product data is succesfully deleted!",
                );
            } else {
                return Helper::GetResponse(400, "A product data is not found!");
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }
}
