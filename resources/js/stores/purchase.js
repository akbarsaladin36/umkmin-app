import { create } from "zustand";
import axiosApi from "../utils/axios";
import toast from "react-hot-toast";

const usePurchasesStore = create((set, get) => ({
    purchases: [],
    pagination: {},
    suppliers: [],
    products: [],
    purchaseItems: [],
    search: "",
    page: 1,
    limit: 5,
    purchaseDetail: null,
    loading: false,
    GetPurchases: async (page = 1, search = get().search) => {
        set({ loading: true });
        try {
            const params = {
                page,
                search,
                limit: get().limit,
            };
            const res = await axiosApi.get("/admin/purchases", { params });
            const start = (page - 1) * get().limit;
            const purchases = res.data.data.data.map((item, index) => {
                return {
                    no: start + index + 1,
                    code: item.code,
                    invoice_no: item.invoice_no,
                    total_amount: item.total_amount,
                    status: item.status,
                };
            });
            set({
                purchases: purchases,
                pagination: res.data.data,
                page: page,
                search: search,
                loading: false,
            });
        } catch (error) {
            console.log(error);
            set({
                purchases: [],
                pagination: {},
                page: page,
                search: search,
                loading: false,
            });
        }
    },
    GetListSuppliers: async () => {
        set({ loading: true });
        try {
            const res = await axiosApi.get("/admin/suppliers/list-suppliers");
            const suppliersMap = res.data.data.map((item) => {
                return {
                    uuid: item.uuid,
                    name: item.name,
                };
            });
            set({ suppliers: suppliersMap, loading: false });
        } catch (error) {
            set({ suppliers: [], loading: false });
        }
    },
    GetListProducts: async () => {
        set({ loading: true });
        try {
            const res = await axiosApi.get("/admin/products/list-products");
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
    GetPurchaseItemsByCode: async (purchaseCode) => {
        set({ loading: true });
        try {
            const res = await axiosApi.get(
                `/admin/purchase-items/${purchaseCode}`,
            );
            const purchaseItemsMap = res.data.data.map((item) => {
                return {
                    code: item.code,
                    purchase_code: item.purchase_code,
                    product_code: item.product_code,
                    quantity: item.quantity,
                    cost_price: item.cost_price,
                    subtotal: item.subtotal,
                };
            });
            set({ purchaseItems: purchaseItemsMap, loading: false });
        } catch (error) {
            set({ purchaseItems: [], loading: false });
        }
    },
    GetPurchase: async (purchaseCode) => {
        set({ loading: true });
        try {
            const res = await axiosApi.get(`/admin/purchases/${purchaseCode}`);
            set({ purchaseDetail: res.data.data, loading: false });
        } catch (error) {
            toast.error(error.response.data.message);
            set({ purchaseDetail: null, loading: false });
        }
    },
    CreatePurchase: async (data) => {
        set({ loading: true });
        try {
            const res = await axiosApi.post("/admin/purchases", data);
            toast.success(res.data.message);
            get().GetPurchases();
            set({ loading: false });
        } catch (error) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    UpdatePurchase: async (purchaseCode, data) => {
        set({ loading: true });
        try {
            const res = await axiosApi.patch(
                `/admin/purchases/${purchaseCode}`,
                data,
            );
            toast.success(res.data.message);
            get().GetPurchases();
            set({ loading: false });
        } catch (error) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    DeletePurchase: async (purchaseCode) => {
        try {
            const res = await axiosApi.delete(
                `/admin/purchases/${purchaseCode}`,
            );
            toast.success(res.data.message);
            get().GetPurchases();
            set({ loading: false });
        } catch (error) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
}));

export default usePurchasesStore;
