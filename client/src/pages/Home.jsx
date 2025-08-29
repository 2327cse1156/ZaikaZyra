import { useSelector } from "react-redux"
import DeliveryBoy from "../components/DeliveryBoy"
import OwnerDashboard from "../components/OwnerDashboard"
import UserDashboard from "../components/UserDashboard"
function Home() {
    const {userData}=useSelector(state=>state.user)
  return (
    <div>
        {userData.role=="user" && <UserDashboard />}
        {userData.role=="owner" && <OwnerDashboard />}
        {userData.role=="deliveryBoy" && <DeliveryBoy />}
    </div>
  )
}

export default Home
