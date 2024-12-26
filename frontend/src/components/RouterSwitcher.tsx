import { Route, Routes } from "react-router-dom";
import { NotFoundImage } from "./NotFoundImage";
// import LoginForm from "./LoginForm";
import { LoginPage } from "./LoginPage";
import SignUpPage from "./SignUpPage";
import Home from "./HomeButton";
import ProductList from "../pages/ProductList";
import Dashboard from "./Dashboard";
const RouterSwithcer = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="*" element={<NotFoundImage />} />
            <Route path="/digital-market" element={<ProductList />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    );
};
export default RouterSwithcer;