import { useEffect, useRef, useState } from "react";
import useUsersStore from "../../stores/user";
import SearchInput from "../../components/SearchInput";
import TablePagination from "../../components/TablePagination";
import ModalComponent from "../../components/Modal";
import Loading from "../../components/SpinnerLoading";
import PopupModalComponent from "../../components/PopupModal";
import { BsTrash3 } from "react-icons/bs";
import { HiOutlinePencilSquare } from "react-icons/hi2";

const Users = () => {
    const [createUserForm, setCreateUserForm] = useState({
        username: "",
        email: "",
        password: "",
        confirm_password: "",
        first_name: "",
        last_name: "",
        address: "",
        phone_number: "",
        role_id: "",
    });
    const [editUserForm, setEditUserForm] = useState({
        first_name: "",
        last_name: "",
        address: "",
        phone_number: "",
        role_id: "",
    });
    const [deleteUsername, setDeleteUsername] = useState(null);
    const createModalRef = useRef(null);
    const editUserModalRef = useRef(null);
    const deleteUserModalRef = useRef(null);

    const {
        users,
        pagination,
        userDetail,
        GetUsers,
        GetUser,
        CreateUser,
        UpdateUser,
        DeleteUser,
        loading,
    } = useUsersStore();

    useEffect(() => {
        GetUsers(1);
    }, []);

    useEffect(() => {
        if (userDetail && userDetail.username) {
            setEditUserForm({
                first_name: userDetail.first_name,
                last_name: userDetail.last_name,
                address: userDetail.address,
                phone_number: userDetail.phone_number,
                role_id: userDetail.role_id,
            });
        }
    }, [userDetail]);

    const handleChange = (e) => {
        setCreateUserForm({
            ...createUserForm,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {
        setCreateUserForm({
            username: "",
            email: "",
            password: "",
            confirm_password: "",
            first_name: "",
            last_name: "",
            address: "",
            phone_number: "",
            role_id: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            username: createUserForm.username,
            email: createUserForm.email,
            password: createUserForm.password,
            confirm_password: createUserForm.confirm_password,
            first_name: createUserForm.first_name,
            last_name: createUserForm.last_name,
            address: createUserForm.address,
            phone_number: createUserForm.phone_number,
            role_id: createUserForm.role_id,
        };
        await CreateUser(data);
        createModalRef.current.hide();
        resetForm();
        GetUsers(1);
    };

    const showEditModal = async (username) => {
        editUserModalRef.current.show();
        await GetUser(username);
    };

    const handleEditChange = (e) => {
        setEditUserForm({
            ...editUserForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const data = {
            first_name: editUserForm.first_name,
            last_name: editUserForm.last_name,
            address: editUserForm.address,
            phone_number: editUserForm.phone_number,
            role_id: editUserForm.role_id,
        };
        await UpdateUser(userDetail.username, data);
        editUserModalRef.current.hide();
    };

    const showDeleteUserModal = (username) => {
        setDeleteUsername(username);
        deleteUserModalRef.current.show();
    };

    const handleDeleteUser = async (username) => {
        await DeleteUser(username);
        deleteUserModalRef.current.delete();
    };

    return (
        <>
            <h1 className="text-4xl font-bold">Users</h1>
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
                        <SearchInput onSearch={(value) => GetUsers(1, value)} />
                    </div>
                    <button
                        type="button"
                        onClick={() => createModalRef.current.show()}
                        className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                    >
                        Create User
                    </button>
                </div>
                <table className="w-full text-sm text-left rtl:text-right text-body">
                    <thead className="text-sm text-body bg-neutral-secondary-medium border-b border-default-medium">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                No
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Username
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Full Name
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
                        {users.length === 0 && (
                            <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
                                <td
                                    colSpan="6"
                                    className="text-center px-6 py-4"
                                >
                                    Belum ada data user yang ditampilkan
                                </td>
                            </tr>
                        )}

                        {users.map((user) => (
                            <tr
                                className="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium"
                                key={user.uuid}
                            >
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                                >
                                    {user.no}
                                </th>
                                <td className="px-6 py-4">{user.username}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">
                                    {user.first_name && user.last_name
                                        ? user.first_name + " " + user.last_name
                                        : user.username}
                                </td>
                                <td className="px-6 py-4">{user.status}</td>
                                <td className="px-6 py-4 space-x-5">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            showEditModal(user.username)
                                        }
                                        className="border border-fg-brand p-3 rounded-xs font-medium text-fg-brand cursor-pointer hover:bg-fg-brand hover:text-white"
                                    >
                                        <HiOutlinePencilSquare />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            showDeleteUserModal(user.username)
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
                    onPageChange={(page) => GetUsers(page)}
                />
            </div>

            {/* Create Users Modal */}
            <ModalComponent
                idElement={"create-user-modal"}
                title={"Create User"}
                ref={createModalRef}
                children={
                    <>
                        {/* <!-- Modal body --> */}
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4 md:space-y-6 py-4 md:py-6">
                                <div className="grid md:grid-cols-2 space-x-6 gap-3">
                                    <div className="mt-3">
                                        <div className="mb-3">
                                            <label
                                                htmlFor="username"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                id="username"
                                                name="username"
                                                value={createUserForm.username}
                                                onChange={handleChange}
                                                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                                placeholder="John"
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="password"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                value={createUserForm.password}
                                                onChange={handleChange}
                                                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="first_name"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                First name
                                            </label>
                                            <input
                                                type="text"
                                                id="first_name"
                                                name="first_name"
                                                value={
                                                    createUserForm.first_name
                                                }
                                                onChange={handleChange}
                                                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                                placeholder="John"
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="address"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                id="address"
                                                name="address"
                                                value={createUserForm.address}
                                                onChange={handleChange}
                                                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                                placeholder="Alabama Street No. 13"
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="role_id"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                Role
                                            </label>
                                            <select
                                                id="role_id"
                                                name="role_id"
                                                value={createUserForm.role_id}
                                                onChange={handleChange}
                                                className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                                            >
                                                <option value="0">
                                                    Pilih Role
                                                </option>
                                                <option value="1">Admin</option>
                                                <option value="2">Kasir</option>
                                                <option value="3">
                                                    Pengadaan
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <div className="mb-3">
                                            <label
                                                htmlFor="email"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                E-mail
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={createUserForm.email}
                                                onChange={handleChange}
                                                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                                placeholder="john.doe@mail.com"
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="confirm_password"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                id="confirm_password"
                                                name="confirm_password"
                                                value={
                                                    createUserForm.confirm_password
                                                }
                                                onChange={handleChange}
                                                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="last_name"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                Last name
                                            </label>
                                            <input
                                                type="text"
                                                id="last_name"
                                                name="last_name"
                                                value={createUserForm.last_name}
                                                onChange={handleChange}
                                                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                                placeholder="Doe"
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="phone_number"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                Phone number
                                            </label>
                                            <input
                                                type="text"
                                                id="phone_number"
                                                name="phone_number"
                                                value={
                                                    createUserForm.phone_number
                                                }
                                                onChange={handleChange}
                                                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                                placeholder="081234567890"
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
                                        createModalRef.current.hide()
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

            {/* Edit User Modal */}
            <ModalComponent
                idElement={"edit-user-modal"}
                title={"Edit User"}
                ref={editUserModalRef}
                children={
                    <>
                        {/* <!-- Modal body --> */}
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="space-y-4 md:space-y-6 py-4 md:py-6">
                                <div className="grid md:grid-cols-2 space-x-6 gap-3">
                                    <div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="first_name"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                First name
                                            </label>
                                            <input
                                                type="text"
                                                id="first_name"
                                                name="first_name"
                                                onChange={handleEditChange}
                                                value={editUserForm.first_name}
                                                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                                placeholder="John"
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="address"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                id="address"
                                                name="address"
                                                onChange={handleEditChange}
                                                value={editUserForm.address}
                                                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                                placeholder="Alabama Street No. 13"
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="role_id"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                Role
                                            </label>
                                            <select
                                                id="role_id"
                                                name="role_id"
                                                onChange={handleEditChange}
                                                value={editUserForm.role_id}
                                                className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                                            >
                                                <option value="0">
                                                    Pilih Role
                                                </option>
                                                <option value="1">Admin</option>
                                                <option value="2">Kasir</option>
                                                <option value="3">
                                                    Pengadaan
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="last_name"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                Last name
                                            </label>
                                            <input
                                                type="text"
                                                id="last_name"
                                                name="last_name"
                                                onChange={handleEditChange}
                                                value={editUserForm.last_name}
                                                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                                placeholder="Doe"
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="phone_number"
                                                className="block mb-2.5 text-sm font-medium text-heading"
                                            >
                                                Phone number
                                            </label>
                                            <input
                                                type="text"
                                                id="phone_number"
                                                name="phone_number"
                                                onChange={handleEditChange}
                                                value={
                                                    editUserForm.phone_number
                                                }
                                                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                                placeholder="081234567890"
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
                                        editUserModalRef.current.hide()
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

            {/* Popup modal for delete user */}
            <PopupModalComponent
                idElement={"delete-user-modal"}
                ref={deleteUserModalRef}
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
                                Apakah kamu ingin menghapus user ini ?
                            </h3>
                            <div className="flex items-center space-x-4 justify-center">
                                <button
                                    onClick={() =>
                                        handleDeleteUser(deleteUsername)
                                    }
                                    type="button"
                                    className="text-white bg-danger box-border border border-transparent hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                                >
                                    Ya
                                </button>
                                <button
                                    onClick={() =>
                                        deleteUserModalRef.current.hide()
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

export default Users;
