import React, { useState } from 'react';
import styled from 'styled-components';
import {
  TextField,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Address } from 'viem';
import { useKintoFunctions } from './KintoConnect';
import { TokenBalance, formatTokenBalance } from './BlockscoutUtils';

const ProjectBudget: React.FC = () => {
  const {
    initializeBudgetAllocation,
    allocateBudget,
    authorizeUser,
  } = useKintoFunctions();

  const [loading, setLoading] = useState<boolean>(false);
  const [budgetTokenAddress, setBudgetTokenAddress] = useState<string>('');
  const [budgetAmount, setBudgetAmount] = useState<string>('');
  const [authorizedUser, setAuthorizedUser] = useState<string>('');
  const [contractBalance, setContractBalance] = useState<string>('');
  const [userAllocation, setUserAllocation] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [selectedToken, setSelectedToken] = useState<TokenBalance | null>(null);

  const handleInitializeBudgetAllocation = async () => {
    if (!budgetTokenAddress) {
      console.log('Initialization cancelled: missing token address');
      return;
    }

    setLoading(true);
    try {
      await initializeBudgetAllocation(budgetTokenAddress as Address);
      console.log('Budget allocation initialized successfully');
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
      setAuthorizedUser('');
    } catch (error) {
      console.error('Failed to authorize user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectBudgetWrapper>
      <h1>Project Budget Management</h1>
      
      <Section>
        <h2>Initialize Budget Allocation</h2>
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
      </Section>

      <Section>
        <h2>Allocate Budget</h2>
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
      </Section>

      <Section>
        <h2>Authorize User</h2>
        <TextField
          fullWidth
          label="User Address"
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
        {userAllocation && <p>User Allocation: {userAllocation}</p>}
      </Section>

      <Section>
        <h2>Withdraw Funds</h2>
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
          label="Amount to Withdraw"
          type="number"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
        />
      </Section>

      <Section>
        <h2>Contract Balance</h2>
        <p>{contractBalance}</p>
      </Section>
    </ProjectBudgetWrapper>
  );
};

const ProjectBudgetWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
`;

export default ProjectBudget;