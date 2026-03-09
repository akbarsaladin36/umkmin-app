import { useEffect, useRef, useState } from "react";
import useCategoriesStore from "../../stores/category";
import TablePagination from "../../components/TablePagination";
import ModalComponent from "../../components/Modal";
import Loading from "../../components/SpinnerLoading";
import PopupModalComponent from "../../components/PopupModal";
import SearchInput from "../../components/SearchInput";
import { BsTrash3 } from "react-icons/bs";
import { HiOutlinePencilSquare } from "react-icons/hi2";

const Categories = () => {
    const [createCategoryForm, setCreateCategoryForm] = useState({
        name: "",
        description: "",
    });
    const [editCategoryForm, setEditCategoryForm] = useState({
        name: "",
        description: "",
    });
    const [categoryName, setDeleteCategoryName] = useState(null);
    const createCategoryModalRef = useRef(null);
    const editCategoryModalRef = useRef(null);
    const deleteCategoryModalRef = useRef(null);

    const {
        categories,
        pagination,
        categoryDetail,
        GetCategories,
        GetCategory,
        CreateCategory,
        UpdateCategory,
        DeleteCategory,
        loading,
    } = useCategoriesStore();

    useEffect(() => {
        GetCategories(1);
    }, []);

    useEffect(() => {
        if (categoryDetail && categoryDetail.name) {
            setEditCategoryForm({
                name: categoryDetail.name,
                description: categoryDetail.description,
            });
        }
    }, [categoryDetail]);

    const handleChange = (e) => {
        setCreateCategoryForm({
            ...createCategoryForm,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {
        setCreateCategoryForm({
            name: "",
            description: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            name: createCategoryForm.name,
            description: createCategoryForm.description,
        };
        await CreateCategory(data);
        createCategoryModalRef.current.hide();
        resetForm();
        GetCategories(1);
    };

    const showEditModal = async (categoryName) => {
        editCategoryModalRef.current.show();
        await GetCategory(categoryName);
    };

    const handleEditChange = (e) => {
        setEditCategoryForm({
            ...editCategoryForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const data = {
            name: editCategoryForm.name,
            description: editCategoryForm.description,
        };
        await UpdateCategory(categoryDetail.name, data);
        editCategoryModalRef.current.hide();
    };

    const showDeleteCategoryModal = (categoryName) => {
        setDeleteCategoryName(categoryName);
        deleteCategoryModalRef.current.show();
    };

    const handleDeleteCategory = async (categoryName) => {
        await DeleteCategory(categoryName);
        deleteCategoryModalRef.current.hide();
    };

    return (
        <>
            <h1 className="text-4xl font-bold">Categories</h1>
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
                            onSearch={(value) => GetCategories(1, value)}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => createCategoryModalRef.current.show()}
                        className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                    >
                        Create Category
                    </button>
                </div>
                <table className="w-full text-sm text-left rtl:text-right text-body">
                    <thead className="text-sm text-body bg-neutral-secondary-medium border-b border-default-medium">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                No
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Description
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length === 0 && (
                            <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
                                <td
                                    colSpan="6"
                                    className="text-center px-6 py-4"
                                >
                                    Belum ada data kategori yang ditampilkan
                                </td>
                            </tr>
                        )}

                        {categories.map((category) => (
                            <tr
                                className="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium"
                                key={category.id}
                            >
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                                >
                                    {category.no}
                                </th>
                                <td className="px-6 py-4">{category.name}</td>
                                <td className="px-6 py-4">
                                    {category.description}
                                </td>
                                <td className="px-6 py-4 space-x-5">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            showEditModal(category.name)
                                        }
                                        className="border border-fg-brand p-3 rounded-xs font-medium text-fg-brand cursor-pointer hover:bg-fg-brand hover:text-white"
                                    >
                                        <HiOutlinePencilSquare />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            showDeleteCategoryModal(
                                                category.name,
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
                    onPageChange={(page) => GetCategories(page)}
                />
            </div>

            {/* Create Category Modal */}
            <ModalComponent
                idElement={"create-category-modal"}
                title={"Create Category"}
                ref={createCategoryModalRef}
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
                                            onChange={handleChange}
                                            value={createCategoryForm.name}
                                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                            placeholder="category name"
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
                                                createCategoryForm.description
                                            }
                                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                            placeholder="category description"
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
                                        createCategoryModalRef.current.hide()
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

            {/* Edit Category Modal */}
            <ModalComponent
                idElement={"edit-category-modal"}
                title={"Edit Category"}
                ref={editCategoryModalRef}
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
                                            onChange={handleEditChange}
                                            value={editCategoryForm.name}
                                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                            placeholder="category name"
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
                                            value={editCategoryForm.description}
                                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                            placeholder="category description"
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
                                        editCategoryModalRef.current.hide()
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

            {/* Popup modal for delete category */}
            <PopupModalComponent
                idElement={"delete-category-modal"}
                ref={deleteCategoryModalRef}
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
                                Apakah kamu ingin menghapus kategori ini ?
                            </h3>
                            <div className="flex items-center space-x-4 justify-center">
                                <button
                                    onClick={() =>
                                        handleDeleteCategory(categoryName)
                                    }
                                    type="button"
                                    className="text-white bg-danger box-border border border-transparent hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                                >
                                    Ya
                                </button>
                                <button
                                    onClick={() =>
                                        deleteCategoryModalRef.current.hide()
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

export default Categories;
