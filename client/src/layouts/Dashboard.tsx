import { Outlet } from "react-router-dom";
import DashboardNavbar from "../components/Dashboard/Navbar";

export default function Dashboard() {
  return (
    <div className="flex flex-row bg-gray-50 h-screen w-full">
      <nav className="max-w-[300px] bg-koi pt-8 px-4 shadow w-full bg-white">
        <DashboardNavbar />
      </nav>
      <div className="w-full h-screen text-gray-700 p-8">
        <Outlet />
      </div>
    </div>
  );
}
