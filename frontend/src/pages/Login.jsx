import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const data = await loginUser(identifier, password);
      localStorage.setItem('token', data.token);
      const meRes = await fetch("http://localhost:5000/api/auth/me", {
        credentials: "include",
      });
      const userData = await meRes.json();
      setUser(userData);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

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
            Sign in to continue
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
            placeholder="Email or username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            style={{
              background: "#050a0f",
              border: "1px solid rgba(0,212,255,0.2)",
              color: "#c8e6f0",
              padding: "14px 18px",
              borderRadius: "14px",
              fontSize: "14px",
              outline: "none",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              background: "#050a0f",
              border: "1px solid rgba(0,212,255,0.2)",
              color: "#c8e6f0",
              padding: "14px 18px",
              borderRadius: "14px",
              fontSize: "14px",
              outline: "none",
              width: "100%",
              boxSizing: "border-box",
            }}
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
            LOGIN →
          </button>
        </form>

        <p style={{
          color: "#4a7a8a",
          fontSize: "13px",
          textAlign: "center",
          marginTop: "24px",
        }}>
          No account?{" "}
          <Link to="/signup" style={{ color: "#00d4ff", textDecoration: "none", fontWeight: "bold" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;