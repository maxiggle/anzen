import { Outlet } from "react-router-dom";
import DashboardNavbar from "../components/Dashboard/Navbar";
import useInitChat from "../hooks/useInitChat";
import { useEffect, useState, useRef } from "react";
import config from "../utils/config";
import axios from "axios";
import Modal from "../components/UI/Modal";
import Onboarding from "../components/Dashboard/Onboarding";
import useChatStore from "../store/useChatStore";
import { useProfileStore, UserState } from "../store/useProfileStore";

export default function Dashboard() {
  const { handleConnect } = useInitChat();
  const myAddress = useChatStore((state) => state.myAddress);
  const setProfile = useProfileStore((state) => state.setProfile);
  const [loading, setLoading] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(true);
  const walletAddressRef = useRef(
    localStorage.getItem("userWalletAddress") ?? myAddress
  );

  useEffect(() => {
    handleConnect();
    walletAddressRef.current =
      localStorage.getItem("userWalletAddress") ?? myAddress;

    const getProfile = async () => {
      if (!walletAddressRef.current) return;

      setLoading(true);
      try {
        const { data } = await axios.get(
          `${config.backendUrl}/api/users/${walletAddressRef.current}`
        );
        setIsOnboardingComplete(data.user.role !== "employer");
        setProfile(data.user as UserState["user"]);
      } catch (error) {
        console.log(error);
        setIsOnboardingComplete(false);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [myAddress, handleConnect]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <svg
            className="w-24 h-24 mx-auto mb-4 text-blue-500 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <h2 className="text-3xl font-bold text-gray-800 mb-2 animate-pulse">
            Loading Dashboard
          </h2>
          <p className="text-gray-600 text-lg">
            Please wait while we fetch your data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-row bg-gray-50 h-screen w-full">
        <nav className="max-w-[300px] bg-koi pt-8 px-4 shadow w-full bg-white">
          <DashboardNavbar />
        </nav>
        <div className="w-full max-w-[calc(100%-300px)] h-screen overflow-y-auto text-gray-700 p-8">
          <Outlet />
        </div>
      </div>
      <Modal
        state={!isOnboardingComplete}
        size="3xl"
        setState={setIsOnboardingComplete}
      >
        <Onboarding
          publicKey={walletAddressRef.current!}
          onClose={() => setIsOnboardingComplete(true)}
        />
      </Modal>
    </>
  );
}
