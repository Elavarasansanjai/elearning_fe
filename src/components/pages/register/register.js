import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";

const Register = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if email and password are provided
    if (
      !formData?.email ||
      !formData?.password ||
      !formData?.name ||
      !formData?.role
    ) {
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
        }/api/elearning/user/register`,

        formData
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
      <h2>Register</h2>
      <form onSubmit={handleSubmit} onChange={handleChange}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData?.name ? formData?.name : ""}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData?.email ? formData?.email : ""}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData?.password ? formData?.password : ""}
            required
          />
        </div>
        <div className="form-group">
          <label>Role:</label>
          <select name="role" value={formData?.role ? formData?.role : ""}>
            <option disabled value="">
              select
            </option>
            <option value="Student">Student</option>
            <option value="Instructor">Instructor</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <button type="submit">{loading ? "Loading..." : "Register"}</button>

        {error && (
          <p style={{ color: "red" }} className="error">
            {error}
          </p>
        )}
        <div style={{ textAlign: "center" }}>
          <p>If You have account please </p>
          <Link to="/elearning/login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
