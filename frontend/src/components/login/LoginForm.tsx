import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../ToggleTheme/ThemeToggle";
import "./LoginForm.css";
import eyeOpenIcon from "../../assets/icons/eye-open.svg";
import eyeClosedIcon from "../../assets/icons/eye-closed.svg";
import loginIllustration from "../../assets/images/login-illustration.svg";
import lightLogo from "../../assets/icons/game-controller-svgrepo-com (1).svg";
import darkLogo from "../../assets/icons/game-controller-svgrepo-com white.svg";

interface LoginFormData {
  login: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    login: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme } = useTheme();
  const [apiError, setApiError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const logoSrc = theme === "dark" ? darkLogo : lightLogo;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.login.trim()) {
      newErrors.login = "Login is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 3) {
      newErrors.password = "Password must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(formData.login, formData.password);
      navigate("/");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card login-card">
        <div className="auth-form-side">
          <div className="auth-header">
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <ThemeToggle />
            </div>
            <div className="auth-logo">
              <img src={logoSrc} alt="logo" className="auth-logo-icon" />
              <span className="auth-logo-text">Gamestore</span>
            </div>
            <h1 className="auth-title">Welcome back!</h1>
            <p className="auth-subtitle">Log in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Login</label>
              <input
                type="text"
                name="login"
                placeholder="Enter your login"
                value={formData.login}
                onChange={handleChange}
                className={errors.login ? "error" : ""}
              />
              {errors.login && (
                <span className="error-message">{errors.login}</span>
              )}
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "error" : ""}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <img
                    src={showPassword ? eyeOpenIcon : eyeClosedIcon}
                    alt={showPassword ? "Hide password" : "Show password"}
                    width="20"
                    height="20"
                  />
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>        
            </div>

            {apiError && (
              <div className="error-message" style={{ marginBottom: "8px" }}>
                {apiError}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        </div>
        <div className="auth-image-side">
          <img
            src={loginIllustration}
            alt="Gaming illustration"
            className="auth-image"
          />
          <div className="auth-image-text">
            <h3>Welcome to Gamestore</h3>
            <p>Discover thousands of amazing games!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
