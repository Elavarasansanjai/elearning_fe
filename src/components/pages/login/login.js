import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if email and password are provided
    if (!formData?.email || !formData?.password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Send login request to the backend
      const response = await axios.post(
        `${
          process.env.REACT_APP_BACKEND_URL
            ? process.env.REACT_APP_BACKEND_URL
            : window.location.origin
        }/api/elearning/user/login`,
        {
          email: formData?.email,
          password: formData?.password,
        }
      );
      if (response.data.code === 200) {
        localStorage.setItem("elearningToken", response.data.token);
        if (response.data?.userType === "Instructor") {
          navigate("/elearning/instructor");
        } else if (response.data?.userType === "Student") {
          navigate("/elearning/student");
        } else {
          navigate("/elearning/admin");
        }
      } else {
        setError(response.data.msg);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Invalid email or password"); // Error message for incorrect credentials
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  useEffect(() => {
    if (localStorage.getItem("elearningToken")) {
      try {
        axios
          .get(
            `${
              process.env.REACT_APP_BACKEND_URL
                ? process.env.REACT_APP_BACKEND_URL
                : window.location.origin
            }/api/elearning/user/auth`,

            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem(
                  "elearningToken"
                )}`,
              },
            }
          )
          .then((upload) => {
            if (upload.data.code === 200) {
              const usertype = upload?.data?.userType;
              if (usertype === "Student") {
                navigate("/elearning/student");
              } else if (usertype === "Instructor") {
                navigate("/elearning/instructor");
              }
            } else {
              alert(upload?.data?.msg);
              navigate("/elearning");
            }
          });
      } catch (err) {
        alert("something went wrong!");
        navigate("/elearning");
      }
    }
  }, []);
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} onChange={handleChange}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData?.email ? formData?.email : ""}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData?.password ? formData?.password : ""}
            required
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p style={{ color: "red", textAlign: "center" }} className="error">
            {error}
          </p>
        )}
        <p style={{ textAlign: "center" }}>Don't you have account</p>
        <div style={{ textAlign: "center" }}>
          <Link to={"/elearning/register"}> Register now</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
