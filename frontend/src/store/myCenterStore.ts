
import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../api/axiosClient";

export interface UserCenter { [key: string]: any; }
export interface UserWorkshop { [key: string]: any; }
export interface UserSession { [key: string]: any; }
export interface UserBooking { [key: string]: any; }

interface MyCenterState {
  myCenters: UserCenter[];
  myWorkshops: UserWorkshop[];
  mySessions: UserSession[];
  myBookings: UserBooking[];

  centers: UserCenter[];
  workshops: UserWorkshop[];
  sessions: UserSession[];

  fetchMyCenterData: (ownerId: string) => Promise<void>;

  createCenter: (userId: string, data: any) => Promise<any>;
  updateCenter: (id: string, data: any) => Promise<void>;
  deleteCenter: (id: string) => Promise<void>;

  createWorkshop: (centerId: string, data: any) => Promise<void>;
  updateWorkshop: (id: string, data: any) => Promise<void>;
  deleteWorkshop: (id: string) => Promise<void>;
  updateWorkshopStatus?: any;

  createSession: (workshopId: string, data: any) => Promise<void>;
  updateSession: (id: string, data: any) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;

  addCenterAdmin: (centerId: string, userId: string) => Promise<void>;
  addCenterStaff: (centerId: string, userId: string) => Promise<void>;

  updateBookingStatus: (id: string, status: string) => Promise<void>;
  requestCancelBooking: (id: string, requestedBy: string) => Promise<void>;     
  approveCancelBooking: (id: string) => Promise<void>;
}

const useMyCenterStore = create<MyCenterState>()(
  persist(
    (set) => ({
      myCenters: [],
      myWorkshops: [],
      mySessions: [],
      myBookings: [],
      centers: [],
      workshops: [],
      sessions: [],

      fetchMyCenterData: async (ownerId) => {
        try {
          // Fetch user's own centers
          const cenRes: any = await apiClient.get(`/client/centers/admin/${ownerId}`);
          const myCenters = Array.isArray(cenRes) ? cenRes : [];

          // Fetch workshops for each center, tagging with centerId
          const workshopResults = await Promise.allSettled(
            myCenters.map((c: any) =>
              apiClient.get(`/client/workshops/center/${c.centerId}`).then((res: any) =>
                (Array.isArray(res) ? res : []).map((w: any) => ({ ...w, centerId: c.centerId }))
              )
            )
          );
          const myWorkshops = workshopResults.flatMap((r) =>
            r.status === "fulfilled" ? r.value : []
          );

          set({ myCenters, myWorkshops, mySessions: [] });
        } catch (e) {
          console.error("fetchMyCenterData error:", e);
        }
      },

      createCenter: async (userId: string, data: any) => {
        if (!userId) throw new Error("Cannot create center: userId is missing");

        // Upload image files to Cloudinary first
        const imageFiles: File[] = data.imageFiles ?? [];
        const uploadedUrls: string[] = [];
        for (const file of imageFiles) {
          const formData = new FormData();
          formData.append("file", file);
          try {
            const res: any = await apiClient.post("/client/files/upload", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            if (res?.imageUrl) uploadedUrls.push(res.imageUrl);
          } catch (err) {
            console.error("Image upload failed:", err);
          }
        }
        const address = data.address
          || [data.subDistrict, data.district, data.province].filter(Boolean).join(", ")
          || "-";

        const payload = {
          centerName: data.name,
          description: data.description || null,
          address,
          subDistrict: data.subDistrict || null,
          district: data.district || null,
          province: data.province || null,
          googleMapLink: data.locationLink || null,
          email: data.email || null,
          line: data.lineId || null,
          facebook: data.facebook || null,
          webSite: data.website || null,
          createdAt: null,
          leaderFirstName: data.communityLeaderFirstName || null,
          leaderLastName: data.communityLeaderLastName || null,
          leaderTelephone: data.communityLeaderTelephone || null,
          centerImages: uploadedUrls,
          telephones: data.telephones ?? [],
        };

        const res = await apiClient.post(`/client/centers/create/user/${userId}`, payload);
        return res;
      },
      updateCenter: async (id, data) => {
        await apiClient.patch(`/client/centers/update/${id}`, data);
      },
      deleteCenter: async (id) => {
        await apiClient.delete(`/client/centers/delete/${id}`);
      },

      createWorkshop: async (centerId, data: any) => {
        await apiClient.post(`/client/workshops/create`, { ...data, centerId });
      },
      updateWorkshop: async (id, data) => {
        await apiClient.patch(`/client/workshops/update/${id}`, data);
      },
      deleteWorkshop: async (id) => {
        await apiClient.delete(`/client/workshops/delete/${id}`);
      },

      createSession: async (workshopId, data: any) => {
         await apiClient.post(`/client/activities/workshop/${workshopId}/create`, data);
      },
      updateSession: async (id, data) => {
        await apiClient.patch(`/client/activities/update/${id}`, data);
      },
      deleteSession: async (id) => {
        await apiClient.delete(`/client/activities/delete/${id}`);
      },

      addCenterAdmin: async (centerId: string, userId: string) => {
        await apiClient.post(`/client/centers/${centerId}/add-admin/${userId}`);
      },
      addCenterStaff: async (centerId: string, userId: string) => {
        await apiClient.post(`/client/centers/${centerId}/add-staff/${userId}`);
      },

      updateBookingStatus: async (id, status) => {
        console.warn("Feature Coming Soon");
        alert("Booking handling Feature Coming Soon");
      },
      requestCancelBooking: async (id, requestedBy) => {
        console.warn("Feature Coming Soon");
        alert("Booking handling Feature Coming Soon");
      },
      approveCancelBooking: async (id) => {
        console.warn("Feature Coming Soon");
        alert("Booking handling Feature Coming Soon");
      }
    }),
    { name: "tg_mycenter" }
  )
);

export default useMyCenterStore;

