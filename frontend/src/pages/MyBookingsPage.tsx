import { useState } from "react";
import { Link, Navigate } from "react-router";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";
import useBookingStore from "../store/bookingStore";
import useAuthStore from "../store/authStore";
import { activities, centers, Booking } from "../data/mockData";

function getStatusIcon(status: Booking["status"]) {
  if (status === "confirmed") return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  if (status === "cancelled") return <XCircle className="w-4 h-4 text-red-400" />;
  if (status === "cancellation_requested") return <AlertCircle className="w-4 h-4 text-orange-500" />;
  return <AlertCircle className="w-4 h-4 text-amber-400" />;
}

function getStatusClass(status: Booking["status"]) {
  if (status === "confirmed") return "bg-green-50 text-green-700 border-green-200";
  if (status === "cancelled") return "bg-red-50 text-red-600 border-red-200";
  if (status === "cancellation_requested") return "bg-orange-50 text-orange-700 border-orange-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
}

export function MyBookingsPage() {
  const user = useAuthStore((s) => s.user);
  const bookings = useBookingStore((s) => s.bookings);
  const cancelBooking = useBookingStore((s) => s.cancelBooking);
  const requestCancellation = useBookingStore((s) => s.requestCancellation);
  const [tab, setTab] = useState<"upcoming" | "all">("upcoming");
  const [cancelId, setCancelId] = useState<string | null>(null);

  if (!user) return <Navigate to="/login" state={{ from: "/my-bookings" }} replace />;

  const enriched = bookings.map((b) => {
    const activity = activities.find((a) => a.id === b.activityId);
    const session = activity?.sessions.find((s) => s.id === b.sessionId);
    const center = activity ? centers.find((c) => c.id === activity.centerId) : undefined;
    
    // Check cancellation restriction
    const currentDate = new Date('2026-03-07');
    let canCancel = false;
    let daysUntil = 0;
    if (session) {
      const sessionDate = new Date(session.date);
      const timeDiff = sessionDate.getTime() - currentDate.getTime();
      daysUntil = Math.ceil(timeDiff / (1000 * 3600 * 24));
      canCancel = daysUntil >= 3;
    }

    return { ...b, activity, session, center, canCancel, daysUntil };
  });

  const displayed =
    tab === "upcoming"
      ? enriched.filter((b) => b.status !== "cancelled")
      : enriched;

  const confirmCancel = () => {
    if (cancelId) {
      const booking = bookings.find((b) => b.id === cancelId);
      if (booking?.status === "confirmed") {
        // Requires mutual approval
        requestCancellation(cancelId, "participant");
        alert("Cancellation requested. Waiting for center approval.");
      } else {
        cancelBooking(cancelId);
      }
      setCancelId(null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-stone-900 mb-1" style={{ fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 700 }}>
            My Bookings
          </h1>
          <p className="text-stone-500" style={{ fontSize: "0.9rem" }}>
            Manage your activity reservations
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-stone-100 rounded-xl p-1 mb-6" style={{ width: "fit-content" }}>
          {(["upcoming", "all"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg transition-all capitalize ${
                tab === t
                  ? "bg-white text-stone-900 shadow-sm font-medium"
                  : "text-stone-500 hover:text-stone-700"
              }`}
              style={{ fontSize: "0.875rem" }}
            >
              {t === "upcoming" ? "Upcoming" : "All Bookings"}
            </button>
          ))}
        </div>

        {/* Bookings list */}
        {displayed.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-stone-900 mb-2" style={{ fontWeight: 500 }}>No bookings yet</h3>
            <p className="text-stone-500 mb-6" style={{ fontSize: "0.875rem" }}>
              Start exploring activities and make your first booking!
            </p>
            <Link
              to="/workshops"
              className="inline-block px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors font-medium"
              style={{ fontSize: "0.875rem" }}
            >
              Explore Activities
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {displayed.map((booking) => (
              <div
                key={booking.id}
                className={`bg-white rounded-2xl border overflow-hidden transition-all ${
                  booking.status === "cancelled" ? "opacity-60 border-stone-100" : "border-stone-100 hover:shadow-md"
                }`}
              >
                <div className="flex">
                  {/* Image */}
                  {booking.activity && (
                    <div className="w-28 sm:w-36 flex-shrink-0">
                      <img
                        src={booking.activity.images?.[0] || ""}
                        alt={booking.activity.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-stone-900 font-semibold truncate"
                          style={{ fontSize: "0.95rem" }}
                        >
                          {booking.activity?.title ?? "Unknown Activity"}
                        </p>
                        <p className="text-stone-400" style={{ fontSize: "0.75rem" }}>
                          Booking #{booking.id}
                        </p>
                      </div>
                      <span
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium flex-shrink-0 ${getStatusClass(
                          booking.status
                        )}`}
                      >
                        {getStatusIcon(booking.status)}
                        {booking.status === "cancellation_requested" ? "Cancellation Requested" : 
                         booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 mb-3">
                      {booking.session && (
                        <div className="flex items-center gap-1.5 text-stone-500" style={{ fontSize: "0.8rem" }}>
                          <Calendar className="w-3.5 h-3.5 text-amber-500" />
                          {new Date(booking.session.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          · {booking.session.time}
                        </div>
                      )}
                      {booking.center && (
                        <div className="flex items-center gap-1.5 text-stone-500" style={{ fontSize: "0.8rem" }}>
                          <MapPin className="w-3.5 h-3.5 text-amber-500" />
                          {booking.center.name}, {booking.center.location}
                        </div>
                      )}
                      <div className="flex items-center gap-4" style={{ fontSize: "0.8rem" }}>
                        <span className="flex items-center gap-1 text-stone-500">
                          <Users className="w-3.5 h-3.5 text-amber-500" />
                          {booking.participants} participant{booking.participants > 1 ? "s" : ""}
                        </span>
                        {booking.activity && (
                          <span className="flex items-center gap-1 text-stone-500">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            {booking.activity.duration}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-amber-700 font-semibold" style={{ fontSize: "0.95rem" }}>
                        ฿{booking.totalPrice.toLocaleString()}
                      </span>
                      {booking.status !== "cancelled" && booking.status !== "cancellation_requested" && (
                        <div className="flex items-center gap-2">
                          {!booking.canCancel && (
                            <span className="text-xs text-red-500 mr-2">Too late to cancel</span>
                          )}
                          <button
                            onClick={() => setCancelId(booking.id)}
                            disabled={!booking.canCancel}
                            className={`flex items-center gap-1 transition-colors ${
                              booking.canCancel ? "text-red-400 hover:text-red-600" : "text-stone-300 cursor-not-allowed"
                            }`}
                            style={{ fontSize: "0.78rem" }}
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Cancel
                          </button>
                        </div>
                      )}
                      {booking.status === "cancellation_requested" && booking.cancelRequestedBy === "center" && (
                         <div className="flex gap-2">
                           <button onClick={() => {
                             useBookingStore.getState().approveCancellation(booking.id);
                           }} className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs font-semibold">Approve Cancellation</button>
                         </div>
                      )}
                      {booking.status === "cancellation_requested" && booking.cancelRequestedBy === "participant" && (
                         <span className="text-xs text-stone-500 italic">Waiting for center approval...</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Dialog */}
      {cancelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-stone-900 text-center mb-2" style={{ fontWeight: 600, fontSize: "1.05rem" }}>
              Cancel Booking?
            </h3>
            <p className="text-stone-500 text-center mb-6" style={{ fontSize: "0.875rem" }}>
              This action cannot be undone. Are you sure you want to cancel this booking?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelId(null)}
                className="flex-1 py-2.5 border border-stone-200 text-stone-600 hover:bg-stone-50 rounded-xl transition-colors"
                style={{ fontSize: "0.875rem" }}
              >
                Keep It
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-medium"
                style={{ fontSize: "0.875rem" }}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
