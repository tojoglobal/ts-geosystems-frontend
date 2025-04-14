import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MainNavbars from "./Navbars/MainNavbars";

function App() {
  return (
    <>
      <BrowserRouter>
        <MainNavbars />
        {/* <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes> */}
      </BrowserRouter>
    </>
  );
}

export default App;
