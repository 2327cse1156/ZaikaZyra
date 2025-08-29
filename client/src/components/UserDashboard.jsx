import Nav from "./Nav";

function UserDashboard() {
  return (
    <div className="relative min-h-screen bg-[#FFF7ED] overflow-hidden">
      {/* Floating bubbles */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-36 h-36 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-2000"></div>
        <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-4000"></div>
      </div>

      {/* Navbar */}
      <Nav />

      {/* Dashboard content placeholder
      <div className="w-[95%] max-w-6xl mx-auto mt-8 p-6 bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800">Welcome to Dashboard</h2>
        <p className="text-gray-600 mt-2">
          Here you can manage your orders, account info, and more.
        </p>
      </div> */}
    </div>
  );
}

export default UserDashboard;
