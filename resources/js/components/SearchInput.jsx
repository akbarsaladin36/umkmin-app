import { useState } from "react"

const SearchInput = ({ onSearch }) => {
    const [value, setValue] = useState("");

    let timeout

    const handleChange = (e) => {
        const val = e.target.value
        setValue(val)
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            onSearch(val)
        }, 500)
    }

    return (
        <>
            <input type="text" id="input-group-1" value={value} onChange={handleChange} className="block w-full max-w-96 ps-9 pe-3 py-2 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body" placeholder="Search" />
        </>
    )
}

export default SearchInput