import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  X
} from "lucide-react";
import useBookingStore from "../store/bookingStore";
import useAuthStore from "../store/authStore";
import useDataStore from "../store/dataStore";
import useMyCenterStore from "../store/myCenterStore";

function normalizeStatus(s: any): string {
  if (!s) return "pending";
  return String(s).toLowerCase();
}

function getStatusIcon(status: string) {
  if (status === "confirmed") return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  if (status === "cancelled") return <XCircle className="w-4 h-4 text-red-400" />;
  if (status === "completed") return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
  if (status === "cancellation_requested") return <AlertCircle className="w-4 h-4 text-orange-400" />;
  return <AlertCircle className="w-4 h-4 text-amber-400" />;
}

function getStatusClass(status: string) {
  if (status === "confirmed") return "bg-green-50 text-green-700 border-green-200";
  if (status === "cancelled") return "bg-red-50 text-red-600 border-red-200";
  if (status === "completed") return "bg-blue-50 text-blue-700 border-blue-200";
  if (status === "cancellation_requested") return "bg-orange-50 text-orange-700 border-orange-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
}

function parseDate(startDate: string | null | undefined): { date: string; time: string } {
  if (!startDate) return { date: "", time: "" };
  const s = String(startDate);
  return { date: s.slice(0, 10), time: s.slice(11, 16) };
}

