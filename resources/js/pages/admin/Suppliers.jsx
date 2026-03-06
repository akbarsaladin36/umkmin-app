import { useEffect, useRef, useState } from "react";
import useSuppliersStore from "../../stores/supplier";
import TablePagination from "../../components/TablePagination";
import ModalComponent from "../../components/Modal";
import Loading from "../../components/SpinnerLoading";
import PopupModalComponent from "../../components/PopupModal";
import { BsTrash3 } from "react-icons/bs";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import SearchInput from "../../components/SearchInput";

const Suppliers = () => {
    const [createSupplierForm, setCreateSupplierForm] = useState({
        name: "",
        address: "",
        phone_number: "",
    });
    const [editSupplierForm, setEditSupplierForm] = useState({
        name: "",
        address: "",
        phone_number: "",
    });
    const [deleteSupplierCode, setDeleteSupplierCode] = useState(null);
    const createSupplierModalRef = useRef(null);
    const editSupplierModalRef = useRef(null);
    const deleteSupplierModalRef = useRef(null);

    const {
        suppliers,
        pagination,
        supplierDetail,
        GetSuppliers,
        GetSupplier,
        CreateSupplier,
        UpdateSupplier,
        DeleteSupplier,
        loading,
    } = useSuppliersStore();

    useEffect(() => {
        GetSuppliers(1);
    }, []);

    useEffect(() => {
        if (supplierDetail && supplierDetail.code) {
            setEditSupplierForm({
                name: supplierDetail.name,
                address: supplierDetail.address,
                phone_number: supplierDetail.phone_number,
            });
        }
    }, [supplierDetail]);

    const handleChange = (e) => {
        setCreateSupplierForm({
            ...createSupplierForm,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {
        setCreateSupplierForm({
            name: "",
            address: "",
            phone_number: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            name: createSupplierForm.name,
            address: createSupplierForm.address,
            phone_number: createSupplierForm.phone_number,
        };
        await CreateSupplier(data);
        createSupplierModalRef.current.hide();
        resetForm();
        GetSuppliers(1);
    };

    const showEditModal = async (supplierCode) => {
        editSupplierModalRef.current.show();
        await GetSupplier(supplierCode);
    };

    const handleEditChange = (e) => {
        setEditSupplierForm({
            ...editSupplierForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const data = {
            name: editSupplierForm.name,
            address: editSupplierForm.address,
            phone_number: editSupplierForm.address,
        };
        await UpdateSupplier(supplierDetail.code, data);
        editSupplierModalRef.current.hide();
    };

    const showDeleteSupplierModal = (supplierCode) => {
        setDeleteSupplierCode(supplierCode);
        deleteSupplierModalRef.current.show();
    };

    const handleDeleteSupplier = async (supplierCode) => {
        await DeleteSupplier(supplierCode);
        deleteSupplierModalRef.current.hide();
    };

    return (
        <>
            <h1 className="text-4xl font-bold">Suppliers</h1>
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
                            onSearch={(value) => GetSuppliers(1, value)}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => createSupplierModalRef.current.show()}
                        className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                    >
                        Create Supplier
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
                                Full Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Address
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map((supplier) => (
                            <tr
                                className="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium"
                                key={supplier.code}
                            >
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                                >
                                    {supplier.no}
                                </th>
                                <td className="px-6 py-4">{supplier.code}</td>
                                <td className="px-6 py-4">{supplier.name}</td>
                                <td className="px-6 py-4">
                                    {supplier.address}
                                </td>
                                <td className="px-6 py-4 space-x-5">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            showEditModal(supplier.code)
                                        }
                                        className="border border-fg-brand p-3 rounded-xs font-medium text-fg-brand cursor-pointer hover:bg-fg-brand hover:text-white"
                                    >
                                        <HiOutlinePencilSquare />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            showDeleteSupplierModal(
                                                supplier.code,
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
                    onPageChange={(page) => GetSuppliers(page)}
                />
            </div>

            {/* Create Supplier Modal */}
            <ModalComponent
                idElement={"create-supplier-modal"}
                title={"Create Supplier"}
                ref={createSupplierModalRef}
                children={
                    <>
                        {/* <!-- Modal body --> */}
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4 md:space-y-6 py-4 md:py-6">
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
                                            value={createSupplierForm.name}
                                            onChange={handleChange}
                                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="address"
                                            className="block mb-2.5 text-sm font-medium text-heading"
                                        >
                                            First name
                                        </label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            value={createSupplierForm.address}
                                            onChange={handleChange}
                                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                            placeholder="Jalan Lewat No.1"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="phone_number"
                                            className="block mb-2.5 text-sm font-medium text-heading"
                                        >
                                            Phone Number
                                        </label>
                                        <input
                                            type="text"
                                            id="phone_number"
                                            name="phone_number"
                                            value={
                                                createSupplierForm.phone_number
                                            }
                                            onChange={handleChange}
                                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                            placeholder="01234567890"
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
                                        createSupplierModalRef.current.hide()
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

            {/* Edit supplier Modal */}
            <ModalComponent
                idElement={"edit-supplier-modal"}
                title={"Edit Supplier"}
                ref={editSupplierModalRef}
                children={
                    <>
                        {/* <!-- Modal body --> */}
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="space-y-4 md:space-y-6 py-4 md:py-6">
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
                                            value={editSupplierForm.name}
                                            onChange={handleEditChange}
                                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="address"
                                            className="block mb-2.5 text-sm font-medium text-heading"
                                        >
                                            First name
                                        </label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            value={editSupplierForm.address}
                                            onChange={handleEditChange}
                                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                            placeholder="Jalan Lewat No.1"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="phone_number"
                                            className="block mb-2.5 text-sm font-medium text-heading"
                                        >
                                            Phone Number
                                        </label>
                                        <input
                                            type="text"
                                            id="phone_number"
                                            name="phone_number"
                                            value={
                                                editSupplierForm.phone_number
                                            }
                                            onChange={handleEditChange}
                                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                            placeholder="01234567890"
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
                                    {loading ? <Loading /> : "Update"}
                                </button>
                                <button
                                    onClick={() =>
                                        editSupplierModalRef.current.hide()
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

            {/* Popup modal for delete supplier */}
            <PopupModalComponent
                idElement={"delete-supplier-modal"}
                ref={deleteSupplierModalRef}
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
                                Apakah kamu ingin menghapus supplier ini ?
                            </h3>
                            <div className="flex items-center space-x-4 justify-center">
                                <button
                                    onClick={() =>
                                        handleDeleteSupplier(deleteSupplierCode)
                                    }
                                    type="button"
                                    className="text-white bg-danger box-border border border-transparent hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                                >
                                    Ya
                                </button>
                                <button
                                    onClick={() =>
                                        deleteSupplierModalRef.current.hide()
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

export default Suppliers;
