
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useForm from '../../hooks/useForm';
import authService from '../authService';
import { Address } from 'viem';
import { createKintoSDK } from 'kinto-web-sdk';
import { fetchAccountInfo, fetchKYCViewerInfo } from '../kinto/KintoFunctions';
import { Button } from '@mui/material';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { type: accountType } = useParams<{ type: string }>();
  const [step, setStep] = useState(1);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const kintoSDK = createKintoSDK('0xCFE10657E75385F0c93Ee7e0Aec266Ae9382E0ED');

  async function kintoLogin() {
    try {
      await kintoSDK.createNewWallet();
      var kycViewerInfo;
      const accountInfo = await fetchAccountInfo();
      console.log('Account Info:', accountInfo);

      if (accountInfo.walletAddress) {
      kycViewerInfo = await fetchKYCViewerInfo(accountInfo.walletAddress as Address);
        console.log('KYC Viewer Info:', kycViewerInfo);
      }

      console.log('the account info are', accountInfo);

      // Handle different conditions based on account info and KYC status
      if (accountInfo.exists && kycViewerInfo?.isKYC) {
        navigate("/dashboard");
      } else if (accountInfo.exists && !accountInfo.approval) {
        setError("Please complete your KYC on Kinto to use the application.");
      } else {
        setError("Please create or log in to your Kinto account to proceed.");
      }
    } catch (error) {
      console.error('Failed to login/signup:', error);
    }
  }

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setIsWalletConnected(accounts.length > 0);
        if (accounts.length > 0) {
          setPublicKey(accounts[0]);
        }
      } catch (error) {
        console.error("Failed to verify wallet connection:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
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
  };

  const { form, setFormValue, submit } = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    action: async ({ firstName, lastName, email, password }) => {
      setError('');
      setSuccess('');
      if (!isWalletConnected) {
        setError("Please connect your wallet before registering.");
        return;
      }
      try {
        console.log("Sending registration request:", { firstName, lastName, email, password, publicKey });
        const result = await authService.register(firstName, lastName, email, password, publicKey);
        localStorage.setItem('token', result.token);
        setSuccess('Registration successful!');
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

  const handleNextStep = () => {
    if (form.firstName && form.lastName && form.email && form.password) {
      setStep(2);
    } else {
      setError("Please fill in all fields before continuing.");
    }
  };

  return (
    <div className="min-h-screen bg-koi flex">
      <div className="w-full flex items-center flex-col justify-center">
        <a className="inline-flex w-[220px] mb-8 rounded-[30px] px-6 overflow-hidden">
          <img src="/icons/hlogo.png" alt="logo" className="w-full h-full object-cover" />
        </a>
        <div className="bg-white p-8 rounded-lg border-2 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Register as {accountType === "company" ? "Company" : "Provider"}
          </h2>
          <form onSubmit={submit} className="space-y-4">
            {step === 1 ? (
              <>
                <Button variant="contained" color="primary" onClick={kintoLogin}>
                  Login/Signup
                </Button>
              </>
            ) : (
              <>
                <div>
                  <h3 className="text-xl mb-4">Link a Wallet</h3>
                  <p className="mb-4 text-sm">
                    By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
                    You acknowledge that you are solely responsible for the security of your wallet
                    and any associated private keys. We are not responsible for any loss of funds
                    resulting from compromised wallet security or unauthorized access. Please
                    ensure you understand the risks involved in using blockchain technology before
                    proceeding.
                  </p>
                  <button
                    type="button"
                    onClick={connectWallet}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4"
                    disabled={isWalletConnected}
                  >
                    {isWalletConnected ? 'Wallet Connected' : 'Connect Wallet'}
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  disabled={!isWalletConnected}
                >
                  Complete Registration
                </button>
              </>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;