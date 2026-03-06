import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserCenter {
  id: string;
  ownerId: string;
  name: string;
  nameTh: string;
  subDistrict: string;
  district: string;
  province: string;
  locationLink: string;
  telephones: string[];
  email: string;
  lineId: string;
  facebook: string;
  website: string;
  description: string;
  communityLeaderFirstName: string;
  communityLeaderLastName: string;
  communityLeaderTelephone: string;
  images: string[];
}

export interface UserWorkshop {
  id: string;
  centerId: string;
  ownerId: string;
  title: string;
  titleTh: string;
  category: string;
  description: string;
  images?: string[];
  duration: string;
  maxParticipants: number;
  price: number;
  difficulty?: "Beginner" | "Intermediate" | "Advanced" | string;

  // Auto-generation properties
  recurringDays?: string[];
  sessionType?: string;
  sessionRounds?: { start: string; end: string }[];
  defaultRegistrationCapacity?: number;
  defaultActivityName?: string;
  defaultActivityDescription?: string;
}

export interface UserSession {
  id: string;
  workshopId: string;
  centerId: string;
  ownerId: string;
  name: string; // e.g. "Pottery for Beginners - March"
  description: string;
  date: string;        // "YYYY-MM-DD"
  startTime: string;   // "HH:MM"
  endTime: string;     // "HH:MM"
  registrationDeadline: string; // "YYYY-MM-DD"
  maxParticipants: number;
  notes: string;
  status: "upcoming" | "full" | "cancelled" | "completed";
}

export interface BookingRequest {
  id: string;
  sessionId: string;
  workshopId: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  telephone: string;
  participants: number;
  paymentStatus: "pending" | "paid";
  status: "pending" | "approved" | "rejected" | "confirmed" | "cancelled" | "cancellation_requested";
  cancelRequestedBy?: "participant" | "center";
}

interface MyCenterState {
  centers: UserCenter[];
  workshops: UserWorkshop[];
  sessions: UserSession[];
  bookings: BookingRequest[];
  // Center
  createCenter: (data: Omit<UserCenter, "id">) => UserCenter;
  updateCenter: (id: string, data: Partial<Omit<UserCenter, "id" | "ownerId">>) => void;
  deleteCenter: (id: string) => void;
  // Workshop
  createWorkshop: (data: Omit<UserWorkshop, "id">) => UserWorkshop;
  updateWorkshop: (id: string, data: Partial<Omit<UserWorkshop, "id" | "centerId" | "ownerId">>) => void;
  deleteWorkshop: (id: string) => void;
  // Session
  createSession: (data: Omit<UserSession, "id">) => UserSession;
  updateSession: (id: string, data: Partial<Omit<UserSession, "id" | "workshopId" | "centerId" | "ownerId">>) => void;
  deleteSession: (id: string) => void;
  generateWeeklySessions: (workshopId: string) => void;
  // Booking
  updateBookingStatus: (id: string, status: BookingRequest["status"]) => void;
  createMockBooking: (sessionId: string, workshopId: string) => void;
  // Queries
  getCenterByOwner: (ownerId: string) => UserCenter | undefined;
  getCentersByOwner: (ownerId: string) => UserCenter[];
  getWorkshopsByCenter: (centerId: string) => UserWorkshop[];
  getWorkshopById: (id: string) => UserWorkshop | undefined;
  getSessionsByWorkshop: (workshopId: string) => UserSession[];
  getBookingsBySession: (sessionId: string) => BookingRequest[];

  requestCancellation: (id: string, requestedBy: "center" | "participant") => void;
  approveCancellation: (id: string) => void;
}

