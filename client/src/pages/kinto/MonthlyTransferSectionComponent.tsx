import React from 'react';
import {
  Button,
  CircularProgress,
  TextField,
} from '@mui/material';
import styled from 'styled-components';

interface MonthlyTransferSectionProps {
  loading: boolean;
  monthlyRecipient: string;
  setMonthlyRecipient: (value: string) => void;
  monthlyAmount: string;
  setMonthlyAmount: (value: string) => void;
  monthlyTokenAddress: string;
  setMonthlyTokenAddress: (value: string) => void;
  monthlyMaxAllowance: string;
  setMonthlyMaxAllowance: (value: string) => void;
  handleInitializeMonthlyTransfer: () => void;
  handleExecuteMonthlyTransfer: () => void;
}

const MonthlyTransferSection = styled.div`
  margin-top: 20px;
`;

const ColumnHeader = styled.h3`
  margin-bottom: 10px;
`;

const MonthlyTransferContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MonthlyTransferSectionComponent: React.FC<MonthlyTransferSectionProps> = ({
  loading,
  monthlyRecipient,
  setMonthlyRecipient,
  monthlyAmount,
  setMonthlyAmount,
  monthlyTokenAddress,
  setMonthlyTokenAddress,
  monthlyMaxAllowance,
  setMonthlyMaxAllowance,
  handleInitializeMonthlyTransfer,
  handleExecuteMonthlyTransfer,
}) => {
  return (
    <MonthlyTransferSection>
      <ColumnHeader>Monthly Transfer</ColumnHeader>
      <MonthlyTransferContent>
        <TextField
          fullWidth
          label="Recipient Address"
          value={monthlyRecipient}
          onChange={(e) => setMonthlyRecipient(e.target.value)}
        />
        <TextField
          fullWidth
          label="Monthly Amount"
          type="number"
          value={monthlyAmount}
          onChange={(e) => setMonthlyAmount(e.target.value)}
        />
        <TextField
          fullWidth
          label="Token Address"
          value={monthlyTokenAddress}
          onChange={(e) => setMonthlyTokenAddress(e.target.value)}
        />
        <TextField
          fullWidth
          label="Max Allowance"
          type="number"
          value={monthlyMaxAllowance}
          onChange={(e) => setMonthlyMaxAllowance(e.target.value)}
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleInitializeMonthlyTransfer} 
          disabled={loading || !monthlyRecipient || !monthlyAmount || !monthlyTokenAddress || !monthlyMaxAllowance}
        >
          {loading ? <CircularProgress size={24} /> : 'Initialize Monthly Transfer'}
        </Button>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleExecuteMonthlyTransfer} 
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Execute Monthly Transfer'}
        </Button>
      </MonthlyTransferContent>
    </MonthlyTransferSection>
  );
};

export default MonthlyTransferSectionComponent;