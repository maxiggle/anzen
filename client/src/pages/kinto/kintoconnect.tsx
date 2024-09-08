import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Input,
  CircularProgress,
  Box,
  Card,
  Typography,
} from '@mui/material';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import DataTable from '../../components/UI/DataTable';
import { Address } from 'viem';
import { KintoAccountInfo } from 'kinto-web-sdk';
import { TokenBalance, formatTokenBalance } from './BlockscoutUtils';
import {
  kintoLogin,
  fetchCounter,
  increaseCounter,
  fetchKYCViewerInfo,
  fetchAccountInfo,
  fetchTokenBalances,
  transferToken,
  setupAndRunMonthlyTransfer,
  fetchDestinationKYC,
  initializeBudgetAllocation, 
  allocateBudget, 
  authorizeUser, 
  unauthorizeUser, 
  withdrawFunds, 
  getContractBalance, 
  getUserAllocation,
  initializeAndApproveMonthlyTransfer,
  executeMonthlyTransferIfNeeded,
  startWalletRecovery,
  completeWalletRecovery,
  approveWalletRecovery,
  changeWalletRecoverer
} from './KintoFunctions';
import { ethers } from 'ethers';


import BudgetAllocationSectionComponent from './BudgetAllocationSectionComponent';
import MonthlyTransferSectionComponent from './MonthlyTransferSectionComponent';
import TransferFundsSectionComponent from './TransferFundsSectionComponent';


interface KintoAccountInfo {
  walletAddress: Address;
}

interface KYCViewerInfo {
  isIndividual: boolean;
  isCorporate: boolean;
  isKYC: boolean;
  isSanctionsSafe: boolean;
  getCountry: string;
  getWalletOwners: Address[];
}

export const receipient = "0x79edB24F41Ec139dde29B6e604ed52954d643858" as Address;
export const tokenAddress = "0x0E7000967bcB5fC76A5A89082db04ed0Bf9548d8" as Address;
export const amount = BigInt("500000000000000");
export const totalAmount = BigInt("1000000000000000");

export const KintoContext = React.createContext({
  handleStartWalletRecovery: (wallet: string) => {},
  handleCompleteWalletRecovery:(wallet: string,  newSigners: string[]) => {}, 
  handleApproveWalletRecovery:(wallet: string) => {}, 
  handleChangeWalletRecoverer:(wallet: string, newRecoverer: string) => {},
  accountInfo: undefined,
  kycViewerInfo: undefined,
  tokenBalances: [],
  loading: false,
});

interface KintoConnectProps {
  children: ReactNode;
  showNavigation?: boolean;
}

const StyledTabsNavigation = ({ selectedAction, handleActionChange }) => {
return (
    <div>
      <div className="flex w-full border-b border-gray-200">
        {['allocate', 'payment', 'monthly'].map((action) => (
          <button
            key={action}
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              selectedAction === action
                ? 'text-[#a855f7] border-b-2 border-[#a855f7]'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => handleActionChange(action)}
          >
            {action === 'allocate' && 'Allocate Budget'}
            {action === 'payment' && 'Make a Payment'}
            {action === 'monthly' && 'Monthly Salary'}
          </button>
        ))}
      </div>
      {!selectedAction && (
        <div className="mt-6 text-center text-2xl font-bold text-[#a855f7] bg-purple-50 py-4 rounded-lg shadow-sm">
          Select your service
        </div>
      )}
    </div>
  );
};


