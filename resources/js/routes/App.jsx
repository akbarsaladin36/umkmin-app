import { Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { initFlowbite } from "flowbite";
import useAuthStore from "../stores/auth";

import Index from "../pages/Index";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import Loading from "../components/SpinnerLoading";

// const AdminLayout = lazy(() => import("../components/layouts/AdminLayout"));
// const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
// const Users = lazy(() => import("../pages/admin/Users"));
// const Categories = lazy(() => import("../pages/admin/Categories"));
// const Products = lazy(() => import("../pages/admin/Products"));
// const Sales = lazy(() => import("../pages/admin/Sales"));
// const Suppliers = lazy(() => import("../pages/admin/Suppliers"));
// const Purchases = lazy(() => import("../pages/admin/Purchases"));
// const CashTransactions = lazy(() => import("../pages/admin/CashTransactions"));

import AdminLayout from "../components/layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Categories from "../pages/admin/Categories";
import Products from "../pages/admin/Products";
import Sales from "../pages/admin/Sales";
import Suppliers from "../pages/admin/Suppliers";
import Purchases from "../pages/admin/Purchases";
import CashTransactions from "../pages/admin/CashTransactions";

// const CashierLayout = lazy(() => import("../components/layouts/CashierLayout"));
// const CashierCashTransactions = lazy(
//     () => import("../pages/cashier/CashTransactions"),
// );
// const CashierSales = lazy(() => import("../pages/cashier/Sales"));

import CashierLayout from "../components/layouts/CashierLayout";
import CashierCashTransactions from "../pages/cashier/CashTransactions";
import CashierSales from "../pages/cashier/Sales";

const App = () => {
    const location = useLocation();
    const fetchUser = useAuthStore((state) => state.fetchUser);

    useEffect(() => {
        const timer = setTimeout(() => {
            initFlowbite();
        }, 100);

        return () => clearTimeout(timer);
    }, [location.pathname]);

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        // <Suspense fallback={<Loading fullScreen />}>
        <Routes>
            <Route path="/" element={<Index />} />
            <Route element={<ProtectedRoute />}>
                <Route element={<RoleRoute allowedRoles={[1]} />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="users" element={<Users />} />
                        <Route path="categories" element={<Categories />} />
                        <Route path="products" element={<Products />} />
                        <Route path="sales" element={<Sales />} />
                        <Route path="suppliers" element={<Suppliers />} />
                        <Route path="purchases" element={<Purchases />} />
                        <Route
                            path="cash-transactions"
                            element={<CashTransactions />}
                        />
                    </Route>
                </Route>
                <Route element={<RoleRoute allowedRoles={[2]} />}>
                    <Route path="/cashier" element={<CashierLayout />}>
                        <Route path="sales" element={<CashierSales />} />
                        <Route
                            path="cash-transactions"
                            element={<CashierCashTransactions />}
                        />
                    </Route>
                </Route>
            </Route>
        </Routes>
        // </Suspense>
    );
};

export default App;
