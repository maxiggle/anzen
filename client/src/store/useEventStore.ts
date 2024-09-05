import {create} from 'zustand';

interface EventStore {
  contractId: number | null;
  contractStatus: number | null;
  setContractId: (id: number) => void;
  setContractStatus: (status: number) => void;
}

export default create<EventStore>((set) => ({
    contractId: null,
    contractStatus: null,
    setContractId: (id) => set({ contractId: id }),
    setContractStatus: (status) => set({ contractStatus: status }),
  }));