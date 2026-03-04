import { create } from "zustand";
import axiosApi from "../utils/axios";
import toast from "react-hot-toast";

const useUsersStore = create((set, get) => ({
    users: [],
    pagination: {},
    search: "",
    page: 1,
    limit: 5,
    userDetail: null,
    loading: false,
    GetUsers: async (page = 1, search = get().search) => {
        set({ loading: true });
        try {
            const params = {
                page,
                search,
                limit: get().limit,
            };
            const res = await axiosApi.get("/admin/users", { params });
            const start = (page - 1) * get().limit;
            const usersMap = res.data.data.data.map((item, index) => {
                return {
                    no: start + index + 1,
                    uuid: item.uuid,
                    username: item.username,
                    email: item.email,
                    first_name: item.first_name,
                    last_name: item.last_name,
                    status: item.is_active == 1 ? "Active" : "Non-Active",
                };
            });
            set({
                users: usersMap,
                pagination: res.data.data,
                page: page,
                search: search,
                loading: false,
            });
        } catch (error) {
            console.log(error);
            set({
                users: [],
                pagination: {},
                page: page,
                search: search,
                loading: false,
            });
        }
    },
    GetUser: async (username) => {
        set({ loading: true });
        try {
            const res = await axiosApi.get(`/admin/users/${username}`);
            set({ userDetail: res.data.data, loading: false });
        } catch (error) {
            console.log(error);
            set({ userDetail: null, loading: false });
        }
    },
    CreateUser: async (data) => {
        set({ loading: true });
        try {
            await axiosApi.post("/admin/users", data);
            toast.success("Data user baru telah berhasil disimpan!");
            get().GetUsers();
            set({ loading: false });
        } catch (error) {
            console.log(error);
            toast.error(error.response.message);
            set({ loading: false });
        }
    },
    UpdateUser: async (username, data) => {
        set({ loading: true });
        try {
            await axiosApi.patch(`/admin/users/${username}`, data);
            toast.success("Data user telah berhasil diupdate!");
            get().GetUsers();
            set({ loading: false });
        } catch (error) {
            console.log(error);
            toast.error(error.response.message);
            set({ loading: false });
        }
    },
    DeleteUser: async (username) => {
        try {
            await axiosApi.delete(`/admin/users/${username}`);
            toast.success("Data user baru telah berhasil dihapus!");
            get().GetUsers();
            set({ loading: false });
        } catch (error) {
            console.log(error);
            toast.error(error.response.message);
            set({ loading: false });
        }
    },
}));

export default useUsersStore;
