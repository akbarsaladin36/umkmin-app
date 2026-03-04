import { Modal } from "flowbite";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const PopupModalComponent = forwardRef(({ idElement, children }, ref) => {
    const modalRef = useRef(null);
    const modalInstance = useRef(null);

    useEffect(() => {
        modalInstance.current = new Modal(modalRef.current);
    }, []);

    useImperativeHandle(ref, () => ({
        show() {
            modalInstance.current.show();
        },
        hide() {
            modalInstance.current.hide();
        },
    }));

    return (
        <>
            <div
                ref={modalRef}
                id={idElement}
                tabIndex="-1"
                className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
            >
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
                        <button
                            type="button"
                            className="absolute top-3 end-2.5 text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
                            onClick={() => modalInstance.current.hide()}
                        >
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
                            <span className="sr-only">Close modal</span>
                        </button>
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
});

export default PopupModalComponent;
