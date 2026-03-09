import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { initFlowbite } from "flowbite";
import CashierNavbar from "../navbars/CashierNavbar";
import CashierSidebar from "../sidebars/CashierSidebar";
import Loading from "../SpinnerLoading";

const CashierLayout = () => {
    const location = useLocation();
    const [loadingPage, setLoadingPage] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => {
            initFlowbite();
        });
    }, []);

    useEffect(() => {
        setLoadingPage(true);
        const timer = setTimeout(() => {
            setLoadingPage(false);
        }, 400);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <>
            <CashierNavbar />
            <CashierSidebar />
            <div className="p-4 lg:ml-64 mt-15 sm:mt-15">
                {loadingPage && (
                    <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
                        <Loading fullscreen />
                    </div>
                )}
                <Outlet />
            </div>
        </>
    );
};

export default CashierLayout;
