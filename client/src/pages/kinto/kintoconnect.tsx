import { useEffect, useState } from 'react';
import { createKintoSDK, KintoAccountInfo } from 'kinto-web-sdk';
import {
  encodeFunctionData, Address, getContract,
  defineChain, createPublicClient, http
} from 'viem';
import styled from 'styled-components';
import { getERC20Balances, formatTokenBalance, TokenBalance } from './BlockscoutUtils';
import numeral from 'numeral';
import contractsJSON from './abis/7887.json';
import { KYCViewerService } from './KYCViewerService';
import './App.css';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';

interface KYCViewerInfo {
  isIndividual: boolean;
  isCorporate: boolean;
  isKYC: boolean;
  isSanctionsSafe: boolean;
  getCountry: string;
  getWalletOwners: Address[];
}

export const counterAbi = [{ "type": "constructor", "inputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "count", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "increment", "inputs": [], "outputs": [], "stateMutability": "nonpayable" }];

const kinto = defineChain({
  id: 7887,
  name: 'Kinto',
  network: 'kinto',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.kinto-rpc.com/'],
      webSocket: ['wss://rpc.kinto.xyz/ws'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://kintoscan.io' },
  },
});

const KintoConnect = () => {
  const [accountInfo, setAccountInfo] = useState<KintoAccountInfo | undefined>(undefined);
  const [kycViewerInfo, setKYCViewerInfo] = useState<KYCViewerInfo | undefined>(undefined);
  const [counter, setCounter] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [selectedToken, setSelectedToken] = useState<TokenBalance | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [destinationKYCInfo, setDestinationKYCInfo] = useState<KYCViewerInfo | null>(null);
  
  const kintoSDK = createKintoSDK('0xCFE10657E75385F0c93Ee7e0Aec266Ae9382E0ED');
  const counterAddress = "0xCFE10657E75385F0c93Ee7e0Aec266Ae9382E0ED" as Address;
  const paymentAddress = "0xCfe808D7994bB4b3741008B4c301688D4Cd4958C" as Address;

  async function kintoLogin() {
    try {
      await kintoSDK.createNewWallet();
    } catch (error) {
      console.error('Failed to login/signup:', error);
    }
  }

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

  const fundTransferAbi = [
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFunds",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ];
  
  async function transferFunds(recipient: string, amount: bigint) {
    const data = encodeFunctionData({
      abi: fundTransferAbi,
      functionName: 'transferFunds',
      args: [recipient, amount]
    });
    
    setLoading(true);
    try {
      const response = await kintoSDK.sendTransaction([{ to: paymentAddress, data, value: amount }]);
      console.log('Transfer successful:', response);
    } catch (error) {
      console.error('Failed to transfer funds:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleTransferFunds = async () => {
    const recipientAddress = "0x79edB24F41Ec139dde29B6e604ed52954d643858" as Address;
    const verySmallAmount = BigInt(10000000000000); // 0.00001 ETH en wei

    try {
      await transferFunds(recipientAddress, verySmallAmount);
      console.log('Funds transferred successfully');
    } catch (error) {
      console.error('Failed to transfer funds:', error);
    }
  };
  
  async function fetchCounter() {
    const client = createPublicClient({
      chain: kinto,
      transport: http(),
    });
    const counterContract = getContract({
      address: counterAddress as Address,
      abi: counterAbi,
      client: { public: client }
    });
    const count = await counterContract.read.count([]) as BigInt;
    setCounter(Number(count.toString()));
  }

  async function increaseCounter() {
    const data = encodeFunctionData({
      abi: counterAbi,
      functionName: 'increment',
      args: []
    });
    setLoading(true);
    try {
      await kintoSDK.sendTransaction([{ to: counterAddress, data, value: BigInt(0) }]);
      await fetchCounter();
    } catch (error) {
      console.error('Failed to increase counter:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchKYCViewerInfo() {
    if (!accountInfo?.walletAddress) return;

    const client = createPublicClient({
      chain: kinto,
      transport: http(),
    });
    const kycViewer = getContract({
      address: contractsJSON.contracts.KYCViewer.address as Address,
      abi: contractsJSON.contracts.KYCViewer.abi,
      client: { public: client }
    });

    try {
      const [isIndividual, isCorporate, isKYC, isSanctionsSafe, getCountry, getWalletOwners] = await Promise.all([
        kycViewer.read.isIndividual([accountInfo.walletAddress]),
        kycViewer.read.isCompany([accountInfo.walletAddress]),
        kycViewer.read.isKYC([accountInfo.walletAddress]),
        kycViewer.read.isSanctionsSafe([accountInfo.walletAddress]),
        kycViewer.read.getCountry([accountInfo.walletAddress]),
        kycViewer.read.getWalletOwners([accountInfo.walletAddress])
      ]);

      setKYCViewerInfo({
        isIndividual,
        isCorporate,
        isKYC,
        isSanctionsSafe,
        getCountry,
        getWalletOwners
      } as KYCViewerInfo);
    } catch (error) {
      console.error('Failed to fetch KYC viewer info:', error);
    }
  }

  async function fetchAccountInfo() {
    try {
      setAccountInfo(await kintoSDK.connect());
    } catch (error) {
      console.error('Failed to fetch account info:', error);
    }
  };

  useEffect(() => {
    fetchAccountInfo();
    fetchCounter();
  }, []);

  useEffect(() => {
    if (accountInfo?.walletAddress) {
      fetchKYCViewerInfo();
    }
  }, [accountInfo]);

  async function fetchTokenBalances() {
    if (accountInfo?.walletAddress) {
      const balances = await getERC20Balances(accountInfo.walletAddress);
      console.log('Token balances:', balances);
      setTokenBalances(balances);
    }
  }

  const handleTransfer = async () => {
    if (!selectedToken || !recipientAddress || !transferAmount || !accountInfo?.walletAddress) {
      console.log('Transfer cancelled: missing information');
      return;
    }

    try {
      const amount = BigInt(parseFloat(transferAmount) * Math.pow(10, parseInt(selectedToken.decimals)));
      const data = encodeFunctionData({
        abi: [{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}],
        functionName: 'transfer',
        args: [recipientAddress as Address, amount]
      });

      const response = await kintoSDK.sendTransaction([{ 
        to: selectedToken.contractAddress as Address, 
        data, 
        value: BigInt(0) 
      }]);

      console.log('Transfer response:', response);
      await fetchTokenBalances();
      setTransferAmount('');
      setRecipientAddress('');
      setSelectedToken(null);
    } catch (error) {
      console.error('Failed to transfer token:', error);
    }
  };

  const fetchDestinationKYC = async () => {
    if (!recipientAddress) return;

    const kycViewer = KYCViewerService.getInstance();
    const info = await kycViewer.fetchKYCInfo(recipientAddress as Address);
    setDestinationKYCInfo(info);
  };

  useEffect(() => {
    fetchAccountInfo();
  }, []);

  useEffect(() => {
    if (accountInfo?.walletAddress) {
      fetchKYCViewerInfo();
      fetchTokenBalances();
    }
  }, [accountInfo]);

  useEffect(() => {
    if (recipientAddress && recipientAddress.length === 42) {
      fetchDestinationKYC();
    } else {
      setDestinationKYCInfo(null);
    }
  }, [recipientAddress]);

  return (
    <WholeWrapper>
      <AppWrapper>
        <ContentWrapper>
          <SimpleHeader>Kinto Wallet SDK Sample App</SimpleHeader>
          {accountInfo ? (
            <>
              <CounterWrapper>
                <Button variant="contained" color="primary" onClick={kintoLogin}>
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
                <Button variant="contained" color="primary" onClick={increaseCounter}>
                  Increase Counter
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
                    <Button variant="contained" color="primary" onClick={handleTransfer} disabled={!selectedToken || !transferAmount || !recipientAddress}>
                      Transfer
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

const CompressedAddress: React.FC<{ address: Address; className?: string }> = ({ address, className }) => (
  <div className={className}>
    {address.slice(0, 10)}...{address.slice(-10)}
  </div>
);

const ArrowColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ArrowIcon = styled.span`
  font-size: 24px;
`;

export default KintoConnect;