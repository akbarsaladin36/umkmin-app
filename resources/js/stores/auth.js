import { create } from "zustand";
import axiosApi from "../utils/axios";

const useAuthStore = create(
    (set) => ({
        user: null,
        loading: false,
        authChecked: false,
        login: async (data) => {
            set({ loading: true })
            try {
                await axiosApi.post('/auth/login', data)
                const res = await axiosApi.get('/me')
                set({
                    user: res.data.data,
                    loading: false,
                    authChecked: true
                })
                return res.data.data
            } catch(error) {
                console.log(error)
                set({ user: null, loading: false, authChecked: false })
            }
        },
        logout: async () => {
            set({ loading: true })
            try {
                await axiosApi.post('/auth/logout')
                set({ user: null, loading: false, authChecked: false })
            } catch(error) {
                console.log(error)
                set({ loading: false })
            }
        },
        fetchUser: async () => {
            try {
                const res = await axiosApi.get('/me')
                set({ user: res.data.data, authChecked: true }) 
            } catch(error) {
                console.log(error)
                set({ user: null })
            }
        }
    })
)

export default useAuthStore