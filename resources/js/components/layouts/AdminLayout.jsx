import { Outlet } from "react-router-dom"
import AdminNavbar from "../navbars/AdminNavbar"
import AdminSidebar from "../sidebars/AdminSidebar"
import { useEffect } from "react"
import { initFlowbite } from "flowbite"

const AdminLayout = () => {

    useEffect(() => {
        requestAnimationFrame(() => {
            initFlowbite()
        })
    }, [])


    return (
        <>
            <AdminNavbar/>
            <AdminSidebar/>
            <div className="p-4 lg:ml-64 mt-15 sm:mt-15">
                <Outlet/>
            </div>
        </>
    )
}

export default AdminLayout