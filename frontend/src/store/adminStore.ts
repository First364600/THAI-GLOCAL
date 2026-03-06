import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfile } from "./authStore";
import { centers, Center } from "../data/mockData";

export interface CenterRegistrationRequest {
  id: string;
  userId: string;
  name: string;
  address: string;
  telephones: string[]; // max 3, min 1
  email: string;
  lineId: string;
  facebook: string;
  website: string;
  providers: string[]; // can contain multiple people
  communityLeaderFirstName: string;
  communityLeaderLastName: string;
  communityLeaderTelephone: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface AdminState {
  registrationRequests: CenterRegistrationRequest[];
  users: UserProfile[]; // mocked for admin view
  adminCenters: Center[];
  addRegistrationRequest: (req: Omit<CenterRegistrationRequest, "id" | "status" | "createdAt">) => void;
  updateRequestStatus: (id: string, status: "approved" | "rejected") => void;
  updateUserRole: (userId: string, role: "user" | "center" | "admin" | "super_admin") => void;
  updateUserStatus: (userId: string, status: "active" | "suspended") => void;
  deleteCenter: (centerId: string) => void;
  syncUsers: () => void;
}

const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      adminCenters: centers,
      registrationRequests: [
        {
          id: "req-1",
          userId: "u-1",
          name: "Bangkok Artisan Hub",
          address: "123 Sukhumvit, Bangkok",
          telephones: ["081-111-1111"],
          email: "hello@bkkartisan.com",
          lineId: "@bkkartisan",
          facebook: "BangkokArtisanHub",
          website: "www.bkkartisan.com",
          providers: ["Somchai Jaidee", "Wipada S."],
          communityLeaderFirstName: "Thongchai",
          communityLeaderLastName: "Makmak",
          communityLeaderTelephone: "082-222-2222",
          status: "pending",
          createdAt: new Date().toISOString(),
        }
      ],
      users: [
        { id: "u-super", name: "Super Admin", email: "super@admin.com", role: "super_admin", status: "active" },
        { id: "u-admin", name: "Gen Admin", email: "admin@tg.com", role: "admin", status: "active" },
        { id: "u-1", name: "Somchai User", email: "somchai@test.com", role: "user", status: "active" },
      ],

      addRegistrationRequest: (req) => {
        const newReq: CenterRegistrationRequest = {
          ...req,
          id: crypto.randomUUID(),
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ registrationRequests: [...s.registrationRequests, newReq] }));
      },

      updateRequestStatus: (id, status) => {
        set((s) => ({
          registrationRequests: s.registrationRequests.map((r) =>
            r.id === id ? { ...r, status } : r
          ),
        }));
      },

      updateUserRole: (userId, role) => {
        set((s) => ({
          users: s.users.map((u) => (u.id === userId ? { ...u, role } : u)),
        }));
        
        try {
          const stored = localStorage.getItem("tg_users");
          if (stored) {
            const lsUsers = JSON.parse(stored);
            const idx = lsUsers.findIndex((u: any) => u.id === userId);
            if (idx !== -1) {
              lsUsers[idx].role = role;
              localStorage.setItem("tg_users", JSON.stringify(lsUsers));
            }
          }
        } catch (e) {}
      },

      updateUserStatus: (userId, status) => {
        set((s) => ({
          users: s.users.map((u) => (u.id === userId ? { ...u, status } : u)),
        }));
        
        try {
          const stored = localStorage.getItem("tg_users");
          if (stored) {
            const lsUsers = JSON.parse(stored);
            const idx = lsUsers.findIndex((u: any) => u.id === userId);
            if (idx !== -1) {
              lsUsers[idx].status = status;
              localStorage.setItem("tg_users", JSON.stringify(lsUsers));
            }
          }
        } catch (e) {}
      },

      deleteCenter: (centerId) => {
        set((s) => ({
          adminCenters: s.adminCenters.filter((c) => c.id !== centerId)
        }));
      },

      syncUsers: () => {
        try {
          const stored = localStorage.getItem("tg_users");
          if (stored) {
            const lsUsers = JSON.parse(stored);
            set({ users: lsUsers });
          }
        } catch (e) {}
      }
    }),
    { name: "tg_admin" }
  )
);

export default useAdminStore;
