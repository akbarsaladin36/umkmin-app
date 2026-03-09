import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/auth";
import Loading from "../components/SpinnerLoading";

const Index = () => {
    const navigate = useNavigate();
    const [loginForm, setLoginForm] = useState({
        username: "",
        password: "",
    });
    const login = useAuthStore((state) => state.login);
    const loading = useAuthStore((state) => state.loading);
    // const user = useAuthStore((state) => state.user);
    // const authChecked = useAuthStore((state) => state.authChecked);

    const handleChange = (e) => {
        setLoginForm({
            ...loginForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            username: loginForm.username,
            password: loginForm.password,
        };
        const res = await login(data);
        // console.log(res);
        if (res.role_id == 1) {
            navigate("/admin/dashboard", { replace: true });
        } else {
            navigate("/cashier/sales", { replace: true });
        }
    };

    // useEffect(() => {
    //     if (!authChecked) return;
    //     if (user) {
    //         if (user.role_id === 1) {
    //             navigate("/admin/dashboard", { replace: true });
    //         } else {
    //             navigate("/cashier/sales", { replace: true });
    //         }
    //     }
    // }, [user, authChecked]);

    return (
        <div className="bg-gray-300 min-h-screen flex items-center justify-center">
            <div className="w-300 h-200 bg-white rounded-lg">
                <div className="grid grid-cols-2 h-full">
                    <div className="bg-red-600 h-full rounded-l-lg flex items-center justify-center">
                        <p className="text-white text-center text-9xl font-bold leading-none">
                            UMKMIN
                        </p>
                    </div>
                    <div className="h-full">
                        <div className="text-center p-10">
                            <h1 className="text-4xl font-bold text-red-600">
                                Selamat Datang
                            </h1>
                        </div>
                        <div className="mt-10">
                            <form
                                className="max-w-sm mx-auto"
                                onSubmit={handleSubmit}
                            >
                                <div className="mb-5">
                                    <label
                                        htmlFor="username"
                                        className="block mb-2.5 text-sm font-medium text-heading"
                                    >
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        onChange={handleChange}
                                        name="username"
                                        value={loginForm.username}
                                        className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                        placeholder="annonymous"
                                        required
                                    />
                                </div>
                                <div className="mb-5">
                                    <label
                                        htmlFor="password"
                                        className="block mb-2.5 text-sm font-medium text-heading"
                                    >
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        onChange={handleChange}
                                        name="password"
                                        value={loginForm.password}
                                        className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <p>
                                    Belum terdaftar ? Silakan klik{" "}
                                    <Link className="text-red-600">link</Link>{" "}
                                    ini
                                </p>
                                <button
                                    type="submit"
                                    className="mt-5 w-full text-white bg-red-600 box-border border border-transparent hover:cursor-pointer hover:bg-white hover:text-red-600 hover:border-red-600 shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                                >
                                    {loading ? <Loading /> : "Login"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
