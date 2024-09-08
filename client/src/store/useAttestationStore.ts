import { create } from 'zustand';


type AttestationStore = {
  attestationJson: string | null;
  setAttestationJson: (json: string) => void;
}

export default create<AttestationStore>((set) => ({
  attestationJson: null,
  setAttestationJson: (json) => set({ attestationJson: JSON.stringify(json) }),
}));
