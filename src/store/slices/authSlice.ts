import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "MODERATOR";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

interface AuthState {
  token: string | null;
  user: AdminUser | null;
}

const TOKEN_STORAGE_KEY = "kanchana_admin_token";

const initialState: AuthState = {
  token: typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_STORAGE_KEY) : null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; user: AdminUser }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      window.localStorage.setItem(TOKEN_STORAGE_KEY, action.payload.token);
    },
    logout(state) {
      state.token = null;
      state.user = null;
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
