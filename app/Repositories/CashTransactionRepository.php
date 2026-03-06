<?php

namespace App\Repositories;

use App\Interfaces\Repositories\CashTransactionRepositoryInterface;
use Illuminate\Support\Facades\DB;

class CashTransactionRepository implements CashTransactionRepositoryInterface
{
    public function GetAll()
    {
        $cashTransactions = DB::table("cash_transactions")->get();
        return $cashTransactions;
    }

    public function GetPaginate($search, $page, $limit)
    {
        $query = DB::table("cash_transactions");
        if ($search) {
            $query->where(function ($a) use ($search) {
                $a->where("code", "like", "%" . $search . "%")->orWhere(
                    "description",
                    "like",
                    "%" . $search . "%",
                );
            });
        }
        $total = (clone $query)->count();
        $cashTransactions = $query
            ->orderBy("created_at", "desc")
            ->offset(($page - 1) * $limit)
            ->limit($limit)
            ->get();
        $last_page = ceil($total / $limit);
        $from = ($page - 1) * $limit + 1;
        $to = min($page * $limit, $total);
        $pagination = [
            "data" => $cashTransactions,
            "total" => $total,
            "per_page" => $limit,
            "current_page" => $page,
            "last_page" => $last_page,
            "from" => $from,
            "to" => $to,
        ];
        return $pagination;
    }

    public function GetOne($cashTransactionCode)
    {
        $cashTransaction = DB::table("cash_transactions")
            ->where("code", $cashTransactionCode)
            ->first();
        return $cashTransaction;
    }

    public function Create(array $data)
    {
        $cashTransaction = DB::table("cash_transactions")->insert($data);
        return $cashTransaction;
    }

    public function Update($cashTransactionCode, array $data)
    {
        $cashTransaction = DB::table("cash_transactions")
            ->where("code", $cashTransactionCode)
            ->update($data);
        return $cashTransaction;
    }

    public function Delete($cashTransactionCode)
    {
        $cashTransaction = DB::table("cash_transactions")
            ->where("code", $cashTransactionCode)
            ->delete();
        return $cashTransaction;
    }
}
