import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Login = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        username,
        password,
      });
      navigate(`/chats/${username}`)
    } catch (error) {
      console.error(error.response?.data?.message || "Error logging in");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm py-4 text-center">
            <div className="card-body px-4">
              <h2>Login</h2>
              <p className="text-muted">Login with your credentials to continue.</p>
              
              <input
                type="text"
                placeholder="Username"
                value={username}
                className="form-control mt-3"
                onChange={(e) => setUsername(e.target.value)}
              />
              
              <input
                type="password"
                placeholder="Password"
                value={password}
                className="form-control mt-3"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button 
                className="btn btn-success mt-4 w-100" 
                onClick={handleLogin}
              >
                Login
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
