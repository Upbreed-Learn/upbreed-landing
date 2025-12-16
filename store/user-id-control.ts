import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserIdState {
  userId: string | null;
  setUserId: (userId: string | null) => void;
  removeUserId: () => void;
}

export const useUserIdStore = create<UserIdState>()(
  persist(
    set => ({
      userId: null,
      setUserId: userId => set({ userId }),
      removeUserId: () => {
        set({ userId: null });
        try {
          localStorage.removeItem('user-id-storage');
        } catch {
          // ignore if localStorage isn't available
        }
      },
    }),
    {
      name: 'user-id-storage',
    },
  ),
);
