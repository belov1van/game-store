import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./LoginForm.css";
import eyeOpenIcon from "../../assets/icons/eye-open.svg";
import eyeClosedIcon from "../../assets/icons/eye-closed.svg";

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
  const [apiError, setApiError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

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
      newErrors.login = "Логин обязателен";
    }

    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
    } else if (formData.password.length < 3) {
      newErrors.password = "Пароль должен быть минимум 3 символов";
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
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon-container">
          <img
            src="../src/assets/icons/game-controller-svgrepo-com (1).svg"
            alt=""
            className="login-icon"
          />
          <div className="gamestore-title">Gamestore</div>
        </div>

        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className="login-form"
        >
          <div className="form-group">
            <input
              type="text"
              name="login"
              placeholder="login"
              value={formData.login}
              onChange={handleChange}
              className={errors.login ? "error" : ""}
            />
            {errors.login && (
              <span className="error-message">{errors.login}</span>
            )}
          </div>

          <div className="form-group password-group">
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error" : ""}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                <img
                  src={showPassword ? eyeOpenIcon : eyeClosedIcon}
                  alt={showPassword ? "Скрыть пароль" : "Показать пароль"}
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
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot your password?
            </Link>
          </div>

          {apiError && (
            <div className="error-message" style={{ marginBottom: "8px" }}>
              {apiError}
            </div>
          )}
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "logging in..." : "log in"}
          </button>
        </form>

        <div className="register-link">
          Don't have an account? <Link to="/register">registe</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
