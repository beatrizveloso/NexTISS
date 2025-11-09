// import { CartProvider } from "./context/CartContext";
import AppRoutes from "./routes/AppRoutes";
import { UserProvider } from "./context/UserContext";
import './App.css';

const App = () => {
  return (
    <UserProvider>
      {/* <CartProvider> */}
        <AppRoutes />
      {/* </CartProvider> */}
    </UserProvider>
  );
};

export default App;