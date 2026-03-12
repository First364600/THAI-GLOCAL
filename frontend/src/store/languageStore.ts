import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "en" | "th";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (lang) => {
        set({ language: lang });
      },
    }),
    { name: "tg_language" }
  )
);

export default useLanguageStore;
