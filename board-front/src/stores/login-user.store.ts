import { User } from "types/interface";
import { create } from "zustand";
import { persist} from 'zustand/middleware';

interface LoginUserStore {
    loginUser : User | null;
    setLoginUser : (loginUser : User) => void;
    resetLoginUser : () => void;

};

/* const useLoginUserStore = create<LoginUserStore>(set =>({loginUser : null,
setLoginUser : (loginUser) => set(state => ({...state, loginUser})),
resetLoginUser : () => set(state => ({...state,loginUser : null}))
})); */

const useLoginUserStore = create<LoginUserStore>()(
  persist(
    (set) => ({
      loginUser: null,
      setLoginUser: (loginUser) => set({ loginUser }),
      resetLoginUser: () => set({ loginUser: null }),
    }),
    {
      name: 'login-user-store', // localStorage key
    partialize: (state) => ({ loginUser: state.loginUser }),
    }
  )
);


export default useLoginUserStore;

