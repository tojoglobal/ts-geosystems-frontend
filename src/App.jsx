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
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
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
import SupportRequestForm from "./Pages/NavComponents/SupportRequestForm";
import ViewProfile from "./Dashboard/Profile/ViewProfile";
import UpdateProfile from "./Dashboard/Profile/UpdateProfile";
import TradeIn from "./Pages/NavComponents/TradeIn";
import ProductAddForm from "./Dashboard/Products/AddProducts";
import RemoteSupport from "./Pages/NavComponents/RemoteSupport";
import UserManuals from "./Pages/NavComponents/UserManuals";
import TSBlog from "./Pages/NavComponents/Blog/TSBlog";
import Clearance from "./Pages/NavComponents/Clearance";
import Compare from "./Pages/NavComponents/Compare";
import UsedEquipment from "./Pages/NavComponents/UsedEquipment";
import Brands from "./Dashboard/Brands/Brands";
import UpdateProductForm from "./Dashboard/Products/EditProducts";
import ProductTable from "./Dashboard/Products/ProductTable";
import Cart from "./Pages/NavComponents/Cart";
import Checkout from "./Pages/NavComponents/Checkout";
import Software from "./Dashboard/Software/Software";
import CategoryProduct from "./Pages/CategoryProduct";
import OrderTable from "./Dashboard/Orders/OrderTable";
import HomePageControl from "./Dashboard/WebsiteControll/HomePageControl";
import ClientMessages from "./Dashboard/DBComponents/ClientMessages";
import ThankYou from "./Pages/ThankYou/ThankYou";
import PaymentSuccess from "./Pages/payment/PaymentSuccess";
import PaymentFail from "./Pages/payment/PaymentFail";
import PaymentCancel from "./Pages/payment/PaymentCancel";
import PaymentIpn from "./Pages/payment/PaymentIpn";
import PromoCodeManager from "./Dashboard/PromoCodeManager/PromoCodeManager";
import AdminUpdateAboutUs from "./Pages/Control/AdminUpdateAboutUs";
import AdminUpdateContactUs from "./Pages/Control/AdminUpdateContactUs";
import AdminUpdateHire from "./Pages/Control/AdminUpdateHire";
import AdminUpdateService from "./Pages/Control/AdminUpdateService";
import BlogDetails from "./Pages/NavComponents/Blog/BlogDetails";
import TaxManager from "./Dashboard/TaxManager/TaxManager";
import AuthorManager from "./Dashboard/Author/AuthorMange";
import BlogTypeManage from "./Dashboard/BlogType/BlogTypeManage";
import BlogTable from "./Dashboard/Blog/BlogTable";
import BlogCreate from "./Dashboard/Blog/BlogCreate";
import BlogUpdate from "./Dashboard/Blog/BlogUpdate";
import BlogView from "./Dashboard/Blog/BlogView";
import AdminUpdateCertificateTracking from "./Pages/Control/AdminUpdateCertificateTracking";
import WelcomePage from "./Pages/WelcomePage/WelcomePage";
import UserProtectedRoute from "./ProtectedRoute/UserProtectedRoute";
import UserOrders from "./UserAccount/UserOrders";
import UserInbox from "./UserAccount/UserInbox";
import UserAddress from "./UserAccount/UserAddress";
import RecentlyViewed from "./UserAccount/RecentlyViewed";
import AccountSettings from "./UserAccount/AccountSettings";
import UserAccountLayout from "./UserAccount/UserAccountLayout";
import PublicOnlyRoute from "./ProtectedRoute/PublicOnlyRoute";
import TradeInData from "./Dashboard/TradeIn/TradeInData";
import AdminSupportData from "./Dashboard/Support/AdminSupportData";
import AddNewAddress from "./UserAccount/AddNewAddress";
import Chat from "./Dashboard/Chat/Chat";
import Subscriber from "./Dashboard/Subscriber/Subscriber";
import AdminServiceInquiries from "./Dashboard/Services/AdminServiceInquiries";
import MailView from "./Dashboard/Email/MailView";
import Inbox from "./Dashboard/Email/Inbox";
import Categories from "./Dashboard/Categorys/Categories";
import AddUserManuals from "./Dashboard/UserManuals/AddUserManuals";
import AddQuickGuides from "./Dashboard/QuickGuides/AddQuickGuides";
import AdminUpdateTradeIn from "./Pages/Control/AdminUpdateTradeIn";
import AdminUpdateSupport from "./Pages/Control/AdminUpdateSupport";
import AdminUpdateUsedEquipment from "./Pages/Control/AdminUpdateUsedEquipment";
import AdminUpdateFooter from "./Pages/Control/AdminUpdateFooter";
import SiteMap from "./Components/SiteMap";
import HelpDeskButton from "./Pages/HelpDeskButton";
import ProductQuestion from "./Dashboard/Products/ProductQuestion";
import CreditAccountApplication from "./Dashboard/CreditAccount/CreditAccountApplication";
import AdminShowCreditAccount from "./Dashboard/CreditAccount/AdminShowCreditAccount";
import AdminUpdateHelpDesk from "./Pages/Control/AdminUpdateHelpDesk";
import EditAdress from "./UserAccount/EditAdress";
import DynamicPage from "./Footer/DynamicPage";
import SettingsPage from "./Dashboard/SettingsPage/SettingsPage";
import BlogTagManage from "./Dashboard/BlogTags/BlogTagManage";
import EquipmentManagement from "./Dashboard/TSCC/EquipmentManagement";
import ClientInformationManager from "./Dashboard/ClientInformationManager/ClientInformationManager";
import Calendar from "./Dashboard/Calendar/Calendar";
import AdminChangePassword from "./Dashboard/Profile/AdminChangePassword";
import QuotationData from "./Dashboard/Quotation/Quotation";
import ContactTrackingData from "./Pages/ContactTrackingData/ContactTrackingData";
import { useEffect, useState } from "react";
import axios from "axios";
import SiteMeta from "./SiteMeta/SiteMeta";
import { Helmet } from "react-helmet-async";

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
        <Route path="/cc" element={<CertificateTracking />} />
        <Route path="/cd" element={<ContactTrackingData />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* product layout route */}
        <Route element={<ProductLayout />}>
          <Route path="/ts/:slug" element={<DynamicPage />} />
          <Route path="/remote-support" element={<RemoteSupport />} />
          <Route path="/:category" element={<CategoryProduct />} />
          <Route path="/:category/:subcategory" element={<CategoryProduct />} />
          <Route path="/brand/:brand" element={<CategoryProduct />} />
          <Route path="/products/:id/:slug" element={<ProductDetails />} />
          <Route path="/clearance" element={<Clearance />} />
          <Route path="/compare/:ids" element={<Compare />} />
          <Route path="/used" element={<UsedEquipment />} />
          <Route path="/hire" element={<Hire />} />
          <Route
            path="/hire/credit-account-application"
            element={<CreditAccountApplication />}
          />
          <Route path="/service" element={<Service />} />
          <Route path="/support" element={<SupportRequestForm />} />
          <Route path="/quick-guides" element={<QuickGuides />} />
          <Route path="/software-downloads" element={<SoftwareDownloads />} />
          <Route path="/trade-in" element={<TradeIn />} />
          <Route path="/ts-blog" element={<TSBlog />} />
          <Route path="/ts-blog/:id/:slug" element={<BlogDetails />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/user-manuals" element={<UserManuals />} />
          <Route path="/cart" element={<Cart />} />
          {/* payment */}
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/fail" element={<PaymentFail />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
          <Route path="/payment/ipn" element={<PaymentIpn />} />
        </Route>
        {/* product layout end  */}
        {/* tank you page */}
        <Route path="/thank-you" element={<ThankYou />} />
        {/* welcome rotue */}
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/sitemap" element={<SiteMap />} />
        {/* user  Routes */}
        {/* Auth user Routes */}
        <Route
          path="/user/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/user/create_account"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/user/account/"
          element={
            <UserProtectedRoute>
              <UserAccountLayout />
            </UserProtectedRoute>
          }
        >
          <Route path="orders" element={<UserOrders />} />
          <Route path="inbox" element={<UserInbox />} />
          <Route path="address-book" element={<UserAddress />} />
          <Route path="add-address" element={<AddNewAddress />} />
          <Route path="edit-address/:id" element={<EditAdress />} />
          <Route path="recent-viewed" element={<RecentlyViewed />} />
          <Route path="account-settings" element={<AccountSettings />} />
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
          <Route path="chat" element={<Chat />} />
          <Route path="update-profile" element={<UpdateProfile />} />
          {/* product route */}
          <Route path="product" element={<ProductTable />} />
          <Route path="credit-account" element={<AdminShowCreditAccount />} />
          <Route path="product/question" element={<ProductQuestion />} />
          <Route path="add-product" element={<ProductAddForm />} />
          <Route path="update-product/:id" element={<UpdateProductForm />} />
          {/* category add */}
          <Route path="add-categorys" element={<Categories />} />
          {/* add brand */}
          <Route path="add-brands" element={<Brands />} />
          {/* add software  */}
          <Route path="add-software" element={<Software />} />
          {/* add userManuals  */}
          <Route path="add-usermanuals" element={<AddUserManuals />} />
          {/* add quickGuides  */}
          <Route path="add-quickguides" element={<AddQuickGuides />} />
          {/* order route */}
          <Route path="orders" element={<OrderTable />} />
          {/* hoem page controll */}
          <Route path="home-page" element={<HomePageControl />} />
          <Route path="help-desk" element={<AdminUpdateHelpDesk />} />
          <Route path="client-messages" element={<ClientMessages />} />
          <Route path="trade-in" element={<TradeInData />} />
          {/* support route */}
          <Route path="support" element={<AdminSupportData />} />
          {/* promoCode */}
          <Route path="promocodemanager" element={<PromoCodeManager />} />
          <Route path="subscriber" element={<Subscriber />} />
          {/* add taxesmanager */}
          <Route path="taxesmanager" element={<TaxManager />} />
          {/* blog routes */}
          <Route path="ts-blog" element={<BlogTable />} />
          <Route path="ts-blog/create" element={<BlogCreate />} />
          <Route path="ts-blog/view/:id" element={<BlogView />} />
          <Route path="ts-blog/create" element={<BlogCreate />} />
          <Route path="ts-blog/edit/:id" element={<BlogUpdate />} />
          {/* author route */}
          <Route path="author" element={<AuthorManager />} />
          {/* Blog Type route */}
          <Route path="blog-type" element={<BlogTypeManage />} />
          <Route path="blog-tags" element={<BlogTagManage />} />
          <Route path="calendar" element={<Calendar />} />
          {/* service-inquiries route  */}
          <Route path="service-inquiries" element={<AdminServiceInquiries />} />
          {/* email routes */}
          <Route
            path="email/inbox"
            element={<Inbox userEmail={"no-reply@tsgb.site"} />}
          />
          {/* ts-cc */}
          <Route path="ts-cc" element={<EquipmentManagement />} />
          {/* ts-cc */}
          <Route path="ts-client" element={<ClientInformationManager />} />
          {/* SettingsPage */}
          <Route path="settings" element={<SettingsPage />} />
          {/* dynamic about page */}
          <Route path="hire" element={<AdminUpdateHire />} />
          <Route path="used-equipment" element={<AdminUpdateUsedEquipment />} />
          <Route path="service" element={<AdminUpdateService />} />
          <Route path="tradein" element={<AdminUpdateTradeIn />} />
          <Route path="quotation" element={<QuotationData />} />
          <Route path="about-us" element={<AdminUpdateAboutUs />} />
          <Route path="contact-us" element={<AdminUpdateContactUs />} />
          <Route path="update/support" element={<AdminUpdateSupport />} />
          <Route path="cc" element={<AdminUpdateCertificateTracking />} />
          <Route path="cc" element={<AdminUpdateCertificateTracking />} />
          <Route path="footer" element={<AdminUpdateFooter />} />
          <Route path="change-password" element={<AdminChangePassword />} />
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
      {!hideNavFooter && <Footer />}
      {!hideNavFooter && <HelpDeskButton />}
    </>
  );
};

function App() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_OPEN_APIURL}/api/settings`)
      .then((res) => setSettings(res.data))
      .catch(() => {});
  }, []);

  return (
    <>
      <AppProvider>
        {/* Place SiteMeta here for global effect */}

        <SiteMeta settings={settings} />

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
