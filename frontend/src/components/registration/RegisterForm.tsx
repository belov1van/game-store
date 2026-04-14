import React, { useState } from "react";
import "./RegisterForm.css";
import eyeOpenIcon from "../../assets/icons/eye-open.svg";
import eyeClosedIcon from "../../assets/icons/eye-closed.svg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
  const [apiError, setApiError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

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
      newErrors.login = "Логин обязателен";
    }

    if (!formData.mail.trim()) {
      newErrors.mail = "Email обязателен";
    } else if (!/\S+@\S+\.\S+/.test(formData.mail)) {
      newErrors.mail = "Неверный формат email";
    }

    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
    } else if (formData.password.length < 3) {
      newErrors.password = "Пароль должен быть минимум 3 символов";
    }

    if (formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = "Пароли не совпадают";
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
    <div className="register-container">
      <div className="register-card">
        <div className="register-icon-container">
          <img
            src="../src/assets/icons/game-controller-svgrepo-com (1).svg"
            alt=""
            className="register-icon"
          />
          <div className="gamestore-title">Gamestore</div>
        </div>

        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className="register-form"
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

          <div className="form-group">
            <input
              type="email"
              name="mail"
              placeholder="mail"
              value={formData.mail}
              onChange={handleChange}
              className={errors.mail ? "error" : ""}
            />
            {errors.mail && (
              <span className="error-message">{errors.mail}</span>
            )}
          </div>

          <div className="form-group password-group">
            <div className="password-input-wrapper">
              <input
                type={showPasswords.password ? "text" : "password"}
                name="password"
                placeholder="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error" : ""}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => togglePasswordVisibility("password")}
                aria-label={
                  showPasswords.password ? "Скрыть пароль" : "Показать пароль"
                }
              >
                <img
                  src={showPasswords.password ? eyeOpenIcon : eyeClosedIcon}
                  alt={
                    showPasswords.password ? "Скрыть пароль" : "Показать пароль"
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

          <div className="form-group password-group">
            <div className="password-input-wrapper">
              <input
                type={showPasswords.repeatPassword ? "text" : "password"}
                name="repeatPassword"
                placeholder="Repeat password"
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
                    ? "Скрыть пароль"
                    : "Показать пароль"
                }
              >
                <img
                  src={
                    showPasswords.repeatPassword ? eyeOpenIcon : eyeClosedIcon
                  }
                  alt={
                    showPasswords.repeatPassword
                      ? "Скрыть пароль"
                      : "Показать пароль"
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
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "signing up..." : "sing up"}
          </button>
        </form>

        <div className="login-link">
          already have an account <Link to="/login">log in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
