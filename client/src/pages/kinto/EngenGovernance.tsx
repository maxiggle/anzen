import React, { useState, useEffect } from 'react';
import { Button, TextField, Card, CardHeader, CardContent, Typography, Stepper, Step, StepLabel, Radio, RadioGroup, FormControlLabel, CircularProgress, Snackbar, IconButton, Tooltip, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Info, HowToVote, Description, Check, Close } from '@mui/icons-material';
import { getVotingDelay, getVotingPeriod, getProposalThreshold, getQuorum, createProposal, castVote, executeProposal } from './KintoFunctions';
import { KintoConnect } from './KintoConnect';

const theme = {
  primary: '#a855f7',
  secondary: '#f3e8ff',
  text: '#4a5568',
};

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#a855f7',
  color: 'white',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: '#9333ea',
    transform: 'translateY(-2px)',
  },
  '&:disabled': {
    backgroundColor: '#e2e8f0',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#a855f7',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#a855f7',
  },
}));

const AnimatedTypography = styled(Typography)`
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  animation: fadeIn 1s ease-in;
`;

const EngenGovernance = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [creatingProposal, setCreatingProposal] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [governanceInfo, setGovernanceInfo] = useState({
    votingDelay: BigInt(0),
    votingPeriod: BigInt(0),
    proposalThreshold: BigInt(0),
    quorum: BigInt(0),
  });
  const [proposalDetails, setProposalDetails] = useState({
    title: '',
    description: '',
    targets: [],
    values: [],
    calldatas: [],
  });
  const [voteDetails, setVoteDetails] = useState({
    proposalId: '',
    support: '',
  });

  useEffect(() => {
    const fetchGovernanceInfo = async () => {
      setLoading(true);
      try {
        const votingDelay = await getVotingDelay();
        const votingPeriod = await getVotingPeriod();
        const proposalThreshold = await getProposalThreshold();
        const quorum = await getQuorum(BigInt(0));

        setGovernanceInfo({
          votingDelay,
          votingPeriod,
          proposalThreshold,
          quorum,
        });
        setSnackbar({ open: true, message: 'Governance info updated successfully', severity: 'success' });
      } catch (error) {
        console.error("Error fetching governance info:", error);
        setSnackbar({ open: true, message: 'Error fetching governance info', severity: 'error' });
      }
      setLoading(false);
    };

    fetchGovernanceInfo();
  }, []);

  const handleCreateProposal = async () => {
    setCreatingProposal(true);
    try {
      await createProposal(
        proposalDetails.targets,
        proposalDetails.values.map(BigInt),
        proposalDetails.calldatas,
        `${proposalDetails.title}\n\n${proposalDetails.description}`
      );
      setSnackbar({ open: true, message: 'Proposal created successfully!', severity: 'success' });
      setActiveStep(0);
      setProposalDetails({
        title: '',
        description: '',
        targets: [],
        values: [],
        calldatas: [],
      });
    } catch (error) {
      setSnackbar({ open: true, message: `Error creating proposal: ${error.message}`, severity: 'error' });
    }
    setCreatingProposal(false);
  };

  const handleCastVote = async () => {
    setLoading(true);
    try {
      await castVote(BigInt(voteDetails.proposalId), parseInt(voteDetails.support));
      setSnackbar({ open: true, message: 'Vote cast successfully!', severity: 'success' });
      setVoteDetails({ proposalId: '', support: '' });
    } catch (error) {
      setSnackbar({ open: true, message: `Error casting vote: ${error.message}`, severity: 'error' });
    }
    setLoading(false);
  };

  const steps = ['Governance Information', 'Create Proposal', 'Cast Vote'];
  const stepIcons = [<Info />, <Description />, <HowToVote />];

  const isProposalFormValid = () => {
    return proposalDetails.title.trim() !== '' &&
           proposalDetails.description.trim() !== '' &&
           proposalDetails.targets.length > 0 &&
           proposalDetails.values.length > 0 &&
           proposalDetails.calldatas.length > 0;
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <StyledCard>
            <CardHeader 
              title={<Typography variant="h5" style={{ color: theme.primary }}>Governance Information</Typography>}
              avatar={<Info style={{ color: theme.primary }} />}
            />
            <CardContent>
              <AnimatedTypography>Voting Delay: {governanceInfo.votingDelay.toString()} blocks</AnimatedTypography>
              <AnimatedTypography>Voting Period: {governanceInfo.votingPeriod.toString()} blocks</AnimatedTypography>
              <AnimatedTypography>Proposal Threshold: {governanceInfo.proposalThreshold.toString()} tokens</AnimatedTypography>
              <AnimatedTypography>Quorum: {governanceInfo.quorum.toString()} votes</AnimatedTypography>
            </CardContent>
          </StyledCard>
        );
      case 1:
        return (
          <StyledCard>
            <CardHeader 
              title={<Typography variant="h5" style={{ color: theme.primary }}>Create Proposal</Typography>}
              avatar={<Description style={{ color: theme.primary }} />}
            />
            <CardContent>
              <StyledTextField
                fullWidth
                margin="normal"
                label="Proposal Title"
                value={proposalDetails.title}
                onChange={(e) => setProposalDetails({ ...proposalDetails, title: e.target.value })}
              />
              <StyledTextField
                fullWidth
                margin="normal"
                label="Description"
                multiline
                rows={4}
                value={proposalDetails.description}
                onChange={(e) => setProposalDetails({ ...proposalDetails, description: e.target.value })}
              />
              <StyledTextField
                fullWidth
                margin="normal"
                label="Targets (comma-separated)"
                value={proposalDetails.targets.join(',')}
                onChange={(e) => setProposalDetails({ ...proposalDetails, targets: e.target.value.split(',').filter(Boolean) })}
              />
              <StyledTextField
                fullWidth
                margin="normal"
                label="Values (comma-separated)"
                value={proposalDetails.values.join(',')}
                onChange={(e) => setProposalDetails({ ...proposalDetails, values: e.target.value.split(',').filter(Boolean) })}
              />
              <StyledTextField
                fullWidth
                margin="normal"
                label="Calldatas (comma-separated)"
                value={proposalDetails.calldatas.join(',')}
                onChange={(e) => setProposalDetails({ ...proposalDetails, calldatas: e.target.value.split(',').filter(Boolean) })}
              />
              <StyledButton
                variant="contained"
                onClick={handleCreateProposal}
                style={{ marginTop: '16px' }}
                disabled={creatingProposal || !isProposalFormValid()}
                startIcon={creatingProposal ? <CircularProgress size={20} /> : <Check />}
              >
                {creatingProposal ? "Creating..." : "Create Proposal"}
              </StyledButton>
            </CardContent>
          </StyledCard>
        );
      case 2:
        return (
          <StyledCard>
            <CardHeader 
              title={<Typography variant="h5" style={{ color: theme.primary }}>Cast Vote</Typography>}
              avatar={<HowToVote style={{ color: theme.primary }} />}
            />
            <CardContent>
              <StyledTextField
                fullWidth
                margin="normal"
                label="Proposal ID"
                value={voteDetails.proposalId}
                onChange={(e) => setVoteDetails({ ...voteDetails, proposalId: e.target.value })}
              />
              <RadioGroup
                value={voteDetails.support}
                onChange={(e) => setVoteDetails({ ...voteDetails, support: e.target.value })}
              >
                <FormControlLabel value="0" control={<Radio style={{ color: theme.primary }} />} label="Against" />
                <FormControlLabel value="1" control={<Radio style={{ color: theme.primary }} />} label="For" />
                <FormControlLabel value="2" control={<Radio style={{ color: theme.primary }} />} label="Abstain" />
              </RadioGroup>
              <StyledButton
                variant="contained"
                onClick={handleCastVote}
                style={{ marginTop: '16px' }}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <HowToVote />}
              >
                {loading ? "Voting..." : "Cast Vote"}
              </StyledButton>
            </CardContent>
          </StyledCard>
        );
      default:
        return null;
    }
  };

  return (
    <KintoConnect showNavigation={false}>
      <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
        <Typography variant="h3" style={{ color: theme.primary, marginBottom: '24px', textAlign: 'center', fontWeight: 'bold' }}>
          Engen Governance
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel style={{ marginBottom: '24px' }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel StepIconComponent={() => (
                <Tooltip title={label}>
                  <IconButton style={{ color: activeStep >= index ? theme.primary : theme.text }}>
                    {stepIcons[index]}
                  </IconButton>
                </Tooltip>
              )}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Fade in={true} timeout={1000}>
          <div>
            {renderStepContent(activeStep)}
          </div>
        </Fade>
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
          <StyledButton
            disabled={activeStep === 0}
            onClick={() => setActiveStep((prevActiveStep) => prevActiveStep - 1)}
            startIcon={<Close />}
          >
            Previous
          </StyledButton>
          <StyledButton
            disabled={activeStep === steps.length - 1}
            onClick={() => setActiveStep((prevActiveStep) => prevActiveStep + 1)}
            endIcon={<Check />}
          >
            Next
          </StyledButton>
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        ContentProps={{
          style: {
            backgroundColor: snackbar.severity === 'success' ? '#48bb78' : '#f56565',
          }
        }}
      />
    </KintoConnect>
  );
};

export default EngenGovernance;