<?php

namespace App\Services;

use App\Helper\Helper;
use App\Interfaces\Repositories\SaleRepositoryInterface;
use App\Interfaces\Services\SaleServiceInterface;
use Illuminate\Support\Facades\DB;
use Throwable;

class SaleService implements SaleServiceInterface
{
    protected $saleRepository;

    public function __construct(SaleRepositoryInterface $saleRepository)
    {
        $this->saleRepository = $saleRepository;
    }

    public function GetSalesService()
    {
        try {
            $sales = $this->saleRepository->GetAll();
            if (count($sales) > 0) {
                return Helper::GetResponse(
                    200,
                    "All sales are succesfully appeared!",
                    $sales,
                );
            } else {
                return Helper::GetResponse(400, "All sales are empty!");
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function GetSalesPaginateService($request)
    {
        try {
            $search = $request->search ? $request->search : null;
            $page = $request->page ? $request->page : 1;
            $limit = $request->limit ? $request->limit : 5;
            $page = max((int) $page, 1);
            $limit = max((int) $limit, 1);
            $sales = $this->saleRepository->GetPaginate($search, $page, $limit);
            if ($sales["total"] > 0) {
                return Helper::GetResponse(
                    200,
                    "All sales data are succesfully appeared!",
                    $sales,
                );
            } else {
                return Helper::GetResponse(400, "All sales data are empty!");
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function GetSalesPaginateByUserService($request)
    {
        try {
            $authUser = Helper::GetAuthUser($request);
            $search = $request->search ? $request->search : null;
            $page = $request->page ? $request->page : 1;
            $limit = $request->limit ? $request->limit : 5;
            $page = max((int) $page, 1);
            $limit = max((int) $limit, 1);
            $sales = $this->saleRepository->GetPaginateByUser(
                $authUser->username,
                $search,
                $page,
                $limit,
            );
            if ($sales["total"] > 0) {
                return Helper::GetResponse(
                    200,
                    "All sales data are succesfully appeared!",
                    $sales,
                );
            } else {
                return Helper::GetResponse(400, "All sales data are empty!");
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function GetSaleService($saleCode)
    {
        try {
            $sale = $this->saleRepository->GetOne($saleCode);
            if ($sale) {
                return Helper::GetResponse(
                    200,
                    "A sale data is succesfully appeared!",
                    $sale,
                );
            } else {
                return Helper::GetResponse(400, "A sale data is not found!");
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function CreateSaleService($request)
    {
        DB::beginTransaction();
        try {
            $saleCode = Helper::GenerateCode("sales");
            $invoiceNo = Helper::GenerateCode("invoice-sales");
            $authUser = Helper::GetAuthUser($request);
            $sale_items = [];
            $total_amount = 0;
            $final_amount = 0;
            foreach ($request->items as $item) {
                $subtotal = intval($item["quantity"]) * intval($item["price"]);
                $saleItemCode = Helper::GenerateCode("sale-items");
                $sale_items[] = [
                    "sale_item_code" => $saleItemCode,
                    "sale_code" => $saleCode,
                    "product_code" => $item["product_code"],
                    "quantity" => $item["quantity"],
                    "price" => $item["price"],
                    "subtotal" => $subtotal,
                    "created_at" => date("Y-m-d H:i:s"),
                    "created_by" => $authUser->uuid,
                    "created_by_username" => $authUser->username,
                ];
                $total_amount += $subtotal;
            }
            $this->saleRepository->CreateSaleItems($sale_items);
            $final_amount = $total_amount;
            $data = [
                "code" => $saleCode,
                "invoice_no" => $invoiceNo,
                "user_uuid" => $request->user_uuid,
                "total_amount" => $total_amount,
                "discount" => $request->discount,
                "final_amount" => $final_amount,
                "status" => "pending",
                "created_at" => date("Y-m-d H:i:s"),
                "created_by" => $authUser->uuid,
                "created_by_username" => $authUser->username,
            ];
            $this->saleRepository->Create($data);
            DB::commit();
            $response = [...$data, "sale_items" => $sale_items];
            return Helper::GetResponse(
                200,
                "A new sales data is succesfully created!",
                $response,
            );
        } catch (Throwable $e) {
            DB::rollBack();
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function UpdateSaleService($saleCode, $request)
    {
        DB::beginTransaction();
        try {
            $sale = $this->saleRepository->GetOne($saleCode);
            if ($sale) {
                if ($request->status == "paid") {
                    $authUser = Helper::GetAuthUser($request);
                    if (
                        intval($request->paid_amount) <
                        intval($sale->final_amount)
                    ) {
                        return Helper::GetResponse(
                            400,
                            "Your money is not enough to pay this products!",
                        );
                    }
                    $changeAmount =
                        intval($request->paid_amount) -
                        intval($sale->final_amount);
                    $data = [
                        "payment_method" => $request->payment_method,
                        "paid_amount" => $request->paid_amount,
                        "change_amount" => $changeAmount,
                        "status" => $request->status,
                        "updated_at" => date("Y-m-d H:i:s"),
                        "updated_by" => $authUser->uuid,
                        "updated_by_username" => $authUser->username,
                    ];
                    $this->saleRepository->Update($saleCode, $data);
                    $saleItems = $this->saleRepository->GetSaleItems($saleCode);
                    foreach ($saleItems as $item) {
                        $this->saleRepository->UpdateProduct(
                            $item->product_code,
                            $item->quantity,
                        );
                    }
                } else {
                    $authUser = Helper::GetAuthUser($request);
                    $data = [
                        "status" => $request->status
                            ? $request->status
                            : $sale->status,
                        "updated_at" => date("Y-m-d H:i:s"),
                        "updated_by" => $authUser->uuid,
                        "updated_by_username" => $authUser->username,
                    ];
                    $this->saleRepository->Update($saleCode, $data);
                }
                DB::commit();
                return Helper::GetResponse(
                    200,
                    "A sale data status is succesfully updated!",
                    $data,
                );
            } else {
                DB::rollBack();
                return Helper::GetResponse(400, "A sale data is not found!");
            }
        } catch (Throwable $e) {
            DB::rollBack();
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function DeleteSaleService($saleCode)
    {
        try {
            $sale = $this->saleRepository->GetOne($saleCode);
            if ($sale) {
                if ($sale->status == "paid") {
                    return Helper::GetResponse(
                        400,
                        "A sale data cannot be deleted because status is paid!",
                    );
                } else {
                    $this->saleRepository->DeleteSaleItem($saleCode);
                    $this->saleRepository->Delete($saleCode);
                    return Helper::GetResponse(
                        200,
                        "A sale data is succesfully deleted!",
                    );
                }
            } else {
                return Helper::GetResponse(400, "A sale data is not found!");
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }
}
