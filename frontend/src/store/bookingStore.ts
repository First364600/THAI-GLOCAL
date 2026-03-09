
import { create } from "zustand";
import apiClient from "../api/axiosClient";

export interface Booking {
  id: string;
  activityId: string;
  userId: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  qrCodeUrl?: string; // Could be mapped from Spring Boot later
  [key: string]: any;
}

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;

  fetchUserBookings: (userId: string) => Promise<void>;
  createBooking: (userId: string, activityId: string, customOptions?: Record<string, any>) => Promise<Booking | null>;      
  cancelBooking: (bookingId: string) => Promise<void>;
  verifyBooking: (qrData: string) => Promise<boolean>;
}

const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  isLoading: false,
  error: null,

  fetchUserBookings: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      // ActivityRegisters mapping
      const res = await apiClient.get(`/client/activity-registers/user/${userId}`);
      // apiClient interceptor already unwraps response.data
      const data = Array.isArray(res) ? res : (res as any);
      if (data) set({ bookings: data });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch bookings" });
    } finally {
      set({ isLoading: false });
    }
  },

  createBooking: async (userId, activityId, customOptions) => {
    set({ isLoading: true, error: null });
    try {
      const payload = { ...customOptions };
      const res = await apiClient.post(`/client/activity-registers/create/activity/${activityId}/user/${userId}`, payload);
      
      // apiClient interceptor already unwraps response.data
      const newBooking = res as any;
      set((state) => ({ bookings: [...state.bookings, newBooking] }));
      return newBooking;
    } catch (err: any) {
      set({ error: err.message || "Failed to create booking" });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  cancelBooking: async (bookingId) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/client/activity-registers/delete/${bookingId}`); // Verify if delete or update status mapping
      set((state) => ({
        bookings: state.bookings.filter(b => b.id !== bookingId)
      }));
    } catch (err: any) {
      set({ error: err.message || "Failed to cancel booking" });
    } finally {
      set({ isLoading: false });
    }
  },

  verifyBooking: async (qrData) => {
    console.warn("verifyBooking mapping missing in backend");
    return true; 
  }
}));

export default useBookingStore;

