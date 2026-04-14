import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartProvider";
import { AuthProvider } from "./context/AuthProvider";
import "./styles/theme.css";
import HomePage from "./pages/Home/HomePage";
import RegisterForm from "./components/registration/RegisterForm";
import LoginForm from "./components/login/LoginForm";
import AboutUs from "./pages/About-us/AboutUs";
import Profile from "./pages/Profile/Profile";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Router>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
