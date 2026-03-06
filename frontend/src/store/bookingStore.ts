import { create } from "zustand";
import { Booking } from "../data/mockData";

interface BookingState {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
  requestCancellation: (bookingId: string, requestedBy: "participant" | "center") => void;
  approveCancellation: (bookingId: string) => void;
  rejectCancellation: (bookingId: string) => void;
}

const useBookingStore = create<BookingState>((set) => ({
  bookings: [
    {
      id: "b0",
      activityId: "a3",
      sessionId: "s3a",
      name: "Somchai Jaidee",
      email: "somchai@example.com",
      phone: "081-234-5678",
      participants: 2,
      totalPrice: 2700,
      status: "confirmed",
      createdAt: "2026-03-05T10:30:00Z",
      notes: "We are vegetarian, please advise",
    },
  ],
  addBooking: (booking) =>
    set((state) => ({ bookings: [...state.bookings, booking] })),
  cancelBooking: (bookingId) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId ? { ...b, status: "cancelled" } : b
      ),
    })),
  requestCancellation: (bookingId, requestedBy) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId
          ? { ...b, status: "cancellation_requested", cancelRequestedBy: requestedBy }
          : b
      ),
    })),
  approveCancellation: (bookingId) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId
          ? { ...b, status: "cancelled", cancelRequestedBy: undefined }
          : b
      ),
    })),
  rejectCancellation: (bookingId) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId
          ? { ...b, status: "confirmed", cancelRequestedBy: undefined }
          : b
      ),
    })),
}));

export default useBookingStore;
