<?php

namespace App\Interfaces\Services;

interface CashTransactionServiceInterface
{
    public function GetCashTransactionsService();
    public function GetCashTransactionService($cashTransactionCode);
    public function CreateCashTransactionService($request);
    public function UpdateCashTransactionService($cashTransactionCode, $request);
    public function DeleteCashTransactionService($cashTransactionCode);
}