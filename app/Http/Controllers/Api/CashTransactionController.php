<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Interfaces\Services\CashTransactionServiceInterface;
use Illuminate\Http\Request;

class CashTransactionController extends Controller
{
    protected $cashTransactionService;

    public function __construct(
        CashTransactionServiceInterface $cashTransactionService,
    ) {
        $this->cashTransactionService = $cashTransactionService;
    }

    public function GetCashTransactionsController()
    {
        return $this->cashTransactionService->GetCashTransactionsService();
    }

    public function GetCashTransactionsPaginateController(Request $request)
    {
        return $this->cashTransactionService->GetCashTransactionsPaginateService(
            $request,
        );
    }

    public function GetCashTransactionController($cashTransactionCode)
    {
        return $this->cashTransactionService->GetCashTransactionService(
            $cashTransactionCode,
        );
    }

    public function CreateCashTransactionController(Request $request)
    {
        return $this->cashTransactionService->CreateCashTransactionService(
            $request,
        );
    }

    public function UpdateCashTransactionController(
        $cashTransactionCode,
        Request $request,
    ) {
        return $this->cashTransactionService->UpdateCashTransactionService(
            $cashTransactionCode,
            $request,
        );
    }

    public function DeleteCashTransactionController($cashTransactionCode)
    {
        return $this->cashTransactionService->DeleteCashTransactionService(
            $cashTransactionCode,
        );
    }
}
