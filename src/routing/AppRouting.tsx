import { Routes, Route } from 'react-router-dom';
import PrivateLayout from "./layout/PrivateLayout";
import PublicLayout from "./layout/PublicLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Login from "../pages/LoginPage/LoginPage";
import NotFound from "../components/WildCard/NotFound";
import ForgotPassword from "../pages/ForgotPasswordPage/ForgotPasswordPage";
import ResetPassword from "../pages/ResetPasswordPage/ResetPasswordPage";
import Register from "../pages/RegisterPage/RegisterPage";
import LayoutPage from "./layout/LayoutPage";
import Steps from "../pages/Steps/Steps";
import Wallet from "../pages/wallet/wallet";
import IndividualProfile from "../pages/IndividualProfile/IndividualProfile";
import Setting from "../pages/Setting/Setting";
import Subscription from "../pages/Subscription/Subscription";


const AppRouting = () => {

  return (
    <Routes>
      {/* Private route start */}
      <Route path="/" element={<PrivateLayout />}>
        <Route element={<LayoutPage />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/steps" element={<Steps />} />
          <Route path="/steps1" element={<Steps />} />
          <Route path="/steps2" element={<Steps />} />
          <Route path="/steps3" element={<Steps />} />
          <Route path="/steps4" element={<Steps />} />
          <Route path="/steps5" element={<Steps />} />
          <Route path="/steps6" element={<Steps />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/individual-profile" element={<IndividualProfile />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/subscription" element={<Subscription />} />
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

      </Route>
      {/* Public route end */}

      {/* Not found route start */}
      <Route path="*" element={<NotFound />} />
      {/* Not found route end */}
    </Routes>
  );
};

export default AppRouting;
