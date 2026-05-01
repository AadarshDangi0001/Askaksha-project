import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { adminAPI, studentAPI } from "../../services/api";
import "./../../styles/loginpage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setErrors({});
    setApiError("");
  };

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

    try {
      let data;
      if (role === "admin") {
        data = await adminAPI.login(formData.email.trim(), formData.password);
      } else {
        data = await studentAPI.login(formData.email.trim(), formData.password);
      }

      // Store token and user info
      if (role === "admin") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("adminInfo", JSON.stringify(data.admin));
        login({ 
          email: data.admin.email, 
          name: data.admin.name,
          role: role
        });
      } else {
        localStorage.setItem("studentToken", data.token);
        localStorage.setItem("token", data.token); // Also store as token for backward compatibility
        localStorage.setItem("studentInfo", JSON.stringify(data.student));
        login({ 
          email: data.student.email, 
          name: data.student.name,
          role: role
        });
      }
      
      navigate(role === "admin" ? "/admin/dashboard" : "/student/dashboard");
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
            <div className="login-role-selector">
              <button
                type="button"
                className={`login-role-btn ${role === "admin" ? "active" : ""}`}
                onClick={() => handleRoleChange("admin")}
              >
                Admin
              </button>
              <button
                type="button"
                className={`login-role-btn ${role === "student" ? "active" : ""}`}
                onClick={() => handleRoleChange("student")}
              >
                Student
              </button>
            </div>

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
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="•••••••••••"
                value={formData.password}
                onChange={handleChange}
                aria-invalid={!!errors.password}
                className="login-input-with-toggle"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="login-password-toggle"
              >
                <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"}></i>
              </button>
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
              {isSubmitting ? "Logging in..." : `Login as ${role}`}
            </button>
          </form>
        </div>

        <div className="login-already-acc">
          <p>
            Don&apos;t have an account?{" "}
            <span onClick={() => navigate("/register")}>Sign up</span>
          </p>
        </div>

        <div style={{ marginTop: "16px", padding: "12px", borderRadius: "10px", background: "#f7f7f7", border: "1px solid #e5e5e5" }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: "13px", color: "#374151" }}>Demo Credentials</p>
          <p style={{ margin: "6px 0 2px 0", fontSize: "12px", color: "#4b5563" }}>
            Admin: email - iit@admin.com | password - iit@admin
          </p>
          <p style={{ margin: 0, fontSize: "12px", color: "#4b5563" }}>
            Student: email - aadarsh@student.com | password - aadarsh@student
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