const useMyCenterStore = create<MyCenterState>()(
  persist(
    (set, get) => ({
      centers: [],
      workshops: [],
      sessions: [],
      bookings: [
        // Mock data for demo purposes
        {
          id: "bk-1",
          sessionId: "dummy-session-id",
          workshopId: "dummy-workshop-id",
          createdAt: new Date().toISOString(),
          firstName: "Somchai",
          lastName: "Jaidee",
          telephone: "0812345678",
          participants: 2,
          paymentStatus: "pending",
          status: "pending",
        }
      ],

      createCenter: (data) => {
        const center: UserCenter = { ...data, id: crypto.randomUUID() };
        set((s) => ({ centers: [...s.centers, center] }));
        return center;
      },

      updateCenter: (id, data) =>
        set((s) => ({
          centers: s.centers.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),

      deleteCenter: (id) =>
        set((s) => ({
          centers: s.centers.filter((c) => c.id !== id),
          workshops: s.workshops.filter((w) => w.centerId !== id),
        })),

      createWorkshop: (data) => {
        const workshop: UserWorkshop = { ...data, id: crypto.randomUUID() };
        set((s) => ({ workshops: [...s.workshops, workshop] }));
        return workshop;
      },

      updateWorkshop: (id, data) =>
        set((s) => ({
          workshops: s.workshops.map((w) => (w.id === id ? { ...w, ...data } : w)),
        })),

      deleteWorkshop: (id) =>
        set((s) => ({
          workshops: s.workshops.filter((w) => w.id !== id),
          sessions: s.sessions.filter((ss) => ss.workshopId !== id),
        })),

      createSession: (data) => {
        const session: UserSession = { ...data, id: crypto.randomUUID() };
        set((s) => ({ sessions: [...s.sessions, session] }));
        return session;
      },

      updateSession: (id, data) =>
        set((s) => ({
          sessions: s.sessions.map((ss) => (ss.id === id ? { ...ss, ...data } : ss)),
        })),

      deleteSession: (id) =>
        set((s) => ({ sessions: s.sessions.filter((ss) => ss.id !== id) })),

      generateWeeklySessions: (workshopId) => {
        set((s) => {
          const workshop = s.workshops.find(w => w.id === workshopId);
          if (!workshop || !workshop.recurringDays || workshop.recurringDays.length === 0 || !workshop.sessionRounds || workshop.sessionRounds.length === 0) {
            return s; // Nothing to generate
          }

          // Calculate current week (Monday to Sunday)
          const now = new Date();
          const dayOfWeek = now.getDay(); // 0 is Sunday
          // Let's get the most recent or upcoming Monday
          const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
          
          const monday = new Date(now);
          monday.setDate(now.getDate() + diffToMon);
          monday.setHours(0, 0, 0, 0);

          const daysMap: Record<string, number> = {
            "Mon": 0, "Tue": 1, "Wed": 2, "Thu": 3, "Fri": 4, "Sat": 5, "Sun": 6
          };

          const newSessions: UserSession[] = [];
          const existingSessionsForWorkshop = s.sessions.filter(ss => ss.workshopId === workshopId);

          for (const recDay of workshop.recurringDays) {
            if (daysMap[recDay] !== undefined) {
              const targetDate = new Date(monday);
              targetDate.setDate(monday.getDate() + daysMap[recDay]);
              
              const dateStr = targetDate.toISOString().split("T")[0];
              
              // Only generate if date is today or future
              const todayStr = new Date().toISOString().split("T")[0];
              if (dateStr < todayStr) continue;

              for (const round of workshop.sessionRounds) {
                // Check if already exists
                const exists = existingSessionsForWorkshop.some(
                  ss => ss.date === dateStr && ss.startTime === round.start && ss.endTime === round.end
                );
                
                if (!exists) {
                  newSessions.push({
                    id: crypto.randomUUID(),
                    workshopId: workshop.id,
                    centerId: workshop.centerId,
                    ownerId: workshop.ownerId,
                    name: workshop.defaultActivityName || workshop.title,
                    description: workshop.defaultActivityDescription || workshop.description,
                    date: dateStr,
                    startTime: round.start,
                    endTime: round.end,
                    registrationDeadline: dateStr, // Could apply a distinct offset if needed
                    maxParticipants: workshop.defaultRegistrationCapacity || workshop.maxParticipants || 10,
                    notes: "Auto-generated weekly slot",
                    status: "upcoming"
                  });
                }
              }
            }
          }

          return {
            ...s,
            sessions: [...s.sessions, ...newSessions]
          };
        });
      },

      updateBookingStatus: (id, status) =>
        set((s) => ({
          bookings: s.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
        })),

      createMockBooking: (sessionId, workshopId) =>
        set((s) => {
          const names = ["Somchai Jaidee", "Manee Srisuk", "Niran Pradu", "Wipawee Boon", "Kanya Ratan"];
          const randomName = names[Math.floor(Math.random() * names.length)].split(" ");
          
          const newBooking: BookingRequest = {
            id: crypto.randomUUID(),
            sessionId,
            workshopId,
            createdAt: new Date().toISOString(),
            firstName: randomName[0],
            lastName: randomName[1],
            telephone: "08" + Math.floor(Math.random() * 100000000).toString().padStart(8, '0'),
            participants: Math.floor(Math.random() * 3) + 1,
            paymentStatus: "pending",
            status: "pending",
          };
          
          return { bookings: [...s.bookings, newBooking] };
        }),

      getCenterByOwner: (ownerId) => get().centers.find((c) => c.ownerId === ownerId),
      getCentersByOwner: (ownerId) => get().centers.filter((c) => c.ownerId === ownerId),

      getWorkshopsByCenter: (centerId) =>
        get().workshops.filter((w) => w.centerId === centerId),

      getWorkshopById: (id) => get().workshops.find((w) => w.id === id),

      getSessionsByWorkshop: (workshopId) =>
        get().sessions
          .filter((ss) => ss.workshopId === workshopId)
          .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)),

      getBookingsBySession: (sessionId) =>
        get().bookings.filter((b) => b.sessionId === sessionId),

      requestCancellation: (id, requestedBy) =>
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === id ? { ...b, status: "cancellation_requested", cancelRequestedBy: requestedBy } : b
          ),
        })),

      approveCancellation: (id) =>
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === id ? { ...b, status: "cancelled", cancelRequestedBy: undefined } : b
          ),
        })),
    }),
    { name: "tg_my_center" }
  )
);

export default useMyCenterStore;
