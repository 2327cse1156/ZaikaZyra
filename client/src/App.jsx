import { Route } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import {  useSelector } from 'react-redux'
export const serverUrl="http://localhost:5000"
import { Navigate } from 'react-router-dom'
import Home from './pages/Home'

function App() {
  useGetCurrentUser();
  const {userData}=useSelector(state=>state.user)
  return (
    <Routes>
      <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to={"/"} />} />
      <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to={"/"} />} />
      <Route path="/forgot-password" element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />} />
      <Route path="/" element={userData ? <Home /> : <Navigate to={"/signin"} />} />
    </Routes>
  )
}

export default App
