import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/registerpage.css";

const SIGNUP_API_URL = "https://your-backend.com/api/auth/signup";
const USE_BACKEND = false;

const RegisterPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) newErrors.email = "Enter a valid email";
    }

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords do not match";

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

    if (!USE_BACKEND) {
      console.log("Mock signup :", formData);
      const userData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName
      };
      signup(userData);
      navigate("/dashboard");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(SIGNUP_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.message || "Something went wrong. Please try again.");
        return;
      }

      signup(data.user || { 
        email: formData.email, 
        firstName: formData.firstName, 
        lastName: formData.lastName 
      });
      navigate("/dashboard");
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
            <div className="signup-name-row">
              <div className="signup-input-group signup-floating">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="john"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && <span className="signup-error-text">{errors.firstName}</span>}
              </div>

              <div className="signup-input-group signup-floating">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="doe"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && <span className="signup-error-text">{errors.lastName}</span>}
              </div>
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

            <div className="signup-input-group signup-floating">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="•••••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <span className="signup-error-text">{errors.confirmPassword}</span>
              )}
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
              {isSubmitting ? "Creating account..." : "Create account"}
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
