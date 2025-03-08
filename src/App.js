import logo from "./logo.svg";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Navbar from "./components/navbar/navbar";
import Context from "./components/context/AppContext";
import LandingPage from "./components/pages/landing/landingpage";
import Login from "./components/pages/login/login";
import Register from "./components/pages/register/register";
import Instructor from "./components/pages/Instructor/Instructor";
import Auth from "./components/pages/Auth/Auth";
import Student from "./components/Student/student";
import React from "react";

const router = createBrowserRouter([
  {
    path: "/elearning/",
    element: <Navbar />,
    children: [
      { path: "", index: true, element: <LandingPage /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        path: "instructor",
        element: <Auth type="Instructor" Component={Instructor} />,
      },
      {
        path: "student",
        element: <Auth type="Student" Component={Student} />,
      },
      // {path:"/superadmin", element:<SuperAdmin />}
    ],
  },
]);

function App() {
  return (
    <React.Fragment>
      <Context>
        <RouterProvider router={router}></RouterProvider>
      </Context>
    </React.Fragment>
  );
}

export default App;
