import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { initFlowbite } from "flowbite";
import CashierNavbar from "../navbars/CashierNavbar";
import CashierSidebar from "../sidebars/CashierSidebar";

const CashierLayout = () => {
    useEffect(() => {
        requestAnimationFrame(() => {
            initFlowbite();
        });
    }, []);

    return (
        <>
            <CashierNavbar />
            <CashierSidebar />
            <div className="p-4 lg:ml-64 mt-15 sm:mt-15">
                <Outlet />
            </div>
        </>
    );
};

export default CashierLayout;
