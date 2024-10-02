import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateLayout from "./layout/PrivateLayout";
import PublicLayout from "./layout/PublicLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Login from "../pages/LoginPage/LoginPage";
import NotFound from "../components/WildCard/NotFound";
import ForgotPassword from "../pages/ForgotPasswordPage/ForgotPasswordPage";
import ResetPassword from "../pages/ResetPasswordPage/ResetPasswordPage";
import Register from "../pages/RegisterPage/RegisterPage";
import Layout from "../layout/layout";
import LayoutPage from "./layout/LayoutPage";
import Steps from "../pages/Steps/Steps";


const AppRouting = () => {

  return (
    <Routes>
      {/* Private route start */}
      <Route path="/" element={<PrivateLayout />}>
        <Route path="/" element={<Layout />}>
          
        </Route>
      </Route>
      {/* Private route end */}

      {/* Public route start */}
      <Route path="/" element={<PublicLayout />}>
        <Route path="/" index element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route element={<LayoutPage />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/steps" element={<Steps />} />
        </Route>
      </Route>
      {/* Public route end */}

      {/* Not found route start */}
      <Route path="*" element={<NotFound />} />
      {/* Not found route end */}
    </Routes>
  );
};

export default AppRouting;
