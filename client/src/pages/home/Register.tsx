import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useForm from '../../hooks/useForm';
import authService from './AuthService';

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
                <div>
                  <label htmlFor="firstName" className="block mb-1 font-medium">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={setFormValue}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block mb-1 font-medium">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={setFormValue}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={setFormValue}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-1 font-medium">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={setFormValue}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Next
                </button>
              </>
            ) : (
              <>
                <div>
                  <h3 className="text-xl mb-4">Link a Wallet</h3>
                  <p className="mb-4 text-sm">
                    By connecting your wallet, you agree to our Terms of Service and Privacy Policy. You acknowledge that you are solely responsible for the security of your wallet and any associated private keys. We are not responsible for any loss of funds resulting from compromised wallet security or unauthorized access. Please ensure you understand the risks involved in using blockchain technology before proceeding.
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