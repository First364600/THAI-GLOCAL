
import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../api/axiosClient";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatarId?: string;
  [key: string]: any;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: any) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  updateProfile: (userData: any) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null as User | null,

      login: async (userData: any) => {
        try {
          // Send request through gateway proxy directly into the WebClient /client pipeline
          const loginData = { usernameOrEmail: userData.email, password: userData.password };
          const response = await apiClient.post("/client/users/signin", loginData);

          // apiClient interceptor already unwraps to response.data
          const signedIn = response as any;
          const userResponse = signedIn?.userResponse ?? signedIn;

          const mappedUser = userResponse
            ? {
                id: String(userResponse.userId ?? userResponse.id ?? ""),
                firstName: userResponse.firstName,
                lastName: userResponse.lastName,
                email: userResponse.email,
                role: String(userResponse.role ?? userResponse.roleName ?? "").toString(),
                ...userResponse,
              }
            : userData;

          set({ isAuthenticated: true, user: mappedUser });
        } catch (e: any) {
          console.error("Login failed", e);
          throw e;
        }
      },

        signup: async (userData: any) => {
         try {
          const signupData = {
            username: userData.username,
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
            lastName: userData.lastName,
            telephone: userData.telephone,
            address: userData.address,
            birthDate: userData.birthDate ? `${userData.birthDate}T00:00:00` : undefined,
          };
          await apiClient.post("/client/users/signup", signupData);
          // Do not immediately authenticate after signup so the user is redirected to login
         } catch(e: any) {
          let errorMsg = "Registration failed. Please try again later.";
          if (e.code === "ECONNREFUSED" || e.code === "ERR_NETWORK" || e.message === "Network Error") {
            errorMsg = "Server is currently offline (Connection Refused).";
          } else if (e.response?.status === 500) {
            errorMsg = "Server is currently offline or encountered an error (500).";
          } else if (e.response?.data?.message) {
            errorMsg = e.response.data.message;
          } else if (typeof e.response?.data === 'string') {
            errorMsg = e.response.data;
          }
          console.error("SignUp Failed", e);
          throw new Error(errorMsg);
         }
        },
      updateProfile: async (userData: any) => {
        set((state) => ({ user: { ...state.user, ...userData } as User }));
      },
      logout: () => {
        // Call server signout to clear httpOnly cookies
        apiClient.post("/client/users/signout").catch(() => {});
        set({ isAuthenticated: false, user: null });
      },
      forgotPassword: async (email: string) => {
         try {
             await apiClient.post("/client/users/forget-password", { email });
             alert("Password reset check");
         } catch(e) {
             console.error("Forgot pass failed", e);
         }
      }
    }),
    {
      name: "tg_auth",
    }
  )
);

export default useAuthStore;



