import { useEffect, useRef, useState } from "react";
import usePurchasesStore from "../../stores/purchase";
import TablePagination from "../../components/TablePagination";
import ModalComponent from "../../components/Modal";
import Loading from "../../components/SpinnerLoading";
import PopupModalComponent from "../../components/PopupModal";
import SearchInput from "../../components/SearchInput";
import { BsTrash3 } from "react-icons/bs";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import toast from "react-hot-toast";

const Purchases = () => {
    const [createPurchaseForm, setCreatePurchaseForm] = useState({
        supplier_uuid: "",
        due_date: new Date(Date.now()),
    });
    const [selectedProduct, setSelectedProduct] = useState("");
    const [items, setItems] = useState([]);
    const [editPurchaseForm, setEditPurchaseForm] = useState({
        status: "",
    });
    const [deletePurchaseCode, setDeletePurchaseCode] = useState(null);
    const createPurchaseModalRef = useRef(null);
    const editPurchaseModalRef = useRef(null);
    const deletePurchaseModalRef = useRef(null);

    const {
        purchases,
        pagination,
        suppliers,
        products,
        purchaseItems,
        purchaseDetail,
        GetPurchases,
        GetListSuppliers,
        GetListProducts,
        GetPurchaseItemsByCode,
        GetPurchase,
        CreatePurchase,
        UpdatePurchase,
        DeletePurchase,
        loading,
    } = usePurchasesStore();

    useEffect(() => {
        GetPurchases(1);
        GetListSuppliers();
        GetListProducts();
    }, []);

    useEffect(() => {
        if (purchaseDetail && purchaseDetail.code) {
            setEditPurchaseForm({
                payment_method: purchaseDetail.payment_method,
                paid_amount: purchaseDetail.paid_amount,
                status: purchaseDetail.status,
            });
        }
    }, [purchaseDetail]);

    const handleChange = (e) => {
        setCreatePurchaseForm({
            ...createPurchaseForm,
            [e.target.name]: e.target.value,
        });
    };

    const addItem = () => {
        if (!selectedProduct) {
            toast.error("Pilih produk terlebih dahulu!");
            return;
        }
        const product = products.find((p) => p.code == selectedProduct);
        if (!product) return;
        const itemExist = items.some(
            (item) => item.product_code === product.code,
        );
        if (itemExist) {
            toast.error("Data produk sudah didaftarkan di tabel di bawah!");
            setSelectedProduct("");
            return;
        }
        const newItem = {
            name: product.name,
            product_code: product.code,
            quantity: "",
            cost_price: product.selling_price,
        };
        setItems([...items, newItem]);
        setSelectedProduct("");
    };

    const removeItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleChangeItems = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const resetForm = () => {
        setCreatePurchaseForm({
            supplier_uuid: "",
            due_date: new Date(Date.now()),
        });
        setItems([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            supplier_uuid: createPurchaseForm.supplier_uuid,
            due_date: createPurchaseForm.due_date,
        };
        await CreatePurchase(data);
        createPurchaseModalRef.current.hide();
        resetForm();
    };

    const showEditModal = async (saleCode) => {
        editPurchaseModalRef.current.show();
        await GetPurchase(saleCode);
        await GetPurchaseItemsByCode(saleCode);
    };

    const handleEditChange = (e) => {
        setEditPurchaseForm({
            ...editPurchaseForm,
            [e.target.name]: e.target.value,
        });
    };

    const totalSubtotal = purchaseItems.reduce((total, item) => {
        return total + Number(item.subtotal);
    }, 0);

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const data = {
            status: editPurchaseForm.status,
        };
        await UpdatePurchase(purchaseDetail.code, data);
        editPurchaseModalRef.current.hide();
    };

    const showDeletePurchaseModal = (purchaseCode) => {
        setDeletePurchaseCode(purchaseCode);
        deletePurchaseModalRef.current.show();
    };

    const handleDeletePurchase = async (purchaseCode) => {
        await DeletePurchase(purchaseCode);
        deletePurchaseModalRef.current.hide();
    };

    return (
        <>
            <h1 className="text-4xl font-bold">Purchases</h1>
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
                            onSearch={(value) => GetPurchases(1, value)}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => createPurchaseModalRef.current.show()}
                        className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                    >
                        Create Purchase
                    </button>
                </div>
                <table className="w-full text-sm text-left rtl:text-right text-body">
                    <thead className="text-sm text-body bg-neutral-secondary-medium border-b border-default-medium">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                No
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Code
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Invoice No
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Total Amount
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
                        {purchases.map((purchase) => (
                            <tr
                                className="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium"
                                key={purchase.code}
                            >
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                                >
                                    {purchase.no}
                                </th>
                                <td className="px-6 py-4">{purchase.code}</td>
                                <td className="px-6 py-4">
                                    {purchase.invoice_no}
                                </td>
                                <td className="px-6 py-4">
                                    {purchase.total_amount}
                                </td>
                                <td className="px-6 py-4">{purchase.status}</td>
                                <td className="px-6 py-4 space-x-5">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            showEditModal(purchase.code)
                                        }
                                        className="border border-fg-brand p-3 rounded-xs font-medium text-fg-brand cursor-pointer hover:bg-fg-brand hover:text-white"
                                    >
                                        <HiOutlinePencilSquare />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            showDeletePurchaseModal(
                                                purchase.code,
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
                    onPageChange={(page) => GetPurchases(page)}
                />
            </div>

            {/* Create Purchase Modal */}
            <ModalComponent
                idElement={"create-purchase-modal"}
                title={"Create Purchase"}
                customSize={"w-300"}
                ref={createPurchaseModalRef}
                children={
                    <>
                        {/* <!-- Modal body --> */}
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4 md:space-y-6 py-4 md:py-6">
                                <div className="mt-3">
                                    <div className="mb-3">
                                        <label
                                            htmlFor="supplier_uuid"
                                            className="block mb-2.5 text-sm font-medium text-heading"
                                        >
                                            List Suppliers
                                        </label>
                                        <select
                                            id="supplier_uuid"
                                            name="supplier_uuid"
                                            value={
                                                createPurchaseForm.supplier_uuid
                                            }
                                            onChange={handleChange}
                                            className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                                        >
                                            <option value="0">
                                                Pilih Supplier
                                            </option>
                                            {suppliers.map((supplier) => (
                                                <option
                                                    value={supplier.uuid}
                                                    key={supplier.uuid}
                                                >
                                                    {supplier.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center max-w-sm mx-auto space-x-2">
                                    <select
                                        value={selectedProduct}
                                        onChange={(e) =>
                                            setSelectedProduct(e.target.value)
                                        }
                                        className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                                    >
                                        <option value="0">Pilih Produk</option>
                                        {products.map((product) => (
                                            <option
                                                value={product.code}
                                                key={product.code}
                                            >
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => addItem()}
                                        className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                                    >
                                        Add
                                    </button>
                                </div>
                                {/* List Items From Products*/}
                                <div className="mt-3">
                                    <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
                                        <table className="w-full text-sm text-left rtl:text-right text-body">
                                            <thead className="bg-neutral-secondary-soft border-b border-default">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 font-medium"
                                                    >
                                                        Product Name
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 font-medium"
                                                    >
                                                        Product Code
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 font-medium"
                                                    >
                                                        Quantity
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 font-medium"
                                                    >
                                                        Price
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 font-medium"
                                                    >
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.length === 0 && (
                                                    <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
                                                        <td
                                                            colSpan="5"
                                                            className="text-center px-6 py-4"
                                                        >
                                                            Belum ada item
                                                        </td>
                                                    </tr>
                                                )}

                                                {items.map((item, index) => (
                                                    <tr
                                                        key={index}
                                                        className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default"
                                                    >
                                                        <th
                                                            scope="row"
                                                            className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                                                        >
                                                            {item.name}
                                                        </th>
                                                        <td className="px-6 py-4">
                                                            {item.product_code}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <input
                                                                type="text"
                                                                id="quantity"
                                                                name="quantity"
                                                                onChange={(e) =>
                                                                    handleChangeItems(
                                                                        index,
                                                                        "quantity",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    item.quantity
                                                                }
                                                                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                                                placeholder="20"
                                                                required
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <input
                                                                type="text"
                                                                id="cost_price"
                                                                name="cost_price"
                                                                onChange={(e) =>
                                                                    handleChangeItems(
                                                                        index,
                                                                        "cost_price",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    item.cost_price
                                                                }
                                                                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                                                placeholder="150000"
                                                                required
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <button
                                                                onClick={() =>
                                                                    removeItem(
                                                                        index,
                                                                    )
                                                                }
                                                                className="font-medium text-fg-brand hover:underline"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
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
                                        createPurchaseModalRef.current.hide()
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

            {/* Edit Purchase Modal */}
            <ModalComponent
                idElement={"edit-purchase-modal"}
                title={"Edit Purchase"}
                customSize={"w-300"}
                ref={editPurchaseModalRef}
                children={
                    <>
                        {/* <!-- Modal body --> */}
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="space-y-4 md:space-y-6 py-4 md:py-6">
                                <div className="mt-3">
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
                                            value={editPurchaseForm.status}
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
                            <div className="mt-3">
                                <p className="mb-3 text-center font-bold">
                                    Daftar Item
                                </p>
                                <div className="mt-3">
                                    <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
                                        <table className="w-full text-sm text-left rtl:text-right text-body">
                                            <thead className="bg-neutral-secondary-soft border-b border-default">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 font-medium"
                                                    >
                                                        No
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 font-medium"
                                                    >
                                                        Purchase Item Code
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 font-medium"
                                                    >
                                                        Purchase Code
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 font-medium"
                                                    >
                                                        Product Code
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 font-medium"
                                                    >
                                                        Quantity
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 font-medium"
                                                    >
                                                        Price
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 font-medium"
                                                    >
                                                        Subtotal
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {purchaseItems.length === 0 && (
                                                    <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
                                                        <td
                                                            colSpan="5"
                                                            className="text-center px-6 py-4"
                                                        >
                                                            Belum ada item
                                                        </td>
                                                    </tr>
                                                )}

                                                {purchaseItems.map(
                                                    (item, index) => (
                                                        <tr
                                                            key={index + 1}
                                                            className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default"
                                                        >
                                                            <th
                                                                scope="row"
                                                                className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                                                            >
                                                                {index + 1}
                                                            </th>
                                                            <td className="px-6 py-4">
                                                                {item.code}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {
                                                                    item.purchase_code
                                                                }
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {
                                                                    item.product_code
                                                                }
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {item.quantity}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {
                                                                    item.cost_price
                                                                }
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {item.subtotal}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
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
                                        editPurchaseModalRef.current.hide()
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

            {/* Popup modal for delete purchase */}
            <PopupModalComponent
                idElement={"delete-purchase-modal"}
                ref={deletePurchaseModalRef}
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
                                Apakah kamu ingin menghapus pembelian ini ?
                            </h3>
                            <div className="flex items-center space-x-4 justify-center">
                                <button
                                    onClick={() =>
                                        handleDeletePurchase(deletePurchaseCode)
                                    }
                                    type="button"
                                    className="text-white bg-danger box-border border border-transparent hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                                >
                                    Ya
                                </button>
                                <button
                                    onClick={() =>
                                        deletePurchaseModalRef.current.hide()
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

export default Purchases;
