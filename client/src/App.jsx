import { Route, Routes, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import useGetCity from "./hooks/useGetCity";
import useGetMyShop from "./hooks/useGetMyShop";

export const serverUrl = "http://localhost:5000";

function App() {
  const { userData } = useSelector((state) => state.user);

  useGetCurrentUser();
  useGetCity();
  useGetMyShop();

  return (
    <Routes>
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to={"/"} />}
      />
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to={"/"} />}
      />
      <Route
        path="/forgot-password"
        element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />}
      />
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to={"/signin"} />}
      />
    </Routes>
  );
}

export default App;
