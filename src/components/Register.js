import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerationSuccess, setRegistrationSuccess] = useState(null);

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        username,
        password,
      });

      setRegistrationSuccess(
        "You are registered successfully. Proceed to login."
      );
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      
    } catch (error) {
      console.error(error.response?.data?.message || "Error registering user");
      setRegistrationSuccess(
        error.response?.data?.message || "Error registering user"
      );
    } finally {
      setTimeout(() => setRegistrationSuccess(null), 2000);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm py-4 text-center">
            <div className="card-body px-4">
              <h2>Register</h2>
              <p className="text-muted">Not a user yet? Register here</p>
              
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
                onClick={handleRegister}
              >
                Register
              </button>

              <div className="mt-3">
                <button 
                  className="btn btn-link text-decoration-none" 
                  onClick={() => navigate("/login")}
                >
                  Already a user? Login here
                </button>
              </div>

              {registerationSuccess && (
                <p className="mt-3 text-primary">{registerationSuccess}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;