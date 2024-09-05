import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';
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
  getUserAllocation 
} from './KintoFunctions';

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




const KintoConnect: React.FC = () => {
  const [accountInfo, setAccountInfo] = useState<KintoAccountInfo | undefined>(undefined);
  const [kycViewerInfo, setKYCViewerInfo] = useState<KYCViewerInfo | undefined>(undefined);
  const [counter, setCounter] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [selectedToken, setSelectedToken] = useState<TokenBalance | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [destinationKYCInfo, setDestinationKYCInfo] = useState<KYCViewerInfo | null>(null);

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

  return (
    <WholeWrapper>
      <AppWrapper>
        <ContentWrapper>
          <SimpleHeader>Kinto Wallet SDK Sample App</SimpleHeader>
          {accountInfo ? (
            <>
              <CounterWrapper>
                <Button variant="contained" color="primary" onClick={handleKintoLogin}>
                  Login/Signup
                </Button>
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
              </CounterWrapper>
              <ThreeColumnLayout>
                <Column>
                  <ColumnContent>
                    <ColumnHeader>Your Wallet</ColumnHeader>
                    <WalletInfo>
                      <WalletInfoRow>
                        <WalletInfoLabel>Address:</WalletInfoLabel>
                        <CompressedAddress address={accountInfo.walletAddress as Address} />
                      </WalletInfoRow>
                      <WalletInfoRow>
                        <WalletInfoLabel>App Key:</WalletInfoLabel>
                        <CompressedAddress address={accountInfo.appKey as Address} />
                      </WalletInfoRow>
                    </WalletInfo>
                  </ColumnContent>
                  {kycViewerInfo && (
                    <KYCInfoDisplay kycInfo={kycViewerInfo} title="Your KYC Information" />
                  )}
                </Column>

                <ArrowColumn>
                  <ArrowIcon>➡️</ArrowIcon>
                </ArrowColumn>

                <Column>
                  <ColumnContent>
                    <ColumnHeader>Destination</ColumnHeader>
                    <DestinationSection>
                      <TextField
                        fullWidth
                        label="Recipient Address"
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                      />
                    </DestinationSection>
                    {destinationKYCInfo && (
                      <KYCInfoDisplay kycInfo={destinationKYCInfo} title="Destination KYC Information" />
                    )}
                  </ColumnContent>
                </Column>

                <ArrowColumn>
                  <ArrowIcon>➡️</ArrowIcon>
                </ArrowColumn>

                <Column>
                  <ColumnHeader>Transfer</ColumnHeader>
                  <TransferSection>
                    <FormControl fullWidth>
                      <InputLabel id="token-select-label">Select Token</InputLabel>
                      <Select
                        labelId="token-select-label"
                        id="token-select"
                        value={selectedToken ? selectedToken.symbol : ''}
                        label="Select Token"
                        onChange={(e) => {
                          const token = tokenBalances.find(t => t.symbol === e.target.value);
                          setSelectedToken(token || null);
                        }}
                      >
                        {tokenBalances.map((token, index) => (
                          <MenuItem key={`erc20-${index}`} value={token.symbol}>
                            {token.symbol} - Balance: {formatTokenBalance(token.balance, token.decimals)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      label="Amount to Transfer"
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                    />
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={handleTransfer} 
                      disabled={loading || !selectedToken || !transferAmount || !recipientAddress}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Transfer'}
                    </Button>
                  </TransferSection>
                </Column>
              </ThreeColumnLayout>
            </>
          ) : (
            <CircularProgress />
          )}
          <SimpleFooter>Footer Content</SimpleFooter>
        </ContentWrapper>
      </AppWrapper>
    </WholeWrapper>
  );
};

const WholeWrapper = styled.div`
  flex-flow: column nowrap;
  height: auto;
  align-items: center;
  width: 100%;
  display: flex;
  min-height: 100vh;
  min-width: 100vw;
  position: relative;
`;

const AppWrapper = styled.div`
  flex-flow: column nowrap;
  height: auto;
  align-items: center;
  width: 100%;
  display: flex;
  min-height: 85vh;
  min-width: 100vw;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  height: auto;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
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

const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
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