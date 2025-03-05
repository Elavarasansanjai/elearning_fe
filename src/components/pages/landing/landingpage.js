import { useNavigate } from "react-router";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center" }} className="landing_page">
      <div className="landing_login_btn">
        <button
          onClick={() => {
            navigate("/elearning/login");
          }}
        >
          Login
        </button>
      </div>
      <div>
        <p>elearning Platform landing page</p>
      </div>
    </div>
  );
};
export default LandingPage;
