// RegisterPage.js
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAppContext } from "../components/AppContext"; // 추가

const RegisterPage = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useAppContext(); // 추가

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://52.78.157.198/register", {
        email,
        password,
      });

      if (response.data && response.data.success) {
        loginUser(response.data);
        history.push("/login"); // 회원가입 성공 시 로그인 페이지로 이동
      } else {
        console.error("Registration failed:", response.data.err);
      }
    } catch (error) {
      console.error("Registration failed:", error.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
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
      <button onClick={handleRegister}>Register</button>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
