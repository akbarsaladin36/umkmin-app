<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Interfaces\Services\CategoryServiceInterface;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    protected $categoryService;

    public function __construct(CategoryServiceInterface $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function GetCategoriesController()
    {
        return $this->categoryService->GetCategoriesService();
    }

    public function GetCategoriesPaginateController(Request $request)
    {
        return $this->categoryService->GetCategoriesPaginateService($request);
    }

    public function GetCategoryController($categoryName)
    {
        return $this->categoryService->GetCategoryService($categoryName);
    }

    public function CreateCategoryController(Request $request)
    {
        return $this->categoryService->CreateCategoryService($request);
    }

    public function UpdateCategoryController($categoryName, Request $request)
    {
        return $this->categoryService->UpdateCategoryService(
            $categoryName,
            $request,
        );
    }

    public function DeleteCategoryController($categoryName)
    {
        return $this->categoryService->DeleteCategoryService($categoryName);
    }
}
