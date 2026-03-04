<?php

namespace App\Providers;

use App\Interfaces\Repositories\AuthRepositoryInterface;
use App\Interfaces\Repositories\CashTransactionRepositoryInterface;
use App\Interfaces\Repositories\CategoryRepositoryInterface;
use App\Interfaces\Repositories\ProductRepositoryInterface;
use App\Interfaces\Repositories\PurchaseItemRepositoryInterface;
use App\Interfaces\Repositories\PurchaseRepositoryInterface;
use App\Interfaces\Repositories\RoleRepositoryInterface;
use App\Interfaces\Repositories\SaleItemRepositoryInterface;
use App\Interfaces\Repositories\SaleRepositoryInterface;
use App\Interfaces\Repositories\SupplierRepositoryInterface;
use App\Interfaces\Repositories\UserRepositoryInterface;
use App\Interfaces\Services\AuthServiceInterface;
use App\Interfaces\Services\CashTransactionServiceInterface;
use App\Interfaces\Services\CategoryServiceInterface;
use App\Interfaces\Services\ProductServiceInterface;
use App\Interfaces\Services\PurchaseItemServiceInterface;
use App\Interfaces\Services\PurchaseServiceInterface;
use App\Interfaces\Services\RoleServiceInterface;
use App\Interfaces\Services\SaleItemServiceInterface;
use App\Interfaces\Services\SaleServiceInterface;
use App\Interfaces\Services\SupplierServiceInterface;
use App\Interfaces\Services\UserServiceInterface;
use App\Repositories\AuthRepository;
use App\Repositories\CashTransactionRepository;
use App\Repositories\CategoryRepository;
use App\Repositories\ProductRepository;
use App\Repositories\PurchaseItemRepository;
use App\Repositories\PurchaseRepository;
use App\Repositories\RoleRepository;
use App\Repositories\SaleItemRepository;
use App\Repositories\SaleRepository;
use App\Repositories\SupplierRepository;
use App\Repositories\UserRepository;
use App\Services\AuthService;
use App\Services\CashTransactionService;
use App\Services\CategoryService;
use App\Services\ProductService;
use App\Services\PurchaseItemService;
use App\Services\PurchaseService;
use App\Services\RoleService;
use App\Services\SaleItemService;
use App\Services\SaleService;
use App\Services\SupplierService;
use App\Services\UserService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Auth
        $this->app->bind(AuthRepositoryInterface::class, AuthRepository::class);
        $this->app->bind(AuthServiceInterface::class, AuthService::class);

        // Admin
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(UserServiceInterface::class, UserService::class);
        $this->app->bind(RoleRepositoryInterface::class, RoleRepository::class);
        $this->app->bind(RoleServiceInterface::class, RoleService::class);
        $this->app->bind(CategoryRepositoryInterface::class, CategoryRepository::class);
        $this->app->bind(CategoryServiceInterface::class, CategoryService::class);
        $this->app->bind(ProductRepositoryInterface::class, ProductRepository::class);
        $this->app->bind(ProductServiceInterface::class, ProductService::class);
        $this->app->bind(SaleRepositoryInterface::class, SaleRepository::class);
        $this->app->bind(SaleServiceInterface::class, SaleService::class);
        $this->app->bind(SaleItemRepositoryInterface::class, SaleItemRepository::class);
        $this->app->bind(SaleItemServiceInterface::class, SaleItemService::class);
        $this->app->bind(SupplierRepositoryInterface::class, SupplierRepository::class);
        $this->app->bind(SupplierServiceInterface::class, SupplierService::class);
        $this->app->bind(PurchaseRepositoryInterface::class, PurchaseRepository::class);
        $this->app->bind(PurchaseServiceInterface::class, PurchaseService::class);
        $this->app->bind(PurchaseItemRepositoryInterface::class, PurchaseItemRepository::class);
        $this->app->bind(PurchaseItemServiceInterface::class, PurchaseItemService::class);
        $this->app->bind(CashTransactionRepositoryInterface::class, CashTransactionRepository::class);
        $this->app->bind(CashTransactionServiceInterface::class, CashTransactionService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
