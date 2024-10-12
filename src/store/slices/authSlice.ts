import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Helper functions to interact with localStorage
const loadStateFromLocalStorage = () => {
  const savedState = localStorage.getItem('authState');
  return savedState ? JSON.parse(savedState) : { isLogin: false, token: null };
};

const saveStateToLocalStorage = (state: AuthState) => {
  localStorage.setItem('authState', JSON.stringify(state));
};

interface AuthState {
  isLogin: boolean;
  token: string | null;
}

const initialState: AuthState = loadStateFromLocalStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.isLogin = true;
      state.token = action.payload;
      saveStateToLocalStorage(state);
    },
    logout: (state) => {
      state.isLogin = false;
      state.token = null;
      saveStateToLocalStorage(state);
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;