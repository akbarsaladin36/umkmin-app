import { create } from "zustand";
import axiosApi from "../utils/axios";
import toast from "react-hot-toast";

const useCategoriesStore = create((set, get) => ({
    categories: [],
    pagination: {},
    search: "",
    page: 1,
    limit: 5,
    categoryDetail: null,
    loading: false,
    GetCategories: async (page = 1, search = get().search) => {
        set({ loading: true });
        try {
            const params = {
                page,
                search,
                limit: get().limit,
            };
            const res = await axiosApi.get("/admin/categories", { params });
            const start = (page - 1) * get().limit;
            const categoriesMap = res.data.data.data.map((item, index) => {
                return {
                    no: start + index + 1,
                    id: item.id,
                    name: item.name,
                    description: item.description,
                };
            });
            set({
                categories: categoriesMap,
                pagination: res.data.data,
                page: page,
                search: search,
                loading: false,
            });
        } catch (error) {
            console.log(error);
            set({
                categories: [],
                pagination: {},
                page: page,
                search: search,
                loading: false,
            });
        }
    },
    GetCategory: async (categoryName) => {
        set({ loading: true });
        try {
            const res = await axiosApi.get(`/admin/categories/${categoryName}`);
            set({ categoryDetail: res.data.data, loading: false });
        } catch (error) {
            console.log(error);
            set({ categoryDetail: null, loading: false });
        }
    },
    CreateCategory: async (data) => {
        set({ loading: true });
        try {
            await axiosApi.post("/admin/categories", data);
            toast.success("Data kategori baru telah berhasil disimpan!");
            get().GetCategories();
            set({ loading: false });
        } catch (error) {
            console.log(error);
            toast.error(error.response.message);
            set({ loading: false });
        }
    },
    UpdateCategory: async (categoryName, data) => {
        set({ loading: true });
        try {
            await axiosApi.patch(`/admin/categories/${categoryName}`, data);
            toast.success("Data kategori telah berhasil diupdate!");
            get().GetCategories();
            set({ loading: false });
        } catch (error) {
            console.log(error);
            toast.error(error.response.message);
            set({ loading: false });
        }
    },
    DeleteCategory: async (categoryName) => {
        try {
            await axiosApi.delete(`/admin/categories/${categoryName}`);
            toast.success("Data kategori telah berhasil dihapus!");
            get().GetCategories();
            set({ loading: false });
        } catch (error) {
            console.log(error);
            toast.error(error.response.message);
            set({ loading: false });
        }
    },
}));

export default useCategoriesStore;
