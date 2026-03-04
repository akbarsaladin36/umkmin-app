import { create } from "zustand";
import axiosApi from "../utils/axios";
import toast from "react-hot-toast";

const useProductsStore = create((set, get) => ({
    products: [],
    pagination: {},
    categories: [],
    search: "",
    page: 1,
    limit: 5,
    productDetail: null,
    loading: false,
    GetProducts: async (page = 1, search = get().search) => {
        set({ loading: true });
        try {
            const params = {
                page,
                search,
                limit: get().limit,
            };
            const res = await axiosApi.get("/admin/products", { params });
            const start = (page - 1) * get().limit;
            const productsMap = res.data.data.data.map((item, index) => {
                return {
                    no: start + index + 1,
                    code: item.code,
                    barcode: item.barcode,
                    name: item.name,
                    cost_price: item.cost_price,
                    selling_price: item.selling_price,
                    stock: item.stock,
                };
            });
            set({
                products: productsMap,
                pagination: res.data.data,
                page: page,
                search: search,
                loading: false,
            });
        } catch (error) {
            console.log(error);
            set({
                products: [],
                pagination: {},
                page: page,
                search: search,
                loading: false,
            });
        }
    },
    GetListCategories: async () => {
        set({ loading: true });
        try {
            const res = await axiosApi.get("/admin/categories/list-categories");
            const categoriesMap = res.data.data.map((item) => {
                return {
                    id: item.id,
                    name: item.name,
                };
            });
            set({ categories: categoriesMap, loading: false });
        } catch (error) {
            set({ categories: [], loading: false });
        }
    },
    GetProduct: async (categoryName) => {
        set({ loading: true });
        try {
            const res = await axiosApi.get(`/admin/products/${categoryName}`);
            set({ productDetail: res.data.data, loading: false });
        } catch (error) {
            console.log(error);
            set({ productDetail: null, loading: false });
        }
    },
    CreateProduct: async (data) => {
        set({ loading: true });
        try {
            await axiosApi.post("/admin/products", data);
            toast.success("Data produk baru telah berhasil disimpan!");
            get().GetProducts();
            set({ loading: false });
        } catch (error) {
            console.log(error);
            toast.error(error.response.message);
            set({ loading: false });
        }
    },
    UpdateProduct: async (productCode, data) => {
        set({ loading: true });
        try {
            await axiosApi.patch(`/admin/products/${productCode}`, data);
            toast.success("Data produk telah berhasil diupdate!");
            get().GetProducts();
            set({ loading: false });
        } catch (error) {
            console.log(error);
            toast.error(error.response.message);
            set({ loading: false });
        }
    },
    DeleteProduct: async (productCode) => {
        try {
            await axiosApi.delete(`/admin/products/${productCode}`);
            toast.success("Data produk telah berhasil dihapus!");
            get().GetProducts();
            set({ loading: false });
        } catch (error) {
            console.log(error);
            toast.error(error.response.message);
            set({ loading: false });
        }
    },
}));

export default useProductsStore;
