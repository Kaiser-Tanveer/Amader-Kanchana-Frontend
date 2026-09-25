import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import i18n, { LANGUAGE_STORAGE_KEY } from "@/i18n";

export type AppLanguage = "bn" | "en";

interface LanguageState {
  current: AppLanguage;
}

const initialState: LanguageState = {
  current: (i18n.language as AppLanguage) || "bn",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<AppLanguage>) {
      state.current = action.payload;
      i18n.changeLanguage(action.payload);
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, action.payload);
      document.documentElement.lang = action.payload;
    },
    toggleLanguage(state) {
      const next: AppLanguage = state.current === "bn" ? "en" : "bn";
      state.current = next;
      i18n.changeLanguage(next);
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
      document.documentElement.lang = next;
    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;
export default languageSlice.reducer;
