// LoginPage.js
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAppContext } from "../components/AppContext"; // 추가

const LoginPage = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useAppContext(); // 추가

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      if (response.data && response.data.loginSuccess) {
        loginUser(response.data);
        history.push("/"); // 로그인 성공 시 홈 화면으로 이동
      } else {
        console.error("Login failed:", response.data.message);
      }
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default LoginPage;
