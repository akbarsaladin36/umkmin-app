<?php

namespace App\Repositories;

use App\Interfaces\Repositories\SaleRepositoryInterface;
use Illuminate\Support\Facades\DB;

class SaleRepository implements SaleRepositoryInterface
{
    public function GetAll()
    {
        $sales = DB::table("sales")->get();
        return $sales;
    }

    public function GetPaginate($search, $page, $limit)
    {
        $query = DB::table("sales");
        if ($search) {
            $query->where(function ($a) use ($search) {
                $a->where("code", "like", "%" . $search . "%")->orWhere(
                    "invoice_no",
                    "like",
                    "%" . $search . "%",
                );
            });
        }
        $total = (clone $query)->count();
        $sales = $query
            ->orderBy("created_at", "desc")
            ->offset(($page - 1) * $limit)
            ->limit($limit)
            ->get();
        $last_page = ceil($total / $limit);
        $from = ($page - 1) * $limit + 1;
        $to = min($page * $limit, $total);
        $pagination = [
            "data" => $sales,
            "total" => $total,
            "per_page" => $limit,
            "current_page" => $page,
            "last_page" => $last_page,
            "from" => $from,
            "to" => $to,
        ];
        return $pagination;
    }

    public function GetPaginateByUser($username, $search, $page, $limit)
    {
        $query = DB::table("sales")->where("created_by_username", $username);
        if ($search) {
            $query->where(function ($a) use ($search) {
                $a->where("code", "like", "%" . $search . "%")->orWhere(
                    "invoice_no",
                    "like",
                    "%" . $search . "%",
                );
            });
        }
        $total = (clone $query)->count();
        $sales = $query
            ->orderBy("created_at", "desc")
            ->offset(($page - 1) * $limit)
            ->limit($limit)
            ->get();
        $last_page = ceil($total / $limit);
        $from = ($page - 1) * $limit + 1;
        $to = min($page * $limit, $total);
        $pagination = [
            "data" => $sales,
            "total" => $total,
            "per_page" => $limit,
            "current_page" => $page,
            "last_page" => $last_page,
            "from" => $from,
            "to" => $to,
        ];
        return $pagination;
    }

    public function GetSaleItems($saleCode)
    {
        $saleItems = DB::table("sale_items")
            ->where("sale_code", $saleCode)
            ->get();
        return $saleItems;
    }

    public function GetOne($saleCode)
    {
        $sale = DB::table("sales")->where("code", $saleCode)->first();
        return $sale;
    }

    public function Create(array $data)
    {
        $sale = DB::table("sales")->insert($data);
        return $sale;
    }

    public function CreateSaleItems(array $data)
    {
        $saleItem = DB::table("sale_items")->insert($data);
        return $saleItem;
    }

    public function Update($saleCode, array $data)
    {
        $sale = DB::table("sales")->where("code", $saleCode)->update($data);
        return $sale;
    }

    public function UpdateProduct($productCode, $qty)
    {
        $product = DB::table("products")
            ->where("code", $productCode)
            ->decrement("stock", $qty);
        return $product;
    }

    public function Delete($saleCode)
    {
        $sale = DB::table("sales")->where("code", $saleCode)->delete();
        return $sale;
    }

    public function DeleteSaleItem($saleCode)
    {
        $sale = DB::table("sale_items")
            ->where("sale_code", $saleCode)
            ->delete();
        return $sale;
    }
}
