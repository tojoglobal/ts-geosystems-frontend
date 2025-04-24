import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import MainNavbars from "./Navbars/MainNavbars";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AppProvider } from "./context/AppContext";
import Footer from "./Footer/Footer";
import MainHome from "./Pages/HomePage/MainHome";
import Erro from "./Err/Erro";
import AdminLogin from "./auth/admin/AdminLogin";
import Dashboard from "./Dashboard/Dashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import DashboardLayout from "./Dashboard/Layout/Layout";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import QuickGuides from "./Pages/NavComponents/QuickGuides";

import ProductDetails from "./Pages/ProductPage/ProductDetails";
import ProductLayout from "./Pages/ProductLayout";
import AboutUs from "./Pages/NavComponents/AboutUs/AboutUs";
import ContactUs from "./Pages/NavComponents/ContactUs";
import CertificateTracking from "./Pages/NavComponents/CertificateTracking";
import Service from "./Pages/NavComponents/Service";
import SoftwareDownloads from "./Pages/NavComponents/SoftwareDownloads";
import Hire from "./Pages/NavComponents/Hire";

const AppLayout = () => {
  const location = useLocation();
  const hideNavFooter =
    location.pathname.startsWith("/dashboard") ||
    location.pathname === "/admin/login";
  return (
    <>
      {!hideNavFooter && <MainNavbars />}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainHome />} />
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/create_account" element={<Register />} />
        <Route path="/cc" element={<CertificateTracking />} />

        <Route element={<ProductLayout />}>
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/hire" element={<Hire />} />
          <Route path="/service" element={<Service />} />
          <Route path="/quick-guides" element={<QuickGuides />} />
          <Route path="/software-downloads" element={<SoftwareDownloads />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Erro />} />
      </Routes>
      {!hideNavFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <>
      <AppProvider>
        <Router
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <AppLayout />
        </Router>
      </AppProvider>
    </>
  );
}

export default App;
