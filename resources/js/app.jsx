import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./routes/App";
import "../css/app.css";
import "flowbite";
import "flowbite/dist/flowbite.js";
import { Toaster } from "react-hot-toast";

const root = document.getElementById("app");

createRoot(root).render(
    <BrowserRouter>
        <Toaster position="top-right" />
        <App />
    </BrowserRouter>,
);
