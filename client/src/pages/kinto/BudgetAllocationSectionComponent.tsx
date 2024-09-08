import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { styled } from '@mui/system';

const tokenOptions = [
  { name: 'DAI', address: '0xdA100067134959575D87D11d54F2722Ba3C934aB' },
  { name: 'EIGEN', address: '0xe16E00eeFCd866e8aE5a4e43bBdd6831da6391E1' },
  { name: 'ENA', address: '0xE040001C257237839a69E9683349C173297876F0' },
  { name: 'ETHFI', address: '0xe70F10CD4bD932a28b80d48D771026a4c88E6285' },
  { name: 'USDC', address: '0x05DC0010C9902EcF6CBc921c6A4bd971c69E5A2E' },
  { name: 'USDe', address: '0x05dE0003C333A503bea5224fCc64f0D4b5446C38' },
  { name: 'WETH', address: '0x0E7000967bcB5fC76A5A89082db04ed0Bf9548d8' },
  { name: 'eETH', address: '0xee70005Ec41738eA7ED2B97D7d56ac829F1E99e6' },
  { name: 'sDAI', address: '0x5da1004F7341D510C6651C67B4EFcEEA76Cac0E8' },
  { name: 'sUSDe', address: '0x505de0f7a5d786063348aB5BC31e3a21344fA7B0' },
  { name: 'wUSDM', address: '0x0050110dd97a2bf4fDD8D69530B3e85d2e3EDfbc' },
  { name: 'weETH', address: '0x0Ee700095AeDFe0814fFf7d6DFD75461De8e2b19' },
  { name: 'wstETH', address: '0x057e70cCa0dC435786a50FcF440bf8FCC1eEAf17' },
];

const authorizedUserOptions = [
  { name: 'Sami', address: '0x79edB24F41Ec139dde29B6e604ed52954d643858' },
  { name: 'Godwin', address: '0xfEbc40e5FE30f897813F6d85a3e292B1c35aa886' },
  { name: 'Treasure', address: '0x538cFD76c4B97C5a87E1d5Eb2C7d026D08d34a81' },
];

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
  maxWidth: 500,
  margin: 'auto',
  marginTop: theme.spacing(6),
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const CustomStepper = styled(Stepper)(({ theme }) => ({
  '& .MuiStepIcon-root': {
    color: '#d8b4fe',
    '&.Mui-active': {
      color: '#a855f7',
    },
    '&.Mui-completed': {
      color: '#a855f7',
    },
  },
}));

const BudgetAllocationSection = ({
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
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps = ['Select Token', 'Initialize Allocation', 'Allocate Budget', 'Authorize User'];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Token</InputLabel>
            <Select
              value={budgetTokenAddress}
              onChange={(e) => setBudgetTokenAddress(e.target.value)}
              label="Select Token"
            >
              {tokenOptions.map((token) => (
                <MenuItem key={token.address} value={token.address}>
                  {token.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 1:
        return (
          <CustomButton
            fullWidth
            onClick={() => {
              handleInitializeBudgetAllocation();
              handleNext();
            }}
            disabled={loading || !budgetTokenAddress}
          >
            {loading ? <CircularProgress size={24} sx={{ mr: 1 }} /> : null}
            Initialize Budget Allocation
          </CustomButton>
        );
      case 2:
        return (
          <>
            <TextField
              fullWidth
              label="Amount to Allocate"
              type="number"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              sx={{ mb: 3 }}
            />
            <CustomButton
              fullWidth
              onClick={() => {
                handleAllocateBudget();
                handleNext();
              }}
              disabled={loading || !budgetAmount}
            >
              {loading ? <CircularProgress size={24} sx={{ mr: 1 }} /> : null}
              Allocate Budget
            </CustomButton>
          </>
        );
      case 3:
        return (
          <>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select Authorized User</InputLabel>
              <Select
                value={authorizedUser}
                onChange={(e) => setAuthorizedUser(e.target.value)}
                label="Select Authorized User"
              >
                {authorizedUserOptions.map((user) => (
                  <MenuItem key={user.address} value={user.address}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <CustomButton
              fullWidth
              onClick={handleAuthorizeUser}
              disabled={loading || !authorizedUser}
            >
              {loading ? <CircularProgress size={24} sx={{ mr: 1 }} /> : null}
              Authorize User
            </CustomButton>
          </>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <CustomCard>
      <CardContent>
        <Typography variant="h4" component="div" gutterBottom align="center" sx={{ mb: 4, color: '#a855f7' }}>
          Budget Allocation
        </Typography>

        <CustomStepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </CustomStepper>

        <Box mb={4}>
          {getStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ color: '#a855f7' }}
          >
            Back
          </Button>
          <CustomButton
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
          >
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </CustomButton>
        </Box>
      </CardContent>
    </CustomCard>
  );
};

export default BudgetAllocationSection;