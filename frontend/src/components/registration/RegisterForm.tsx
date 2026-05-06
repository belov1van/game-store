import React, { useState } from "react";
import "./RegisterForm.css";
import eyeOpenIcon from "../../assets/icons/eye-open.svg";
import eyeClosedIcon from "../../assets/icons/eye-closed.svg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../ToggleTheme/ThemeToggle";
import registerIllustration from "../../assets/images/register-illustration.svg";
import lightLogo from "../../assets/icons/game-controller-svgrepo-com (1).svg";
import darkLogo from "../../assets/icons/game-controller-svgrepo-com white.svg";

interface FormData {
  login: string;
  mail: string;
  password: string;
  repeatPassword: string;
}

interface PasswordVisibility {
  password: boolean;
  repeatPassword: boolean;
}

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { theme } = useTheme();
  const [apiError, setApiError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const logoSrc = theme === "dark" ? darkLogo : lightLogo;

  const [formData, setFormData] = useState<FormData>({
    login: "",
    mail: "",
    password: "",
    repeatPassword: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const [showPasswords, setShowPasswords] = useState<PasswordVisibility>({
    password: false,
    repeatPassword: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const togglePasswordVisibility = (field: keyof PasswordVisibility) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.login.trim()) {
      newErrors.login = "Login is required";
    } else if (formData.login.length < 3) {
      newErrors.login = "Login must be at least 3 characters";
    }

    if (!formData.mail.trim()) {
      newErrors.mail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.mail)) {
      newErrors.mail = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = "Passwords do not match";
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
      await register(formData.login, formData.mail, formData.password);
      navigate("/");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
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
            <h1 className="auth-title">Create account</h1>
            <p className="auth-subtitle">Join our gaming community!</p>
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
              <label>Email</label>
              <input
                type="email"
                name="mail"
                placeholder="your@email.com"
                value={formData.mail}
                onChange={handleChange}
                className={errors.mail ? "error" : ""}
              />
              {errors.mail && (
                <span className="error-message">{errors.mail}</span>
              )}
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.password ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "error" : ""}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility("password")}
                  aria-label={
                    showPasswords.password ? "Hide password" : "Show password"
                  }
                >
                  <img
                    src={showPasswords.password ? eyeOpenIcon : eyeClosedIcon}
                    alt={
                      showPasswords.password ? "Hide password" : "Show password"
                    }
                    width="20"
                    height="20"
                  />
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label>Confirm password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.repeatPassword ? "text" : "password"}
                  name="repeatPassword"
                  placeholder="Confirm your password"
                  value={formData.repeatPassword}
                  onChange={handleChange}
                  className={errors.repeatPassword ? "error" : ""}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility("repeatPassword")}
                  aria-label={
                    showPasswords.repeatPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  <img
                    src={
                      showPasswords.repeatPassword ? eyeOpenIcon : eyeClosedIcon
                    }
                    alt={
                      showPasswords.repeatPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    width="20"
                    height="20"
                  />
                </button>
              </div>
              {errors.repeatPassword && (
                <span className="error-message">{errors.repeatPassword}</span>
              )}
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
              {isLoading ? "Signing up..." : "Sign up"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>

        <div className="auth-image-side">
          <img
            src={registerIllustration}
            alt="Gaming illustration"
            className="auth-image"
          />
          <div className="auth-image-text">
            <h3>Join us today!</h3>
            <p>Thousands of games, weekly discounts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
