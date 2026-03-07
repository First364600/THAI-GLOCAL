import { create } from "zustand";
import { persist } from "zustand/middleware";
import useLanguageStore from "./languageStore";

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  telephone?: string;
  address?: string;
  role?: "user" | "center" | "admin" | "super_admin";
  status?: "active" | "suspended";
  language?: "en" | "th";
}

interface AuthState {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Omit<UserProfile, "id" | "email">>) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      login: async (emailOrUsername, password) => {
        if (!emailOrUsername || !password) throw new Error("Email/username and password are required.");
        if (password.length < 6) throw new Error("Invalid credentials.");

        // Check localStorage for a registered user
        let stored = localStorage.getItem("tg_users");
        let users: (UserProfile & { password: string })[] = [];
        if (stored) {
          users = JSON.parse(stored);
        } 
        
        // Ensure default admin exists even if there are other users
        if (!users.find(u => u.email === "admin@tg.com")) {
          const defaultAdmin = {
            id: "u-super", name: "Super Admin", email: "admin@tg.com", password: "password", role: "super_admin" as const, status: "active" as const
          };
          users.push(defaultAdmin);
          localStorage.setItem("tg_users", JSON.stringify(users));
        }

        const found = users.find(
          (u) =>
            u.email.toLowerCase() === emailOrUsername.toLowerCase() ||
            (u.username && u.username.toLowerCase() === emailOrUsername.toLowerCase())
        );
        if (!found || found.password !== password) throw new Error("Invalid email or password.");
        if (found.status === "suspended") throw new Error("This account is suspended.");

        const { password: _pw, ...profile } = found;
        set({ user: profile });
        if (profile.language) {
          useLanguageStore.getState().setLanguage(profile.language);
        }
      },

      signup: async (email, password) => {
        if (!email || !password) throw new Error("All fields are required.");
        if (password.length < 6) throw new Error("Password must be at least 6 characters.");

        const stored = localStorage.getItem("tg_users");
        const users: (UserProfile & { password: string })[] = stored ? JSON.parse(stored) : [];
        if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
          throw new Error("An account with this email already exists.");
        }

        const newUser: UserProfile & { password: string } = {
          id: crypto.randomUUID(),
          email,
          password,
        };
        users.push(newUser);
        localStorage.setItem("tg_users", JSON.stringify(users));

        const { password: _pw, ...profile } = newUser;
        set({ user: profile });
      },

      logout: () => set({ user: null }),

      updateProfile: (data) => {
        const current = get().user;
        if (!current) return;
        const updated = { ...current, ...data };
        set({ user: updated });

        // Persist updated profile back to users list
        const stored = localStorage.getItem("tg_users");
        if (stored) {
          const users: (UserProfile & { password: string })[] = JSON.parse(stored);
          const idx = users.findIndex((u) => u.id === current.id);
          if (idx !== -1) {
            users[idx] = { ...users[idx], ...data };
            localStorage.setItem("tg_users", JSON.stringify(users));
          }
        }
      },
    }),
    { name: "tg_auth" }
  )
);

export default useAuthStore;
