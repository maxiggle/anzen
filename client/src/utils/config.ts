import galadrielABI from "../abis/galadriel.json"

export default {
  web3AuthClientId: import.meta.env.VITE_APP_WEB3_AUTH_CLIENT_ID,
  galadrielPrivateKey: import.meta.env.VITE_APP_PRIVATE_KEY_GALADRIEL,
  employeePrivateKey: import.meta.env.VITE_APP_PRIVATE_KEY_EMPLOYEE,
  employerContractAddress: import.meta.env.VITE_APP_EMPLOYER_CONTRACT_ADDRESS,
  galadrielRpcUrl: import.meta.env.VITE_APP_GALADRIEL_RPC_URL,
  employeeAddress: import.meta.env.VITE_APP_EMPLOYEE_ADDRESS,
  employerAbi: galadrielABI,
  xmtp: {
    kintoPrivateKey: import.meta.env.VITE_APP_KINTO_PRIVATE_KEY,
    kintoRPCURL: import.meta.env.VITE_APP_KINTO_RPC_URL,
    environment: import.meta.env.VITE_APP_XMTP_ENV
  },
}