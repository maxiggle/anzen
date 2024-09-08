// App.tsx ou WalletPage.tsx
import React from 'react';
import { KintoConnect } from './KintoConnect';
import {WalletRecoveryProcess, AccountInfo} from './KintoConnect';

const AccountInfoPage: React.FC = () => {
  return (
    <KintoConnect showNavigation={false}>
      {/* Autres composants */}
      <AccountInfo />
      {/* Autres composants */}
    </KintoConnect>
  );
};

export default AccountInfoPage;