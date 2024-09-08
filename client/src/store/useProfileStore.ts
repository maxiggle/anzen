import { create } from 'zustand';
import { RegisterRole } from '../utils/types';

export interface UserState {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    role: RegisterRole;
    email: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  } | null;

  setProfile: (user: UserState['user']) => void;
  clearUser: () => void;
}

export const useProfileStore = create<UserState>((set) => ({
  user: null,
  setProfile: (user: UserState['user']) => set({ user }),
  clearUser: () => set({ user: null }),
}));
