<?php

namespace App\Interfaces\Services;

interface SupplierServiceInterface
{
    public function GetSuppliersService();
    public function GetSupplierService($supplierCode);
    public function CreateSupplierService($request);
    public function UpdateSupplierService($supplierCode, $request);
    public function DeleteSupplierService($supplierCode);
}