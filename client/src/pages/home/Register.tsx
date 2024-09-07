import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useForm from "../../hooks/useForm";
import authService from "../authService";
import { Address } from "viem";
import { createKintoSDK } from "kinto-web-sdk";
import { fetchAccountInfo, fetchKYCViewerInfo } from "../kinto/KintoFunctions";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";

// declare global {
//   interface Window {
//     ethereum?: any;
//   }
// }

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { type: accountType } = useParams<{ type: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const kintoSDK = createKintoSDK("0xCFE10657E75385F0c93Ee7e0Aec266Ae9382E0ED");

  useEffect(() => {
    checkWalletConnection();
  }, []);

  useEffect(() => {
    const handleKintoLoginComplete = async () => {
      console.log("Kinto login completed");
      const accountInfo = await fetchAccountInfo();
      const kycViewerInfo = await fetchKYCViewerInfo(
        accountInfo.walletAddress as Address
      );

      if (accountInfo.exists && kycViewerInfo?.isKYC) {
        setSuccess("Login successful! Redirecting to dashboard...");
        setIsLoading(false);
        navigate("/dashboard");
      }
    };

    window.addEventListener("kintoLoginComplete", handleKintoLoginComplete);

    return () => {
      window.removeEventListener(
        "kintoLoginComplete",
        handleKintoLoginComplete
      );
    };
  }, [navigate]);

  const checkWalletConnection = async () => {
    setIsLoading(true);
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        setIsWalletConnected(accounts.length > 0);
        if (accounts.length > 0) {
          setPublicKey(accounts[0]);
        }
      } catch (error) {
        console.error("Failed to verify wallet connection:", error);
        setError("Failed to verify wallet connection. Please try again.");
      }
    } else {
      setError("Wallet is not installed. Please install it to continue.");
    }
    setIsLoading(false);
  };

  const kintoLogin = async () => {
    console.log("Starting Kinto login process");
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("Creating new wallet or logging in");
      await kintoSDK.createNewWallet();

      // Add a delay to allow Kinto login to complete
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Fetching account info");
      const accountInfo = await fetchAccountInfo();
      console.log("Account Info:", accountInfo);

      if (!accountInfo.walletAddress) {
        throw new Error("Wallet address not found");
      }

      console.log("Fetching KYC viewer info");
      const kycViewerInfo = await fetchKYCViewerInfo(
        accountInfo.walletAddress as Address
      );
      console.log("KYC Viewer Info:", kycViewerInfo);

      if (accountInfo.exists && kycViewerInfo?.isKYC) {
        console.log("Login successful, redirecting to dashboard");
        setSuccess("Login successful! Redirecting to dashboard...");
        setIsLoading(false);
        navigate("/dashboard");
      } else if (accountInfo.exists && !kycViewerInfo?.isKYC) {
        console.log("KYC verification required");
        setDialogMessage(
          "Please complete your KYC verification on Kinto to use the application."
        );
        setOpenDialog(true);
        setIsLoading(false);
      } else {
        console.log("Account creation or login required");
        setDialogMessage(
          "Please create or log in to your Kinto account to proceed."
        );
        setOpenDialog(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to login/signup:", error);
      setError("An error occurred during the login process. Please try again.");
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Connected to wallet, public key:", accounts[0]);
        setIsWalletConnected(true);
        setPublicKey(accounts[0]);
        setSuccess("Wallet connected successfully!");
      } catch (error) {
        console.error("Failed to connect to wallet:", error);
        setError("Failed to connect to wallet. Please try again.");
      }
    } else {
      setError("Wallet is not installed. Please install it to continue.");
    }
    setIsLoading(false);
  };

  const { form, setFormValue, submit } = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    action: async ({ firstName, lastName, email, password }) => {
      setError("");
      setSuccess("");
      if (!isWalletConnected) {
        setError("Please connect your wallet before registering.");
        return;
      }
      try {
        console.log("Sending registration request:", {
          firstName,
          lastName,
          email,
          password,
          publicKey,
        });
        const result = await authService.register(
          firstName,
          lastName,
          email,
          password,
          publicKey
        );
        localStorage.setItem("token", result.token);
        setSuccess("Registration successful!");
        return result;
      } catch (err) {
        setError("Registration failed. The email may already be in use.");
        throw err;
      }
    },
    success() {
      navigate("/dashboard");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-koi flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-koi flex">
      <div className="w-full flex items-center flex-col justify-center">
        <a className="inline-flex w-[220px] mb-8 rounded-[30px] px-6 overflow-hidden">
          <img
            src="/icons/hlogo.png"
            alt="logo"
            className="w-full h-full object-cover"
          />
        </a>
        <div className="bg-white p-8 rounded-lg border-2 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Register as {accountType === "company" ? "Company" : "Provider"}
          </h2>
          <form onSubmit={submit} className="space-y-4">
            <Button
              variant="contained"
              color="primary"
              onClick={kintoLogin}
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} />
              ) : (
                "Login/Signup with Kinto"
              )}
            </Button>
            <p className="text-center">or</p>
            <button
              type="button"
              onClick={connectWallet}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4"
              disabled={isWalletConnected || isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} />
              ) : isWalletConnected ? (
                "Wallet Connected"
              ) : (
                "Connect Wallet"
              )}
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
          </form>
        </div>
      </div>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Action Required</DialogTitle>
        <DialogContent>
          <p>{dialogMessage}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Register;
