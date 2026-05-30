import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { logoutUser } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";

function Home() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    navigate("/login");
  };

  return (
    <div>
      <h1>Home Page</h1>

      <h2>Welcome, {user.name}</h2>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>

      <Link to="/change-password">Change Password</Link>

      <br />
      <br />

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;