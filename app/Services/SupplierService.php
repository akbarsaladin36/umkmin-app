<?php

namespace App\Services;

use App\Helper\Helper;
use App\Interfaces\Repositories\SupplierRepositoryInterface;
use App\Interfaces\Services\SupplierServiceInterface;
use Throwable;

class SupplierService implements SupplierServiceInterface
{
    protected $supplierRepository;

    public function __construct(SupplierRepositoryInterface $supplierRepository)
    {
        $this->supplierRepository = $supplierRepository;
    }

    public function GetSuppliersService()
    {
        try {
            $suppliers = $this->supplierRepository->GetAll();
            if(count($suppliers) > 0) {
                return Helper::GetResponse(200, 'All suppliers are succesfully appeared!', $suppliers);
            } else {
                return Helper::GetResponse(400, 'All suppliers are empty!');
            }
        } catch(Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function GetSupplierService($supplierCode)
    {
        try {
            $supplier = $this->supplierRepository->GetOne($supplierCode);
            if($supplier) {
                return Helper::GetResponse(200, 'A supplier data is succesfully appeared!', $supplier);
            } else {
                return Helper::GetResponse(400, 'A supplier data is not found!');
            }
        } catch(Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function CreateSupplierService($request)
    {
        try {
            $supplierCode = Helper::GenerateCode('suppliers');
            $supplier = $this->supplierRepository->GetOne($supplierCode);
            if($supplier) {
                return Helper::GetResponse(400, 'A supplier data is registered!');
            } else {
                $authUser = Helper::GetAuthUser($request);
                $data = [
                    'code' => $supplierCode,
                    'name' => $request->name,
                    'phone_number' => $request->phone_number,
                    'address' => $request->address,
                    'created_at' => date("Y-m-d H:i:s"),
                    'created_by' => $authUser->uuid,
                    'created_by_username' => $authUser->username
                ];
                $this->supplierRepository->Create($data);
                return Helper::GetResponse(200, 'A new supplier data is succesfully created!', $data);
            }
        } catch(Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function UpdateSupplierService($supplierCode, $request)
    {
        try {
            $supplier = $this->supplierRepository->GetOne($supplierCode);
            if($supplier) {
                $authUser = Helper::GetAuthUser($request);
                $data = [
                    'name' => $request->name ? $request->name : $supplier->name,
                    'phone_number' => $request->phone_number  ? $request->phone_number : $supplier->phone_number,
                    'address' => $request->address  ? $request->address : $supplier->address,
                    'updated_at' => date("Y-m-d H:i:s"),
                    'updated_by' => $authUser->uuid,
                    'updated_by_username' => $authUser->username
                ];
                $this->supplierRepository->Update($supplierCode, $data);
                return Helper::GetResponse(200, 'An existing supplier data is succesfully updated!', $data);
            } else {
                return Helper::GetResponse(400, 'A supplier data is not found!');
            }
        } catch(Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function DeleteSupplierService($supplierCode)
    {
        try {
            $supplier = $this->supplierRepository->GetOne($supplierCode);
            if($supplier) {
                $this->supplierRepository->Delete($supplierCode);
                return Helper::GetResponse(200, 'A supplier data is succesfully deleted!');
            } else {
                return Helper::GetResponse(400, 'A supplier data is not found!');
            }
        } catch(Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }
}