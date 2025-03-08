import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const Auth = ({ type, Component }) => {
  const [isUser, setIsUser] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
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
              Authorization: `Bearer ${localStorage.getItem("elearningToken")}`,
            },
          }
        )
        .then((upload) => {
          if (upload.data.code === 200) {
            const usertype = upload?.data?.userType;
            if (type === usertype) {
              setIsUser(true);
            } else {
              setIsUser(false);
              alert("user role not matched!");
              navigate("/elearning");
            }
          } else {
            setIsUser(false);
            alert(upload?.data?.msg);
            localStorage.removeItem("elearningToken");
            navigate("/elearning");
          }
        });
    } catch (err) {
      alert("something went wrong!");
      navigate("/elearning");
    }
  }, []);

  return isUser && <Component />;
};
export default Auth;
