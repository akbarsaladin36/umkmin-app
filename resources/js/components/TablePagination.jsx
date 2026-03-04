const TablePagination = ({ pagination, onPageChange }) => {
    const pages = [];

    for (let i = 1; i <= pagination.last_page; i++) {
        pages.push(i);
    }

    const isDisabledNext =
        pagination.current_page === 1
            ? `text-fg-disabled bg-disabled`
            : `text-body bg-neutral-secondary-medium hover:bg-neutral-tertiary-medium hover:text-heading`;
    const isDisabledPrev =
        pagination.current_page === pagination.last_page
            ? `text-fg-disabled bg-disabled`
            : `text-body bg-neutral-secondary-medium hover:bg-neutral-tertiary-medium hover:text-heading`;

    return (
        <>
            <nav
                className="flex items-center flex-column flex-wrap md:flex-row justify-between p-4"
                aria-label="Table navigation"
            >
                <span className="text-sm font-normal text-body mb-4 md:mb-0 block w-full md:inline md:w-auto">
                    Showing{" "}
                    <span className="font-semibold text-heading">
                        {pagination.from}-{pagination.to}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-heading">
                        {pagination.total}
                    </span>
                </span>
                <ul className="flex -space-x-px text-sm">
                    <li>
                        <button
                            disabled={pagination.current_page === 1}
                            onClick={() =>
                                onPageChange(pagination.current_page - 1)
                            }
                            className={`flex items-center justify-center ${isDisabledNext} box-border border border-default-medium font-medium rounded-s-base text-sm px-3 h-9 focus:outline-none`}
                        >
                            Previous
                        </button>
                    </li>
                    {pages.map((page) => (
                        <button
                            aria-current="page"
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`flex items-center justify-center ${pagination.current_page === page ? `text-fg-brand bg-brand-softer hover:bg-brand-soft hover:text-fg-brand` : `text-body bg-neutral-secondary-medium hover:bg-neutral-tertiary-medium hover:text-heading`} box-border border border-default-medium  font-medium text-sm w-9 h-9 focus:outline-none`}
                        >
                            {page}
                        </button>
                    ))}
                    <li>
                        <button
                            disabled={
                                pagination.current_page === pagination.last_page
                            }
                            onClick={() =>
                                onPageChange(pagination.current_page + 1)
                            }
                            className={`flex items-center justify-center ${isDisabledPrev} box-border border border-default-medium font-medium rounded-e-base text-sm px-3 h-9 focus:outline-none`}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default TablePagination;
