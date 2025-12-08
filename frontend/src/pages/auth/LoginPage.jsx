import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./../../styles/loginpage.css";

// Future backend URL
const LOGIN_API_URL = "https://your-backend.com/api/auth/login";
const USE_BACKEND = false;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setApiError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Enter a valid email";
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    if (!USE_BACKEND) {
      console.log("Mock login (no backend yet):", formData);
      const userData = {
        email: formData.email,
        firstName: formData.email.split('@')[0],
        lastName: ""
      };
      login(userData);
      navigate("/dashboard");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        setApiError(data.message || "Invalid email or password");
        return;
      }

      login(data.user || { email: formData.email });
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.message || "Failed to login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
 <div className="login-main">
      <div className="login-container">
        <div className="login-images">
          <img className="login-car" src="/imgs/kidbike.png" alt="" />
          <img className="login-logo" src="/imgs/LoginLogo.png" alt="" />
        </div>

        <div className="login-text">
          <h3>Login</h3>
          <p>Welcome back! Please login to your account</p>
        </div>

        <div className="login-forms">
          <form className="login-form-container" onSubmit={handleSubmit} noValidate>
            <div className="login-input-group login-floating">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="john.doe@gmail.com"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <span className="login-error-text">{errors.email}</span>
              )}
            </div>

            <div className="login-input-group login-floating">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="•••••••••••"
                value={formData.password}
                onChange={handleChange}
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <span className="login-error-text">{errors.password}</span>
              )}
            </div>

            {apiError && <div className="login-api-error">{apiError}</div>}

            <button
              type="submit"
              className="login-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        <div className="login-already-acc">
          <p>
            Don&apos;t have an account?{" "}
            <span onClick={() => navigate("/signup")}>Sign up</span>
          </p>
        </div>

        <div className="login-with">
          <div className="login-line"></div>
          <p>or Login with</p>
          <div className="login-line"></div>
        </div>

        <div className="login-google">
          <div className="login-img-container">
            <img src="/imgs/google.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
