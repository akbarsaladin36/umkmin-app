import { create } from "zustand";
import axiosApi from "../utils/axios";
import toast from "react-hot-toast";

const useSuppliersStore = create((set, get) => ({
    suppliers: [],
    pagination: {},
    search: "",
    page: 1,
    limit: 5,
    supplierDetail: null,
    loading: false,
    GetSuppliers: async (page = 1, search = get().search) => {
        set({ loading: true });
        try {
            const params = {
                page,
                search,
                limit: get().limit,
            };
            const res = await axiosApi.get("/admin/suppliers", { params });
            const start = (page - 1) * get().limit;
            const suppliers = res.data.data.data.map((item, index) => {
                return {
                    no: start + index + 1,
                    code: item.code,
                    name: item.name,
                    address: item.address,
                };
            });
            set({
                suppliers: suppliers,
                pagination: res.data.data,
                page: page,
                search: search,
                loading: false,
            });
        } catch (error) {
            set({
                suppliers: [],
                pagination: {},
                page: page,
                search: search,
                loading: false,
            });
        }
    },
    GetSupplier: async (supplierCode) => {
        set({ loading: true });
        try {
            const res = await axiosApi.get(`/admin/suppliers/${supplierCode}`);
            set({ supplierDetail: res.data.data, loading: false });
        } catch (error) {
            toast.error(error.response.data.message);
            set({ supplierDetail: null, loading: false });
        }
    },
    CreateSupplier: async (data) => {
        set({ loading: true });
        try {
            const res = await axiosApi.post("/admin/suppliers", data);
            toast.success(res.data.message);
            get().GetSuppliers();
            set({ loading: false });
        } catch (error) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    UpdateSupplier: async (supplierCode, data) => {
        set({ loading: true });
        try {
            const res = await axiosApi.patch(
                `/admin/suppliers/${supplierCode}`,
                data,
            );
            toast.success(res.data.message);
            get().GetSuppliers();
            set({ loading: false });
        } catch (error) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    DeleteSupplier: async (supplierCode) => {
        try {
            const res = await axiosApi.delete(
                `/admin/suppliers/${supplierCode}`,
            );
            toast.success(res.data.message);
            get().GetSuppliers();
            set({ loading: false });
        } catch (error) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
}));

export default useSuppliersStore;
