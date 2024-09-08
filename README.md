# Project README

## Getting Started

### Frontend Setup
1. Navigate to the `client` folder
2. Run `yarn` or `npm install`
3. Copy `.env.example` and fill in your `.env` file

### Backend Setup
1. Go to the `backend` folder
2. Execute `yarn`
3. Run `yarn run dev`

## Kinto Integration

**Important:** For Kinto-related functionalities, go to `client/src/pages/kinto`:

- `kitoconnect.tsx`: Main file for connection and financial services
- `KINTOFUNCTIONS.TSX`: Contains all functions communicating with various smart contracts used in this project
- `AccountInfoPage`: Displays Kinto user info
- `Allocate Budget`: Contains budget allocation logic
- `EngenGovernance`: Contains voting and decentralized governance logic
- `TransferFundsSectionComponent`: Handles fund transfers
- `MonthlyTransfer`: Implements salary payment logic
- `BudgetAllocationSectionComponent`: Implements budget logic
- `RecoverWallet`: Implements wallet recovery logic
- `KYCViewerService`: Retrieves KYC info

### Custom Smart Contracts
In the `/kinto_smart_contract` folder:
Two custom smart contracts interacting with Kinto smart contracts, implementing different logics (budget allocation + monthly transfer)

## SignProtocol Usage
In `client/src/pages/dashboard/signProtocol`:
Implementation of schema creation logic, attestation generation, and signature

## Gladriel Usage
- `client/src/pages/dashboard/Contract.tsx`: Interaction with Galadriel for contract generation
- `backend/scripts`: Files calling the Galadriel smart contract

## XMTP Usage
`client/src/pages/dashboard/chat.tsx`:
Implementation of chat logic

---

Do you like our project? Want to work with us? Don't hesitate to contact us!
