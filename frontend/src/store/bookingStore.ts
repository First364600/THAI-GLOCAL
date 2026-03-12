
import { create } from "zustand";
import apiClient from "../api/axiosClient";

export interface Booking {
  id: string;
  activityId: string;
  activityName?: string;
  startDate?: string | null;
  userId: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  participants?: number;
  totalPrice?: number;
  createdAt: string;
  qrCodeUrl?: string;
  [key: string]: any;
}

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;

  fetchUserBookings: (userId: string) => Promise<void>;
  createBooking: (userId: string, activityId: string, customOptions?: Record<string, any>) => Promise<Booking | null>;      
  cancelBooking: (bookingId: string) => Promise<void>;
  requestCancelBooking: (bookingId: string, requestedBy: string) => Promise<void>;
  approveCancelBooking: (bookingId: string) => Promise<void>;
  verifyBooking: (qrData: string) => Promise<boolean>;
}

const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  isLoading: false,
  error: null,

  fetchUserBookings: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.get(`/client/activity-registers/user/${userId}`);
      const raw: any[] = Array.isArray(res) ? res : [];
      const bookings: Booking[] = raw.filter(Boolean).map((r) => ({
        id: String(r.activityRegisterId ?? ""),
        activityId: String(r.activityId ?? ""),
        activityName: r.activityName ?? "",
        startDate: r.startDate ?? null,
        userId: String(userId),
        status: r.status ? String(r.status).toLowerCase() as Booking["status"] : "pending",
        participants: r.numberOfRegister ?? 1,
        totalPrice: r.totalPrice ?? 0,
        createdAt: "",
      }));
      set({ bookings });
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
      await apiClient.post(`/client/activity-registers/create/activity/${activityId}/user/${userId}`, payload);
      await get().fetchUserBookings(userId);
      return null;
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
      await apiClient.patch(`/client/activity-registers/${bookingId}/cancel`);
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
  },

  requestCancelBooking: async (bookingId) => {
    await get().cancelBooking(bookingId);
  },

  approveCancelBooking: async (bookingId) => {
    await get().cancelBooking(bookingId);
  },
}));

export default useBookingStore;

