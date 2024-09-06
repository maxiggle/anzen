import { Outlet } from "react-router-dom";
import DashboardNavbar from "../components/Dashboard/Navbar";
import useInitChat from "../hooks/useInitChat";
import { useEffect } from "react";

export default function Dashboard() {
  const { handleConnect } = useInitChat();

  useEffect(() => {
    handleConnect();
  }, []);

  return (
    <div className="flex flex-row  bg-gray-50 h-screen w-full">
      <nav className="max-w-[300px] bg-koi pt-8 px-4 shadow w-full bg-white">
        <DashboardNavbar />
      </nav>
      <div className="w-full max-w-[calc(100%-300px)] h-screen text-gray-700 p-8">
        <Outlet />
      </div>
    </div>
  );
}
