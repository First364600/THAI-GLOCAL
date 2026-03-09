import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  Clock,
  Users,
  MapPin,
  Calendar,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  Mail,
  MessageSquare,
  X,
  PartyPopper,
} from "lucide-react";
import useDataStore, { Session } from "../store/dataStore";
import useBookingStore from "../store/bookingStore";
import { toast } from "sonner";
import { ImageCarousel } from "../components/ImageCarousel";

function BookingModal({
  session,
  activityId,
  activityTitle,
  pricePerPerson,
  onClose,
  onSuccess,
}: {
  session: Session;
  activityId: string;
  activityTitle: string;
  pricePerPerson: number;
  onClose: () => void;
  onSuccess: (bookingId: string) => void;
}) {
  const addBooking = useBookingStore((s) => s.addBooking);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    participants: 1,
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const totalPrice = form.participants * pricePerPerson;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (form.participants < 1) e.participants = "At least 1 participant";
    if (form.participants > session.availableSpots)
      e.participants = `Only ${session.availableSpots} spots available`;
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));

    const bookingId = `BK${Date.now().toString().slice(-6)}`;
    addBooking({
      id: bookingId,
      activityId,
      sessionId: session.id,
      name: form.name,
      email: form.email,
      phone: form.phone,
      participants: form.participants,
      totalPrice,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      notes: form.notes,
    });

    setLoading(false);
    onSuccess(bookingId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <div>
            <h2 className="text-stone-900" style={{ fontSize: "1.1rem", fontWeight: 600 }}>Book Activity</h2>
            <p className="text-stone-500" style={{ fontSize: "0.8rem" }}>
              {new Date(session.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              · {session.time}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {/* Summary */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <h3 className="text-amber-800 font-medium mb-1" style={{ fontSize: "0.875rem" }}>{activityTitle}</h3>
            <div className="flex items-center justify-between">
              <span className="text-stone-600" style={{ fontSize: "0.8rem" }}>
                ฿{pricePerPerson.toLocaleString()} × {form.participants} person{form.participants > 1 ? "s" : ""}
              </span>
              <span className="text-amber-700 font-bold" style={{ fontSize: "1rem" }}>
                ฿{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Participants */}
          <div>
            <label className="text-stone-700 mb-1.5 block" style={{ fontSize: "0.875rem" }}>
              Number of Participants
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, participants: Math.max(1, f.participants - 1) }))}
                className="w-9 h-9 rounded-lg border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 transition-colors font-medium"
              >
                −
              </button>
              <span className="w-10 text-center font-semibold text-stone-900" style={{ fontSize: "1.1rem" }}>
                {form.participants}
              </span>
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({ ...f, participants: Math.min(session.availableSpots, f.participants + 1) }))
                }
                className="w-9 h-9 rounded-lg border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 transition-colors font-medium"
              >
                +
              </button>
              <span className="text-stone-400" style={{ fontSize: "0.75rem" }}>
                (max {session.availableSpots})
              </span>
            </div>
            {errors.participants && (
              <p className="text-red-500 mt-1" style={{ fontSize: "0.75rem" }}>{errors.participants}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="text-stone-700 mb-1.5 block" style={{ fontSize: "0.875rem" }}>
              <User className="w-3.5 h-3.5 inline mr-1" />
              Full Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Your full name"
              className={`w-full px-4 py-2.5 rounded-xl border bg-stone-50 outline-none transition-colors focus:border-amber-400 ${
                errors.name ? "border-red-300" : "border-stone-200"
              }`}
              style={{ fontSize: "0.875rem" }}
            />
            {errors.name && <p className="text-red-500 mt-1" style={{ fontSize: "0.75rem" }}>{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-stone-700 mb-1.5 block" style={{ fontSize: "0.875rem" }}>
              <Mail className="w-3.5 h-3.5 inline mr-1" />
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
              className={`w-full px-4 py-2.5 rounded-xl border bg-stone-50 outline-none transition-colors focus:border-amber-400 ${
                errors.email ? "border-red-300" : "border-stone-200"
              }`}
              style={{ fontSize: "0.875rem" }}
            />
            {errors.email && <p className="text-red-500 mt-1" style={{ fontSize: "0.75rem" }}>{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="text-stone-700 mb-1.5 block" style={{ fontSize: "0.875rem" }}>
              <Phone className="w-3.5 h-3.5 inline mr-1" />
              Phone Number
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="+66 81 234 5678"
              className={`w-full px-4 py-2.5 rounded-xl border bg-stone-50 outline-none transition-colors focus:border-amber-400 ${
                errors.phone ? "border-red-300" : "border-stone-200"
              }`}
              style={{ fontSize: "0.875rem" }}
            />
            {errors.phone && <p className="text-red-500 mt-1" style={{ fontSize: "0.75rem" }}>{errors.phone}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="text-stone-700 mb-1.5 block" style={{ fontSize: "0.875rem" }}>
              <MessageSquare className="w-3.5 h-3.5 inline mr-1" />
              Special Requests{" "}
              <span className="text-stone-400 font-normal" style={{ fontSize: "0.75rem" }}>
                (optional)
              </span>
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Dietary requirements, accessibility needs, etc."
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 outline-none transition-colors focus:border-amber-400 resize-none"
              style={{ fontSize: "0.875rem" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-xl transition-colors font-medium shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Confirming...
              </>
            ) : (
              <>Confirm Booking · ฿{totalPrice.toLocaleString()}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function BookingSuccessModal({
  bookingId,
  activityTitle,
  session,
  onClose,
}: {
  bookingId: string;
  activityTitle: string;
  session: Session;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <PartyPopper className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-stone-900 mb-2" style={{ fontSize: "1.3rem", fontWeight: 700 }}>
          Booking Confirmed! 🎉
        </h2>
        <p className="text-stone-500 mb-1" style={{ fontSize: "0.875rem" }}>
          Booking ID: <span className="font-mono font-medium text-stone-700">{bookingId}</span>
        </p>
        <p className="text-stone-500 mb-6" style={{ fontSize: "0.875rem" }}>
          {activityTitle} ·{" "}
          {new Date(session.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}{" "}
          at {session.time}
        </p>
        <p className="text-stone-400 mb-6" style={{ fontSize: "0.8rem" }}>
          A confirmation will be sent to your email. We look forward to seeing you!
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => { navigate("/my-bookings"); onClose(); }}
            className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors font-medium"
            style={{ fontSize: "0.875rem" }}
          >
            View My Bookings
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-stone-200 text-stone-600 hover:bg-stone-50 rounded-xl transition-colors"
            style={{ fontSize: "0.875rem" }}
          >
            Stay Here
          </button>
        </div>
      </div>
    </div>
  );
}

function ActivityDetailModal({
  session,
  activityTitle,
  onClose,
  onBook,
}: {
  session: Session;
  activityTitle: string;
  onClose: () => void;
  onBook: () => void;
}) {
  const currentDate = new Date('2026-03-07'); // System current date
  const sessionDate = new Date(session.date);
  const timeDiff = sessionDate.getTime() - currentDate.getTime();
  const daysUntil = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  const isBookingClosed = daysUntil < 2;
  const isFullyBooked = session.availableSpots === 0;
  const isDisabled = isFullyBooked || isBookingClosed;

  let buttonText = "Reserve this Activity";
  if (isFullyBooked) buttonText = "Fully Booked";
  else if (isBookingClosed) buttonText = "Booking Closed (Starts soon)";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-stone-900 leading-tight mb-1">
              Activity Details
            </h2>
            <p className="text-stone-500 text-sm">
              {activityTitle}
            </p>
          </div>
          <button onClick={onClose} className="p-2 -mr-2 rounded-xl text-stone-400 hover:bg-stone-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          <div>
            <h3 className="text-2xl font-bold text-stone-900 mb-2">{session.name || "Workshop Activity"}</h3>
            <p className="text-stone-600 leading-relaxed text-sm">
              {session.description || "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 flex items-start gap-3">
               <Calendar className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
               <div>
                 <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Date</p>
                 <p className="text-stone-900 font-medium text-sm">
                   {new Date(session.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                 </p>
               </div>
             </div>
             <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 flex items-start gap-3">
               <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
               <div>
                 <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Time</p>
                 <p className="text-stone-900 font-medium text-sm">{session.time}</p>
               </div>
             </div>
             <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 flex items-start gap-3 sm:col-span-2">
               <Users className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
               <div>
                 <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Availability</p>
                 <p className="text-stone-900 font-medium text-sm">
                   {session.availableSpots === 0 
                     ? "This session is fully booked." 
                     : `${session.availableSpots} spots left (out of ${session.totalSpots} total)`
                   }
                  </p>
               </div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-stone-100 bg-stone-50 flex flex-wrap items-center justify-end gap-3 shrink-0">
          {isBookingClosed && !isFullyBooked && (
            <p className="text-red-500 text-xs mr-auto">
              Bookings close 2 days before the activity start date.
            </p>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 transition-colors font-medium text-sm"
          >
            Close
          </button>
          <button
            onClick={onBook}
            disabled={isDisabled}
            className="px-8 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-400 text-white rounded-xl transition-colors font-medium text-sm flex gap-2 items-center"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export function WorkshopDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { activities, centers, fetchData } = useDataStore();

  useEffect(() => { fetchData(); }, [fetchData]);

  const activity = activities.find((a) => a.id === id);
  const [detailSession, setDetailSession] = useState<Session | null>(null);
  const [bookingSession, setBookingSession] = useState<Session | null>(null);
  const [successBookingId, setSuccessBookingId] = useState<string | null>(null);
  const [successSession, setSuccessSession] = useState<Session | null>(null);

  if (!activity) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-stone-900 mb-2">Activity not found</h2>
          <Link to="/workshops" className="text-amber-600 hover:underline">
            Browse all activities
          </Link>
        </div>
      </div>
    );
  }

  const center = centers.find((c) => c.id === activity.centerId);

  const spotsColor = (available: number, total: number) => {
    const ratio = available / total;
    if (available === 0) return "text-red-500";
    if (ratio <= 0.3) return "text-orange-500";
    return "text-green-600";
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-16">
      {/* Back nav */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <Link
          to="/workshops"
          className="inline-flex items-center gap-1 text-stone-500 hover:text-amber-600 transition-colors"
          style={{ fontSize: "0.875rem" }}
        >
          <ChevronLeft className="w-4 h-4" /> Back to Activities
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Hero Image */}
          <div className="rounded-2xl overflow-hidden group/main-carousel" style={{ height: "340px" }}>
            <ImageCarousel
              images={activity.images || []}
              alt={activity.title}
              className="w-full h-full"
            />
          </div>

          {/* Title & meta */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-600">
                {activity.category}
              </span>
            </div>
            <h1 className="text-stone-900 mb-1" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700 }}>
              {activity.title}
            </h1>
            <p className="text-stone-400 mb-4" style={{ fontSize: "0.85rem" }}>{activity.titleTh}</p>
            <div className="flex flex-wrap items-center gap-4 text-stone-500" style={{ fontSize: "0.875rem" }}>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                {activity.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-500" />
                Max {activity.maxParticipants} participants
              </span>
              {center && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  {center.name}, {center.location}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 border border-stone-100">
            <h2 className="text-stone-900 mb-3" style={{ fontWeight: 600 }}>About This Activity</h2>
            <p className="text-stone-600" style={{ fontSize: "0.9rem", lineHeight: 1.8 }}>
              {activity.description}
            </p>
          </div>

        </div>

        {/* Right: Booking Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-white rounded-2xl border border-stone-100 shadow-lg overflow-hidden">
              {/* Price header */}
              <div
                className="p-5 text-white"
                style={{ background: "linear-gradient(135deg, #92400e, #b45309)" }}
              >
                <p className="text-amber-200 mb-1" style={{ fontSize: "0.75rem" }}>Starting from</p>
                <p className="font-bold" style={{ fontSize: "1.8rem" }}>
                  ฿{activity.price.toLocaleString()}
                </p>
                <p className="text-amber-200" style={{ fontSize: "0.8rem" }}>per person</p>
              </div>

              <div className="p-5">
                <h3 className="text-stone-900 mb-4 font-medium">Activity List</h3>
                <div className="flex flex-col gap-3 mb-5">
                  {activity.sessions.map((session: any) => {
                    const isFull = session.availableSpots === 0;
                    return (
                      <button
                        key={session.id}
                        onClick={() => setDetailSession(session)}
                        className="w-full p-4 rounded-xl border text-left transition-all border-stone-200 hover:border-amber-300 hover:bg-amber-50/50 group block"
                      >
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-stone-900 font-semibold leading-tight text-sm group-hover:text-amber-700 transition-colors">
                              {session.name || "Workshop Activity"}
                            </h4>
                            <p
                              className={`font-medium shrink-0 ${spotsColor(session.availableSpots, session.totalSpots)}`}
                              style={{ fontSize: "0.75rem" }}
                            >
                              {isFull ? "Full" : `${session.availableSpots} spots left`}
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-stone-500" style={{ fontSize: "0.8rem" }}>
                            <span>
                              {new Date(session.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {session.time}
                            </span>
                            <span>
                              {session.totalSpots - session.availableSpots}/{session.totalSpots} Booked
                            </span>
                          </div>
                          {/* Progress bar */}
                          <div className="mt-1 h-1 rounded-full bg-stone-200 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isFull
                                  ? "bg-red-400"
                                  : session.availableSpots / session.totalSpots <= 0.3
                                  ? "bg-orange-400"
                                  : "bg-green-400"
                              }`}
                              style={{
                                width: `${((session.totalSpots - session.availableSpots) / session.totalSpots) * 100}%`,
                              }}
                            />
                          </div>
                          <div className="mt-2 text-amber-600 font-medium text-xs flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            View Details →
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {center && (
                  <div className="mt-4 pt-4 border-t border-stone-100">
                    <div className="flex items-center gap-2">
                      <img
                        src={center.images?.[0] || ""}
                        alt={center.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-stone-800 font-medium" style={{ fontSize: "0.75rem" }}>
                          {center.name}
                        </p>
                        <span className="text-stone-500" style={{ fontSize: "0.7rem" }}>{center.location}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Detail Modal */}
      {detailSession && (
        <ActivityDetailModal
          session={detailSession}
          activityTitle={activity.title}
          onClose={() => setDetailSession(null)}
          onBook={() => {
            setDetailSession(null);
            setBookingSession(detailSession);
          }}
        />
      )}

      {/* Booking Modal */}
      {bookingSession && (
        <BookingModal
          session={bookingSession}
          activityId={activity.id}
          activityTitle={activity.title}
          pricePerPerson={activity.price}
          onClose={() => setBookingSession(null)}
          onSuccess={(id) => {
            setSuccessBookingId(id);
            setSuccessSession(bookingSession);
            setBookingSession(null);
            toast.success("Booking confirmed!");
          }}
        />
      )}

      {/* Success Modal */}
      {successBookingId && successSession && (
        <BookingSuccessModal
          bookingId={successBookingId}
          activityTitle={activity.title}
          session={successSession}
          onClose={() => {
            setSuccessBookingId(null);
            setSuccessSession(null);
          }}
        />
      )}
    </div>
  );
}
