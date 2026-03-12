import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../api/axiosClient";
import { activities } from "../data/mockData";

export interface UserCenter { [key: string]: any; }
export interface UserWorkshop { [key: string]: any; }
export interface UserSession { [key: string]: any; }
export interface UserBooking { [key: string]: any; }

interface MyCenterState {
  myCenters: UserCenter[];
  myWorkshops: UserWorkshop[];
  mySessions: UserSession[];
  myBookings: any[];

  centers: UserCenter[];
  workshops: UserWorkshop[];
  sessions: UserSession[];

  fetchMyCenterData: (ownerId: string) => Promise<void>;

  createCenter: (userId: string, data: any) => Promise<void>;
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
  requestCancelBooking: (id: string) => Promise<void>;     
  approveCancelBooking: (id: string) => Promise<void>;

  updateCenterStatus: (centerId: string, status: string) => Promise<void>;
  clearAllData: () => void;
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
          const centersRes: any = await apiClient.get(`/client/centers/admin/${ownerId}`);
          const raw: any[] = Array.isArray(centersRes) ? centersRes : [];

          // Map server field names to frontend form field names
          const mapped = raw.map((c: any) => ({
            id: String(c.centerId),
            centerName: c.centerName,
            description: c.description,
            address: c.address || `${c.subDistrict}, ${c.district}, ${c.province}`,
            subDistrict: c.subDistrict,
            district: c.district,
            province: c.province,
            locationLink: c.googleMapLink,
            email: c.email,
            lineId: c.line,
            facebook: c.facebook,
            website: c.webSite,
            communityLeaderFirstName: c.leaderFirstName,
            communityLeaderLastName: c.leaderLastName,
            communityLeaderTelephone: c.leaderTelephone,
            images: c.centerImages ?? [],
            telephones: c.telephones ?? [],
            createdAt: c.createdAt,
          }));

          // Fetch workshops for each center in parallel
          const workshopResults = await Promise.allSettled(
            mapped.map((c) => apiClient.get(`/client/workshops/center/${c.id}`))
          );
          const allWorkshops: any[] = workshopResults.flatMap((r, i) => {
            if (r.status !== "fulfilled") return [];
            const list: any[] = Array.isArray(r.value) ? r.value : [];
            return list.map((w: any) => ({
              id: String(w.workshopId),
              centerId: mapped[i].id,
              title: w.workshopName,
              description: w.description,
              price: w.price ?? 0,
              maxParticipants: w.MemberCapacity ?? 0,
              category: w.workshopType ?? "",
              images: w.workshopImages ?? [],
              duration: "",
              titleTh: "",
              recurringDays: [],
              sessionType: "Daily Time Slots",
              sessionRounds: [{ start: "13:00", end: "16:00" }],
              defaultActivityName: "",
              defaultActivityDescription: "",
              defaultRegistrationCapacity: w.MemberCapacity ?? 10,
            }));
          });

          // Fetch activities for each workshop in parallel
          const activityResults = await Promise.allSettled(
            allWorkshops.map((w) => apiClient.get(`/client/activities/workshop/${w.id}`))
          );
          console.log("activity result", activityResults);
          const allSessions: any[] = [];
          const allBookings: any[] = [];

          activityResults.forEach((r, i) => {
            if (r.status !== "fulfilled") return;
            const list: any[] = Array.isArray(r.value) ? r.value : [];
            list.forEach((a: any) => {
              const startDT: string = a.startDate ?? "";
              const endDT: string = a.endDate ?? "";
              const regDT: string = a.dateCanRegister ?? "";
              
              // Map activity to session
              allSessions.push({
                id: String(a.activityId),
                workshopId: allWorkshops[i].id,
                name: a.activityName,
                description: a.description ?? "",
                date: startDT ? startDT.slice(0, 10) : "",
                startTime: startDT ? startDT.slice(11, 16) : "",
                endTime: endDT ? endDT.slice(11, 16) : "",
                registrationDeadline: regDT ? regDT.slice(0, 10) : "",
                maxParticipants: a.registerCapacity ?? 0,
                notes: "",
                status: "upcoming" as UserSession["status"],
              });
              
              // Map registerInfo to bookings
              if (a.registerInfo && Array.isArray(a.registerInfo)) {
                a.registerInfo.forEach((reg: any) => {
                  allBookings.push({
                    id: String(reg.activityRegisterId),
                    sessionId: String(a.activityId),
                    userId: reg.user?.userId ?? reg.userId,
                    username: reg.username,
                    firstName: reg.user?.firstName ?? "",
                    lastName: reg.user?.lastName ?? "",
                    email: reg.user?.email ?? "",
                    telephone: reg.user?.telephone ?? "",
                    address: reg.user?.address ?? "",
                    numberOfParticipants: reg.numberOfRegister ?? 1,
                    numberOfRegister: reg.numberOfRegister ?? 1,
                    status: reg.status?.toLowerCase() ?? "pending",
                    totalPrice: reg.totalPrice ?? 0,
                    createdAt: reg.user?.createdAt ?? new Date(),
                  });
                });
              }
              console.log("all booking", allBookings);
            });
          });

