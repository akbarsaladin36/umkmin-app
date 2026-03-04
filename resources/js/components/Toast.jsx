const Toast = ({ toastType, message, onClose }) => {
    const toastColor = (toastType) => {
        switch (toastType) {
            case "toast-success":
                return "bg-green-300";
            case "toast-danger":
                return "bg-red-300";
            case "toast-warning":
                return "bg-yellow-300";
            default:
                return "bg-green-300";
        }
    };

    return (
        <>
            <div
                id={toastType}
                className={`fixed top-5 right-5 w-full max-w-sm p-4 flex items-start gap-3 text-body ${toastColor(toastType)} rounded-base shadow-xs border border-default`}
                role="alert"
            >
                <div className="flex-1 text-sm ps-3.5 mt-2">{message}</div>
                <button
                    type="button"
                    className="flex items-center justify-center text-body hover:text-heading bg-transparent border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary rounded text-sm h-8 w-8"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <span className="sr-only">Close</span>
                    <svg
                        className="w-5 h-5"
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
                            d="M6 18 17.94 6M18 18 6.06 6"
                        />
                    </svg>
                </button>
            </div>
        </>
    );
};

export default Toast;
