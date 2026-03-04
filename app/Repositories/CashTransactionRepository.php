<?php

namespace App\Repositories;

use App\Interfaces\Repositories\CashTransactionRepositoryInterface;
use Illuminate\Support\Facades\DB;

class CashTransactionRepository implements CashTransactionRepositoryInterface
{
    public function GetAll()
    {
        $cashTransactions = DB::table('cash_transactions')->get();
        return $cashTransactions;
    }

    public function GetOne($cashTransactionCode)
    {
        $cashTransaction = DB::table('cash_transactions')->where('code', $cashTransactionCode)->first();
        return $cashTransaction;
    }

    public function Create(array $data)
    {
        $cashTransaction = DB::table('cash_transactions')->insert($data);
        return $cashTransaction;
    }

    public function Update($cashTransactionCode, array $data)
    {
        $cashTransaction = DB::table('cash_transactions')->where('code', $cashTransactionCode)->update($data);
        return $cashTransaction;
    }

    public function Delete($cashTransactionCode)
    {
        $cashTransaction = DB::table('cash_transactions')->where('code', $cashTransactionCode)->delete();
        return $cashTransaction;
    }
}