          set({ myCenters: mapped, myWorkshops: allWorkshops, mySessions: allSessions, myBookings: allBookings });
        } catch (e) {
          console.error(e);
        }
      },

      createCenter: async (userId: string, data: any) => {
        const payload = {
          centerName: data.name,
          description: data.description,
          subDistrict: data.subDistrict,
          district: data.district,
          province: data.province,
          address: [data.subDistrict, data.district, data.province].filter(Boolean).join(', ') || data.address || '-',
          googleMapLink: data.locationLink,
          email: data.email,
          line: data.lineId,
          facebook: data.facebook,
          webSite: data.website,
          leaderFirstName: data.communityLeaderFirstName,
          leaderLastName: data.communityLeaderLastName,
          leaderTelephone: data.communityLeaderTelephone,
          centerImages: data.images,
          telephones: data.telephones,
        };
        await apiClient.post(`/client/centers/create/user/${userId}`, payload);
      },
      updateCenter: async (id, data: any) => {
        const payload: any = {};
        if (data.name !== undefined) payload.centerName = data.name;
        if (data.description !== undefined) payload.description = data.description;
        if (data.subDistrict !== undefined) payload.subDistrict = data.subDistrict;
        if (data.district !== undefined) payload.district = data.district;
        if (data.province !== undefined) payload.province = data.province;
        if (data.subDistrict || data.district || data.province) {
          payload.address = [data.subDistrict, data.district, data.province].filter(Boolean).join(', ') || data.address;
        }
        if (data.locationLink !== undefined) payload.googleMapLink = data.locationLink;
        if (data.email !== undefined) payload.email = data.email;
        if (data.lineId !== undefined) payload.line = data.lineId;
        if (data.facebook !== undefined) payload.facebook = data.facebook;
        if (data.website !== undefined) payload.webSite = data.website;
        if (data.communityLeaderFirstName !== undefined) payload.leaderFirstName = data.communityLeaderFirstName;
        if (data.communityLeaderLastName !== undefined) payload.leaderLastName = data.communityLeaderLastName;
        if (data.communityLeaderTelephone !== undefined) payload.leaderTelephone = data.communityLeaderTelephone;
        if (data.images !== undefined) payload.centerImages = data.images;
        if (data.telephones !== undefined) payload.telephones = data.telephones;
        // Pass through any already-mapped fields (from adminStore)
        const serverFields = ['centerName','address','googleMapLink','line','webSite','leaderFirstName','leaderLastName','leaderTelephone','centerImages'];
        serverFields.forEach(f => { if (data[f] !== undefined) payload[f] = data[f]; });
        await apiClient.patch(`/client/centers/update/${id}`, payload);
      },
      deleteCenter: async (id) => {
        await apiClient.delete(`/client/centers/delete/${id}`);
      },

      createWorkshop: async (centerId, data: any) => {
        await apiClient.post(`/client/workshops/create`, {
          workshopName: data.workshopName ?? data.title,
          description: data.description,
          price: data.price,
          memberCapacity: data.memberCapacity ?? data.MemberCapacity ?? data.maxParticipants,
          workshopType: data.workshopType ?? data.category,
          centerId: Number(centerId),
          workshopImages: data.workshopImages ?? data.images ?? [],
          activities: data.activities ?? null,
        });
      },
      updateWorkshop: async (id, data) => {
        await apiClient.patch(`/client/workshops/update/${id}`, {
          workshopName: data.workshopName ?? data.title,
          description: data.description,
          price: data.price,
          memberCapacity: data.memberCapacity ?? data.MemberCapacity ?? data.maxParticipants,
          workshopType: data.workshopType ?? data.category,
          workshopImages: data.workshopImages ?? data.images,
        });
      },
      deleteWorkshop: async (id) => {
        await apiClient.delete(`/client/workshops/delete/${id}`);
      },

      createSession: async (workshopId, data: any) => {
        const buildDateTime = (date: string, time: string) => `${date}T${time}${time.length === 5 ? ":00" : ""}`;
        await apiClient.post(`/client/activities/workshop/${workshopId}/create`, {
          activityName: data.activityName ?? data.name,
          description: data.description,
          startDate: buildDateTime(data.date, data.startTime ?? "09:00"),
          endDate: buildDateTime(data.date, data.endTime ?? "18:00"),
          dateCanRegister: buildDateTime(data.registrationDeadline ?? data.date, "23:59"),
          price: data.price ?? 0,
          registerCapacity: data.registerCapacity ?? data.maxParticipants,
        });
      },
      updateSession: async (id, data: any) => {
        const buildDateTime = (date: string, time: string) => `${date}T${time}${time.length === 5 ? ":00" : ""}`;
        await apiClient.patch(`/client/activities/update/${id}`, {
          activityName: data.activityName ?? data.name,
          description: data.description,
          startDate: buildDateTime(data.date, data.startTime ?? "09:00"),
          endDate: buildDateTime(data.date, data.endTime ?? "18:00"),
          dateCanRegister: buildDateTime(data.registrationDeadline ?? data.date, "23:59"),
          price: data.price ?? 0,
          registerCapacity: data.registerCapacity ?? data.maxParticipants,
        });
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
        try {
          if (status === "confirmed") {
            await apiClient.patch(`/client/activity-registers/${id}/confirm`);
          } else if (status === "rejected") {
            await apiClient.patch(`/client/activity-registers/${id}/reject`);
          } else if (status === "request_cancel") {
            await apiClient.patch(`/client/activity-registers/${id}/request-cancel`);
          } else if (status === "approve_cancel") {
            await apiClient.patch(`/client/activity-registers/${id}/approve-cancel`);
          } else if (status === "reject_cancel") {
            await apiClient.patch(`/client/activity-registers/${id}/reject-cancel`);
          } else if (status === "completed") {
            await apiClient.patch(`/client/activity-registers/${id}/complete`);
          }
          
          await new Promise(resolve => setTimeout(resolve, 500));
          const ownerId = localStorage.getItem("userId");
          if (ownerId) {
            const state = useMyCenterStore.getState();
            await state.fetchMyCenterData(ownerId);
          }
        } catch (e) {
          console.error("Error updating booking status:", e);
          throw e;
        }
      },
      requestCancelBooking: async (id) => {
        try {
          await apiClient.patch(`/client/activity-registers/${id}/cancel`);
          const ownerId = localStorage.getItem("userId");
          if (ownerId) {
            const state = useMyCenterStore.getState();
            await state.fetchMyCenterData(ownerId);
          }
        } catch (e) {
          console.error("Error requesting cancellation:", e);
          throw e;
        }
      },
      approveCancelBooking: async (id) => {
        try {
          await apiClient.patch(`/client/activity-registers/${id}/cancel`);
          const ownerId = localStorage.getItem("userId");
          if (ownerId) {
            const state = useMyCenterStore.getState();
            await state.fetchMyCenterData(ownerId);
          }
        } catch (e) {
          console.error("Error approving cancellation:", e);
          throw e;
        }
      },

      updateCenterStatus: async (centerId: string, status: string) => {
        await apiClient.patch(`/client/centers/${centerId}/status?status=${status}`);
      },
      clearAllData: () => {
        set({
          myCenters: [],
          myWorkshops: [],
          mySessions: [],
          myBookings: [],
          // เพิ่มทุก property ที่ต้องการล้าง
        });
      }
    }),
    { name: "tg_mycenter" }
  )
);

export default useMyCenterStore;

