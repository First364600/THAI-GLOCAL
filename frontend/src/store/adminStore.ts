import { create } from "zustand";
import apiClient from "../api/axiosClient";

export type CenterStatus = "active" | "suspended" | "disabled";

export interface AdminUser {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
}

export interface AdminCenter {
  id: string;
  name: string;
  nameTh?: string;
  owner: string;
  location?: string;
  province?: string;
  description?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface CenterRegistrationRequest {
  id: number;
  name: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  address: string;
  telephones: string[];
  email: string;
  lineId?: string;
  facebook?: string;
  website?: string;
  providers?: string[];
  communityLeaderFirstName: string;
  communityLeaderLastName: string;
  communityLeaderTelephone: string;
}

/** @deprecated Use CenterRegistrationRequest instead */
export type RegistrationRequest = CenterRegistrationRequest;

interface AdminState {
  users: AdminUser[];
  centers: AdminCenter[];
  adminCenters: AdminCenter[];
  centerStatuses: Record<string, CenterStatus>;
  registrationRequests: CenterRegistrationRequest[];
  pendingCenters: AdminCenter[];
  systemStats: {
    totalUsers: number;
    activeCenters: number;
    revenue: number;
    pendingApprovals: number;
  };

  fetchAdminData: () => Promise<void>;
  syncUsers: () => Promise<void>;
  fetchPendingCenters: () => Promise<void>;

  updateUserStatus: (id: string, status: "active" | "inactive" | "suspended") => Promise<void>;
  updateCenterStatus: (id: string | number, status: string) => Promise<void>;
  updateUserInfo: (id: string, data: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  updateRegistrationRequestStatus: (id: number, status: "pending" | "approved" | "rejected") => Promise<void>;

  getSystemLogs: () => Promise<any[]>;
}

const useAdminStore = create<AdminState>((set, get) => ({
  users: [],
  centers: [],
  adminCenters: [],
  centerStatuses: {},
  registrationRequests: [],
  pendingCenters: [],
  systemStats: {
    totalUsers: 0,
    activeCenters: 0,
    revenue: 0,
    pendingApprovals: 0,
  },

  syncUsers: async () => { await get().fetchAdminData(); },

  fetchAdminData: async () => {
    try {
      const [usersRes, centersRes, requestsRes, pendingCentersRes] = await Promise.allSettled([
        apiClient.get(`/client/users/admin`),
        apiClient.get(`/client/centers`),
        apiClient.get(`/client/admin/registration-requests`),
        apiClient.get(`/client/centers/admin/pending`)
      ]);

      const users = usersRes.status === "fulfilled" 
        ? (Array.isArray(usersRes.value) ? usersRes.value.map((u: any) => ({
            id: u.id || u.userId || u._id, 
            ...u
          })) : []) 
        : [];
      
      const centers = centersRes.status === "fulfilled" ? (Array.isArray(centersRes.value) ? centersRes.value : []) : [];
      const requests = requestsRes.status === "fulfilled" ? (Array.isArray(requestsRes.value) ? requestsRes.value : []) : [];
      const pendingCenters = pendingCentersRes.status === "fulfilled" ? (Array.isArray(pendingCentersRes.value) ? pendingCentersRes.value : []) : [];  

      const statuses: Record<string, CenterStatus> = {};
      centers.forEach((c: any) => { statuses[c.id] = c.centerStatus ?? "active"; });

      set({
        users,
        centers,
        adminCenters: centers,
        centerStatuses: statuses,
        registrationRequests: requests,
        pendingCenters: pendingCenters,  
        systemStats: {
          totalUsers: users.length,
          activeCenters: centers.filter((c: any) => c.status === "approved").length,
          revenue: Math.floor(Math.random() * 50000),
          pendingApprovals: pendingCenters.length,  
        },
      });
    } catch (error) {
       console.error("Admin fetch error:", error);
    }
  },

  fetchPendingCenters: async () => {  
    try {
      const res = await apiClient.get(`/client/centers/admin/pending`);
      const pendingCenters = Array.isArray(res) ? res : [];
      set({ pendingCenters });
    } catch(e) { console.error(e); }
  },

  updateUserStatus: async (id, status) => {
    try {
      await apiClient.patch(`/client/users/admin/${id}`, { status });
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? { ...u, status } : u)),
      }));
    } catch (e) { console.error(e); }
  },

  updateUserRole: async (id: any, role: any) => {
    try {
      await apiClient.patch(`/client/users/admin/role/${id}`, { role });
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? { ...u, role } : u)),
      }));
    } catch (e) { console.error(e); }
  },

  updateUserInfo: async (id, data) => {
    try {
      await apiClient.patch(`/client/users/admin/${id}`, data);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
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
      await apiClient.patch(`/client/centers/${id}/status?status=${status}`);
      
      // อัพเดท pendingCenters โดยลบ center ที่ approve/reject ไป
      set((state) => ({
        pendingCenters: state.pendingCenters.filter(
          (c) => c.id !== id.toString()
        ),
        systemStats: {
          ...state.systemStats,
          pendingApprovals: Math.max(0, state.systemStats.pendingApprovals - 1),
        },
      }));
    } catch (e) {
      console.error("Update center status error:", e);
    }
  },

  updateAdminCenter: async (id: any, data: any) => {
    try {
      const payload: any = {};
      if (data.name !== undefined) payload.centerName = data.name;
      if (data.nameTh !== undefined) payload.nameTh = data.nameTh;
      if (data.description !== undefined) payload.description = data.description;
      if (data.location !== undefined) payload.subDistrict = data.location;
      if (data.province !== undefined) payload.province = data.province;
      if (data.location || data.province) {
        payload.address = [data.location, data.province].filter(Boolean).join(', ');
      }
      // pass through any already-DTO-named fields
      ['email','facebook','webSite','website','line','lineId','googleMapLink','leaderFirstName','leaderLastName','leaderTelephone','centerImages','telephones'].forEach(f => {
        if (data[f] !== undefined) payload[f] = data[f];
      });
      await apiClient.patch(`/client/centers/update/${id}`, payload);
      set((state) => ({
        centers: state.centers.map((c) => (c.id === id ? { ...c, ...data } : c)),
        adminCenters: state.adminCenters.map((c) => (c.id === id ? { ...c, ...data } : c)),
      }));
    } catch (e) { console.error(e); }
  },

  deleteCenter: async (id: any) => {
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
        registrationRequests: state.registrationRequests.map((r) =>
          r.id === id ? { ...r, status } : r
        ),
      }));
    } catch(e) { console.error(e); }
  },

  getSystemLogs: async () => {
    try {
      const res = await apiClient.get(`/client/admin/logs`);
      return Array.isArray(res) ? res : [];
    } catch (error) { console.error("Logs fetch failed", error); throw error; }
  },
}));

export default useAdminStore;



