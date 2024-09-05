import React, { useState } from 'react';
import { Address } from 'viem';
import { 
  initializeBudgetAllocation, 
  allocateBudget, 
  authorizeUser, 
  unauthorizeUser, 
  withdrawFunds, 
  getContractBalance, 
  getUserAllocation 
} from './KintoFunctions';

const BudgetAllocationUI = () => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [contractBalance, setContractBalance] = useState('0');
  const [userAllocation, setUserAllocation] = useState('0');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [confirmAction, setConfirmAction] = useState<(() => Promise<void>) | null>(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  const handleInitialize = () => {
    setConfirmAction(() => async () => {
      try {
        await initializeBudgetAllocation(tokenAddress as Address);
        setStatus({ type: 'success', message: 'Contrat initialisé avec succès' });
      } catch (error) {
        setStatus({ type: 'error', message: 'Erreur lors de l\'initialisation' });
      }
    });
    setConfirmMessage('Êtes-vous sûr de vouloir initialiser le contrat ?');
  };

  const handleAllocateBudget = () => {
    setConfirmAction(() => async () => {
      try {
        await allocateBudget(BigInt(amount));
        setStatus({ type: 'success', message: 'Budget alloué avec succès' });
      } catch (error) {
        setStatus({ type: 'error', message: 'Erreur lors de l\'allocation du budget' });
      }
    });
    setConfirmMessage(`Êtes-vous sûr de vouloir allouer ${amount} ?`);
  };

  const handleAuthorizeUser = () => {
    setConfirmAction(() => async () => {
      try {
        await authorizeUser(userAddress as Address);
        setStatus({ type: 'success', message: 'Utilisateur autorisé avec succès' });
      } catch (error) {
        setStatus({ type: 'error', message: 'Erreur lors de l\'autorisation de l\'utilisateur' });
      }
    });
    setConfirmMessage(`Êtes-vous sûr de vouloir autoriser l'utilisateur ${userAddress} ?`);
  };

  const handleUnauthorizeUser = () => {
    setConfirmAction(() => async () => {
      try {
        await unauthorizeUser(userAddress as Address);
        setStatus({ type: 'success', message: 'Autorisation de l\'utilisateur révoquée avec succès' });
      } catch (error) {
        setStatus({ type: 'error', message: 'Erreur lors de la révocation de l\'autorisation' });
      }
    });
    setConfirmMessage(`Êtes-vous sûr de vouloir révoquer l'autorisation de l'utilisateur ${userAddress} ?`);
  };

  const handleWithdrawFunds = () => {
    setConfirmAction(() => async () => {
      try {
        await withdrawFunds(BigInt(amount));
        setStatus({ type: 'success', message: 'Fonds retirés avec succès' });
      } catch (error) {
        setStatus({ type: 'error', message: 'Erreur lors du retrait des fonds' });
      }
    });
    setConfirmMessage(`Êtes-vous sûr de vouloir retirer ${amount} ?`);
  };

  const handleGetUserAllocation = () => {
    setConfirmAction(() => async () => {
      try {
        const allocation = await getUserAllocation(userAddress as Address);
        setUserAllocation(allocation.toString());
        setStatus({ type: 'success', message: 'Allocation utilisateur récupérée avec succès' });
      } catch (error) {
        setStatus({ type: 'error', message: 'Erreur lors de la récupération de l\'allocation' });
      }
    });
    setConfirmMessage(`Voulez-vous récupérer l'allocation de l'utilisateur ${userAddress} ?`);
  };

  const handleGetContractBalance = () => {
    setConfirmAction(() => async () => {
      try {
        const balance = await getContractBalance();
        setContractBalance(balance.toString());
        setStatus({ type: 'success', message: 'Solde du contrat récupéré avec succès' });
      } catch (error) {
        setStatus({ type: 'error', message: 'Erreur lors de la récupération du solde du contrat' });
      }
    });
    setConfirmMessage('Voulez-vous récupérer le solde actuel du contrat ?');
  };

  const confirmActionHandler = async () => {
    if (confirmAction) {
      await confirmAction();
      setConfirmAction(null);
      setConfirmMessage('');
    }
  };

  const cancelActionHandler = () => {
    setConfirmAction(null);
    setConfirmMessage('');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Gestion du Budget</h1>
      <p>Interagissez avec le contrat BudgetAllocation</p>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="tokenAddress">Adresse du Token</label>
        <input id="tokenAddress" value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} placeholder="0x..." style={{ width: '100%', padding: '5px', marginBottom: '10px' }} />
        <button onClick={handleInitialize} style={{ padding: '5px 10px' }}>Initialiser le Contrat</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="amount">Montant</label>
        <input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Montant" style={{ width: '100%', padding: '5px', marginBottom: '10px' }} />
        <button onClick={handleAllocateBudget} style={{ padding: '5px 10px', marginRight: '10px' }}>Allouer le Budget</button>
        <button onClick={handleWithdrawFunds} style={{ padding: '5px 10px' }}>Retirer des Fonds</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="userAddress">Adresse de l'Utilisateur</label>
        <input id="userAddress" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} placeholder="0x..." style={{ width: '100%', padding: '5px', marginBottom: '10px' }} />
        <button onClick={handleAuthorizeUser} style={{ padding: '5px 10px', marginRight: '10px' }}>Autoriser l'Utilisateur</button>
        <button onClick={handleUnauthorizeUser} style={{ padding: '5px 10px', marginRight: '10px' }}>Révoquer l'Autorisation</button>
        <button onClick={handleGetUserAllocation} style={{ padding: '5px 10px' }}>Voir l'Allocation</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p>Solde du Contrat: {contractBalance}</p>
        <button onClick={handleGetContractBalance} style={{ padding: '5px 10px' }}>Actualiser le Solde</button>
        <p>Allocation de l'Utilisateur: {userAllocation}</p>
      </div>

      {confirmMessage && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#ffffcc', 
          border: '1px solid #ffcc00',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <p>{confirmMessage}</p>
          <button onClick={confirmActionHandler} style={{ padding: '5px 10px', marginRight: '10px' }}>Confirmer</button>
          <button onClick={cancelActionHandler} style={{ padding: '5px 10px' }}>Annuler</button>
        </div>
      )}

      {status.message && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: status.type === 'error' ? '#ffcccc' : '#ccffcc', 
          border: `1px solid ${status.type === 'error' ? '#ff0000' : '#00ff00'}`,
          borderRadius: '5px'
        }}>
          <h3>{status.type === 'error' ? 'Erreur' : 'Succès'}</h3>
          <p>{status.message}</p>
        </div>
      )}
    </div>
  );
};

export default BudgetAllocationUI;