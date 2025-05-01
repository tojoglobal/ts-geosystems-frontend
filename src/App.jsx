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
import Error from "./Err/Error";
import AdminLogin from "./auth/admin/AdminLogin";
import Dashboard from "./Dashboard/Dashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import DashboardLayout from "./Dashboard/Layout/Layout";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import CertificateTracking from "./Pages/NavComponents/CertificateTracking";
import ProductLayout from "./Pages/ProductLayout";
import ProductDetails from "./Pages/ProductPage/ProductDetails";
import Hire from "./Pages/NavComponents/Hire";
import Service from "./Pages/NavComponents/Service";
import QuickGuides from "./Pages/NavComponents/QuickGuides";
import SoftwareDownloads from "./Pages/NavComponents/SoftwareDownloads";
import AboutUs from "./Pages/NavComponents/AboutUs/AboutUs";
import ContactUs from "./Pages/NavComponents/ContactUs";
import Support from "./Pages/NavComponents/Support";
import ViewProfile from "./Dashboard/Profile/ViewProfile";
import UpdateProfile from "./Dashboard/Profile/UpdateProfile";
import TradeIn from "./Pages/NavComponents/TradeIn";
import ProductAddForm from "./Dashboard/Products/AddProducts";
import RemoteSupport from "./Pages/NavComponents/RemoteSupport";
import UserManuals from "./Pages/NavComponents/UserManuals";
import G2Blog from "./Pages/NavComponents/G2Blog";
import Clearance from "./Pages/NavComponents/Clearance";
import Categorys from "./Dashboard/Categorys/Categorys";
import Compare from "./Pages/NavComponents/Compare";
import UsedEquipment from "./Pages/NavComponents/UsedEquipment";
import Brands from "./Dashboard/Brands/Brands";
import UpdateProductForm from "./Dashboard/Products/EditProducts";
import ProductTable from "./Dashboard/Products/ProductsPage";
import Cart from "./Pages/NavComponents/Cart";
import Checkout from "./Pages/NavComponents/Checkout";
import Software from "./Dashboard/Software/Software";
import CategoryProduct from "./Pages/CategoryProduct";
import OrderTable from "./Dashboard/Orders/OrderTable";
import HomePageControl from "./Dashboard/WebsiteControll/HomePageControl";
import ClientMessages from "./Dashboard/DBComponents/ClientMessages";
import SupportPage from "./Pages/NavComponents/SupportPage";
import Brand from "./Pages/ProductPage/Brand";

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
        <Route path="/remote-support" element={<RemoteSupport />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route element={<ProductLayout />}>
          <Route path="/:category" element={<CategoryProduct />} />
          <Route path="/:category/:subcategory" element={<CategoryProduct />} />
          <Route path="/products/:id/:slug" element={<ProductDetails />} />
          <Route path="/clearance" element={<Clearance />} />
          <Route path="/compare/:ids" element={<Compare />} />
          <Route path="/used" element={<UsedEquipment />} />
          <Route path="/hire" element={<Hire />} />
          <Route path="/service" element={<Service />} />
          <Route path="/support" element={<Support />} />
          <Route path="/support-page" element={<SupportPage />} />
          <Route path="/quick-guides" element={<QuickGuides />} />
          <Route path="/software-downloads" element={<SoftwareDownloads />} />
          <Route path="/trade-in" element={<TradeIn />} />
          <Route path="/g2-blog" element={<G2Blog />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/user-manuals" element={<UserManuals />} />
          <Route path="/cart" element={<Cart />} />
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
          <Route path="viewprofile" element={<ViewProfile />} />
          <Route path="update-profile" element={<UpdateProfile />} />

          {/* product route */}
          <Route path="product" element={<ProductTable />} />
          <Route path="add-product" element={<ProductAddForm />} />
          <Route path="update-product/:id" element={<UpdateProductForm />} />
          {/* category add */}
          <Route path="add-categorys" element={<Categorys />} />
          {/* add brand */}
          <Route path="add-brands" element={<Brands />} />
          {/* add software  */}
          <Route path="add-software" element={<Software />} />
          {/* order route */}
          <Route path="orders" element={<OrderTable />} />
          {/* hoem page controll */}
          <Route path="home-page" element={<HomePageControl />} />
          <Route path="client-messages" element={<ClientMessages />} />
        </Route>

        <Route path="*" element={<Error />} />
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
