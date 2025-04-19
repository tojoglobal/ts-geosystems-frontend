import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MainNavbars from "./Navbars/MainNavbars";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { HelmetProvider } from "react-helmet-async";
import { AppProvider } from "./context/AppContext";
import Footer from "./Footer/Footer";
import MainHome from "./Pages/HomePage/MainHome";

function App() {
  return (
    <>
      <HelmetProvider>
        <AppProvider>
          <BrowserRouter>
            <MainNavbars />
            <MainHome />
            <Footer />
          </BrowserRouter>
        </AppProvider>
      </HelmetProvider>
    </>
  );
}

export default App;
