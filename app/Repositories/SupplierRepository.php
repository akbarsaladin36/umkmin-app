<?php

namespace App\Repositories;

use App\Interfaces\Repositories\SupplierRepositoryInterface;
use Illuminate\Support\Facades\DB;

class SupplierRepository implements SupplierRepositoryInterface
{
    public function GetAll()
    {
        $suppliers = DB::table("suppliers")->get();
        return $suppliers;
    }

    public function GetPaginate($search, $page, $limit)
    {
        $query = DB::table("suppliers");
        if ($search) {
            $query->where(function ($a) use ($search) {
                $a->where("code", "like", "%" . $search . "%")->orWhere(
                    "name",
                    "like",
                    "%" . $search . "%",
                );
            });
        }
        $total = (clone $query)->count();
        $suppliers = $query
            ->orderBy("created_at", "desc")
            ->offset(($page - 1) * $limit)
            ->limit($limit)
            ->get();
        $last_page = ceil($total / $limit);
        $from = ($page - 1) * $limit + 1;
        $to = min($page * $limit, $total);
        $pagination = [
            "data" => $suppliers,
            "total" => $total,
            "per_page" => $limit,
            "current_page" => $page,
            "last_page" => $last_page,
            "from" => $from,
            "to" => $to,
        ];
        return $pagination;
    }

    public function GetOne($supplierCode)
    {
        $supplier = DB::table("suppliers")
            ->where("code", $supplierCode)
            ->first();
        return $supplier;
    }

    public function Create(array $data)
    {
        $supplier = DB::table("suppliers")->insert($data);
        return $supplier;
    }

    public function Update($supplierCode, array $data)
    {
        $supplier = DB::table("suppliers")
            ->where("code", $supplierCode)
            ->update($data);
        return $supplier;
    }

    public function Delete($supplierCode)
    {
        $supplier = DB::table("suppliers")
            ->where("code", $supplierCode)
            ->delete();
        return $supplier;
    }
}