export function MyBookingsPage() {
  const user = useAuthStore((s) => s.user);
  const bookings = useBookingStore((s) => s.bookings);
  const fetchUserBookings = useBookingStore((s) => s.fetchUserBookings);
  const cancelBooking = useBookingStore((s) => s.cancelBooking);
  const requestCancellation = useBookingStore((s) => s.requestCancelBooking);
  const { workshops, centers, fetchData } = useDataStore();
  const store = useMyCenterStore();
  const [tab, setTab] = useState<"upcoming" | "all">("upcoming");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" state={{ from: "/my-bookings" }} replace />;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchUserBookings(String(user.id));
    if (workshops.length === 0) fetchData();
  }, [user.id]);

  const enriched = bookings
    .filter((b) => b != null)
    .map((b) => {
      const status = normalizeStatus(b.status);
      const activityId = String(b.activityId ?? "");
      const workshop = workshops.find((w) => String(w.id) === activityId);
      const center = workshop ? centers.find((c) => c.id === workshop.centerId) : undefined;
      const { date, time } = parseDate(b.startDate);

      const currentDate = new Date();
      let canCancel = false;
      let daysUntil = 0;
      if (date) {
        const sessionDate = new Date(date);
        const timeDiff = sessionDate.getTime() - currentDate.getTime();
        daysUntil = Math.ceil(timeDiff / (1000 * 3600 * 24));
        canCancel = daysUntil >= 3;
      }

      return {
        id: b.id,
        activityId: activityId,
        activityName: b.activityName || workshop?.title || "Unknown Activity",
        images: workshop?.images ?? [],
        duration: workshop?.duration ?? "",
        date,
        time,
        center,
        status,
        participants: b.participants ?? 1,
        totalPrice: b.totalPrice ?? 0,
        canCancel,
        daysUntil,
      };
    });

  const displayed =
    tab === "upcoming"
      ? enriched.filter((b) => b.status !== "completed")  // ← เปลี่ยนให้เก็บ cancelled ไว้
      : enriched;

  const confirmCancel = () => {
    if (cancelId) {
      cancelBooking(cancelId);
      setCancelId(null);
    }
  };

  const handleApproveCancel = async (bookingId: string) => {
    try {
      setLoadingId(bookingId);
      await store.updateBookingStatus(bookingId, "approve_cancel");
      setErrorMessage(null);
      // Refresh bookings
      if (user) {
        await fetchUserBookings(String(user.id));
      }
      // Show success message
      alert("✓ Cancellation approved successfully");
    } catch (e) {
      setErrorMessage("Failed to approve cancellation. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleRejectCancel = async (bookingId: string) => {
    try {
      setLoadingId(bookingId);
      await store.updateBookingStatus(bookingId, "reject_cancel");
      setErrorMessage(null);
      // Refresh bookings
      if (user) {
        await fetchUserBookings(String(user.id));
      }
      // Show notification dialog
      alert("✓ Cancellation rejected!\n\nWe've notified the center admin. If the user has any issues, they can contact the center admin directly.");
    } catch (e) {
      setErrorMessage("Failed to reject cancellation. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-700 text-sm font-medium">{errorMessage}</p>
            </div>
            <button 
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

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
                className={`bg-white rounded-2xl border overflow-hidden transition-all cursor-pointer hover:shadow-lg ${
                  booking.status === "cancelled" ? "opacity-60 border-stone-100" : "border-stone-100 hover:shadow-md"
                }`}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  {booking.images.length > 0 && (
                    <div className="w-full sm:w-28 sm:shrink-0">
                      <img
                        src={booking.images[0]}
                        alt={booking.activityName}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => navigate(`/workshops/${booking.activityId}`)}
                      />
                    </div>
                  )}

                  <div className="flex-1 p-4 flex flex-col gap-4">
                    <div 
                      onClick={() => navigate(`/workshops/${booking.activityId}`)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-stone-900 font-semibold truncate"
                            style={{ fontSize: "0.95rem" }}
                          >
                            {booking.activityName}
                          </p>
                          <p className="text-stone-400" style={{ fontSize: "0.75rem" }}>
                            Booking #{booking.id}
                          </p>
                        </div>
                        <span
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium shrink-0 ${getStatusClass(
                            booking.status
                          )}`}
                        >
                          {getStatusIcon(booking.status)}
                          {booking.status === "cancellation_requested" 
                            ? "Cancel Requested" 
                            : booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1 mb-3">
                        {booking.date && (
                          <div className="flex items-center gap-1.5 text-stone-500" style={{ fontSize: "0.8rem" }}>
                            <Calendar className="w-3.5 h-3.5 text-amber-500" />
                            {new Date(booking.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                            {booking.time && ` · ${booking.time}`}
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
                          {booking.duration && (
                            <span className="flex items-center gap-1 text-stone-500">
                              <Clock className="w-3.5 h-3.5 text-amber-500" />
                              {booking.duration}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between border-t border-stone-100 pt-3 gap-2">
                      <span className="text-amber-700 font-semibold" style={{ fontSize: "0.95rem" }}>
                        ฿{booking.totalPrice.toLocaleString()}
                      </span>
                      
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {booking.status === "cancellation_requested" && (
                          <>
                            <button
                              onClick={() => handleApproveCancel(booking.id)}
                              disabled={loadingId === booking.id}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => handleRejectCancel(booking.id)}
                              disabled={loadingId === booking.id}
                              className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          </>
                        )}
                        {booking.status === "cancelled" && (
                          <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50 px-3 py-1.5 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5 text-stone-400" />
                            <span>Cancellation completed</span>
                          </div>
                        )}
                        {booking.status === "rejected" && (
                          <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50 px-3 py-1.5 rounded-lg">
                            <XCircle className="w-3.5 h-3.5 text-stone-400" />
                            <span>Cancellation rejected</span>
                          </div>
                        )}
                        {booking.status !== "cancelled" && booking.status !== "completed" && booking.status !== "cancellation_requested" && booking.status !== "rejected" && (
                          <>
                            {!booking.canCancel && (
                              <span className="text-xs text-red-500 mr-2">Too late to cancel</span>
                            )}
                            <button
                              onClick={() => setCancelId(booking.id)}
                              disabled={!booking.canCancel}
                              className={`flex items-center gap-1 transition-colors ${
                                booking.canCancel ? "text-red-400 hover:text-red-600 cursor-pointer" : "text-stone-300 cursor-not-allowed"
                              }`}
                              style={{ fontSize: "0.78rem" }}
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Cancel
                            </button>
                          </>
                        )}
                      </div>
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
