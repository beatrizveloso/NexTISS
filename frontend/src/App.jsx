import AppRoutes from "./routes/AppRoutes";
import { UserProvider } from "./context/UserContext";
import './App.css';

const App = () => {
  return (
    <UserProvider>
        <AppRoutes />
    </UserProvider>
  );
};

export default App;