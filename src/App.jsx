import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Admin from "./pages/Dashboard/Admin.jsx";
import Student from "./pages/Dashboard/Student.jsx";
import Professor from "./pages/Dashboard/Professor.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import About from "./pages/About.jsx";
import Features from "./pages/Features.jsx";



const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/student", element: <Student/> },
  { path: "/professor", element: <Professor/> },
  { path: "/admin", element: <Admin/> },
  { path: "/about", element: <About/> },
  { path: "/features", element: <Features/> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
