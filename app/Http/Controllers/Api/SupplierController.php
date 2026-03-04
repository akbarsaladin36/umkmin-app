<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Interfaces\Services\SupplierServiceInterface;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    protected $supplierService;

    public function __construct(SupplierServiceInterface $supplierService)
    {
        $this->supplierService = $supplierService;
    }

    public function GetSuppliersController()
    {
        return $this->supplierService->GetSuppliersService();
    }

    public function GetSupplierController($supplierCode)
    {
        return $this->supplierService->GetSupplierService($supplierCode);
    }

    public function CreateSupplierController(Request $request)
    {
        return $this->supplierService->CreateSupplierService($request);
    }

    public function UpdateSupplierController($supplierCode, Request $request)
    {
        return $this->supplierService->UpdateSupplierService($supplierCode, $request);
    }

    public function DeleteSupplierController($supplierCode)
    {
        return $this->supplierService->DeleteSupplierService($supplierCode);
    }
}
