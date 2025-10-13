import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./login.scss";
import { signIn } from "../../server"; // your backend API call

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in both fields");
      return;
    }

    try {
      setLoading(true);

      // Call the real login API
      const payload = {
        email: formData.email,
        password: formData.password,
      };

      const response = await signIn(payload);
      console.log(response)

      // ✅ Expecting API response shape like:
      // { success: true, token: "xyz", message: "Login successful" }
      if (response?.token) {
        localStorage.setItem("authToken", response.token);
        navigate("/"); // redirect to dashboard
      } else {
        setError(response?.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img
          src={"/assets/Frame 322.png"}
          alt="Livease Logo"
          className="login-logo"
        />
        <p className="login-subtitle">Login to proceed</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className="login-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="login-input"
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
