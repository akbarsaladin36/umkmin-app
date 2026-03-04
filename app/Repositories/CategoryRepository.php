<?php

namespace App\Repositories;

use App\Interfaces\Repositories\CategoryRepositoryInterface;
use Illuminate\Support\Facades\DB;

class CategoryRepository implements CategoryRepositoryInterface
{
    public function GetAll()
    {
        $categories = DB::table("categories")->get();
        return $categories;
    }

    public function GetPaginate($search, $page, $limit)
    {
        $query = DB::table("categories");
        if ($search) {
            $query->where(function ($a) use ($search) {
                $a->where("name", "like", "%" . $search . "%")->orWhere(
                    "description",
                    "like",
                    "%" . $search . "%",
                );
            });
        }
        $total = (clone $query)->count();
        $categories = $query
            ->orderBy("created_at", "desc")
            ->offset(($page - 1) * $limit)
            ->limit($limit)
            ->get();
        $last_page = ceil($total / $limit);
        $from = ($page - 1) * $limit + 1;
        $to = min($page * $limit, $total);
        $pagination = [
            "data" => $categories,
            "total" => $total,
            "per_page" => $limit,
            "current_page" => $page,
            "last_page" => $last_page,
            "from" => $from,
            "to" => $to,
        ];
        return $pagination;
    }

    public function GetOne($categoryName)
    {
        $category = DB::table("categories")
            ->where("name", $categoryName)
            ->first();
        return $category;
    }

    public function Create(array $data)
    {
        $category = DB::table("categories")->insert($data);
        return $category;
    }

    public function Update($categoryName, array $data)
    {
        $category = DB::table("categories")
            ->where("name", $categoryName)
            ->update($data);
        return $category;
    }

    public function Delete($categoryName)
    {
        $category = DB::table("categories")
            ->where("name", $categoryName)
            ->delete();
        return $category;
    }
}
