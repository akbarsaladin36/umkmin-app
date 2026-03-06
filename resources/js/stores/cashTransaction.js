import { create } from "zustand";
import axiosApi from "../utils/axios";
import toast from "react-hot-toast";

const useCashTransactionsStore = create((set, get) => ({
    cashTransactions: [],
    pagination: {},
    search: "",
    page: 1,
    limit: 5,
    cashTransactionDetail: null,
    loading: false,
    GetCashTransactions: async (page = 1, search = get().search) => {
        set({ loading: true });
        try {
            const params = {
                page,
                search,
                limit: get().limit,
            };
            const res = await axiosApi.get("/admin/cash-transactions", {
                params,
            });
            const start = (page - 1) * get().limit;
            const cashTransactions = res.data.data.data.map((item, index) => {
                return {
                    no: start + index + 1,
                    code: item.code,
                    category: item.category,
                    amount: item.amount,
                    description: item.description,
                    status: item.status,
                };
            });
            set({
                cashTransactions: cashTransactions,
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
    GetCashTransaction: async (cashTransactionCode) => {
        set({ loading: true });
        try {
            const res = await axiosApi.get(
                `/admin/cash-transactions/${cashTransactionCode}`,
            );
            set({ cashTransactionDetail: res.data.data, loading: false });
        } catch (error) {
            toast.error(error.response.data.message);
            set({ cashTransactionDetail: null, loading: false });
        }
    },
    CreateCashTransaction: async (data) => {
        set({ loading: true });
        try {
            const res = await axiosApi.post("/admin/cash-transactions", data);
            toast.success(res.data.message);
            get().GetCashTransactions();
            set({ loading: false });
        } catch (error) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    UpdateCashTransaction: async (cashTransactionCode, data) => {
        set({ loading: true });
        try {
            const res = await axiosApi.patch(
                `/admin/cash-transactions/${cashTransactionCode}`,
                data,
            );
            toast.success(res.data.message);
            get().GetCashTransactions();
            set({ loading: false });
        } catch (error) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    DeleteCashTransaction: async (cashTransactionCode) => {
        try {
            const res = await axiosApi.delete(
                `/admin/cash-transactions/${cashTransactionCode}`,
            );
            toast.success(res.data.message);
            get().GetCashTransactions();
            set({ loading: false });
        } catch (error) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
}));

export default useCashTransactionsStore;
