import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./components/home/HomePage";
import LoginPage from "./login/Login";
import DashboardPage from "./dashboard/DashboardPage";
import Signup from "./components/signup/SignUp";
import RegistrationPage from "./components/register/Register";
import EditPRD from "./dashboard/prd/[prdId]/edit/EditPRD";
import PRDPreview from "./dashboard/prd/components/preview/PRDPreview";
// Import PRDPreview

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/dashboard/prd/:prdId/edit",
        element: <EditPRD />,
      },
      {
        path: "/dashboard/prd/preview",
        element: <PRDPreview />, // Add PRDPreview route
      },
    ],
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/register",
    element: <RegistrationPage />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

// Render the application
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
