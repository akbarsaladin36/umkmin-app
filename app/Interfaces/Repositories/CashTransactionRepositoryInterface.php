<?php

namespace App\Interfaces\Repositories;

interface CashTransactionRepositoryInterface
{
    public function GetAll();
    public function GetPaginate($search, $page, $limit);
    public function GetPaginateByUser($username, $search, $page, $limit);
    public function GetOne($cashTransactionCode);
    public function Create(array $data);
    public function Update($cashTransactionCode, array $data);
    public function Delete($cashTransactionCode);
}
