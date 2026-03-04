<?php

namespace App\Services;

use App\Helper\Helper;
use App\Interfaces\Repositories\SaleItemRepositoryInterface;
use App\Interfaces\Services\SaleItemServiceInterface;
use Throwable;

class SaleItemService implements SaleItemServiceInterface
{
    protected $saleItemRepository;

    public function __construct(SaleItemRepositoryInterface $saleItemRepository)
    {
        $this->saleItemRepository = $saleItemRepository;
    }

    public function GetSaleItemsBySaleCodeService($saleCode)
    {
        try {
            $saleItems = $this->saleItemRepository->GetBySaleCode($saleCode);
            if($saleItems) {
                return Helper::GetResponse(200, 'All sale items based from sale code are succesfully appeared!', $saleItems);
            } else {
                return Helper::GetResponse(400, 'All sale items based from sale code are empty!');
            }
        } catch(Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function GetSaleItemService($saleItemCode)
    {
        try {
            $saleItem = $this->saleItemRepository->GetOne($saleItemCode);
            if($saleItem) {
                return Helper::GetResponse(200, 'A sale item data is succesfully appeared!', $saleItem);
            } else {
                return Helper::GetResponse(400, 'A sale item data is not found!');
            }
        } catch(Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function DeleteSaleItemService($saleItemCode)
    {
        try {
            $saleItem = $this->saleItemRepository->GetOne($saleItemCode);
            if($saleItem) {
                $this->saleItemRepository->Delete($saleItemCode);
                return Helper::GetResponse(200, 'A sale item data is succesfully deleted!');
            } else {
                return Helper::GetResponse(400, 'A sale item data is not found!');
            }
        } catch(Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }
}