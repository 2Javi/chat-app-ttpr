import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../api/authApi";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await signupUser(formData);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  const inputStyle = {
    background: "#050a0f",
    border: "1px solid rgba(0,212,255,0.2)",
    color: "#c8e6f0",
    padding: "14px 18px",
    borderRadius: "14px",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #12253a 30%, #050a0f 70%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "420px",
        padding: "48px",
        background: "#07111e",
        border: "1px solid rgba(0,212,255,0.15)",
        borderRadius: "24px",
        boxShadow: "0 0 40px rgba(0,212,255,0.1)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>💬</div>
          <h1 style={{
            color: "#00d4ff",
            fontSize: "22px",
            fontWeight: "bold",
            letterSpacing: "4px",
            margin: 0,
          }}>MESSAGES</h1>
          <p style={{ color: "#4a7a8a", fontSize: "13px", marginTop: "8px" }}>
            Create your account
          </p>
        </div>

        {error && (
          <p style={{
            color: "#ff4444",
            fontSize: "13px",
            textAlign: "center",
            marginBottom: "16px",
            padding: "10px",
            background: "rgba(255,68,68,0.1)",
            borderRadius: "12px",
            border: "1px solid rgba(255,68,68,0.2)",
          }}>{error}</p>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone (optional)"
            value={formData.phone}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={inputStyle}
          />
          <button
            type="submit"
            style={{
              background: "#00d4ff",
              color: "#050a0f",
              border: "none",
              padding: "14px",
              borderRadius: "14px",
              fontSize: "13px",
              fontWeight: "bold",
              letterSpacing: "2px",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            SIGN UP →
          </button>
        </form>

        <p style={{
          color: "#4a7a8a",
          fontSize: "13px",
          textAlign: "center",
          marginTop: "24px",
        }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#00d4ff", textDecoration: "none", fontWeight: "bold" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;