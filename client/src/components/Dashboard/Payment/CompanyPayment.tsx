import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, CircularProgress } from "@mui/material";
import { Address } from "viem";
import { KintoAccountInfo } from "kinto-web-sdk";
import {
  TokenBalance,
  formatTokenBalance,
} from "../../../pages/kinto/BlockscoutUtils";
import {
  kintoLogin,
  fetchKYCViewerInfo,
  fetchAccountInfo,
  fetchTokenBalances,
  transferToken,
  setupAndRunMonthlyTransfer,
  fetchDestinationKYC,
  initializeBudgetAllocation,
  allocateBudget,
  authorizeUser,
  initializeAndApproveMonthlyTransfer,
  executeMonthlyTransferIfNeeded,
} from "../../../pages/kinto/KintoFunctions";

import BudgetAllocationSectionComponent from "../../../pages/kinto/BudgetAllocationSectionComponent";
import MonthlyTransferSectionComponent from "../../../pages/kinto/MonthlyTransferSectionComponent";
import TransferFundsSectionComponent from "../../../pages/kinto/TransferFundsSectionComponent";

interface KYCViewerInfo {
  isIndividual: boolean;
  isCorporate: boolean;
  isKYC: boolean;
  isSanctionsSafe: boolean;
  getCountry: string;
  getWalletOwners: Address[];
}

export const receipient =
  "0x79edB24F41Ec139dde29B6e604ed52954d643858" as Address;
export const tokenAddress =
  "0x0E7000967bcB5fC76A5A89082db04ed0Bf9548d8" as Address;
export const amount = BigInt("500000000000000");
export const totalAmount = BigInt("1000000000000000");