export const KintoConnect: React.FC<KintoConnectProps> = ({ children, showNavigation = true }) => {
  const [accountInfo, setAccountInfo] = useState<KintoAccountInfo | undefined>(undefined);
  const [kycViewerInfo, setKYCViewerInfo] = useState<KYCViewerInfo | undefined>(undefined);
  const [counter, setCounter] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [selectedToken, setSelectedToken] = useState<TokenBalance | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [destinationKYCInfo, setDestinationKYCInfo] = useState<KYCViewerInfo | null>(null);
  const [budgetTokenAddress, setBudgetTokenAddress] = useState<string>('');
  const [budgetAmount, setBudgetAmount] = useState<string>('');
  const [authorizedUser, setAuthorizedUser] = useState<string>('');
  const [monthlyRecipient, setMonthlyRecipient] = useState<string>('');
  const [monthlyAmount, setMonthlyAmount] = useState<string>('');
  const [monthlyTokenAddress, setMonthlyTokenAddress] = useState<string>('');
  const [monthlyMaxAllowance, setMonthlyMaxAllowance] = useState<string>('');
  const [showInfo, setshowInfo] = useState(false);
  const [showRecoverInfo, setshowRecoverInfo] = useState(false);
  const [showBudgetAllocation, setshowBudgetAllocation] = useState(false);
  const [showMonthlyTransfer, setshowMonthlyTransfer] = useState(false);
  const [showFundTransfer, setshowFundTransfer] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');

  const handleSetupAndRunMonthlyTransfer = async () => {
    try {
      await setupAndRunMonthlyTransfer(receipient, amount, tokenAddress, totalAmount);
      // Optionally update state or show a success message
    } catch (error) {
      console.error('Failed to setup monthly transfer:', error);
      // Optionally show an error message to the user
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      await fetchAccountInfo().then(setAccountInfo);
      await fetchCounter().then(setCounter);
    };
    initializeApp();
  }, []);

  useEffect(() => {
    if (accountInfo?.walletAddress) {
      fetchKYCViewerInfo(accountInfo.walletAddress as Address).then(setKYCViewerInfo);
      fetchTokenBalances(accountInfo.walletAddress as Address).then(setTokenBalances);
    }
  }, [accountInfo]);

  useEffect(() => {
    if (recipientAddress && recipientAddress.length === 42) {
      fetchDestinationKYC(recipientAddress as Address).then(setDestinationKYCInfo);
    } else {
      setDestinationKYCInfo(null);
    }
  }, [recipientAddress]);

  const handleKintoLogin = async () => {
    try {
      await kintoLogin();
      const newAccountInfo = await fetchAccountInfo();
      setAccountInfo(newAccountInfo);
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };
  

  const handleIncreaseCounter = async () => {
    setLoading(true);
    try {
      // const newCounter = await increaseCounter();
      // setCounter(newCounter);
      await initializeBudgetAllocation(tokenAddress);
    } catch (error) {
      console.error('Failed to increase counter:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!selectedToken || !recipientAddress || !transferAmount || !accountInfo?.walletAddress) {
      console.log('Transfer cancelled: missing information');
      return;
    }

    setLoading(true);
    try {
      const amount = BigInt(parseFloat(transferAmount) * Math.pow(10, parseInt(selectedToken.decimals)));
      await transferToken(selectedToken.contractAddress as Address, recipientAddress as Address, amount);
      await fetchTokenBalances(accountInfo.walletAddress as Address).then(setTokenBalances);
      setTransferAmount('');
      setRecipientAddress('');
      setSelectedToken(null);
    } catch (error) {
      console.error('Failed to transfer token:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeBudgetAllocation = async () => {
    if (!budgetTokenAddress) {
      console.log('Initialization cancelled: missing token address');
      return;
    }

    setLoading(true);
    try {
      await initializeBudgetAllocation(budgetTokenAddress as Address);
      console.log('Budget allocation initialized successfully');
      // Optionally, you can clear the input field or show a success message
      setBudgetTokenAddress('');
    } catch (error) {
      console.error('Failed to initialize budget allocation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAllocateBudget = async () => {
    if (!budgetAmount) {
      console.log('Budget allocation cancelled: missing amount');
      return;
    }

    setLoading(true);
    try {
      const amount = BigInt(parseFloat(budgetAmount) * Math.pow(10, 18)); // Assuming 18 decimals, adjust if needed
      await allocateBudget(amount);
      console.log('Budget allocated successfully');
      // Optionally, you can clear the input field or show a success message
      setBudgetAmount('');
    } catch (error) {
      console.error('Failed to allocate budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorizeUser = async () => {
    if (!authorizedUser) {
      console.log('User authorization cancelled: missing address');
      return;
    }

    setLoading(true);
    try {
      await authorizeUser(authorizedUser as Address);
      console.log('User authorized successfully');
      // Optionally, you can clear the input field or show a success message
      setAuthorizedUser('');
    } catch (error) {
      console.error('Failed to authorize user:', error);
    } finally {
      setLoading(false);
    }
  };

  const KYCInfoDisplay: React.FC<{ kycInfo: KYCViewerInfo; title: string }> = ({ kycInfo, title }) => (
    <KYCInfo>
      <KYCInfoHeader>{title}</KYCInfoHeader>
      <KYCInfoRow>
        <KYCInfoLabel>Is Individual:</KYCInfoLabel>
        <KYCInfoValue>{kycInfo.isIndividual ? 'Yes' : 'No'}</KYCInfoValue>
      </KYCInfoRow>
      <KYCInfoRow>
        <KYCInfoLabel>Is Corporate:</KYCInfoLabel>
        <KYCInfoValue>{kycInfo.isCorporate ? 'Yes' : 'No'}</KYCInfoValue>
      </KYCInfoRow>
      <KYCInfoRow>
        <KYCInfoLabel>Is KYC:</KYCInfoLabel>
        <KYCInfoValue>{kycInfo.isKYC ? 'Yes' : 'No'}</KYCInfoValue>
      </KYCInfoRow>
      <KYCInfoRow>
        <KYCInfoLabel>Is Sanctions Safe:</KYCInfoLabel>
        <KYCInfoValue>{kycInfo.isSanctionsSafe ? 'Yes' : 'No'}</KYCInfoValue>
      </KYCInfoRow>
      <KYCInfoRow>
        <KYCInfoLabel>Country:</KYCInfoLabel>
        <KYCInfoValue>{kycInfo.getCountry}</KYCInfoValue>
      </KYCInfoRow>
    </KYCInfo>
  );

  const CompressedAddress: React.FC<{ address: Address; className?: string }> = ({ address, className }) => (
    <div className={className}>
      {address.slice(0, 10)}...{address.slice(-10)}
    </div>
  );

  const handleInitializeMonthlyTransfer = async () => {
    if (!monthlyRecipient || !monthlyAmount || !monthlyTokenAddress || !monthlyMaxAllowance) {
      console.log('Monthly transfer initialization cancelled: missing information');
      return;
    }

    setLoading(true);
    try {
      const amount = BigInt(parseFloat(monthlyAmount) * Math.pow(10, 18)); // Assuming 18 decimals, adjust if needed
      const maxAllowance = BigInt(parseFloat(monthlyMaxAllowance) * Math.pow(10, 18));
      await initializeAndApproveMonthlyTransfer(
        monthlyRecipient as Address,
        amount,
        monthlyTokenAddress as Address,
        maxAllowance
      );
      console.log('Monthly transfer initialized successfully');
      // Optionally, clear input fields or show a success message
    } catch (error) {
      console.error('Failed to initialize monthly transfer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteMonthlyTransfer = async () => {
    setLoading(true);
    try {
      await executeMonthlyTransferIfNeeded();
      console.log('Monthly transfer executed successfully');
    } catch (error) {
      console.error('Failed to execute monthly transfer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartWalletRecovery = async (wallet: string) => {
    if (!wallet) {
      console.log('Wallet recovery start cancelled: missing wallet address');
      return;
    }

    setLoading(true);
    try {
      await startWalletRecovery(wallet as Address);
      console.log('Wallet recovery started successfully');
      // Optionally, show a success message or update UI
    } catch (error) {
      console.error('Failed to start wallet recovery:', error);
      // Optionally, show an error message
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteWalletRecovery = async (wallet: string, newSigners: string[]) => {
    if (!wallet || !newSigners.length) {
      console.log('Wallet recovery completion cancelled: missing information');
      return;
    }

    setLoading(true);
    try {
      await completeWalletRecovery(wallet as Address, newSigners as Address[]);
      console.log('Wallet recovery completed successfully');
      // Optionally, show a success message or update UI
    } catch (error) {
      console.error('Failed to complete wallet recovery:', error);
      // Optionally, show an error message
    } finally {
      setLoading(false);
    }
  };

  const handleApproveWalletRecovery = async (wallet: string) => {
    if (!wallet) {
      console.log('Wallet recovery approval cancelled: missing wallet address');
      return;
    }

    setLoading(true);
    try {
      await approveWalletRecovery(wallet as Address);
      console.log('Wallet recovery approved successfully');
      // Optionally, show a success message or update UI
    } catch (error) {
      console.error('Failed to approve wallet recovery:', error);
      // Optionally, show an error message
    } finally {
      setLoading(false);
    }
  };

  const handleChangeWalletRecoverer = async (wallet: string, newRecoverer: string) => {
    if (!wallet || !newRecoverer) {
      console.log('Wallet recoverer change cancelled: missing information');
      return;
    }

    setLoading(true);
    try {
      await changeWalletRecoverer(wallet as Address, newRecoverer as Address);
      console.log('Wallet recoverer changed successfully');
      // Optionally, show a success message or update UI
    } catch (error) {
      console.error('Failed to change wallet recoverer:', error);
      // Optionally, show an error message
    } finally {
      setLoading(false);
    }
  };

  const handleActionChange = (action) => {
    setSelectedAction(action);
    setshowBudgetAllocation(action === 'allocate');
    setshowMonthlyTransfer(action === 'monthly');
    setshowFundTransfer(action === 'payment');
  };

  const contextValue = {
    handleStartWalletRecovery,
    handleCompleteWalletRecovery, 
    handleApproveWalletRecovery, 
    handleChangeWalletRecoverer,
    accountInfo,
    kycViewerInfo,
    tokenBalances,
    loading,
  };

  return (
    <KintoContext.Provider value={contextValue}>
    <WholeWrapper>
      <AppWrapper>
        <ContentWrapper>
        {showNavigation && (
        <StyledTabsNavigation 
              selectedAction={selectedAction}
              handleActionChange={handleActionChange}
            />
        )}
          {children}
          {accountInfo ? (
            <>
              <CounterWrapper>
              {accountInfo && showRecoverInfo &&(
              <Button onClick={() => handleStartWalletRecovery('0x58A5fF6611ff6b6da23E9bFf5C50Ba2BC4E1C6c8')}>
                      Recover your wallet
              </Button>
              )}
             {accountInfo && showInfo && (
              <>
                <WalletRows>
                  <WalletRow key="chain">
                    <WalletRowName>Chain</WalletRowName>
                    <WalletRowValue>Kinto (ID: 7887)</WalletRowValue>
                  </WalletRow>
                  {kycViewerInfo && (
                    <>
                      <WalletRow key="isIndividual">
                        <WalletRowName>Is Individual</WalletRowName>
                        <WalletRowValue>{kycViewerInfo.isIndividual ? 'Yes' : 'No'}</WalletRowValue>
                      </WalletRow>
                      <WalletRow key="isCorporate">
                        <WalletRowName>Is Corporate</WalletRowName>
                        <WalletRowValue>{kycViewerInfo.isCorporate ? 'Yes' : 'No'}</WalletRowValue>
                      </WalletRow>
                      <WalletRow key="isKYC">
                        <WalletRowName>Is KYC</WalletRowName>
                        <WalletRowValue>{kycViewerInfo.isKYC ? 'Yes' : 'No'}</WalletRowValue>
                      </WalletRow>
                      <WalletRow key="isSanctionsSafe">
                        <WalletRowName>Is Sanctions Safe</WalletRowName>
                        <WalletRowValue>{kycViewerInfo.isSanctionsSafe ? 'Yes' : 'No'}</WalletRowValue>
                      </WalletRow>
                      <WalletRow key="country">
                        <WalletRowName>Country</WalletRowName>
                        <WalletRowValue>{kycViewerInfo.getCountry}</WalletRowValue>
                      </WalletRow>
                    </>
                  )}
                  <WalletRow key="counter">
                    <WalletRowName>Counter</WalletRowName>
                    <WalletRowValue>{counter}</WalletRowValue>
                  </WalletRow>
                </WalletRows>
                <Button variant="contained" color="primary" onClick={handleIncreaseCounter} disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : 'Increase Counter'}
                </Button>
              </>
            )}
              </CounterWrapper>
              <ThreeColumnLayout>
              <Column>

              {accountInfo && showFundTransfer &&(

              <TransferFundsSectionComponent
                loading={loading}
                tokenBalances={tokenBalances}
                selectedToken={selectedToken}
                setSelectedToken={setSelectedToken}
                recipientAddress={recipientAddress}
                setRecipientAddress={setRecipientAddress}
                transferAmount={transferAmount}
                setTransferAmount={setTransferAmount}
                handleTransfer={handleTransfer}
                formatTokenBalance={formatTokenBalance}
              />
            )}
            </Column>
              </ThreeColumnLayout>
              {accountInfo && showBudgetAllocation &&(
                <BudgetAllocationSectionComponent
                  loading={loading}
                  budgetTokenAddress={budgetTokenAddress}
                  setBudgetTokenAddress={setBudgetTokenAddress}
                  budgetAmount={budgetAmount}
                  setBudgetAmount={setBudgetAmount}
                  authorizedUser={authorizedUser}
                  setAuthorizedUser={setAuthorizedUser}
                  handleInitializeBudgetAllocation={handleInitializeBudgetAllocation}
                  handleAllocateBudget={handleAllocateBudget}
                  handleAuthorizeUser={handleAuthorizeUser}
                />
              )}

              {accountInfo && showMonthlyTransfer &&  
              (<MonthlyTransferSectionComponent
                loading={loading}
                monthlyRecipient={monthlyRecipient}
                setMonthlyRecipient={setMonthlyRecipient}
                monthlyAmount={monthlyAmount}
                setMonthlyAmount={setMonthlyAmount}
                monthlyTokenAddress={monthlyTokenAddress}
                setMonthlyTokenAddress={setMonthlyTokenAddress}
                monthlyMaxAllowance={monthlyMaxAllowance}
                setMonthlyMaxAllowance={setMonthlyMaxAllowance}
                handleInitializeMonthlyTransfer={handleInitializeMonthlyTransfer}
                handleExecuteMonthlyTransfer={handleExecuteMonthlyTransfer}
              />
            )}

            </>
          ) : (
            <CircularProgress />
          )}
        </ContentWrapper>
      </AppWrapper>
    </WholeWrapper>
    </KintoContext.Provider>
  );
};

export const WalletRecoveryProcess: React.FC = () => {
  const {
    handleStartWalletRecovery,
    handleCompleteWalletRecovery,
    handleApproveWalletRecovery,
    handleChangeWalletRecoverer,
    loading
  } = useContext(KintoContext);

  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(0);
  const [signerAddress, setSignerAddress] = useState<string | null>(null);
  const [newSigners, setNewSigners] = useState<string[]>([]);
  const [newRecoverer, setNewRecoverer] = useState<string>('');
  const [recoveryHistory, setRecoveryHistory] = useState<Array<{ walletAddress: string; status: string; date: string }>>([]);
  const [availableAddresses, setAvailableAddresses] = useState<string[]>([]);
  const [tempNewSigner, setTempNewSigner] = useState<string>('');

  const getStepInfo = () => {
    switch (step) {
      case 0:
        return {
          title: "Wallet Recovery",
          description: "Start the recovery process for your wallet",
          buttonText: "Initiate Wallet Recovery"
        };
      case 1:
        return {
          title: "Add New Signers",
          description: "Add new signers to your recovered wallet",
          buttonText: "Continue Recovery Process"
        };
      case 2:
        return {
          title: "Approve Recovery",
          description: "Approve the changes to your wallet",
          buttonText: "Approve Wallet Recovery"
        };
      case 3:
        return {
          title: "Change Recoverer",
          description: "Update the recoverer for your wallet",
          buttonText: "Finalize Recovery Process"
        };
      default:
        return {
          title: "Wallet Recovery",
          description: "Need to recover your wallet?",
          buttonText: "Click here to start recovering the wallet..."
        };
    }
  };

  const { title, description, buttonText } = getStepInfo();

  const connectMetaMask = async (): Promise<string[]> => {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error("MetaMask is not installed");
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length === 0) {
        throw new Error("No accounts found in MetaMask");
      }

      return accounts.map(account => account.address);
    } catch (error) {
      console.error("Failed to connect to MetaMask:", error);
      throw error;
    }
  };

  const handleConnectWallet = async () => {
    try {
      const addresses = await connectMetaMask();
      setAvailableAddresses(addresses);
      console.log("Available addresses:", addresses);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleSelectAddress = (address: string) => {
    setSignerAddress(address);
    console.log("Selected address:", address);
  };

  const handleAddSigner = () => {
    if (tempNewSigner) {
      setNewSigners([...newSigners, tempNewSigner]);
      setTempNewSigner('');
      console.log("Added new signer:", tempNewSigner);
    }
  };

  const handleSetNewRecoverer = (address: string) => {
    setNewRecoverer(address);
    console.log("Set new recoverer:", address);
  };

  const handleRecoveryAction = async (action: () => Promise<void>) => {
    if (!signerAddress) return;

    try {
      await action();
      setRecoveryHistory([
        ...recoveryHistory,
        { walletAddress: signerAddress, status: `Step ${step + 1} completed`, date: new Date().toLocaleString() }
      ]);
      setStep(step + 1);
      if (step === 3) {
        setShowModal(false);
      }
    } catch (error) {
      console.error("Failed to perform recovery action:", error);
      // You might want to show an error message to the user here
    }
  };

  const renderModalContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Initiate Recovery</h3>
            {availableAddresses.length > 0 ? (
              <div>
                <p className="text-sm text-gray-600">Select an address:</p>
                <select 
                  onChange={(e) => handleSelectAddress(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select an address</option>
                  {availableAddresses.map((address, index) => (
                    <option key={index} value={address}>
                      {address}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <Button
                onClick={handleConnectWallet}
                className="w-full"
              >
                Connect your Wallet
              </Button>
            )}
            <Button
              onClick={() => signerAddress && handleRecoveryAction(() => handleStartWalletRecovery(signerAddress))}
              disabled={loading || !signerAddress}
              className="w-full"
            >
              {loading ? 'Recovery in progress...' : 'Recover Your Wallet'}
            </Button>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Add New Signers</h3>
            {newSigners.map((signer, index) => (
              <p key={index} className="text-sm text-gray-600">New signer {index + 1}: {signer}</p>
            ))}
            <div>
              <p className="text-sm text-gray-600">Select new signer address:</p>
              <select 
                value={tempNewSigner}
                onChange={(e) => setTempNewSigner(e.target.value)}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="">Select an address</option>
                {availableAddresses.map((address, index) => (
                  <option key={index} value={address}>
                    {address}
                  </option>
                ))}
              </select>
              <Button onClick={handleAddSigner} variant="outline" className="w-full">
                Add Selected Signer
              </Button>
            </div>
            <Button
              onClick={() => signerAddress && handleRecoveryAction(() => handleCompleteWalletRecovery(signerAddress, newSigners))}
              disabled={loading || newSigners.length === 0 || !signerAddress}
              className="w-full"
            >
              {loading ? 'Completion in progress...' : 'Complete Recovery'}
            </Button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Approve Recovery</h3>
            <p className="text-sm text-gray-600">You're about to approve the recovery process for wallet: {signerAddress}</p>
            <Button
              onClick={() => signerAddress && handleRecoveryAction(() => handleApproveWalletRecovery(signerAddress))}
              disabled={loading || !signerAddress}
              className="w-full"
            >
              {loading ? 'Approval in progress...' : 'Approve Recovery'}
            </Button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Change Recoverer</h3>
            <div>
              <p className="text-sm text-gray-600">Select new recoverer address:</p>
              <select 
                value={newRecoverer}
                onChange={(e) => handleSetNewRecoverer(e.target.value)}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="">Select an address</option>
                {availableAddresses.map((address, index) => (
                  <option key={index} value={address}>
                    {address}
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={() => signerAddress && newRecoverer && handleRecoveryAction(() => handleChangeWalletRecoverer(signerAddress, newRecoverer))}
              disabled={loading || !newRecoverer || !signerAddress}
              className="w-full"
            >
              {loading ? 'Change in progress...' : 'Change Recoverer'}
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col items-start mb-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <Button 
          onClick={() => setShowModal(true)} 
          variant="primary"
          className="w-full"
        >
          {buttonText}
        </Button>
      </div>

      {recoveryHistory.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Recovery History</h3>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Wallet Address</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {recoveryHistory.map((record, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{record.walletAddress}</td>
                  <td className="p-2">{record.status}</td>
                  <td className="p-2">{record.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal state={showModal} size="3xl" setState={setShowModal}>
        <div className="p-6">
          {renderModalContent()}
        </div>
      </Modal>
    </div>
  );
};


const CustomCard = styled.div`
  max-width: 500px;
  margin: auto;
  margin-top: 48px;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: white;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  margin-bottom: 32px;
  color: #a855f7;
  text-align: center;
  font-size: 24px;
`;

const InfoItem = styled.div`
  margin-bottom: 16px;
`;

export const AccountInfo: React.FC = () => {
  const { accountInfo, kycViewerInfo, tokenBalances } = useContext(KintoContext);

  if (!kycViewerInfo) {
    return (
      <CustomCard>
        <CardContent>
          <p style={{ textAlign: 'center' }}>Loading account information...</p>
        </CardContent>
      </CustomCard>
    );
  }

  return (
    <CustomCard>
      <CardContent>
        <Title>Account Information</Title>

        <InfoItem>
          <strong>Name : </strong> Sami
        </InfoItem>
        <InfoItem>
          <strong>Chain:</strong> Kinto (ID: 7887)
        </InfoItem>
        <InfoItem>
          <strong>Is Individual:</strong> {kycViewerInfo.isIndividual ? 'Yes' : 'No'}
        </InfoItem>
        <InfoItem>
          <strong>Is Corporate:</strong> {kycViewerInfo.isCorporate ? 'Yes' : 'No'}
        </InfoItem>
        <InfoItem>
          <strong>Is KYC:</strong> {kycViewerInfo.isKYC ? 'Yes' : 'No'}
        </InfoItem>
        <InfoItem>
          <strong>Is Sanctions Safe:</strong> {kycViewerInfo.isSanctionsSafe ? 'Yes' : 'No'}
        </InfoItem>
        <InfoItem>
          <strong>Country Code:</strong> {kycViewerInfo.getCountry}
        </InfoItem>
      </CardContent>
    </CustomCard>
  );
};

const MonthlyTransferSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
`;

const MonthlyTransferContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BudgetAllocationSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
`;

const BudgetAllocationContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;


const WholeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
`;

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ResponsiveLayout = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
`;

const Column = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
`;
const SimpleHeader = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const SimpleFooter = styled.footer`
  margin-top: 20px;
`;

const CounterWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  gap: 32px;
  padding: 16px 0;
`;

const WalletRows = styled.div`
  display: flex;
  padding-top: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
  max-width: 800px;
  border-top: 1px solid lightgrey;
`;

const WalletRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  padding-bottom: 16px;
  align-items: center;
  gap: 32px;
  align-self: stretch;
  border-bottom: 1px solid lightgrey;
  width: 100%;
  overflow: hidden;
`;

const WalletRowName = styled.div`
  width: 150px;
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
`;

const WalletRowValue = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
  flex: 1 0 0;
  align-self: stretch;
  font-size: 24px;
  font-weight: 700;
  line-height: 120%;
`;

const ThreeColumnLayout = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
`;



const ColumnContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
`;
const ColumnHeader = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const WalletInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const WalletInfoRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const WalletInfoLabel = styled.span`
  font-weight: bold;
`;

const TransferSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const DestinationSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const KYCInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const KYCInfoHeader = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const KYCInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const KYCInfoLabel = styled.span`
  font-weight: bold;
  flex: 1;
`;

const KYCInfoValue = styled.span`
  flex: 1;
  text-align: right;
  & > span {
    margin-right: 5px;
  }
`;

const ArrowColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ArrowIcon = styled.span`
  font-size: 24px;
`;

export default KintoConnect;