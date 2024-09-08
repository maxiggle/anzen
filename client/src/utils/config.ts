import galadrielABI from "../abis/galadriel.json"
import employeeABI from "../abis/employee.json"

export default {
  backendUrl: import.meta.env.VITE_APP_BACKEND_URL,
  galadrielPrivateKey: import.meta.env.VITE_APP_PRIVATE_KEY_GALADRIEL,
  employeePrivateKey: import.meta.env.VITE_APP_PRIVATE_KEY_EMPLOYEE,
  employerContractAddress: import.meta.env.VITE_APP_EMPLOYER_CONTRACT_ADDRESS,
  galadrielRpcUrl: import.meta.env.VITE_APP_GALADRIEL_RPC_URL,
  employeeAddress: import.meta.env.VITE_APP_EMPLOYEE_ADDRESS,
  employerAbi: galadrielABI,
  employeeAbi: employeeABI,
  signProtocol: {
    privateKey: "0xef060cb7d3f8ec2db57965356a38775806ed527dafe85a1ecee920f1673d4b0d"
  },
  xmtp: {
    kintoPrivateKey: import.meta.env.VITE_APP_KINTO_PRIVATE_KEY,
    kintoRPCURL: import.meta.env.VITE_APP_KINTO_RPC_URL,
    environment: import.meta.env.VITE_APP_XMTP_ENV
  },
}