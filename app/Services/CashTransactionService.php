<?php

namespace App\Services;

use App\Helper\Helper;
use App\Interfaces\Repositories\CashTransactionRepositoryInterface;
use App\Interfaces\Services\CashTransactionServiceInterface;
use Throwable;

class CashTransactionService implements CashTransactionServiceInterface
{
    protected $cashTransactionRepository;

    public function __construct(
        CashTransactionRepositoryInterface $cashTransactionRepository,
    ) {
        $this->cashTransactionRepository = $cashTransactionRepository;
    }

    public function GetCashTransactionsService()
    {
        try {
            $cashTransactions = $this->cashTransactionRepository->GetAll();
            if (count($cashTransactions) > 0) {
                return Helper::GetResponse(
                    200,
                    "All cash transactions data are succesfully appeared!",
                    $cashTransactions,
                );
            } else {
                return Helper::GetResponse(
                    400,
                    "All cash transactions data are empty!",
                );
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function GetCashTransactionsPaginateService($request)
    {
        try {
            $search = $request->search ? $request->search : null;
            $page = $request->page ? $request->page : 1;
            $limit = $request->limit ? $request->limit : 5;
            $page = max((int) $page, 1);
            $limit = max((int) $limit, 1);
            $cashTransactions = $this->cashTransactionRepository->GetPaginate(
                $search,
                $page,
                $limit,
            );
            if ($cashTransactions["total"] > 0) {
                return Helper::GetResponse(
                    200,
                    "All cash transactions data are succesfully appeared!",
                    $cashTransactions,
                );
            } else {
                return Helper::GetResponse(
                    400,
                    "All cash transactions data are empty!",
                );
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function GetCashTransactionService($cashTransactionCode)
    {
        try {
            $cashTransaction = $this->cashTransactionRepository->GetOne(
                $cashTransactionCode,
            );
            if ($cashTransaction) {
                return Helper::GetResponse(
                    200,
                    "A cash transaction data is succesfully appeared!",
                    $cashTransaction,
                );
            } else {
                return Helper::GetResponse(
                    400,
                    "A cash transaction data is not found!",
                );
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function CreateCashTransactionService($request)
    {
        try {
            $cashTransactionCode = Helper::GenerateCode("cash-transactions");
            $cashTransaction = $this->cashTransactionRepository->GetOne(
                $cashTransactionCode,
            );
            if ($cashTransaction) {
                return Helper::GetResponse(
                    400,
                    "A cash transaction data is previously registered!",
                );
            } else {
                $authUser = Helper::GetAuthUser($request);
                $data = [
                    "code" => $cashTransactionCode,
                    "category" => $request->category,
                    "amount" => $request->amount,
                    "description" => $request->description,
                    "status" => "pending",
                    "created_at" => date("Y-m-d H:i:s"),
                    "created_by" => $authUser->uuid,
                    "created_by_username" => $authUser->username,
                ];
                $this->cashTransactionRepository->Create($data);
                return Helper::GetResponse(
                    200,
                    "A new cash transaction data is succesfully created!",
                    $data,
                );
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function UpdateCashTransactionService($cashTransactionCode, $request)
    {
        try {
            $cashTransaction = $this->cashTransactionRepository->GetOne(
                $cashTransactionCode,
            );
            if ($cashTransaction) {
                $authUser = Helper::GetAuthUser($request);
                $data = [
                    "category" => $request->category
                        ? $request->category
                        : $cashTransaction->category,
                    "amount" => $request->amount
                        ? $request->amount
                        : $cashTransaction->amount,
                    "description" => $request->description
                        ? $request->description
                        : $cashTransaction->description,
                    "status" => $request->status
                        ? $request->status
                        : $cashTransaction->status,
                    "updated_at" => date("Y-m-d H:i:s"),
                    "updated_by" => $authUser->uuid,
                    "updated_by_username" => $authUser->username,
                ];
                $this->cashTransactionRepository->Update(
                    $cashTransactionCode,
                    $data,
                );
                return Helper::GetResponse(
                    200,
                    "An existing cash transaction data is succesfully updated!",
                    $data,
                );
            } else {
                return Helper::GetResponse(
                    400,
                    "A cash transaction data is not found!",
                );
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function DeleteCashTransactionService($cashTransactionCode)
    {
        try {
            $cashTransaction = $this->cashTransactionRepository->GetOne(
                $cashTransactionCode,
            );
            if ($cashTransaction) {
                if ($cashTransaction->status == "paid") {
                    return Helper::GetResponse(
                        400,
                        "A cash transaction data cannot be deleted because the status is paid!",
                    );
                } else {
                    $this->cashTransactionRepository->Delete(
                        $cashTransactionCode,
                    );
                    return Helper::GetResponse(
                        200,
                        "A cash transaction data is succesfully deleted!",
                    );
                }
            } else {
                return Helper::GetResponse(
                    400,
                    "A cash transaction data is not found!",
                );
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }
}
