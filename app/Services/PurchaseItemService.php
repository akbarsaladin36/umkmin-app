<?php

namespace App\Services;

use App\Helper\Helper;
use App\Interfaces\Repositories\PurchaseItemRepositoryInterface;
use App\Interfaces\Services\PurchaseItemServiceInterface;
use Throwable;

class PurchaseItemService implements PurchaseItemServiceInterface
{
    protected $purchaseItemRepository;

    public function __construct(PurchaseItemRepositoryInterface $purchaseItemRepository)
    {
        $this->purchaseItemRepository = $purchaseItemRepository;
    }

    public function GetPurchaseItemsByPurchaseCodeService($purchaseCode)
    {
        try {
            $purchaseItems = $this->purchaseItemRepository->GetByPurchaseCode($purchaseCode);
            if(count($purchaseItems) > 0) {
                return Helper::GetResponse(200, 'All purchase items data are succesfully appeared!', $purchaseItems);
            } else {
                return Helper::GetResponse(400, 'All purchase items data are empty!');
            }
        } catch(Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function DeletePurchaseItemsService($purchaseItemCode)
    {
        try {
            $purchaseItems = $this->purchaseItemRepository->GetOne($purchaseItemCode);
            if($purchaseItems) {
                $purchase = $this->purchaseItemRepository->GetPurchaseCode($purchaseItems->purchase_code);
                if($purchase->status == "paid") {
                    return Helper::GetResponse(400, 'A purchase item data cannot be deleted by purchase status is paid!');
                } else {
                    $this->purchaseItemRepository->UpdatePurchaseTotalAmount($purchase->code, $purchaseItems->subtotal);
                    $this->purchaseItemRepository->Delete($purchaseItemCode);
                    return Helper::GetResponse(200, 'A purchase item data is succesfully deleted!');
                }
            } else {
                return Helper::GetResponse(400, 'A purchase item data is not found!');
            }
        } catch(Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }
}