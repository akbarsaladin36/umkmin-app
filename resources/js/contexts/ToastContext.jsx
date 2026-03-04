import { createContext, useContext, useState } from "react";
import Toast from "../components/Toast";

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const showToast = (toastType, message) => {
        setToast({
            show: true,
            message: message,
            type: toastType,
        });

        setTimeout(() => {
            setToast((prev) => ({ ...prev, show: false }));
        }, 3000);
    };

    const hideToast = () => {
        setToast((prev) => ({ ...prev, show: false }));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast.show && (
                <div className="fixed top-5 right-5 z-50">
                    <Toast
                        toastType={toast.type}
                        message={toast.message}
                        onClose={hideToast}
                    />
                </div>
            )}
        </ToastContext.Provider>
    );
};
