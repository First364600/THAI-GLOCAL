import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import {
  ArrowLeft, Plus, Pencil, Trash2, BookOpen, Clock, Users,
  Calendar, Save, X, ChevronRight, CheckCircle2, XCircle, AlertCircle,
  Mail, Phone, MapPin, User,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import useMyCenterStore, { UserSession } from "../store/myCenterStore";
import { MyBookingsPage } from "./MyBookingsPage";

// ─── helpers ─────────────────────────────────────────────────────────────────

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition text-stone-800 text-sm";
const labelCls = "block text-sm font-medium text-stone-700 mb-1.5";

function formatDate(d: string) {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${Number(day)} ${months[Number(m) - 1]} ${y}`;
}

function formatTime(t: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

const STATUS_META: Record<UserSession["status"], { label: string; color: string; icon: React.ReactNode }> = {
  upcoming:  { label: "Upcoming",  color: "bg-blue-50 text-blue-700 border-blue-100",   icon: <Clock className="w-3 h-3" /> },
  full:      { label: "Full",      color: "bg-amber-50 text-amber-700 border-amber-100", icon: <Users className="w-3 h-3" /> },
  completed: { label: "Completed", color: "bg-green-50 text-green-700 border-green-100", icon: <CheckCircle2 className="w-3 h-3" /> },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-700 border-red-100",       icon: <XCircle className="w-3 h-3" /> },
};

// ─── Session form ─────────────────────────────────────────────────────────────

const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

const EMPTY_SESSION = {
  name: "",
  description: "",
  date: tomorrow(),
  startTime: "09:00",
  endTime: "12:00",
  registrationDeadline: tomorrow(),
  maxParticipants: 10,
  notes: "",
  status: "upcoming" as UserSession["status"],
};

function SessionForm({ initial, onSave, onCancel }: {
  initial?: Partial<typeof EMPTY_SESSION>;
  onSave: (data: typeof EMPTY_SESSION) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...EMPTY_SESSION, ...initial });
  const set = <K extends keyof typeof EMPTY_SESSION>(k: K, v: (typeof EMPTY_SESSION)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSave(form); }}
      className="flex flex-col gap-4"
    >
      <div>
        <label className={labelCls}>Activity Name (e.g. Pottery for Beginners - March) *</label>
        <input
          type="text"
          required
          className={inputCls}
          value={form.name || ""}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Activity Name"
        />
      </div>
      <div>
        <label className={labelCls}>Description</label>
        <textarea
          rows={2}
          className={inputCls + " resize-none"}
          value={form.description || ""}
          onChange={(e) => set("description", e.target.value)}
          placeholder="What to expect…"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}><Calendar className="w-3.5 h-3.5 inline mr-1" />Activity Date *</label>
          <input
            type="date"
            required
            className={inputCls}
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}><Calendar className="w-3.5 h-3.5 inline mr-1" />Registration Deadline *</label>
          <input
            type="date"
            required
            className={inputCls}
            value={form.registrationDeadline || form.date}
            onChange={(e) => set("registrationDeadline", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}><Clock className="w-3.5 h-3.5 inline mr-1" />Start time *</label>
          <input
            type="time"
            required
            className={inputCls}
            value={form.startTime}
            onChange={(e) => set("startTime", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}><Clock className="w-3.5 h-3.5 inline mr-1" />End time *</label>
          <input
            type="time"
            required
            className={inputCls}
            value={form.endTime}
            onChange={(e) => set("endTime", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}><Users className="w-3.5 h-3.5 inline mr-1" />Max participants *</label>
          <input
            type="number"
            min={1}
            required
            className={inputCls}
            value={form.maxParticipants}
            onChange={(e) => set("maxParticipants", Number(e.target.value))}
          />
        </div>
        {/* <div>
          <label className={labelCls}>Status</label>
          <select
            className={inputCls}
            value={form.status}
            onChange={(e) => set("status", e.target.value as UserSession["status"])}
          >
            <option value="upcoming">Upcoming</option>
            <option value="full">Full</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div> */}
      </div>

      <div>
        <label className={labelCls}>Notes (optional)</label>
        <textarea
          rows={2}
          className={inputCls + " resize-none"}
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Any special notes for this activity…"
        />
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium shadow-sm transition-colors"
        >
          <Save className="w-4 h-4" /> Save Activity
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Session card ─────────────────────────────────────────────────────────────

function SessionCard({ session, onEdit, onDelete, onView }: {
  session: UserSession;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}) {
  const meta = STATUS_META[session.status];
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 flex items-start gap-4 hover:border-amber-200 transition-colors cursor-pointer" onClick={onView}>
      {/* Date badge */}
      <div className="shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-amber-50 border border-amber-100 text-center">
        <span className="text-xs font-semibold text-amber-700 uppercase leading-none">
          {session.date ? new Date(session.date + "T00:00:00").toLocaleString("en", { month: "short" }) : "—"}
        </span>
        <span className="text-xl font-bold text-amber-800 leading-tight">
          {session.date ? new Date(session.date + "T00:00:00").getDate() : "—"}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-stone-800 text-sm">{session.name || formatDate(session.date)}</h3>
            <p className="font-medium text-amber-700 text-xs mt-0.5">{formatDate(session.date)}</p>
            <p className="text-xs text-stone-500 mt-0.5">
              {formatTime(session.startTime)} – {formatTime(session.endTime)}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg hover:bg-amber-50 text-stone-400 hover:text-amber-600 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-medium ${meta.color}`}>
            {meta.icon}{meta.label}
          </span>
          <span className="flex items-center gap-1 text-xs text-stone-500">
            <Users className="w-3 h-3" />Capacity: {session.maxParticipants}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Panel = "none" | "add" | "edit" | "view";

export function WorkshopSessionsPage() {
  const { workshopId } = useParams<{ workshopId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const store = useMyCenterStore();

  const [panel, setPanel] = useState<Panel>("none");
  const [editingSession, setEditingSession] = useState<UserSession | null>(null);
  const [activeSession, setActiveSession] = useState<UserSession | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null); // ← Add this

  if (!user) return <Navigate to="/login" state={{ from: `/my-center/workshop/${workshopId}` }} replace />;

  const workshop = workshopId ? store.myWorkshops.find((w: any) => String(w.id) === String(workshopId)) : undefined;
  const workshopIsOwned = workshop ? store.myCenters.some((c: any) => c.id === (workshop as any).centerId) : false;

  if (!workshop || !workshopIsOwned) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-4 px-4">
        <AlertCircle className="w-12 h-12 text-stone-300" />
        <p className="text-stone-500 text-sm">Workshop not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>
    );
  }

  const sessions = store.mySessions.filter((s: any) => String(s.workshopId) === String((workshop as any).id));

  const saveSession = (data: typeof EMPTY_SESSION) => {
    if (editingSession) {
      store.updateSession(editingSession.id, data);
      setEditingSession(null);
    } else {
      store.createSession((workshop as any).id, {
        ...data,
        price: (workshop as any).price,
      });
    }
    setPanel("none");
  };

  const handleDelete = (id: string) => {
    const bookings = store.myBookings.filter((b: any) => String(b.sessionId) === String(id));
    const hasActiveBookings = bookings.some((b: any) => ["pending", "approved", "confirmed"].includes(b.status));
    if (hasActiveBookings) {
      setErrorMessage("Error: Activity cannot be deleted because there are active bookings.\n\nTo delete an activity with existing participants, the organizer must first cancel/remove all bookings. Deletion is only permitted once all participants have approved the cancellation.");
      return;
    }
    store.deleteSession(id);
    setConfirmDeleteId(null);
  };

  if (activeSession) {
    const sessionBookings = store.myBookings.filter((b: any) => String(b.sessionId) === String(activeSession.id));
    const confirmedCount = sessionBookings.filter((b: any) => b.status === "confirmed").length;

    return (
      <>
      {errorMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-bold text-lg">Action Failed</h3>
            </div>
            <p className="text-stone-600 text-sm whitespace-pre-wrap">{errorMessage}</p>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setErrorMessage(null)}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* User Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-lg text-stone-800">User Booking Informaion</h3>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="p-1 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* User Info */}
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800">
                      {selectedBooking.firstName || "N/A"} {selectedBooking.lastName || ""}
                    </p>
                    <p className="text-xs text-stone-500">@{selectedBooking.username}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-stone-700">Contact Information</h4>
                {selectedBooking.email && (
                  <div className="flex items-center gap-2 text-sm text-stone-600 bg-stone-50 p-2.5 rounded-lg">
                    <Mail className="w-4 h-4 text-stone-400" />
                    <span>{selectedBooking.email}</span>
                  </div>
                )}
                {selectedBooking.telephone && (
                  <div className="flex items-center gap-2 text-sm text-stone-600 bg-stone-50 p-2.5 rounded-lg">
                    <Phone className="w-4 h-4 text-stone-400" />
                    <span>{selectedBooking.telephone}</span>
                  </div>
                )}
                {selectedBooking.address && (
                  <div className="flex items-center gap-2 text-sm text-stone-600 bg-stone-50 p-2.5 rounded-lg">
                    <MapPin className="w-4 h-4 text-stone-400" />
                    <span>{selectedBooking.address}</span>
                  </div>
                )}
              </div>

              {/* Booking Information */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-stone-700">Booking Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-stone-50 p-2.5 rounded-lg">
                    <p className="text-stone-400 text-xs">Participants</p>
                    <p className="font-semibold text-stone-800">{selectedBooking.numberOfParticipants} seat(s)</p>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-lg">
                    <p className="text-stone-400 text-xs">Total Price</p>
                    <p className="font-semibold text-stone-800">฿{selectedBooking.totalPrice}</p>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-lg col-span-2">
                    <p className="text-stone-400 text-xs">Status</p>
                    <p className={`font-semibold text-sm mt-1 flex items-center gap-1.5 ${
                      selectedBooking.status === 'pending' ? 'text-amber-600' :
                      selectedBooking.status === 'approved' ? 'text-blue-600' :
                      selectedBooking.status === 'confirmed' ? 'text-green-600' :
                      selectedBooking.status === 'rejected' ? 'text-red-600' :
                      selectedBooking.status === 'cancellation_requested' ? 'text-orange-600' :
                      selectedBooking.status === 'cancelled' ? 'text-slate-600' :
                      'text-stone-600'
                    }`}>
                      <span>
                        {selectedBooking.status === "cancellation_requested" ? "Cancel Requested" :
                         selectedBooking.status === "cancellation_rejected" ? "✓ Cancel Declined" :
                         selectedBooking.status === "pending" ? "Pending" :
                         selectedBooking.status === "approved" ? "✓ Approved" :
                         selectedBooking.status === "confirmed" ? "✓ Confirmed" :
                         selectedBooking.status === "rejected" ? "✗ Rejected" :
                         selectedBooking.status === "cancelled" ? "✗ Cancelled" :
                         selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Registered Date */}
              {selectedBooking.createdAt && (
                <div className="text-xs text-stone-500 pt-2 border-t border-stone-200">
                  Registered: {new Date(selectedBooking.createdAt).toLocaleString()}
                </div>
              )}
            </div>

            <button 
              onClick={() => setSelectedBooking(null)}
              className="w-full mt-6 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-stone-50 pt-20 pb-16">
        <div className="py-8 px-4" style={{ background: "linear-gradient(135deg, #78350f 0%, #b45309 100%)" }}>
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-amber-200 hover:text-white text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex items-start gap-4">
              {workshop.images && workshop.images[0] ? (
                <img
                  src={workshop.images[0]}
                  alt={workshop.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border-2 border-white/20"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-7 h-7 text-white/70" />
                </div>
              )}
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-white leading-tight">{workshop.title}</h1>
                {workshop.titleTh && <p className="text-amber-200 text-sm mt-0.5">{workshop.titleTh}</p>}
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-amber-200">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{workshop.duration}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />Up to {workshop.maxParticipants}</span>
                  <span className="px-2 py-0.5 bg-white/10 rounded-full">{workshop.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
          {/* Details Card */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">{activeSession.name || "Workshop Activity"}</h2>
            <div className="flex flex-col gap-3 text-sm text-stone-600">
              <p>{activeSession.description}</p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div><strong className="text-stone-800">Date & Time:</strong> {formatDate(activeSession.date)} ({formatTime(activeSession.startTime)} - {formatTime(activeSession.endTime)})</div>
                <div><strong className="text-stone-800">Registration Deadline:</strong> {formatDate(activeSession.registrationDeadline)}</div>
                <div><strong className="text-stone-800">Price:</strong> ฿{workshop.price}</div>
                <div><strong className="text-stone-800">Registration Capacity:</strong> {confirmedCount} / {activeSession.maxParticipants}</div>
              </div>
            </div>
          </div>

          {/* Booking Requests */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-stone-900 border-l-4 border-amber-500 pl-3">Booking Approval & Management</h2>
              {/* <button 
                onClick={() => alert("Test booking feature coming soon.")}
                className="text-xs px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg flex items-center gap-1 transition-colors font-medium shadow-sm"
                title="Only for testing"
              >
                <Plus className="w-4 h-4" /> Add Test Booking
              </button> */}
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-amber-50 border border-amber-100 p-3 rounded-2xl flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-amber-600">{sessionBookings.filter((b: any) => b.status === 'pending').length}</span>
                <span className="text-xs font-bold text-amber-800 uppercase mt-1">Pending</span>
              </div>
              <div className="bg-green-50 border border-green-100 p-3 rounded-2xl flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-green-600">{sessionBookings.filter((b: any) => b.status === 'confirmed').length}</span>
                <span className="text-xs font-bold text-green-800 uppercase mt-1">Confirmed</span>
              </div>
              <div className="bg-red-50 border border-red-100 p-3 rounded-2xl flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-red-600">{sessionBookings.filter((b: any) => b.status === 'rejected').length}</span>
                <span className="text-xs font-bold text-red-800 uppercase mt-1">Rejected</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-600">{sessionBookings.filter((b: any) => b.status === 'cancelled').length}</span>
                <span className="text-xs font-bold text-slate-800 uppercase mt-1">Cancelled</span>
              </div>
            </div>

            {sessionBookings.length === 0 ? (
              <div className="bg-white rounded-3xl border-2 border-dashed border-stone-200 p-10 text-center text-stone-500 flex flex-col items-center">
                <Users className="w-10 h-10 text-stone-300 mb-3" />
                <p className="font-medium text-stone-600">No booking requests yet</p>
                <p className="text-sm mt-1">When users book this activity, they will appear here for your approval.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {sessionBookings.map((req: any) => (
                  <div 
                    key={req.id} 
                    onClick={() => setSelectedBooking(req)}
                    className={`bg-white rounded-2xl border-l-4 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-shadow hover:shadow-md cursor-pointer
                      ${req.status === 'pending' ? 'border-l-amber-400 border-y-stone-100 border-r-stone-100' :
                        req.status === 'approved' ? 'border-l-blue-400 border-y-stone-100 border-r-stone-100' :
                        req.status === 'confirmed' ? 'border-l-green-400 border-y-stone-100 border-r-stone-100' :
                        'border-l-red-400 border-y-stone-100 border-r-stone-100'}`}
                  >
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-bold text-stone-800 hover:text-amber-600 transition-colors">
                          {req.firstName} {req.lastName}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
                          ${req.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            req.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                            req.status === 'cancellation_requested' ? 'bg-orange-100 text-orange-800' :
                            req.status === 'cancellation_rejected' ? 'bg-stone-100 text-stone-800' :
                            req.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            req.status === 'cancelled' ? 'bg-slate-100 text-slate-800' :
                            'bg-stone-100 text-stone-800'}`}>
                          {req.status === "cancellation_requested" ? "Cancel Requested" :
                           req.status === "cancellation_rejected" ? "✓ Cancel Declined" :
                           req.status === "pending" ? "Pending" :
                           req.status === "approved" ? "✓ Approved" :
                           req.status === "confirmed" ? "✓ Confirmed" :
                           req.status === "rejected" ? "✗ Rejected" :
                           req.status === "cancelled" ? "✗ Cancelled" :
                           req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-600">
                        <span className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1 rounded-md">
                           <strong className="text-stone-800">Username:</strong> {req.username}
                        </span>
                        <span className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1 rounded-md">
                           <strong className="text-stone-800">Seats:</strong> {req.numberOfParticipants}
                        </span>
                        <span className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1 rounded-md">
                           <strong className="text-stone-800">Total Price:</strong> {req.totalPrice}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-2 hover:text-stone-600">Click to view full details</p>
                    </div>
                    
                    <div 
                      className="flex flex-wrap items-center gap-3 sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-stone-100 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {req.status === "pending" && (
                        <>
                          <button 
                            onClick={async () => {
                              try {
                                await store.updateBookingStatus(req.id, "confirmed");
                                // Refresh data from store
                                const ownerId = useAuthStore.getState().user?.id;
                                if (ownerId) {
                                  await store.fetchMyCenterData(String(ownerId));
                                }
                              } catch (e) {
                                setErrorMessage("Failed to approve booking. Please try again.");
                              }
                            }} 
                            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold shadow-sm transition-transform active:scale-95 flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Approve
                          </button>
                          <button 
                            onClick={async () => {
                              try {
                                await store.updateBookingStatus(req.id, "rejected");
                                // Refresh data from store
                                const ownerId = useAuthStore.getState().user?.id;
                                if (ownerId) {
                                  await store.fetchMyCenterData(String(ownerId));
                                }
                              } catch (e) {
                                setErrorMessage("Failed to reject booking. Please try again.");
                              }
                            }} 
                            className="px-5 py-2.5 bg-white border-2 border-red-100 hover:bg-red-50 text-red-600 rounded-xl text-sm justify-center font-bold transition-transform active:scale-95 flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" /> Reject
                          </button>
                        </>
                      )}
                      {req.status === "approved" && (
                        <button 
                          onClick={async () => {
                            try {
                              await store.updateBookingStatus(req.id, "confirmed");
                              // Refresh data from store
                              const ownerId = useAuthStore.getState().user?.id;
                              if (ownerId) {
                                await store.fetchMyCenterData(String(ownerId));
                              }
                            } catch (e) {
                              setErrorMessage("Failed to confirm booking. Please try again.");
                            }
                          }} 
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm transition-transform active:scale-95 flex items-center gap-2" 
                          title="Confirm after user completes payment"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Mark Paid & Confirm
                        </button>
                      )}
                      {req.status === "cancellation_requested" && req.cancelRequestedBy === "participant" && (
                        <button 
                          onClick={async () => {
                            try {
                              await store.approveCancelBooking(req.id);
                              // Refresh data from store
                              const ownerId = useAuthStore.getState().user?.id;
                              if (ownerId) {
                                await store.fetchMyCenterData(String(ownerId));
                              }
                            } catch (e) {
                              setErrorMessage("Failed to approve cancellation. Please try again.");
                            }
                          }} 
                          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-sm transition-transform active:scale-95 flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Approve Cancellation
                        </button>
                      )}
                      {(req.status === "confirmed") && (
                        <button 
                          onClick={async () => {
                            try {
                              await store.updateBookingStatus(req.id, "request_cancel");
                              // Refresh data from store
                              const ownerId = useAuthStore.getState().user?.id;
                              if (ownerId) {
                                await store.fetchMyCenterData(String(ownerId));
                              }
                              setErrorMessage(null);
                            } catch (e) {
                              setErrorMessage("Failed to request cancellation. Please try again.");
                            }
                          }} 
                          className="px-4 py-2 hover:bg-stone-100 text-stone-500 hover:text-stone-800 rounded-xl text-sm font-medium transition-colors"
                        >
                          Request Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </>
    );
  }

  // Group sessions: upcoming vs past
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = sessions.filter((s: any) => s.date >= today && s.status !== "cancelled" && s.status !== "completed");
  const past = sessions.filter((s: any) => s.date < today || s.status === "cancelled" || s.status === "completed");

  return (
    <>
      {errorMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-bold text-lg">Action Failed</h3>
            </div>
            <p className="text-stone-600 text-sm whitespace-pre-wrap">{errorMessage}</p>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setErrorMessage(null)}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    <div className="min-h-screen bg-stone-50 pt-20 pb-16">
      {/* Header */}
      <div
        className="py-8 px-4"
        style={{ background: "linear-gradient(135deg, #78350f 0%, #b45309 100%)" }}
      >
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-amber-200 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-start gap-4">
            {workshop.images && workshop.images[0] ? (
              <img
                src={workshop.images[0]}
                alt={workshop.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border-2 border-white/20"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-7 h-7 text-white/70" />
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-white leading-tight">{workshop.title}</h1>
              {workshop.titleTh && <p className="text-amber-200 text-sm mt-0.5">{workshop.titleTh}</p>}
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-amber-200">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{workshop.duration}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />Up to {workshop.maxParticipants}</span>
                <span className="px-2 py-0.5 bg-white/10 rounded-full">{workshop.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total activities", value: sessions.length },
            { label: "Upcoming", value: upcoming.length },
            { label: "Completed", value: sessions.filter((s: any) => s.status === "completed").length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-stone-800">{value}</p>
              <p className="text-xs text-stone-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Add / Edit panel */}
        {panel !== "none" ? (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-stone-800 mb-5 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              {panel === "edit" ? "Edit Activity" : "Add New Activity"}
            </h2>
            <SessionForm
              initial={editingSession ? {
                name: editingSession.name,
                description: editingSession.description,
                date: editingSession.date,
                startTime: editingSession.startTime,
                endTime: editingSession.endTime,
                registrationDeadline: editingSession.registrationDeadline,
                maxParticipants: editingSession.maxParticipants,
                notes: editingSession.notes,
                status: editingSession.status,
              } : undefined}
              onSave={saveSession}
              onCancel={() => { setPanel("none"); setEditingSession(null); }}
            />
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => { setEditingSession(null); setPanel("add"); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Activity
            </button>
            
          </div>
        )}

        {/* Upcoming sessions */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide">
            Upcoming ({upcoming.length})
          </h2>
          {upcoming.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-stone-200 p-8 text-center">
              <Calendar className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-stone-400 text-sm">No upcoming activities. Add one above.</p>
            </div>
          ) : (
            upcoming.map((s: any) => {
              const hasBookings = store.myBookings.filter((b: any) => String(b.sessionId) === String(s.id)).length > 0;
              return (
                <div key={s.id}>
                  {confirmDeleteId === s.id ? (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between gap-3">
                      <p className="text-sm text-red-700">Delete activity on <strong>{formatDate(s.date)}</strong>?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-3 py-1.5 bg-white border border-stone-200 text-stone-600 rounded-lg text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <SessionCard
                      session={s}
                      onEdit={() => { setEditingSession(s); setPanel("edit"); }}
                      onDelete={() => {
                        if (hasBookings) {
                           setErrorMessage("Cannot deactivate this activity. Please cancel all existing bookings first.");
                        } else {
                           setConfirmDeleteId(s.id);
                        }
                      }}
                      onView={() => setActiveSession(s)}
                    />
                  )}
                </div>
              );
            })
          )}
        </section>

        {/* Past / Completed / Cancelled sessions */}
        {past.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide">
              Past & Cancelled ({past.length})
            </h2>
            {past.map((s: any) => (
              <div key={s.id}>
                {confirmDeleteId === s.id ? (
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between gap-3">
                    <p className="text-sm text-red-700">Delete activity on <strong>{formatDate(s.date)}</strong>?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-3 py-1.5 bg-white border border-stone-200 text-stone-600 rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <SessionCard
                    session={s}
                    onEdit={() => { setEditingSession(s); setPanel("edit"); }}
                    onDelete={() => setConfirmDeleteId(s.id)}
                    onView={() => setActiveSession(s)}
                  />
                )}
              </div>
            ))}
          </section>
        )}

        {/* Workshop details accordion */}
        <details className="bg-white rounded-2xl border border-stone-100 shadow-sm group">
          <summary className="px-6 py-4 cursor-pointer flex items-center justify-between text-sm font-semibold text-stone-700 select-none list-none">
            Workshop Details
            <ChevronRight className="w-4 h-4 text-stone-400 group-open:rotate-90 transition-transform" />
          </summary>
          <div className="px-6 pb-5 flex flex-col gap-3 text-sm text-stone-600">
            <p>{workshop.description}</p>
          </div>
        </details>

      </div>
    </div>
    </>
  );
}


