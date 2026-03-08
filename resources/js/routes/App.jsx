import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { initFlowbite } from "flowbite";
import useAuthStore from "../stores/auth";

import Index from "../pages/Index";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import AdminLayout from "../components/layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Categories from "../pages/admin/Categories";
import Products from "../pages/admin/Products";
import Sales from "../pages/admin/Sales";
import Suppliers from "../pages/admin/Suppliers";
import Purchases from "../pages/admin/Purchases";
import CashTransactions from "../pages/admin/CashTransactions";
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
    );
};

export default App;
