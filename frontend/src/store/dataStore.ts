import { create } from "zustand";
import apiClient from "../api/axiosClient";
import type { Activity, Center } from "../data/mockData";

interface DataState {
  workshops: Activity[];
  activities: Activity[];
  centers: Center[];
  isLoading: boolean;
  fetchData: () => Promise<void>;
}

const useDataStore = create<DataState>((set) => ({
  workshops: [],
  activities: [],
  centers: [],
  isLoading: false,
  fetchData: async () => {
    set({ isLoading: true });
    try {
      const centersRes: any = await apiClient.get("/client/centers");
      const rawCenters: any[] = Array.isArray(centersRes) ? centersRes : [];

      const mappedCenters: Center[] = rawCenters.map((c: any) => ({
        id: String(c.centerId),
        name: c.centerName ?? "",
        nameTh: "",
        location: [c.district, c.province].filter(Boolean).join(", ") || c.address || "",
        province: c.province ?? "",
        description: c.description ?? "",
        images: c.centerImages ?? [],
        tags: [],
      }));

      // Fetch workshops per center in parallel (needed to know centerId per workshop)
      const workshopResults = await Promise.allSettled(
        mappedCenters.map((c) => apiClient.get(`/client/workshops/center/${c.id}`))
      );

      const allWorkshops: Activity[] = workshopResults.flatMap((r, i) => {
        if (r.status !== "fulfilled") return [];
        const list: any[] = Array.isArray(r.value) ? r.value : [];
        return list.map((w: any) => ({
          id: String(w.workshopId),
          centerId: mappedCenters[i].id,
          title: w.workshopName ?? "",
          titleTh: "",
          category: w.workshopType ?? "",
          description: w.description ?? "",
          images: w.workshopImages ?? [],
          duration: "",
          maxParticipants: w.MemberCapacity ?? 0,
          price: w.price ?? 0,
          sessions: [], // loaded lazily on detail page
        }));
      });

      set({ centers: mappedCenters, workshops: allWorkshops, activities: allWorkshops, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch public data", error);
      set({ isLoading: false });
    }
  },
}));
export default useDataStore;
