<?php

namespace App\Repositories;

use App\Interfaces\Repositories\ProductRepositoryInterface;
use Illuminate\Support\Facades\DB;

class ProductRepository implements ProductRepositoryInterface
{
    public function GetAll()
    {
        $products = DB::table("products")->get();
        return $products;
    }

    public function GetPaginate($search, $page, $limit)
    {
        $query = DB::table("products");
        if ($search) {
            $query->where(function ($a) use ($search) {
                $a->where("code", "like", "%" . $search . "%")
                    ->orWhere("name", "like", "%" . $search . "%")
                    ->orWhere("barcode", "like", "%" . $search . "%");
            });
        }
        $total = (clone $query)->count();
        $categories = $query
            ->orderBy("created_at", "desc")
            ->offset(($page - 1) * $limit)
            ->limit($limit)
            ->get();
        $last_page = ceil($total / $limit);
        $from = ($page - 1) * $limit + 1;
        $to = min($page * $limit, $total);
        $pagination = [
            "data" => $categories,
            "total" => $total,
            "per_page" => $limit,
            "current_page" => $page,
            "last_page" => $last_page,
            "from" => $from,
            "to" => $to,
        ];
        return $pagination;
    }

    public function GetOne($productCode)
    {
        $product = DB::table("products")->where("code", $productCode)->first();
        return $product;
    }

    public function Create(array $data)
    {
        $product = DB::table("products")->insert($data);
        return $product;
    }

    public function Update($productCode, array $data)
    {
        $product = DB::table("products")
            ->where("code", $productCode)
            ->update($data);
        return $product;
    }

    public function Delete($productCode)
    {
        $product = DB::table("products")->where("code", $productCode)->delete();
        return $product;
    }
}
