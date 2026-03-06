import {
    BiCategoryAlt,
    BiLogoProductHunt,
    BiPurchaseTagAlt,
    BiBarChartAlt,
} from "react-icons/bi";
import { HiOutlineUserGroup, HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { TbReceiptDollar } from "react-icons/tb";
import { BsCashCoin } from "react-icons/bs";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
    return (
        <>
            <aside
                id="top-bar-sidebar"
                className="fixed top-0 left-0 z-40 w-64 h-full transition-transform -translate-x-full lg:translate-x-0"
                aria-label="Sidebar"
            >
                <div className="h-full px-3 py-4 overflow-y-auto bg-neutral-primary-soft border-e border-default">
                    <ul className="space-y-2 font-medium mt-15">
                        <li>
                            <Link
                                to="/admin/dashboard"
                                className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-danger group"
                                data-drawer-hide="top-bar-sidebar"
                            >
                                <BiBarChartAlt />
                                <span className="ms-3">Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/users"
                                className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-danger group"
                                data-drawer-hide="top-bar-sidebar"
                            >
                                <HiOutlineUserGroup />
                                <span className="flex-1 ms-3 whitespace-nowrap">
                                    Users
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/categories"
                                className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-danger group"
                                data-drawer-hide="top-bar-sidebar"
                            >
                                <BiCategoryAlt />
                                <span className="flex-1 ms-3 whitespace-nowrap">
                                    Categories
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/products"
                                className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-danger group"
                                data-drawer-hide="top-bar-sidebar"
                            >
                                <BiLogoProductHunt />
                                <span className="flex-1 ms-3 whitespace-nowrap">
                                    Products
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/sales"
                                className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-danger group"
                                data-drawer-hide="top-bar-sidebar"
                            >
                                <TbReceiptDollar />
                                <span className="flex-1 ms-3 whitespace-nowrap">
                                    Sales
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/suppliers"
                                className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-danger group"
                                data-drawer-hide="top-bar-sidebar"
                            >
                                <HiOutlineBuildingOffice2 />
                                <span className="flex-1 ms-3 whitespace-nowrap">
                                    Suppliers
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/purchases"
                                className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-danger group"
                                data-drawer-hide="top-bar-sidebar"
                            >
                                <BiPurchaseTagAlt />
                                <span className="flex-1 ms-3 whitespace-nowrap">
                                    Purchases
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/cash-transactions"
                                className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-danger group"
                                data-drawer-hide="top-bar-sidebar"
                            >
                                <BsCashCoin />
                                <span className="flex-1 ms-3 whitespace-nowrap">
                                    Cash Transactions
                                </span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
