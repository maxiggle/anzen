import { create } from 'zustand';


type AttestationStore = {
  attestationJson: string | null;
  setAttestationJson: (json: string) => void;
}

<<<<<<< HEAD
export default create<AttestationStore>((set) => ({
  attestationJson: null,
  setAttestationJson: (json) => set({ attestationJson: JSON.stringify(json) }),
}));
=======
  type AttestationStore = {
    attestationJson: string | null;
    setAttestationJson: (json: string) => void;
    attestationId: string | null;
    setAttestationId: (id: string) => void;
  } 

  export default create<AttestationStore>((set) => ({
    attestationJson: null,
    setAttestationJson: (json) => set({ attestationJson: JSON.stringify(json) }),
    attestationId: null,
    setAttestationId: (id) => set({ attestationId: id }),
  }));
>>>>>>> 0904546 (chore: code clean up)
