<?php

namespace App\Interfaces\Services;

interface CategoryServiceInterface
{
    public function GetCategoriesService();
    public function GetCategoriesPaginateService($request);
    public function GetCategoryService($categoryName);
    public function CreateCategoryService($request);
    public function UpdateCategoryService($categoryName, $request);
    public function DeleteCategoryService($categoryName);
}
