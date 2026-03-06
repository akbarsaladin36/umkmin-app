<?php

namespace App\Services;

use App\Helper\Helper;
use App\Interfaces\Repositories\PurchaseRepositoryInterface;
use App\Interfaces\Services\PurchaseServiceInterface;
use Illuminate\Support\Facades\DB;
use Throwable;

class PurchaseService implements PurchaseServiceInterface
{
    protected $purchaseRepository;

    public function __construct(PurchaseRepositoryInterface $purchaseRepository)
    {
        $this->purchaseRepository = $purchaseRepository;
    }

    public function GetPurchasesService()
    {
        try {
            $purchases = $this->purchaseRepository->GetAll();
            if (count($purchases) > 0) {
                return Helper::GetResponse(
                    200,
                    "All purchases data are succesfully appeared!",
                    $purchases,
                );
            } else {
                return Helper::GetResponse(
                    400,
                    "All purchases data are empty!",
                );
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function GetPurchasesPaginateService($request)
    {
        try {
            $search = $request->search ? $request->search : null;
            $page = $request->page ? $request->page : 1;
            $limit = $request->limit ? $request->limit : 5;
            $page = max((int) $page, 1);
            $limit = max((int) $limit, 1);
            $sales = $this->purchaseRepository->GetPaginate(
                $search,
                $page,
                $limit,
            );
            if ($sales["total"] > 0) {
                return Helper::GetResponse(
                    200,
                    "All purchases data are succesfully appeared!",
                    $sales,
                );
            } else {
                return Helper::GetResponse(
                    400,
                    "All purchases data are empty!",
                );
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function GetPurchaseService($purchaseCode)
    {
        try {
            $purchase = $this->purchaseRepository->GetOne($purchaseCode);
            if ($purchase) {
                return Helper::GetResponse(
                    200,
                    "A purchase data is succesfully appeared!",
                    $purchase,
                );
            } else {
                return Helper::GetResponse(
                    400,
                    "A purchase data is not found!",
                );
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function CreatePurchaseService($request)
    {
        DB::beginTransaction();
        try {
            $purchase_items = [];
            $total_amount = 0;
            $purchaseInvoiceNo = Helper::GenerateCode("invoice-purchases");
            $authUser = Helper::GetAuthUser($request);
            $purchaseCode = Helper::GenerateCode("purchases");
            $purchase = $this->purchaseRepository->GetOne($purchaseCode);
            if ($purchase) {
                DB::rollBack();
                return Helper::GetResponse(
                    200,
                    "A purchase data is previously registered!",
                );
            } else {
                foreach ($request->purchase_items as $item) {
                    $purchaseItemCode = Helper::GenerateCode("purchase-items");
                    $subtotal =
                        intval($item["quantity"]) * intval($item["cost_price"]);
                    $purchase_items[] = [
                        "purchase_code" => $purchaseCode,
                        "product_code" => $item["product_code"],
                        "code" => $purchaseItemCode,
                        "quantity" => $item["quantity"],
                        "cost_price" => $item["cost_price"],
                        "subtotal" => $subtotal,
                        "created_at" => date("Y-m-d H:i:s"),
                        "created_by" => $authUser->uuid,
                        "created_by_username" => $authUser->username,
                    ];
                    $total_amount += $subtotal;
                }
                $this->purchaseRepository->CreatePurchaseItem($purchase_items);
                $data = [
                    "supplier_uuid" => $request->supplier_uuid,
                    "code" => $purchaseCode,
                    "invoice_no" => $purchaseInvoiceNo,
                    "total_amount" => $total_amount,
                    "status" => "pending",
                    "due_date" => $request->due_date,
                    "created_at" => date("Y-m-d H:i:s"),
                    "created_by" => $authUser->uuid,
                    "created_by_username" => $authUser->username,
                ];
                $this->purchaseRepository->Create($data);
                DB::commit();
                $response = [...$data, "purchase_items" => $purchase_items];
                return Helper::GetResponse(
                    400,
                    "A new purchase data is succesfully created!",
                    $response,
                );
            }
        } catch (Throwable $e) {
            DB::rollBack();
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function UpdatePurchaseService($purchaseCode, $request)
    {
        DB::beginTransaction();
        try {
            $purchase = $this->purchaseRepository->GetOne($purchaseCode);
            if ($purchase) {
                if ($request->status == "paid") {
                    $authUser = Helper::GetAuthUser($request);
                    if (
                        intval($request->paid_amount) <
                        intval($purchase->total_amount)
                    ) {
                        return Helper::GetResponse(
                            400,
                            "Your money is not enough to pay this products!",
                        );
                    }
                    $data = [
                        "status" => $request->status,
                        "updated_at" => date("Y-m-d H:i:s"),
                        "updated_by" => $authUser->uuid,
                        "updated_by_username" => $authUser->username,
                    ];
                    $this->purchaseRepository->Update($purchaseCode, $data);
                    $purchaseItems = $this->purchaseRepository->GetPurchaseItemsByPurchaseCode(
                        $purchaseCode,
                    );
                    foreach ($purchaseItems as $item) {
                        $this->purchaseRepository->UpdateProduct(
                            $item->product_code,
                            $item->quantity,
                        );
                    }
                } else {
                    $authUser = Helper::GetAuthUser($request);
                    $data = [
                        "status" => $request->status,
                        "updated_at" => date("Y-m-d H:i:s"),
                        "updated_by" => $authUser->uuid,
                        "updated_by_username" => $authUser->username,
                    ];
                    $this->purchaseRepository->Update($purchaseCode, $data);
                }
                DB::commit();
                return Helper::GetResponse(
                    200,
                    "An existing purchase data status is succesfully updated!",
                    $data,
                );
            } else {
                DB::rollBack();
                return Helper::GetResponse(
                    400,
                    "A purchase data is not found!",
                );
            }
        } catch (Throwable $e) {
            DB::rollBack();
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function DeletePurchaseService($purchaseCode)
    {
        try {
            $purchase = $this->purchaseRepository->GetOne($purchaseCode);
            if ($purchase) {
                if ($purchase->status == "paid") {
                    return Helper::GetResponse(
                        400,
                        "A purchase data cannot be deleted because status purchase is paid!",
                    );
                } else {
                    $this->purchaseRepository->DeletePurchaseItem(
                        $purchaseCode,
                    );
                    $this->purchaseRepository->Delete($purchaseCode);
                    return Helper::GetResponse(
                        200,
                        "A purchase data is succesfully deleted!",
                    );
                }
            } else {
                return Helper::GetResponse(
                    400,
                    "A purchase data is not found!",
                );
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }
}
