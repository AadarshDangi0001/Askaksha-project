import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { adminAPI, studentAPI } from "../../services/api";
import "../../styles/registerpage.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    collegeCode: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setErrors({});
    setApiError("");
    if (selectedRole === "admin") {
      setFormData(prev => ({ ...prev, collegeCode: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setApiError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) newErrors.email = "Enter a valid email";
    }

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (role === "student" && !formData.collegeCode.trim()) {
      newErrors.collegeCode = "College code is required";
    }

    if (!formData.agree)
      newErrors.agree = "You must accept Terms & Privacy Policies";

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
        data = await adminAPI.register(
          formData.fullName.trim(),
          formData.email.trim(), 
          formData.password
        );
      } else {
        data = await studentAPI.register(
          formData.fullName.trim(),
          formData.email.trim(),
          formData.password,
          formData.collegeCode.trim()
        );
      }

      // Store token and user info
      if (role === "admin") {
        localStorage.setItem("token", data.token || "");
        localStorage.setItem("adminInfo", JSON.stringify(data.admin));
        if (data.collegeCode) {
          localStorage.setItem("collegeCode", data.collegeCode);
        }
        signup({ 
          email: data.admin.email, 
          name: data.admin.name,
          role: role
        });
      } else {
        localStorage.setItem("studentToken", data.token || "");
        localStorage.setItem("token", data.token || ""); // Also store as token for backward compatibility
        localStorage.setItem("studentInfo", JSON.stringify(data.student));
        signup({ 
          email: data.student.email, 
          name: data.student.name,
          role: role
        });
      }
      
      navigate(role === "admin" ? "/admin/dashboard" : "/student/dashboard");
    } catch (err) {
      setApiError(err.message || "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-main">
      <div className="signup-container">
        <div className="signup-images">
          <img className="signup-car" src="/imgs/kidcar.png" alt="" />
          <img className="signup-logo" src="/imgs/LoginLogo.png" alt="" />
        </div>

        <div className="signup-text">
          <h3>Sign up</h3>
          <p>Let's get you all set up so you can access your personal account</p>
        </div>

        <div className="signup-forms">
          <form className="signup-form-container" onSubmit={handleSubmit} noValidate>
            <div className="signup-role-selector">
              <button
                type="button"
                className={`signup-role-btn ${role === "admin" ? "active" : ""}`}
                onClick={() => handleRoleChange("admin")}
              >
                Admin
              </button>
              <button
                type="button"
                className={`signup-role-btn ${role === "student" ? "active" : ""}`}
                onClick={() => handleRoleChange("student")}
              >
                Student
              </button>
            </div>

            <div className="signup-input-group signup-floating">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <span className="signup-error-text">{errors.fullName}</span>}
            </div>

            <div className="signup-input-group signup-floating">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="john.doe@gmail.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="signup-error-text">{errors.email}</span>}
            </div>

            {role === "student" && (
              <div className="signup-input-group signup-floating">
                <label>College Code</label>
                <input
                  type="text"
                  name="collegeCode"
                  placeholder="Enter your college code"
                  value={formData.collegeCode}
                  onChange={handleChange}
                />
                {errors.collegeCode && <span className="signup-error-text">{errors.collegeCode}</span>}
              </div>
            )}

            <div className="signup-input-group signup-floating">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="•••••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className="signup-error-text">{errors.password}</span>}
            </div>

            <div className="signup-checkbox-row">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
              />
              <p>
                I agree to all the <span className="signup-link">Terms</span> and{" "}
                <span className="signup-link">Privacy Policies</span>
              </p>
            </div>
            {errors.agree && <span className="signup-error-text">{errors.agree}</span>}

            {apiError && <div className="signup-api-error">{apiError}</div>}

            <button type="submit" className="signup-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : `Sign up as ${role}`}
            </button>
          </form>
        </div>

        <div className="signup-already-acc">
          <p>
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </p>
        </div>

        <div className="signup-with">
          <div className="signup-line"></div>
          <p>or Sign up with</p>
          <div className="signup-line"></div>
        </div>

        <div className="signup-google">
          <div className="signup-img-container">
            <img src="/imgs/google.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
