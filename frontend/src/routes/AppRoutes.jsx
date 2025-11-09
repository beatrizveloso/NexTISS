import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/loginpage/LoginPage"; 
import Nextis from "../pages/nextis/Nextis"; 
import Comandou from "../pages/comandou/Comandou"; 
import Estock from "../pages/estock/Estock"; 
import Pagamento from "../pages/pagamento/Pagamento"; 
import Termos from "../pages/termos/Termos";
import Privacidade from "../pages/privacidade/Privacidade";
import ScrollToTop from "./ScrollToTop";

const AppRoutes = () => { 
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Nextis />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/comandou" element={<Comandou />} />
        <Route path="/estock" element={<Estock />} />
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/termos-completos" element={<Termos />} />
        <Route path="/politica-privacidade" element={<Privacidade />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/privacidade" element={<Privacidade />} />

        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