export const CompanyPayment: React.FC = () => {
  const [accountInfo, setAccountInfo] = useState<KintoAccountInfo | undefined>(
    undefined
  );
  const [kycViewerInfo, setKYCViewerInfo] = useState<KYCViewerInfo | undefined>(
    undefined
  );
  const [counter, setCounter] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [selectedToken, setSelectedToken] = useState<TokenBalance | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [destinationKYCInfo, setDestinationKYCInfo] =
    useState<KYCViewerInfo | null>(null);
  const [budgetTokenAddress, setBudgetTokenAddress] = useState<string>("");
  const [budgetAmount, setBudgetAmount] = useState<string>("");
  const [authorizedUser, setAuthorizedUser] = useState<string>("");
  const [monthlyRecipient, setMonthlyRecipient] = useState<string>("");
  const [monthlyAmount, setMonthlyAmount] = useState<string>("");
  const [monthlyTokenAddress, setMonthlyTokenAddress] = useState<string>("");
  const [monthlyMaxAllowance, setMonthlyMaxAllowance] = useState<string>("");

  const handleSetupAndRunMonthlyTransfer = async () => {
    try {
      await setupAndRunMonthlyTransfer(
        receipient,
        amount,
        tokenAddress,
        totalAmount
      );
      // Optionally update state or show a success message
    } catch (error) {
      console.error("Failed to setup monthly transfer:", error);
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
      fetchKYCViewerInfo(accountInfo.walletAddress as Address).then(
        setKYCViewerInfo
      );
      fetchTokenBalances(accountInfo.walletAddress as Address).then(
        setTokenBalances
      );
    }
  }, [accountInfo]);

  useEffect(() => {
    if (recipientAddress && recipientAddress.length === 42) {
      fetchDestinationKYC(recipientAddress as Address).then(
        setDestinationKYCInfo
      );
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
      console.error("Failed to login:", error);
    }
  };

  const handleIncreaseCounter = async () => {
    setLoading(true);
    try {
      // const newCounter = await increaseCounter();
      // setCounter(newCounter);
      await initializeBudgetAllocation(tokenAddress);
    } catch (error) {
      console.error("Failed to increase counter:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (
      !selectedToken ||
      !recipientAddress ||
      !transferAmount ||
      !accountInfo?.walletAddress
    ) {
      console.log("Transfer cancelled: missing information");
      return;
    }

    setLoading(true);
    try {
      const amount = BigInt(
        parseFloat(transferAmount) *
          Math.pow(10, parseInt(selectedToken.decimals))
      );
      await transferToken(
        selectedToken.contractAddress as Address,
        recipientAddress as Address,
        amount
      );
      await fetchTokenBalances(accountInfo.walletAddress as Address).then(
        setTokenBalances
      );
      setTransferAmount("");
      setRecipientAddress("");
      setSelectedToken(null);
    } catch (error) {
      console.error("Failed to transfer token:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeBudgetAllocation = async () => {
    if (!budgetTokenAddress) {
      console.log("Initialization cancelled: missing token address");
      return;
    }

    setLoading(true);
    try {
      await initializeBudgetAllocation(budgetTokenAddress as Address);
      console.log("Budget allocation initialized successfully");
      // Optionally, you can clear the input field or show a success message
      setBudgetTokenAddress("");
    } catch (error) {
      console.error("Failed to initialize budget allocation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAllocateBudget = async () => {
    if (!budgetAmount) {
      console.log("Budget allocation cancelled: missing amount");
      return;
    }

    setLoading(true);
    try {
      const amount = BigInt(parseFloat(budgetAmount) * Math.pow(10, 18)); // Assuming 18 decimals, adjust if needed
      await allocateBudget(amount);
      console.log("Budget allocated successfully");
      // Optionally, you can clear the input field or show a success message
      setBudgetAmount("");
    } catch (error) {
      console.error("Failed to allocate budget:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorizeUser = async () => {
    if (!authorizedUser) {
      console.log("User authorization cancelled: missing address");
      return;
    }

    setLoading(true);
    try {
      await authorizeUser(authorizedUser as Address);
      console.log("User authorized successfully");
      // Optionally, you can clear the input field or show a success message
      setAuthorizedUser("");
    } catch (error) {
      console.error("Failed to authorize user:", error);
    } finally {
      setLoading(false);
    }
  };

  //   const KYCInfoDisplay: React.FC<{ kycInfo: KYCViewerInfo; title: string }> = ({
  //     kycInfo,
  //     title,
  //   }) => (
  //     <KYCInfo>
  //       <KYCInfoHeader>{title}</KYCInfoHeader>
  //       <KYCInfoRow>
  //         <KYCInfoLabel>Is Individual:</KYCInfoLabel>
  //         <KYCInfoValue>{kycInfo.isIndividual ? "Yes" : "No"}</KYCInfoValue>
  //       </KYCInfoRow>
  //       <KYCInfoRow>
  //         <KYCInfoLabel>Is Corporate:</KYCInfoLabel>
  //         <KYCInfoValue>{kycInfo.isCorporate ? "Yes" : "No"}</KYCInfoValue>
  //       </KYCInfoRow>
  //       <KYCInfoRow>
  //         <KYCInfoLabel>Is KYC:</KYCInfoLabel>
  //         <KYCInfoValue>{kycInfo.isKYC ? "Yes" : "No"}</KYCInfoValue>
  //       </KYCInfoRow>
  //       <KYCInfoRow>
  //         <KYCInfoLabel>Is Sanctions Safe:</KYCInfoLabel>
  //         <KYCInfoValue>{kycInfo.isSanctionsSafe ? "Yes" : "No"}</KYCInfoValue>
  //       </KYCInfoRow>
  //       <KYCInfoRow>
  //         <KYCInfoLabel>Country:</KYCInfoLabel>
  //         <KYCInfoValue>{kycInfo.getCountry}</KYCInfoValue>
  //       </KYCInfoRow>
  //     </KYCInfo>
  //   );

  const CompressedAddress: React.FC<{
    address: Address;
    className?: string;
  }> = ({ address, className }) => (
    <div className={className}>
      {address.slice(0, 10)}...{address.slice(-10)}
    </div>
  );

  const handleInitializeMonthlyTransfer = async () => {
    if (
      !monthlyRecipient ||
      !monthlyAmount ||
      !monthlyTokenAddress ||
      !monthlyMaxAllowance
    ) {
      console.log(
        "Monthly transfer initialization cancelled: missing information"
      );
      return;
    }

    setLoading(true);
    try {
      const amount = BigInt(parseFloat(monthlyAmount) * Math.pow(10, 18)); // Assuming 18 decimals, adjust if needed
      const maxAllowance = BigInt(
        parseFloat(monthlyMaxAllowance) * Math.pow(10, 18)
      );
      await initializeAndApproveMonthlyTransfer(
        monthlyRecipient as Address,
        amount,
        monthlyTokenAddress as Address,
        maxAllowance
      );
      console.log("Monthly transfer initialized successfully");
      // Optionally, clear input fields or show a success message
    } catch (error) {
      console.error("Failed to initialize monthly transfer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteMonthlyTransfer = async () => {
    setLoading(true);
    try {
      await executeMonthlyTransferIfNeeded();
      console.log("Monthly transfer executed successfully");
    } catch (error) {
      console.error("Failed to execute monthly transfer:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen min-w-full">
      <div className="flex flex-col items-center min-h-[85vh] w-full">
        <div className="flex flex-col items-center justify-start min-h-screen w-full overflow-hidden">
          <h1 className="text-2xl font-bold mb-5">
            Kinto Wallet SDK Sample App
          </h1>
          {accountInfo ? (
            <>
              <div className="flex flex-wrap justify-center gap-8 py-4 w-full">
                <div className="flex flex-col items-start gap-8 py-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleKintoLogin}
                  >
                    Login/Signup
                  </button>
                  <div className="flex flex-col items-start gap-4 self-stretch max-w-3xl border-t border-gray-300 pt-4">
                    <div className="flex flex-row items-center gap-8 self-stretch border-b border-gray-300 pb-4 w-full overflow-hidden">
                      <div className="w-36 text-base font-bold uppercase">
                        Chain
                      </div>
                      <div className="flex-1 text-2xl font-bold">
                        Kinto (ID: 7887)
                      </div>
                    </div>
                    {kycViewerInfo && (
                      <>
                        <div className="flex flex-row items-center gap-8 self-stretch border-b border-gray-300 pb-4 w-full overflow-hidden">
                          <div className="w-36 text-base font-bold uppercase">
                            Is Individual
                          </div>
                          <div className="flex-1 text-2xl font-bold">
                            {kycViewerInfo.isIndividual ? "Yes" : "No"}
                          </div>
                        </div>
                        <div className="flex flex-row items-center gap-8 self-stretch border-b border-gray-300 pb-4 w-full overflow-hidden">
                          <div className="w-36 text-base font-bold uppercase">
                            Is Corporate
                          </div>
                          <div className="flex-1 text-2xl font-bold">
                            {kycViewerInfo.isCorporate ? "Yes" : "No"}
                          </div>
                        </div>
                        <div className="flex flex-row items-center gap-8 self-stretch border-b border-gray-300 pb-4 w-full overflow-hidden">
                          <div className="w-36 text-base font-bold uppercase">
                            Is KYC
                          </div>
                          <div className="flex-1 text-2xl font-bold">
                            {kycViewerInfo.isKYC ? "Yes" : "No"}
                          </div>
                        </div>
                        <div className="flex flex-row items-center gap-8 self-stretch border-b border-gray-300 pb-4 w-full overflow-hidden">
                          <div className="w-36 text-base font-bold uppercase">
                            Is Sanctions Safe
                          </div>
                          <div className="flex-1 text-2xl font-bold">
                            {kycViewerInfo.isSanctionsSafe ? "Yes" : "No"}
                          </div>
                        </div>
                        <div className="flex flex-row items-center gap-8 self-stretch border-b border-gray-300 pb-4 w-full overflow-hidden">
                          <div className="w-36 text-base font-bold uppercase">
                            Country
                          </div>
                          <div className="flex-1 text-2xl font-bold">
                            {kycViewerInfo.getCountry}
                          </div>
                        </div>
                      </>
                    )}
                    <div className="flex flex-row items-center gap-8 self-stretch border-b border-gray-300 pb-4 w-full overflow-hidden">
                      <div className="w-36 text-base font-bold uppercase">
                        Counter
                      </div>
                      <div className="flex-1 text-2xl font-bold">{counter}</div>
                    </div>
                  </div>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    onClick={handleIncreaseCounter}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    ) : (
                      "Increase Counter"
                    )}
                  </button>
                </div>
                <div className="flex flex-col gap-8 w-full max-w-md">
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
                  {accountInfo && (
                    <BudgetAllocationSectionComponent
                      loading={loading}
                      budgetTokenAddress={budgetTokenAddress}
                      setBudgetTokenAddress={setBudgetTokenAddress}
                      budgetAmount={budgetAmount}
                      setBudgetAmount={setBudgetAmount}
                      authorizedUser={authorizedUser}
                      setAuthorizedUser={setAuthorizedUser}
                      handleInitializeBudgetAllocation={
                        handleInitializeBudgetAllocation
                      }
                      handleAllocateBudget={handleAllocateBudget}
                      handleAuthorizeUser={handleAuthorizeUser}
                    />
                  )}
                  {accountInfo && (
                    <MonthlyTransferSectionComponent
                      loading={loading}
                      monthlyRecipient={monthlyRecipient}
                      setMonthlyRecipient={setMonthlyRecipient}
                      monthlyAmount={monthlyAmount}
                      setMonthlyAmount={setMonthlyAmount}
                      monthlyTokenAddress={monthlyTokenAddress}
                      setMonthlyTokenAddress={setMonthlyTokenAddress}
                      monthlyMaxAllowance={monthlyMaxAllowance}
                      setMonthlyMaxAllowance={setMonthlyMaxAllowance}
                      handleInitializeMonthlyTransfer={
                        handleInitializeMonthlyTransfer
                      }
                      handleExecuteMonthlyTransfer={
                        handleExecuteMonthlyTransfer
                      }
                    />
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          )}
          <footer className="mt-5">Footer Content</footer>
        </div>
      </div>
    </div>
  );
};

export default CompanyPayment;
