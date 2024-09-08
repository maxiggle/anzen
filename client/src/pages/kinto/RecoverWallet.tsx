// App.tsx ou WalletPage.tsx
import React from 'react';
import { KintoConnect } from './KintoConnect';
import {WalletRecoveryProcess} from './KintoConnect';

const RecoverWallet: React.FC = () => {
  return (
    <KintoConnect showNavigation={false}>
      <WalletRecoveryProcess />
    </KintoConnect>
  );
};

export default RecoverWallet;