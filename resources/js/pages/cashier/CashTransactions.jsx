import { useEffect, useRef, useState } from "react";
import useCashierCashTransactionsStore from "../../stores/cashier/cashTransaction";
import TablePagination from "../../components/TablePagination";
import ModalComponent from "../../components/Modal";
import Loading from "../../components/SpinnerLoading";
import PopupModalComponent from "../../components/PopupModal";
import SearchInput from "../../components/SearchInput";
import { BsTrash3 } from "react-icons/bs";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import useAuthStore from "../../stores/auth";

const CashierCashTransactions = () => {
    const [createCashTransactionForm, setCreateCashTransactionForm] = useState({
        category: "",
        amount: "",
        description: "",
    });
    const [editCashTransactionForm, setEditCashTransactionForm] = useState({
        category: "",
        amount: "",
        description: "",
        status: "",
    });
    const [deleteCashTransactionCode, setDeleteCashTransactionCode] =
        useState(null);
    const user = useAuthStore((state) => state.user);
    const createCashTransactionModalRef = useRef(null);
    const editCashTransactionModalRef = useRef(null);
    const deleteCashTransactionModalRef = useRef(null);

    const {
        cashTransactions,
        pagination,
        cashTransactionDetail,
        GetCashTransactions,
        GetCashTransaction,
        CreateCashTransaction,
        UpdateCashTransaction,
        DeleteCashTransaction,
        loading,
    } = useCashierCashTransactionsStore();

    useEffect(() => {
        GetCashTransactions(user.username, 1);
    }, []);

    useEffect(() => {
        if (cashTransactionDetail && cashTransactionDetail.code) {
            setEditCashTransactionForm({
                category: cashTransactionDetail.category,
                description: cashTransactionDetail.description,
                amount: cashTransactionDetail.amount,
                status: cashTransactionDetail.status,
            });
        }
    }, [cashTransactionDetail]);

    const handleChange = (e) => {
        setCreateCashTransactionForm({
            ...createCashTransactionForm,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {
        setCreateCashTransactionForm({
            category: "",
            amount: "",
            description: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            category: createCashTransactionForm.category,
            amount: createCashTransactionForm.amount,
            description: createCashTransactionForm.description,
        };
        await CreateCashTransaction(data);
        createCashTransactionModalRef.current.hide();
        resetForm();
    };

    const showEditModal = async (cashTransactionCode) => {
        editCashTransactionModalRef.current.show();
        await GetCashTransaction(cashTransactionCode);
    };

    const handleEditChange = (e) => {
        setEditCashTransactionForm({
            ...editCashTransactionForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const data = {
            category: editCashTransactionForm.category,
            amount: editCashTransactionForm.amount,
            description: editCashTransactionForm.description,
            status: editCashTransactionForm.status,
        };
        await UpdateCashTransaction(cashTransactionDetail.code, data);
        editCashTransactionModalRef.current.hide();
    };

    const showDeleteCashTransactionModal = (cashTransactionCode) => {
        setDeleteCashTransactionCode(cashTransactionCode);
        deleteCashTransactionModalRef.current.show();
    };

    const handleDeleteCashTransaction = async (cashTransactionCode) => {
        await DeleteCashTransaction(cashTransactionCode);
        deleteCashTransactionModalRef.current.hide();
    };

    return (
        <>
            <h1 className="text-4xl font-bold">Cash Transactions</h1>
            <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default mt-5">
                <div className="p-4 flex items-center justify-between space-x-4">
                    <label htmlFor="input-group-1" className="sr-only">
                        Search
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-body"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeWidth="2"
                                    d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <SearchInput
                            onSearch={(value) =>
                                GetCashTransactions(user.username, 1, value)
                            }
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() =>
                            createCashTransactionModalRef.current.show()
                        }
                        className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                    >
                        Create Cash Transaction
                    </button>
                </div>
                <table className="w-full text-sm text-left rtl:text-right text-body">
                    <thead className="text-sm text-body bg-neutral-secondary-medium border-b border-default-medium">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                No
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Description
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Category
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Amount
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {cashTransactions.length === 0 && (
                            <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
                                <td
                                    colSpan="6"
                                    className="text-center px-6 py-4"
                                >
                                    Belum ada data transaksi kas yang
                                    ditampilkan
                                </td>
                            </tr>
                        )}

                        {cashTransactions.map((cashTransaction) => (
                            <tr
                                className="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium"
                                key={cashTransaction.code}
                            >
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                                >
                                    {cashTransaction.no}
                                </th>
                                <td className="px-6 py-4">
                                    {cashTransaction.description}
                                </td>
                                <td className="px-6 py-4">
                                    {cashTransaction.category}
                                </td>
                                <td className="px-6 py-4">
                                    {cashTransaction.amount}
                                </td>
                                <td className="px-6 py-4">
                                    {cashTransaction.status}
                                </td>
                                <td className="px-6 py-4 space-x-5">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            showEditModal(cashTransaction.code)
                                        }
                                        className="border border-fg-brand p-3 rounded-xs font-medium text-fg-brand cursor-pointer hover:bg-fg-brand hover:text-white"
                                    >
                                        <HiOutlinePencilSquare />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            showDeleteCashTransactionModal(
                                                cashTransaction.code,
                                            )
                                        }
                                        className="border border-danger p-3 rounded-xs font-medium text-danger cursor-pointer hover:bg-danger hover:text-white"
                                    >
                                        <BsTrash3 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <TablePagination
                    pagination={pagination}
                    onPageChange={(page) =>
                        GetCashTransactions(user.username, page)
                    }
                />
            </div>

            {/* Create Cash Transaction Modal */}
            <ModalComponent
                idElement={"create-cash-transaction-modal"}
                title={"Create Cash Transaction"}
                ref={createCashTransactionModalRef}
                children={
                    <>
                        {/* <!-- Modal body --> */}
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4 md:space-y-6 py-4 md:py-6">
                                <div className="mt-3">
                                    <div className="mb-3">
                                        <label
                                            htmlFor="category"
                                            className="block mb-2.5 text-sm font-medium text-heading"
                                        >
                                            Category
                                        </label>
                                        <input
                                            type="text"
                                            id="category"
                                            name="category"
                                            onChange={handleChange}
                                            value={
                                                createCashTransactionForm.category
                                            }
                                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                            placeholder="category"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="description"
                                            className="block mb-2.5 text-sm font-medium text-heading"
                                        >
                                            Description
                                        </label>
                                        <input
                                            type="text"
                                            id="description"
                                            name="description"
                                            onChange={handleChange}
                                            value={
                                                createCashTransactionForm.description
                                            }
                                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                            placeholder="description"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="amount"
                                            className="block mb-2.5 text-sm font-medium text-heading"
                                        >
                                            Amount
                                        </label>
                                        <input
                                            type="text"
                                            id="amount"
                                            name="amount"
                                            onChange={handleChange}
                                            value={
                                                createCashTransactionForm.amount
                                            }
                                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                            placeholder="cash transaction amount"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* <!-- Modal footer --> */}
                            <div className="flex items-center justify-end border-t border-default space-x-4 pt-4 md:pt-5">
                                <button
                                    type="submit"
                                    className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                                >
                                    {loading ? <Loading /> : "Save"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        createCashTransactionModalRef.current.hide()
                                    }
                                    className="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                                >
                                    Close
                                </button>
                            </div>
                        </form>
                    </>
                }
            />

            {/* Edit Cash Transaction Modal */}
            <ModalComponent
                idElement={"edit-cash-transaction-modal"}
                title={"Edit Cash Transaction"}
                ref={editCashTransactionModalRef}
                children={
                    <>
                        {/* <!-- Modal body --> */}
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="space-y-4 md:space-y-6 py-4 md:py-6">
                                <div className="mt-3">
                                    <div className="mb-3">
                                        <label
                                            htmlFor="category"
                                            className="block mb-2.5 text-sm font-medium text-heading"
                                        >
                                            Category
                                        </label>
                                        <input
                                            type="text"
                                            id="category"
                                            name="category"
                                            onChange={handleEditChange}
                                            value={
                                                editCashTransactionForm.category
                                            }
                                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                            placeholder="category"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="description"
                                            className="block mb-2.5 text-sm font-medium text-heading"
                                        >
                                            Description
                                        </label>
                                        <input
                                            type="text"
                                            id="description"
                                            name="description"
                                            onChange={handleEditChange}
                                            value={
                                                editCashTransactionForm.description
                                            }
                                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                            placeholder="description"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="amount"
                                            className="block mb-2.5 text-sm font-medium text-heading"
                                        >
                                            Amount
                                        </label>
                                        <input
                                            type="text"
                                            id="amount"
                                            name="amount"
                                            onChange={handleEditChange}
                                            value={
                                                editCashTransactionForm.amount
                                            }
                                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                            placeholder="cash transaction amount"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="status"
                                            className="block mb-2.5 text-sm font-medium text-heading"
                                        >
                                            Status
                                        </label>
                                        <select
                                            id="status"
                                            name="status"
                                            onChange={handleEditChange}
                                            value={
                                                editCashTransactionForm.status
                                            }
                                            className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                                        >
                                            <option value="0">
                                                Pilih Status
                                            </option>
                                            <option value="pending">
                                                Pending
                                            </option>
                                            <option value="paying">
                                                Proses Pembayaran
                                            </option>
                                            <option value="paid">
                                                Sudah Dibayar
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- Modal footer --> */}
                            <div className="flex items-center justify-end border-t border-default space-x-4 pt-4 md:pt-5">
                                <button
                                    type="submit"
                                    className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                                >
                                    {loading ? <Loading /> : "Update"}
                                </button>
                                <button
                                    onClick={() =>
                                        editCashTransactionModalRef.current.hide()
                                    }
                                    type="button"
                                    className="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                                >
                                    Close
                                </button>
                            </div>
                        </form>
                    </>
                }
            />

            {/* Popup modal for delete cash transaction */}
            <PopupModalComponent
                idElement={"delete-cash-transaction-modal"}
                ref={deleteCashTransactionModalRef}
                children={
                    <>
                        <div className="p-4 md:p-5 text-center">
                            <svg
                                className="mx-auto mb-4 text-fg-disabled w-12 h-12"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                            <h3 className="mb-6 text-body">
                                Apakah kamu ingin menghapus transaksi kas ini ?
                            </h3>
                            <div className="flex items-center space-x-4 justify-center">
                                <button
                                    onClick={() =>
                                        handleDeleteCashTransaction(
                                            deleteCashTransactionCode,
                                        )
                                    }
                                    type="button"
                                    className="text-white bg-danger box-border border border-transparent hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                                >
                                    Ya
                                </button>
                                <button
                                    onClick={() =>
                                        deleteCashTransactionModalRef.current.hide()
                                    }
                                    type="button"
                                    className="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                                >
                                    Tidak
                                </button>
                            </div>
                        </div>
                    </>
                }
            />
        </>
    );
};

export default CashierCashTransactions;
