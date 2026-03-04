<?php

namespace App\Services;

use App\Helper\Helper;
use App\Interfaces\Repositories\CategoryRepositoryInterface;
use App\Interfaces\Services\CategoryServiceInterface;
use Throwable;

class CategoryService implements CategoryServiceInterface
{
    protected $categoryRepository;

    public function __construct(CategoryRepositoryInterface $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    public function GetCategoriesService()
    {
        try {
            $categories = $this->categoryRepository->GetAll();
            if (count($categories) > 0) {
                return Helper::GetResponse(
                    200,
                    "All categories data are succesfully appeared!",
                    $categories,
                );
            } else {
                return Helper::GetResponse(
                    400,
                    "All categories data are empty!",
                );
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function GetCategoriesPaginateService($request)
    {
        try {
            $search = $request->search ? $request->search : null;
            $page = $request->page ? $request->page : 1;
            $limit = $request->limit ? $request->limit : 5;
            $page = max((int) $page, 1);
            $limit = max((int) $limit, 1);
            $categories = $this->categoryRepository->GetPaginate(
                $search,
                $page,
                $limit,
            );
            if ($categories["total"] > 0) {
                return Helper::GetResponse(
                    200,
                    "All categories data are succesfully appeared!",
                    $categories,
                );
            } else {
                return Helper::GetResponse(
                    400,
                    "All categories data are empty!",
                );
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function GetCategoryService($categoryName)
    {
        try {
            $category = $this->categoryRepository->GetOne($categoryName);
            if ($category) {
                return Helper::GetResponse(
                    200,
                    "A category data is succesfully appeared!",
                    $category,
                );
            } else {
                return Helper::GetResponse(
                    400,
                    "A category data is not found!",
                );
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function CreateCategoryService($request)
    {
        try {
            $category = $this->categoryRepository->GetOne($request->name);
            if ($category) {
                return Helper::GetResponse(
                    400,
                    "A category data is registered!",
                );
            } else {
                $authUser = Helper::GetAuthUser($request);
                $data = [
                    "name" => Helper::GenerateSlug($request->name),
                    "description" => $request->description,
                    "created_at" => date("Y-m-d H:i:s"),
                    "created_by" => $authUser->uuid,
                    "created_by_username" => $authUser->username,
                ];
                $this->categoryRepository->Create($data);
                return Helper::GetResponse(
                    200,
                    "A new category data is succesfully created!",
                    $data,
                );
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function UpdateCategoryService($categoryName, $request)
    {
        try {
            $category = $this->categoryRepository->GetOne($categoryName);
            if ($category) {
                $authUser = Helper::GetAuthUser($request);
                $data = [
                    "name" => $request->name ? $request->name : $category->name,
                    "description" => $request->description
                        ? $request->description
                        : $category->description,
                    "updated_at" => date("Y-m-d H:i:s"),
                    "updated_by" => $authUser->uuid,
                    "updated_by_username" => $authUser->username,
                ];
                $this->categoryRepository->Update($categoryName, $data);
                return Helper::GetResponse(
                    200,
                    "An existing category data is succesfully updated!",
                    $data,
                );
            } else {
                return Helper::GetResponse(
                    400,
                    "A category data is not found!",
                );
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function DeleteCategoryService($categoryName)
    {
        try {
            $category = $this->categoryRepository->GetOne($categoryName);
            if ($category) {
                $this->categoryRepository->Delete($categoryName);
                return Helper::GetResponse(
                    200,
                    "A category data is succesfully deleted!",
                );
            } else {
                return Helper::GetResponse(
                    400,
                    "A category data is not found!",
                );
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }
}
