
import AppRoutes from "./routes/AppRoutes"
import { AuthProvider } from "./context/AuthContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ToastContainer position="top-right" autoClose={3000} />
        <AppRoutes />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
