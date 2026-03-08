<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CashTransactionController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\PurchaseController;
use App\Http\Controllers\Api\PurchaseItemController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\SaleController;
use App\Http\Controllers\Api\SaleItemController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix("v1")->group(function () {
    Route::prefix("/auth")->group(function () {
        Route::post("/register", [
            AuthController::class,
            "RegisterController",
        ])->name("auth.register");
        Route::post("/login", [AuthController::class, "LoginController"])->name(
            "auth.login",
        );
        Route::post("/logout", [
            AuthController::class,
            "LogoutController",
        ])->name("auth.logout");
    });

    Route::middleware("auth.user")->get("/me", [
        AuthController::class,
        "AuthUserController",
    ]);

    Route::middleware(["auth.user", "role:1"])->group(function () {
        Route::prefix("/admin")->group(function () {
            Route::prefix("/users")->group(function () {
                Route::get("/", [
                    UserController::class,
                    "GetUsersPaginateController",
                ])->name("users.all");
                Route::get("/list-kasir", [
                    UserController::class,
                    "GetUsersByKasirController",
                ])->name("users.list-kasir");
                Route::get("/{username}", [
                    UserController::class,
                    "GetUserController",
                ])->name("users.show");
                Route::post("/", [
                    UserController::class,
                    "CreateUserController",
                ])->name("users.create");
                Route::patch("/{username}", [
                    UserController::class,
                    "UpdateUserController",
                ])->name("users.update");
                Route::delete("/{username}", [
                    UserController::class,
                    "DeleteUserController",
                ])->name("users.delete");
            });
            Route::prefix("/roles")->group(function () {
                Route::get("/", [
                    RoleController::class,
                    "GetRolesController",
                ])->name("roles.all");
                Route::get("/{roleName}", [
                    RoleController::class,
                    "GetRoleController",
                ])->name("roles.show");
                Route::post("/", [
                    RoleController::class,
                    "CreateRoleController",
                ])->name("roles.create");
                Route::patch("/{roleName}", [
                    RoleController::class,
                    "UpdateRoleController",
                ])->name("roles.update");
                Route::delete("/{roleName}", [
                    RoleController::class,
                    "DeleteRoleController",
                ])->name("roles.delete");
            });
            Route::prefix("/categories")->group(function () {
                Route::get("/", [
                    CategoryController::class,
                    "GetCategoriesPaginateController",
                ])->name("categories.all");
                Route::get("/list-categories", [
                    CategoryController::class,
                    "GetCategoriesController",
                ])->name("categories.list-categories");
                Route::get("/{categoryName}", [
                    CategoryController::class,
                    "GetCategoryController",
                ])->name("categories.show");
                Route::post("/", [
                    CategoryController::class,
                    "CreateCategoryController",
                ])->name("categories.create");
                Route::patch("/{categoryName}", [
                    CategoryController::class,
                    "UpdateCategoryController",
                ])->name("categories.update");
                Route::delete("/{categoryName}", [
                    CategoryController::class,
                    "DeleteCategoryController",
                ])->name("categories.delete");
            });
            Route::prefix("/products")->group(function () {
                Route::get("/", [
                    ProductController::class,
                    "GetProductsPaginateController",
                ])->name("products.all");
                Route::get("/list-products", [
                    ProductController::class,
                    "GetProductsController",
                ])->name("products.list-products");
                Route::get("/{productCode}", [
                    ProductController::class,
                    "GetProductController",
                ])->name("products.show");
                Route::post("/", [
                    ProductController::class,
                    "CreateProductController",
                ])->name("products.create");
                Route::patch("/{productCode}", [
                    ProductController::class,
                    "UpdateProductController",
                ])->name("products.update");
                Route::delete("/{productCode}", [
                    ProductController::class,
                    "DeleteProductController",
                ])->name("products.delete");
            });
            Route::prefix("/sales")->group(function () {
                Route::get("/", [
                    SaleController::class,
                    "GetSalesPaginateController",
                ])->name("sales.all");
                Route::get("/{saleCode}", [
                    SaleController::class,
                    "GetSaleController",
                ])->name("sales.show");
                Route::post("/", [
                    SaleController::class,
                    "CreateSaleController",
                ])->name("sales.create");
                Route::patch("/{saleCode}", [
                    SaleController::class,
                    "UpdateSaleController",
                ])->name("sales.update");
                Route::delete("/{saleCode}", [
                    SaleController::class,
                    "DeleteSaleController",
                ])->name("sales.delete");
            });
            Route::prefix("/sale-items")->group(function () {
                Route::get("/{saleCode}", [
                    SaleItemController::class,
                    "GetSaleItemsBySaleCodeController",
                ])->name("sale-items.all");
                Route::delete("/{saleItemCode}", [
                    SaleItemController::class,
                    "DeleteSaleItemController",
                ])->name("sale-items.delete");
            });
            Route::prefix("/suppliers")->group(function () {
                Route::get("/", [
                    SupplierController::class,
                    "GetSuppliersPaginateController",
                ])->name("suppliers.all");
                Route::get("/list-suppliers", [
                    SupplierController::class,
                    "GetSuppliersController",
                ])->name("suppliers.list-suppliers");
                Route::get("/{supplierCode}", [
                    SupplierController::class,
                    "GetSupplierController",
                ])->name("suppliers.show");
                Route::post("/", [
                    SupplierController::class,
                    "CreateSupplierController",
                ])->name("suppliers.create");
                Route::patch("/{supplierCode}", [
                    SupplierController::class,
                    "UpdateSupplierController",
                ])->name("suppliers.update");
                Route::delete("/{supplierCode}", [
                    SupplierController::class,
                    "DeleteSupplierController",
                ])->name("suppliers.delete");
            });
            Route::prefix("/purchases")->group(function () {
                Route::get("/", [
                    PurchaseController::class,
                    "GetPurchasesPaginateController",
                ])->name("purchases.all");
                Route::get("/{purchaseCode}", [
                    PurchaseController::class,
                    "GetPurchaseController",
                ])->name("purchases.show");
                Route::post("/", [
                    PurchaseController::class,
                    "CreatePurchaseController",
                ])->name("purchases.create");
                Route::patch("/{purchaseCode}", [
                    PurchaseController::class,
                    "UpdatePurchaseController",
                ])->name("purchases.update");
                Route::delete("/{purchaseCode}", [
                    PurchaseController::class,
                    "DeletePurchaseController",
                ])->name("purchases.delete");
            });
            Route::prefix("/purchase-items")->group(function () {
                Route::get("/{purchaseCode}", [
                    PurchaseItemController::class,
                    "GetPurchaseItemsByPurchaseCodeController",
                ])->name("purchase-items.all");
                Route::delete("/{purchaseItemCode}", [
                    PurchaseItemController::class,
                    "DeletePurchaseItemController",
                ])->name("purchase-items.delete");
            });
            Route::prefix("/cash-transactions")->group(function () {
                Route::get("/", [
                    CashTransactionController::class,
                    "GetCashTransactionsPaginateController",
                ])->name("cash-transactions.all");
                Route::get("/{cashTransactionCode}", [
                    CashTransactionController::class,
                    "GetCashTransactionController",
                ])->name("cash-transactions.show");
                Route::post("/", [
                    CashTransactionController::class,
                    "CreateCashTransactionController",
                ])->name("cash-transactions.create");
                Route::patch("/{cashTransactionCode}", [
                    CashTransactionController::class,
                    "UpdateCashTransactionController",
                ])->name("cash-transactions.update");
                Route::delete("/{cashTransactionCode}", [
                    CashTransactionController::class,
                    "DeleteCashTransactionController",
                ])->name("cash-transactions.delete");
            });
        });
    });

    Route::middleware(["auth.user", "role:2"])->group(function () {
        Route::prefix("/cashier")->group(function () {
            Route::prefix("/products")->group(function () {
                Route::get("/list-products", [
                    ProductController::class,
                    "GetProductsController",
                ])->name("products.list-products");
            });
            Route::prefix("/sales")->group(function () {
                Route::get("/", [
                    SaleController::class,
                    "GetSalesPaginateByUserController",
                ])->name("sales.all");
                Route::get("/{saleCode}", [
                    SaleController::class,
                    "GetSaleController",
                ])->name("sales.show");
                Route::post("/", [
                    SaleController::class,
                    "CreateSaleController",
                ])->name("sales.create");
                Route::patch("/{saleCode}", [
                    SaleController::class,
                    "UpdateSaleController",
                ])->name("sales.update");
                Route::delete("/{saleCode}", [
                    SaleController::class,
                    "DeleteSaleController",
                ])->name("sales.delete");
            });
            Route::prefix("/sale-items")->group(function () {
                Route::get("/{saleCode}", [
                    SaleItemController::class,
                    "GetSaleItemsBySaleCodeController",
                ])->name("sale-items.all");
                Route::delete("/{saleItemCode}", [
                    SaleItemController::class,
                    "DeleteSaleItemController",
                ])->name("sale-items.delete");
            });
            Route::prefix("/cash-transactions")->group(function () {
                Route::get("/", [
                    CashTransactionController::class,
                    "GetCashTransactionsPaginateByUserController",
                ])->name("cash-transactions.my-cash-transactions");
                Route::get("/{cashTransactionCode}", [
                    CashTransactionController::class,
                    "GetCashTransactionController",
                ])->name("cash-transactions.show");
                Route::post("/", [
                    CashTransactionController::class,
                    "CreateCashTransactionController",
                ])->name("cash-transactions.create");
                Route::patch("/{cashTransactionCode}", [
                    CashTransactionController::class,
                    "UpdateCashTransactionController",
                ])->name("cash-transactions.update");
                Route::delete("/{cashTransactionCode}", [
                    CashTransactionController::class,
                    "DeleteCashTransactionController",
                ])->name("cash-transactions.delete");
            });
        });
    });
});
