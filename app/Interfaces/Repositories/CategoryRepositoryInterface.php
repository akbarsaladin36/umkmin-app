<?php

namespace App\Interfaces\Repositories;

interface CategoryRepositoryInterface
{
    public function GetAll();
    public function GetPaginate($search, $page, $limit);
    public function GetOne($categoryName);
    public function Create(array $data);
    public function Update($categoryName, array $data);
    public function Delete($categoryName);
}
