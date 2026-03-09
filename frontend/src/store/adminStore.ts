
import { create } from "zustand";
import apiClient from "../api/axiosClient";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string;
}

export interface AdminCenter {
  id: string;
  name: string;
  owner: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface RegistrationRequest {
  id: number;
  centerName: string;
  requesterId: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  details: string;
  createdAt: string;
}

interface AdminState {
  users: AdminUser[];
  centers: AdminCenter[];
  registrationRequests: RegistrationRequest[];
  systemStats: {
    totalUsers: number;
    activeCenters: number;
    revenue: number;
    pendingApprovals: number;
  };

  fetchAdminData: () => Promise<void>;

  updateUserStatus: (id: string, status: "active" | "inactive") => Promise<void>;
  updateUserRole: (id: string, role: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  updateCenterStatus: (id: string, status: "pending" | "approved" | "rejected") => Promise<void>;
  deleteCenter: (id: string) => Promise<void>;
  
  updateRegistrationRequestStatus: (id: number, status: "PENDING" | "APPROVED" | "REJECTED") => Promise<void>;

  getSystemLogs: () => Promise<any[]>;
}

const useAdminStore = create<AdminState>((set) => ({
  users: [],
  centers: [],
  registrationRequests: [],
  systemStats: {
    totalUsers: 0,
    activeCenters: 0,
    revenue: 0,
    pendingApprovals: 0,
  },

  fetchAdminData: async () => {
    try {
      const [usersRes, centersRes, requestsRes] = await Promise.allSettled([
        apiClient.get(`/client/users/admin`),
        apiClient.get(`/client/centers`),
        apiClient.get(`/client/admin/registration-requests`)
      ]);

      // apiClient interceptor already unwraps response.data
      const users = usersRes.status === "fulfilled" ? usersRes.value as any : [];
      const centers = centersRes.status === "fulfilled" ? centersRes.value as any : [];
      const requests = requestsRes.status === "fulfilled" ? requestsRes.value as any : [];

      set({
        users,
        centers,
        registrationRequests: requests,
        systemStats: {
          totalUsers: users.length,
          activeCenters: centers.filter((c: any) => c.status === "approved").length,
          revenue: Math.floor(Math.random() * 50000), 
          pendingApprovals: requests.filter((r: any) => r.status === "PENDING").length,
        },
      });
    } catch (error) {
       console.error("Admin fetch error:", error);
    }
  },

  updateUserStatus: async (id, status) => {
    try {
      await apiClient.patch(`/client/users/admin/${id}`, { status });
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? { ...u, status } : u)),
      }));
    } catch (e) { console.error(e); }
  },

  updateUserRole: async (id, role) => {
    try {
      await apiClient.patch(`/client/users/admin/role/${id}`, { role });
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? { ...u, role } : u)),
      }));
    } catch (e) { console.error(e); }
  },

  deleteUser: async (id) => {
    try {
      await apiClient.delete(`/client/users/admin/${id}`);
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
      }));
    } catch(e) { console.error(e); }
  },

  updateCenterStatus: async (id, status) => {
    try {
       await apiClient.patch(`/client/centers/update/${id}`, { status });
       set((state) => ({
        centers: state.centers.map((c) => (c.id === id ? { ...c, status } : c)),
       }));
    } catch(e) { console.error(e); }
  },

  deleteCenter: async (id) => {
    try {
       await apiClient.delete(`/client/centers/delete/${id}`);
       set((state) => ({
          centers: state.centers.filter((c) => c.id !== id),
       }));
    } catch(e) { console.error(e); }
  },

  updateRegistrationRequestStatus: async (id, status) => {
    try {
       await apiClient.patch(`/client/admin/registration-requests/${id}/status`, { status });
       set((state) => ({
          registrationRequests: state.registrationRequests.map((r) => (r.id === id ? { ...r, status } : r)),
       }));
    } catch(e) { console.error(e); }
  },

  getSystemLogs: async () => {
    try {
      const res = await apiClient.get(`/client/admin/logs`);
      // apiClient interceptor already unwraps response.data
      return res as any;
    } catch (error) { console.error("Logs fetch failed", error); throw error; }
  },
}));

export default useAdminStore;



