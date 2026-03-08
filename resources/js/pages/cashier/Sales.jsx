import { useEffect, useRef, useState } from "react";
import useCashierSalesStore from "../../stores/cashier/sale";
import TablePagination from "../../components/TablePagination";
import ModalComponent from "../../components/Modal";
import Loading from "../../components/SpinnerLoading";
import PopupModalComponent from "../../components/PopupModal";
import SearchInput from "../../components/SearchInput";
import { BsTrash3 } from "react-icons/bs";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import toast from "react-hot-toast";
import useAuthStore from "../../stores/auth";

const CashierSales = () => {
    const [createSaleForm, setCreateSaleForm] = useState({
        user_uuid: "",
        discount: "",
    });
    const [selectedProduct, setSelectedProduct] = useState("");
    const [items, setItems] = useState([]);
    const [editSaleForm, setEditSaleForm] = useState({
        payment_method: "",
        paid_amount: "",
        status: "",
    });
    const [deleteSaleCode, setDeleteSaleCode] = useState(null);
    const user = useAuthStore((state) => state.user);
    const createSaleModalRef = useRef(null);
    const editSaleModalRef = useRef(null);
    const deleteSaleModalRef = useRef(null);

    const {
        sales,
        pagination,
        products,
        saleItems,
        saleDetail,
        GetSalesByKasir,
        GetListProducts,
        GetSaleItemByCode,
        GetSale,
        CreateSale,
        UpdateSale,
        DeleteSale,
        loading,
    } = useCashierSalesStore();

    useEffect(() => {
        GetSalesByKasir(user.username, 1);
        GetListProducts();
    }, []);

    useEffect(() => {
        if (saleDetail && saleDetail.code) {
            setEditSaleForm({
                payment_method: saleDetail.payment_method || "",
                paid_amount: saleDetail.paid_amount || "",
                status: saleDetail.status || "",
            });
        }
    }, [saleDetail]);

    const handleChange = (e) => {
        setCreateSaleForm({
            ...createSaleForm,
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
            price: product.selling_price,
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
        setCreateSaleForm({
            user_uuid: "",
            discount: "",
        });
        setItems([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            user_uuid: createSaleForm.user_uuid,
            discount: createSaleForm.discount,
            items: items,
        };
        await CreateSale(data);
        createSaleModalRef.current.hide();
        resetForm();
        // GetSalesByKasir(user.username,1);
    };

    const showEditModal = async (saleCode) => {
        editSaleModalRef.current.show();
        await GetSale(saleCode);
        await GetSaleItemByCode(saleCode);
    };

    const handleEditChange = (e) => {
        setEditSaleForm({
            ...editSaleForm,
            [e.target.name]: e.target.value,
        });
    };

    const totalSubtotal = saleItems.reduce((total, item) => {
        return total + Number(item.subtotal);
    }, 0);

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const data = {
            payment_method: editSaleForm.payment_method,
            paid_amount: totalSubtotal,
            status: editSaleForm.status,
        };
        await UpdateSale(saleDetail.code, data);
        editSaleModalRef.current.hide();
    };

    const showDeleteSaleModal = (saleCode) => {
        setDeleteSaleCode(saleCode);
        deleteSaleModalRef.current.show();
    };

    const handleDeleteSale = async (saleCode) => {
        await DeleteSale(saleCode);
        deleteSaleModalRef.current.hide();
    };

    return (
        <>
            <h1 className="text-4xl font-bold">Sales</h1>
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
                                GetSalesByKasir(user.username, 1, value)
                            }
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => createSaleModalRef.current.show()}
                        className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                    >
                        Create Sale
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
                        {sales.length === 0 && (
                            <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
                                <td
                                    colSpan="6"
                                    className="text-center px-6 py-4"
                                >
                                    Belum ada data penjualan yang ditampilkan
                                </td>
                            </tr>
                        )}

                        {sales.map((sale) => (
                            <tr
                                className="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium"
                                key={sale.code}
                            >
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                                >
                                    {sale.no}
                                </th>
                                <td className="px-6 py-4">{sale.code}</td>
                                <td className="px-6 py-4">{sale.invoice_no}</td>
                                <td className="px-6 py-4">
                                    {sale.total_amount}
                                </td>
                                <td className="px-6 py-4">{sale.status}</td>
                                <td className="px-6 py-4 space-x-5">
                                    <button
                                        type="button"
                                        onClick={() => showEditModal(sale.code)}
                                        className="border border-fg-brand p-3 rounded-xs font-medium text-fg-brand cursor-pointer hover:bg-fg-brand hover:text-white"
                                    >
                                        <HiOutlinePencilSquare />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            showDeleteSaleModal(sale.code)
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
                        GetSalesByKasir(user.username, page)
                    }
                />
            </div>

            {/* Create Sale Modal */}
            <ModalComponent
                idElement={"create-sale-modal"}
                title={"Create Sale"}
                customSize={"w-300"}
                ref={createSaleModalRef}
                children={
                    <>
                        {/* <!-- Modal body --> */}
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4 md:space-y-6 py-4 md:py-6">
                                <div className="grid md:grid-cols-2 space-x-6 gap-3">
                                    <div className="mt-3">
                                        <div className="mb-3">
                                            <label
                                                htmlFor="user_uuid"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                List User
                                            </label>
                                            <select
                                                id="user_uuid"
                                                name="user_uuid"
                                                value={createSaleForm.user_uuid}
                                                onChange={handleChange}
                                                className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                                            >
                                                <option value="0">
                                                    Pilih User
                                                </option>
                                                <option value={user.uuid}>
                                                    {user.first_name &&
                                                    user.last_name
                                                        ? `${user.first_name} ${user.last_name}`
                                                        : user.username}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <div className="mb-3">
                                            <label
                                                htmlFor="discount"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                Discount
                                            </label>
                                            <input
                                                type="text"
                                                id="discount"
                                                name="discount"
                                                onChange={handleChange}
                                                value={createSaleForm.discount}
                                                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                                placeholder="150000"
                                                required
                                            />
                                        </div>
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
                                                                id="price"
                                                                name="price"
                                                                onChange={(e) =>
                                                                    handleChangeItems(
                                                                        index,
                                                                        "price",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    item.price
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
                                        createSaleModalRef.current.hide()
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

            {/* Edit Sale Modal */}
            <ModalComponent
                idElement={"edit-sale-modal"}
                title={"Edit Sale"}
                customSize={"w-300"}
                ref={editSaleModalRef}
                children={
                    <>
                        {/* <!-- Modal body --> */}
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="space-y-4 md:space-y-6 py-4 md:py-6">
                                <div className="mt-3">
                                    <div className="mb-3">
                                        <label
                                            htmlFor="payment_method"
                                            className="block mb-2.5 text-sm font-medium text-heading"
                                        >
                                            Payment Method
                                        </label>
                                        <select
                                            id="payment_method"
                                            name="payment_method"
                                            onChange={handleEditChange}
                                            value={editSaleForm.payment_method}
                                            className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                                        >
                                            <option value="no-payment-method">
                                                Pilih Pembayaran
                                            </option>
                                            <option value="cash">Cash</option>
                                            <option value="qris">QRIS</option>
                                            <option value="debit-card">
                                                Debit Card
                                            </option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="cost_price"
                                            className="block mb-2.5 text-sm font-medium text-heading"
                                        >
                                            Paid Amount
                                        </label>
                                        <input
                                            type="text"
                                            id="paid_amount"
                                            name="paid_amount"
                                            onChange={handleEditChange}
                                            value={totalSubtotal}
                                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                            placeholder="150000"
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
                                            value={editSaleForm.status}
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
                                                        Sale Item Code
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 font-medium"
                                                    >
                                                        Sale Code
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
                                                {saleItems.length === 0 && (
                                                    <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
                                                        <td
                                                            colSpan="5"
                                                            className="text-center px-6 py-4"
                                                        >
                                                            Belum ada item
                                                        </td>
                                                    </tr>
                                                )}

                                                {saleItems.map(
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
                                                                {
                                                                    item.sale_item_code
                                                                }
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {item.sale_code}
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
                                                                {item.price}
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
                                        editSaleModalRef.current.hide()
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

            {/* Popup modal for delete sale */}
            <PopupModalComponent
                idElement={"delete-sale-modal"}
                ref={deleteSaleModalRef}
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
                                Apakah kamu ingin menghapus penjualan ini ?
                            </h3>
                            <div className="flex items-center space-x-4 justify-center">
                                <button
                                    onClick={() =>
                                        handleDeleteSale(deleteSaleCode)
                                    }
                                    type="button"
                                    className="text-white bg-danger box-border border border-transparent hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                                >
                                    Ya
                                </button>
                                <button
                                    onClick={() =>
                                        deleteSaleModalRef.current.hide()
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

export default CashierSales;
