import React from 'react';
import {
  Button,
  CircularProgress,
  TextField,
} from '@mui/material';
import styled from 'styled-components';

interface BudgetAllocationSectionProps {
  loading: boolean;
  budgetTokenAddress: string;
  setBudgetTokenAddress: (value: string) => void;
  budgetAmount: string;
  setBudgetAmount: (value: string) => void;
  authorizedUser: string;
  setAuthorizedUser: (value: string) => void;
  handleInitializeBudgetAllocation: () => void;
  handleAllocateBudget: () => void;
  handleAuthorizeUser: () => void;
}

const BudgetAllocationSection = styled.div`
  margin-top: 20px;
`;

const ColumnHeader = styled.h3`
  margin-bottom: 10px;
`;

const BudgetAllocationContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BudgetAllocationSectionComponent: React.FC<BudgetAllocationSectionProps> = ({
  loading,
  budgetTokenAddress,
  setBudgetTokenAddress,
  budgetAmount,
  setBudgetAmount,
  authorizedUser,
  setAuthorizedUser,
  handleInitializeBudgetAllocation,
  handleAllocateBudget,
  handleAuthorizeUser,
}) => {
  return (
    <BudgetAllocationSection>
      <ColumnHeader>Allocate Budget</ColumnHeader>
      <BudgetAllocationContent>
        <TextField
          fullWidth
          label="Token Address"
          value={budgetTokenAddress}
          onChange={(e) => setBudgetTokenAddress(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleInitializeBudgetAllocation}
          disabled={loading || !budgetTokenAddress}
        >
          {loading ? <CircularProgress size={24} /> : 'Initialize Budget Allocation'}
        </Button>
        
        <TextField
          fullWidth
          label="Amount to Allocate"
          type="number"
          value={budgetAmount}
          onChange={(e) => setBudgetAmount(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAllocateBudget}
          disabled={loading || !budgetAmount}
        >
          {loading ? <CircularProgress size={24} /> : 'Allocate Budget'}
        </Button>
        
        <TextField
          fullWidth
          label="Authorized User Address"
          value={authorizedUser}
          onChange={(e) => setAuthorizedUser(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAuthorizeUser}
          disabled={loading || !authorizedUser}
        >
          {loading ? <CircularProgress size={24} /> : 'Authorize User'}
        </Button>
      </BudgetAllocationContent>
    </BudgetAllocationSection>
  );
};

export default BudgetAllocationSectionComponent;