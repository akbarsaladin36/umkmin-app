import { create } from "zustand";
import toast from "react-hot-toast";
import axiosApi from "../../utils/axios";
import useAuthStore from "../auth";

const useCashierSalesStore = create((set, get) => ({
    sales: [],
    pagination: {},
    products: [],
    saleItems: [],
    search: "",
    page: 1,
    limit: 5,
    saleDetail: null,
    loading: false,
    GetSalesByKasir: async (username, page = 1, search = get().search) => {
        set({ loading: true });
        try {
            const params = {
                username,
                page,
                search,
                limit: get().limit,
            };
            const res = await axiosApi.get("/cashier/sales", { params });
            const start = (page - 1) * get().limit;
            const sales = res.data.data.data.map((item, index) => {
                return {
                    no: start + index + 1,
                    code: item.code,
                    invoice_no: item.invoice_no,
                    total_amount: item.total_amount,
                    status: item.status,
                };
            });
            set({
                sales: sales,
                pagination: res.data.data,
                page: page,
                search: search,
                loading: false,
            });
        } catch (error) {
            console.log(error);
            set({
                sales: [],
                pagination: {},
                page: page,
                search: search,
                loading: false,
            });
        }
    },
    GetListProducts: async () => {
        set({ loading: true });
        try {
            const res = await axiosApi.get("/cashier/products/list-products");
            const productsMap = res.data.data.map((item) => {
                return {
                    code: item.code,
                    name: item.name,
                    selling_price: item.selling_price,
                };
            });
            set({ products: productsMap, loading: false });
        } catch (error) {
            set({ products: [], loading: false });
        }
    },
    GetSaleItemByCode: async (saleCode) => {
        set({ loading: true });
        try {
            const res = await axiosApi.get(`/cashier/sale-items/${saleCode}`);
            const saleItemsMap = res.data.data.map((item) => {
                return {
                    sale_item_code: item.sale_item_code,
                    sale_code: item.sale_code,
                    product_code: item.product_code,
                    quantity: item.quantity,
                    price: item.price,
                    subtotal: item.subtotal,
                };
            });
            set({ saleItems: saleItemsMap, loading: false });
        } catch (error) {
            set({ saleItems: [], loading: false });
        }
    },
    GetSale: async (saleCode) => {
        set({ loading: true });
        try {
            const res = await axiosApi.get(`/cashier/sales/${saleCode}`);
            set({ saleDetail: res.data.data, loading: false });
        } catch (error) {
            toast.error(error.response?.data?.message);
            set({ saleDetail: null, loading: false });
        }
    },
    CreateSale: async (data) => {
        set({ loading: true });
        try {
            await axiosApi.post("/cashier/sales", data);
            toast.success("Data penjualan baru telah berhasil disimpan!");
            const user = useAuthStore.getState().user;
            get().GetSalesByKasir(user.username);
            set({ loading: false });
        } catch (error) {
            toast.error(error.response?.data?.message);
            set({ loading: false });
        }
    },
    UpdateSale: async (saleCode, data) => {
        set({ loading: true });
        try {
            await axiosApi.patch(`/cashier/sales/${saleCode}`, data);
            toast.success("Data penjualan telah berhasil diupdate!");
            const user = useAuthStore.getState().user;
            get().GetSalesByKasir(user.username);
            set({ loading: false });
        } catch (error) {
            toast.error(error.response?.data?.message);
            set({ loading: false });
        }
    },
    DeleteSale: async (saleCode) => {
        try {
            const res = await axiosApi.delete(`/cashier/sales/${saleCode}`);
            toast.success(res.data.message);
            const user = useAuthStore.getState().user;
            get().GetSalesByKasir(user.username);
            set({ loading: false });
        } catch (error) {
            toast.error(error.response?.data?.message);
            set({ loading: false });
        }
    },
}));

export default useCashierSalesStore;
