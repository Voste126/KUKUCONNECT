import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { NotFoundImage } from "./NotFoundImage";
import LoadingSpinner from "./LoadingSpinner"; // Add a spinner or loading indicator for fallback

// Lazy load components
const Home = React.lazy(() => import("./HomeButton"));
const LoginPage = React.lazy(() => import("./LoginPage"));
const SignUpPage = React.lazy(() => import("./SignUpPage"));
const ProductList = React.lazy(() => import("../pages/ProductList"));
const Dashboard = React.lazy(() => import("./Dashboard"));
const Chatbot = React.lazy(() => import("./Chatbot"));
const ProfileForm = React.lazy(() => import("./ProfileForm"));
const LogoutPage = React.lazy(() => import("./Logout"));
const Checkout = React.lazy(() => import("../pages/Checkout"));

const RouterSwitcher = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*" element={<NotFoundImage />} />
        <Route path="/digital-market" element={<ProductList />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-iot" element={<Chatbot />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route
          path="/account"
          element={
            <ProfileForm
              userType="farmer"
              profileData={{ farmName: "", location: "", phoneNumber: "" }}
              onUpdate={() => {}}
            />
          }
        />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Suspense>
  );
};

export default RouterSwitcher;
