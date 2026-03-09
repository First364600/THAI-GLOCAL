import { create } from "zustand";
import apiClient from "../api/axiosClient";

// Normalized types matching what UI pages expect
export interface Center { [key: string]: any; }
export interface Activity { [key: string]: any; }
export interface Session { [key: string]: any; }
export interface Booking { [key: string]: any; }

interface DataState {
  workshops: Activity[];
  activities: Activity[];
  centers: Center[];
  categories: string[];
  provinces: string[];
  fetchData: () => Promise<void>;
  isLoading: boolean;
}

// Map API CenterResponse → UI Center shape
function mapCenter(c: any): Center {
  return {
    ...c,
    id: String(c.centerId ?? c.id),
    name: c.centerName ?? c.name,
    nameTh: c.centerNameTh ?? c.nameTh ?? "",
    location: [c.district, c.province].filter(Boolean).join(", "),
    images: c.centerImages ?? c.images ?? [],
    tags: c.tags ?? [],
    totalActivities: 0, // will be filled after workshops load
  };
}

// Map API WorkshopResponse → UI Activity shape (mock "activity" = API "workshop")
function mapWorkshop(w: any, centerId?: string): Activity {
  return {
    ...w,
    id: String(w.workshopId ?? w.id),
    centerId: centerId ?? String(w.centerId ?? ""),
    title: w.workshopName ?? w.title ?? w.name,
    titleTh: w.workshopNameTh ?? w.titleTh ?? "",
    category: w.workshopType ?? w.category ?? "",
    images: w.workshopImages ?? w.images ?? [],
    maxParticipants: w.memberCapacity ?? w.maxParticipants ?? 0,
    duration: w.duration ?? "",
    price: w.price ?? 0,
    sessions: (w.activities ?? w.sessions ?? []).map((a: any) => ({
      ...a,
      id: String(a.activityId ?? a.id),
      name: a.activityName ?? a.name ?? "",
      date: a.startDate ?? a.date ?? "",
      availableSpots: a.registerCapacity ?? a.availableSpots ?? 0,
      totalSpots: a.registerCapacity ?? a.totalSpots ?? 0,
    })),
  };
}

const useDataStore = create<DataState>((set) => ({
  workshops: [],
  activities: [],
  centers: [],
  categories: ["All"],
  provinces: ["All Provinces"],
  isLoading: false,
  fetchData: async () => {
    set({ isLoading: true });
    try {
      // Fetch all centers
      const cRes: any = await apiClient.get("/client/centers").catch(() => []);
      const rawCenters = Array.isArray(cRes) ? cRes : [];
      const centers = rawCenters.map(mapCenter);

      // Fetch workshops per center to get centerId association
      const workshopResults = await Promise.allSettled(
        centers.map((c) =>
          apiClient.get(`/client/workshops/center/${c.id}`).then((res: any) =>
            (Array.isArray(res) ? res : []).map((w: any) => mapWorkshop(w, c.id))
          )
        )
      );
      const activities = workshopResults.flatMap((r) =>
        r.status === "fulfilled" ? r.value : []
      );

      // Update totalActivities per center
      for (const c of centers) {
        c.totalActivities = activities.filter((a) => String(a.centerId) === String(c.id)).length;
      }

      // Extract unique categories and provinces
      const catSet = new Set<string>();
      activities.forEach((a) => { if (a.category) catSet.add(a.category); });
      const provSet = new Set<string>();
      centers.forEach((c) => { if (c.province) provSet.add(c.province); });

      set({
        centers,
        workshops: activities,
        activities,
        categories: ["All", ...Array.from(catSet)],
        provinces: ["All Provinces", ...Array.from(provSet)],
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch public data", error);
      set({ isLoading: false });
    }
  },
}));
export default useDataStore;
