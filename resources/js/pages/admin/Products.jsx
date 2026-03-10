import { useState, useEffect, useRef } from "react";
import useProductsStore from "../../stores/product";
import TablePagination from "../../components/TablePagination";
import ModalComponent from "../../components/Modal";
import Loading from "../../components/SpinnerLoading";
import PopupModalComponent from "../../components/PopupModal";
import SearchInput from "../../components/SearchInput";
import { BsTrash3 } from "react-icons/bs";
import { HiOutlinePencilSquare } from "react-icons/hi2";

const Products = () => {
    const [createProductForm, setCreateProductForm] = useState({
        category_id: "",
        name: "",
        cost_price: "",
        selling_price: "",
        stock: "",
        min_stock: "",
    });
    const [editProductForm, setEditProductForm] = useState({
        category_id: "",
        name: "",
        cost_price: "",
        selling_price: "",
        stock: "",
        min_stock: "",
    });
    const [deleteProductCode, setDeleteProductCode] = useState(null);
    const createProductModalRef = useRef(null);
    const editProductModalRef = useRef(null);
    const deleteProductModalRef = useRef(null);

    const {
        products,
        pagination,
        categories,
        productDetail,
        GetProducts,
        GetListCategories,
        GetProduct,
        CreateProduct,
        UpdateProduct,
        DeleteProduct,
        loading,
    } = useProductsStore();

    useEffect(() => {
        GetProducts(1);
        GetListCategories();
    }, []);

    useEffect(() => {
        if (productDetail && productDetail.name) {
            setEditProductForm({
                category_id: productDetail.category_id,
                name: productDetail.name,
                cost_price: productDetail.cost_price,
                selling_price: productDetail.selling_price,
                stock: productDetail.stock,
                min_stock: productDetail.min_stock,
            });
        }
    }, [productDetail]);

    const handleChange = (e) => {
        setCreateProductForm({
            ...createProductForm,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {
        setCreateProductForm({
            category_id: "",
            name: "",
            cost_price: "",
            selling_price: "",
            stock: "",
            min_stock: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            category_id: createProductForm.category_id,
            name: createProductForm.name,
            cost_price: createProductForm.cost_price,
            selling_price: createProductForm.selling_price,
            stock: createProductForm.stock,
            min_stock: createProductForm.min_stock,
        };
        await CreateProduct(data);
        createProductModalRef.current.hide();
        resetForm();
        GetProducts(1);
    };

    const showEditModal = async (productCode) => {
        editProductModalRef.current.show();
        await GetProduct(productCode);
    };

    const handleEditChange = (e) => {
        setEditProductForm({
            ...editProductForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const data = {
            category_id: editProductForm.category_id,
            name: editProductForm.name,
            cost_price: editProductForm.cost_price,
            selling_price: editProductForm.selling_price,
            stock: editProductForm.stock,
            min_stock: editProductForm.min_stock,
        };
        await UpdateProduct(productDetail.code, data);
        editProductModalRef.current.hide();
    };

    const showDeleteProductModal = (productCode) => {
        setDeleteProductCode(productCode);
        deleteProductModalRef.current.show();
    };

    const handleDeleteProduct = async (productCode) => {
        await DeleteProduct(productCode);
        deleteProductModalRef.current.hide();
    };

    return (
        <>
            <h1 className="text-4xl font-bold">Products</h1>
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
                            onSearch={(value) => GetProducts(1, value)}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => createProductModalRef.current.show()}
                        className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                    >
                        Create Product
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
                                Barcode
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Cost Price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Selling Price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Stock
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 && (
                            <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
                                <td
                                    colSpan="6"
                                    className="text-center px-6 py-4"
                                >
                                    Belum ada data produk yang ditampilkan
                                </td>
                            </tr>
                        )}
                        {products.map((product) => (
                            <tr
                                className="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium"
                                key={product.code}
                            >
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                                >
                                    {product.no}
                                </th>
                                <td className="px-6 py-4">{product.code}</td>
                                <td className="px-6 py-4">{product.barcode}</td>
                                <td className="px-6 py-4">{product.name}</td>
                                <td className="px-6 py-4">
                                    {product.cost_price}
                                </td>
                                <td className="px-6 py-4">
                                    {product.selling_price}
                                </td>
                                <td className="px-6 py-4">{product.stock}</td>
                                <td className="px-6 py-4 space-x-5">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            showEditModal(product.code)
                                        }
                                        className="border border-fg-brand p-3 rounded-xs font-medium text-fg-brand cursor-pointer hover:bg-fg-brand hover:text-white"
                                    >
                                        <HiOutlinePencilSquare />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            showDeleteProductModal(product.code)
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
                    onPageChange={(page) => GetProducts(page)}
                />
            </div>

            {/* Create Product Modal */}
            <ModalComponent
                idElement={"create-product-modal"}
                title={"Create Product"}
                ref={createProductModalRef}
                children={
                    <>
                        {/* <!-- Modal body --> */}
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4 md:space-y-6 py-4 md:py-6">
                                <div className="grid md:grid-cols-2 space-x-6 gap-3">
                                    <div className="mt-3">
                                        <div className="mb-3">
                                            <label
                                                htmlFor="name"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                onChange={handleChange}
                                                value={createProductForm.name}
                                                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                                placeholder="product name"
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="cost_price"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                Cost Price
                                            </label>
                                            <input
                                                type="text"
                                                id="cost_price"
                                                name="cost_price"
                                                onChange={handleChange}
                                                value={
                                                    createProductForm.cost_price
                                                }
                                                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                                placeholder="150000"
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="stock"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                Stock
                                            </label>
                                            <input
                                                type="text"
                                                id="stock"
                                                name="stock"
                                                onChange={handleChange}
                                                value={createProductForm.stock}
                                                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                                placeholder="20"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <div className="mb-3">
                                            <label
                                                htmlFor="category_id"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                Category
                                            </label>
                                            <select
                                                id="category_id"
                                                name="category_id"
                                                value={
                                                    createProductForm.category_id
                                                }
                                                onChange={handleChange}
                                                className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                                            >
                                                <option value="0">
                                                    Pilih Kategori
                                                </option>
                                                {categories.map((category) => (
                                                    <option
                                                        value={category.id}
                                                        key={category.id}
                                                    >
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="selling_price"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                Selling Price
                                            </label>
                                            <input
                                                type="text"
                                                id="selling_price"
                                                name="selling_price"
                                                onChange={handleChange}
                                                value={
                                                    createProductForm.selling_price
                                                }
                                                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                                placeholder="150000"
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="min_stock"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                Minimal Stock
                                            </label>
                                            <input
                                                type="text"
                                                id="min_stock"
                                                name="min_stock"
                                                onChange={handleChange}
                                                value={
                                                    createProductForm.min_stock
                                                }
                                                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                                placeholder="20"
                                                required
                                            />
                                        </div>
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
                                        createProductModalRef.current.hide()
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

            {/* Edit Product Modal */}
            <ModalComponent
                idElement={"edit-product-modal"}
                title={"Edit Product"}
                ref={editProductModalRef}
                children={
                    <>
                        {/* <!-- Modal body --> */}
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="space-y-4 md:space-y-6 py-4 md:py-6">
                                <div className="grid md:grid-cols-2 space-x-6 gap-3">
                                    <div className="mt-3">
                                        <div className="mb-3">
                                            <label
                                                htmlFor="name"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                onChange={handleEditChange}
                                                value={editProductForm.name}
                                                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                                placeholder="product name"
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="cost_price"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                Cost Price
                                            </label>
                                            <input
                                                type="text"
                                                id="cost_price"
                                                name="cost_price"
                                                onChange={handleEditChange}
                                                value={
                                                    editProductForm.cost_price
                                                }
                                                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                                placeholder="150000"
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="stock"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                Stock
                                            </label>
                                            <input
                                                type="text"
                                                id="stock"
                                                name="stock"
                                                onChange={handleEditChange}
                                                value={editProductForm.stock}
                                                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                                placeholder="20"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <div className="mb-3">
                                            <label
                                                htmlFor="category_id"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                Category
                                            </label>
                                            <select
                                                id="category_id"
                                                name="category_id"
                                                value={
                                                    editProductForm.category_id
                                                }
                                                onChange={handleEditChange}
                                                className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                                            >
                                                <option value="0">
                                                    Pilih Kategori
                                                </option>
                                                {categories.map((category) => (
                                                    <option
                                                        value={category.id}
                                                        key={category.id}
                                                    >
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="selling_price"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                Selling Price
                                            </label>
                                            <input
                                                type="text"
                                                id="selling_price"
                                                name="selling_price"
                                                onChange={handleEditChange}
                                                value={
                                                    editProductForm.selling_price
                                                }
                                                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                                placeholder="150000"
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="min_stock"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                Minimal Stock
                                            </label>
                                            <input
                                                type="text"
                                                id="min_stock"
                                                name="min_stock"
                                                onChange={handleEditChange}
                                                value={
                                                    editProductForm.min_stock
                                                }
                                                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                                placeholder="20"
                                                required
                                            />
                                        </div>
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
                                        editProductModalRef.current.hide()
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

            {/* Popup modal for delete product */}
            <PopupModalComponent
                idElement={"delete-product-modal"}
                ref={deleteProductModalRef}
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
                                Apakah kamu ingin menghapus product ini ?
                            </h3>
                            <div className="flex items-center space-x-4 justify-center">
                                <button
                                    onClick={() =>
                                        handleDeleteProduct(deleteProductCode)
                                    }
                                    type="button"
                                    className="text-white bg-danger box-border border border-transparent hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                                >
                                    Ya
                                </button>
                                <button
                                    onClick={() =>
                                        deleteProductModalRef.current.hide()
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

export default Products;
