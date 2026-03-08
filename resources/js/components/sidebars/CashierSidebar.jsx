import { TbReceiptDollar } from "react-icons/tb";
import { BsCashCoin } from "react-icons/bs";
import { Link } from "react-router-dom";

const CashierSidebar = () => {
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
                                to="/cashier/sales"
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
                                to="/cashier/cash-transactions"
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

export default CashierSidebar;
