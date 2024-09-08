import React from 'react';
import {
  Button,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import { styled } from '@mui/system';

interface TokenBalance {
  symbol: string;
  balance: string;
  decimals: string;
}

interface AuthorizedUser {
  name: string;
  address: string;
}

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

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#a855f7',
  color: 'white',
  '&:hover': {
    backgroundColor: '#9333ea',
  },
  '&.Mui-disabled': {
    backgroundColor: '#d8b4fe',
    color: 'white',
  },
}));

const CustomCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  margin: 'auto',
  marginTop: theme.spacing(6),
  padding: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const authorizedUserOptions: AuthorizedUser[] = [
  { name: 'Sami', address: '0x79edB24F41Ec139dde29B6e604ed52954d643858' },
  { name: 'Godwin', address: '0xfEbc40e5FE30f897813F6d85a3e292B1c35aa886' },
  { name: 'Treasure', address: '0x538cFD76c4B97C5a87E1d5Eb2C7d026D08d34a81' },
];

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
    <CustomCard>
      <CardContent>
        <Typography variant="h4" component="div" gutterBottom align="center" sx={{ mb: 3, color: '#a855f7', fontWeight: 'bold' }}>
          Transfer Funds
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Send tokens securely to any address
        </Typography>

        <Box mb={3}>
          <FormControl fullWidth>
            <InputLabel>Select Token</InputLabel>
            <Select
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
        </Box>

        <Box mb={3}>
          <FormControl fullWidth>
            <InputLabel>Recipient</InputLabel>
            <Select
              value={recipientAddress}
              label="Recipient"
              onChange={(e) => setRecipientAddress(e.target.value)}
            >
              {authorizedUserOptions.map((user, index) => (
                <MenuItem key={`user-${index}`} value={user.address}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box mb={4}>
          <TextField
            fullWidth
            label={`Amount to Transfer (in ${selectedToken?.symbol || 'tokens'})`}
            type="number"
            placeholder="0.00"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            helperText="Enter the amount in the selected token's units (e.g., 0.001 for 0.001 WETH)"
          />
        </Box>

        <CustomButton
          fullWidth
          onClick={handleTransfer}
          disabled={loading || !selectedToken || !transferAmount || !recipientAddress}
        >
          {loading ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
              Processing...
            </>
          ) : (
            'Transfer'
          )}
        </CustomButton>
      </CardContent>
    </CustomCard>
  );
};

export default TransferFundsSectionComponent;