import React from 'react';
import {
  Button,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import styled from 'styled-components';
import { TokenBalance } from './types'; // Assuming you have a types file

interface TransferFundsSectionProps {
  loading: boolean;
  tokenBalances: TokenBalance[];
  selectedToken: TokenBalance | null;
  setSelectedToken: (token: TokenBalance | null) => void;
  recipientAddress: string;
  setRecipientAddress: (value: string) => void;
  transferAmount: string;
  setTransferAmount: (value: string) => void;
  handleTransfer: () => void;
  formatTokenBalance: (balance: string, decimals: string) => string;
}

const TransferSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ColumnHeader = styled.h3`
  margin-bottom: 10px;
`;

const TransferFundsSectionComponent: React.FC<TransferFundsSectionProps> = ({
  loading,
  tokenBalances,
  selectedToken,
  setSelectedToken,
  recipientAddress,
  setRecipientAddress,
  transferAmount,
  setTransferAmount,
  handleTransfer,
  formatTokenBalance,
}) => {
  return (
    <TransferSection>
      <ColumnHeader>Transfer</ColumnHeader>
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
        label="Recipient Address"
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
      />
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
  );
};

export default TransferFundsSectionComponent;