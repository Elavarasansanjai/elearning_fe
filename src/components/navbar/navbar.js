import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import "./navbar.css";
const Navbar = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  useEffect(() => {
    axios
      .get(
        `${
          process.env.REACT_APP_BACKEND_URL
            ? process.env.REACT_APP_BACKEND_URL
            : window.location.origin
        }/api/elearning/user/profile`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("elearningToken")}`,
          },
        }
      )
      .then((res) => {
        const data = res.data;
        if (data.code === 200) {
          const name = data?.data?.name;
          setName(name);
        }
      });
  }, []);
  return (
    <div className="navbar_container">
      <div className="nav_link_container">
        {name && localStorage.getItem("elearningToken") && <p>{name}</p>}
        {localStorage.getItem("elearningToken") && (
          <button
            onClick={() => {
              localStorage.removeItem("elearningToken");
              navigate("/elearning");
            }}
          >
            Logout
          </button>
        )}
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};
export default Navbar;
