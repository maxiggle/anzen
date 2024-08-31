import galadrielABI from "../abis/galadriel.json"

const { env } = import.meta
export default {
  web3AuthClientId: env.VITE_APP_WEB3_AUTH_CLIENT_ID,
  galadrielPrivateKey: env.VITE_APP_PRIVATE_KEY_GALADRIEL,
  employeePrivateKey: env.VITE_APP_PRIVATE_KEY_EMPLOYEE,
  employerContractAddress: env.VITE_APP_EMPLOYER_CONTRACT_ADDRESS,
  galadrielRpcUrl: env.VITE_APP_GALADRIEL_RPC_URL,
  employeeAddress: env.VITE_APP_EMPLOYEE_ADDRESS,
  employerAbi: galadrielABI,
  xmtp: {
    kintoPrivateKey: env.VITE_APP_KINTO_PRIVATE_KEY,
    kintoRPCURL: env.VITE_APP_KINTO_RPC_URL
  },
}
