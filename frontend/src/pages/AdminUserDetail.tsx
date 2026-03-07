import { useState } from "react";
import { CheckCircle2, Ban, UserX, UserCheck } from "lucide-react";
import useAdminStore from "../store/adminStore";
import useMyCenterStore from "../store/myCenterStore";
import { useTranslation } from "../i18n/useTranslation";

function inputCls() {
  return "w-full px-3 py-2 border border-stone-200 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition text-stone-800 text-sm";
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-stone-200">
        <h3 className="text-lg font-bold text-stone-800">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function AdminUserDetail({
  userId,
  onBack,
}: {
  userId: string;
  onBack: () => void;
}) {
  const { t } = useTranslation();
  const user = useAdminStore((s) => s.users.find((u) => u.id === userId));
  const [activeTab, setActiveTab] = useState<"info" | "bookings" | "status">("info");

  if (!user) {
    return <div className="p-8 text-center text-stone-500">User not found.</div>;
  }

  const getDisplayName = (u: any) =>
    [u.firstName, u.lastName].filter(Boolean).join(' ') || u.username || u.email || '';
  const displayName = getDisplayName(user);

  const roleColor =
    user.role === "super_admin" ? "bg-purple-100 text-purple-800"
    : user.role === "admin"      ? "bg-blue-100 text-blue-800"
    : user.role === "center"     ? "bg-amber-100 text-amber-800"
    : "bg-stone-100 text-stone-700";

  const statusColor = user.status === "suspended" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700";
  const statusLabel = user.status === "suspended"
    ? t.userDetail.status.suspended
    : t.userDetail.status.active;

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: "info",     label: t.userDetail.tabs.info },
    { key: "bookings", label: t.userDetail.tabs.bookings },
    { key: "status",   label: t.userDetail.tabs.status },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-stone-500 hover:text-stone-800 text-sm font-medium flex items-center gap-1 mb-2"
        >
          {t.userDetail.backToList}
        </button>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-lg select-none">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-stone-900">{displayName}</h2>
            <p className="text-stone-500 text-sm">{user.email}</p>
          </div>
          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${roleColor}`}>
            {user.role ?? "user"}
          </span>
          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${statusColor}`}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-5 border-b border-stone-200">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-5 py-2 rounded-t-xl font-medium whitespace-nowrap transition-colors text-sm ${
              activeTab === key
                ? "bg-amber-500 text-white"
                : "bg-white text-stone-600 hover:bg-stone-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "info"     && <UserInfoTab userId={userId} />}
      {activeTab === "bookings" && <UserBookingsTab userId={userId} userName={displayName} />}
      {activeTab === "status"   && <UserStatusTab userId={userId} userName={displayName} />}
    </div>
  );
}

// ─── Info Tab ─────────────────────────────────────────────────────────────────

function UserInfoTab({ userId }: { userId: string }) {
  const { t } = useTranslation();
  const di = t.userDetail.info;
  const user = useAdminStore((s) => s.users.find((u) => u.id === userId));
  const updateUserInfo = useAdminStore((s) => s.updateUserInfo);

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState((user as { phone?: string })?.phone ?? "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateUserInfo(userId, { firstName, lastName, phone, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <SectionCard title={di.section}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label={di.username}>
          <input className={inputCls()} value={`${firstName} ${lastName}`.trim()} disabled placeholder="Name" />
        </Field>
        <Field label={di.email}>
          <input className={inputCls()} value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label={di.phone}>
          <input className={inputCls()} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Field>
        <Field label={di.role}>
          <div className="px-3 py-2 border border-stone-100 rounded-xl bg-stone-50 text-stone-600 text-sm">
            {user?.role ?? "user"}
          </div>
        </Field>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium text-sm transition"
        >
          {di.saveChanges}
        </button>
        {saved && (
          <span className="text-green-600 text-sm font-medium flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> {di.saved}
          </span>
        )}
      </div>
    </SectionCard>
  );
}

// ─── Bookings Tab ─────────────────────────────────────────────────────────────

function UserBookingsTab({ userId, userName }: { userId: string; userName: string }) {
  const { t } = useTranslation();
  const db = t.userDetail.bookings;
  const allBookings = useMyCenterStore((s) => s.bookings);
  const workshops = useMyCenterStore((s) => s.workshops);
  const sessions = useMyCenterStore((s) => s.sessions);
  const updateBookingStatus = useMyCenterStore((s) => s.updateBookingStatus);

  // Match by userId if present, otherwise by full name
  const userBookings = allBookings.filter((b) => {
    if (b.userId) return b.userId === userId;
    // Fallback: name-based matching for legacy bookings
    const fullName = `${b.firstName} ${b.lastName}`.toLowerCase();
    return fullName === userName.toLowerCase();
  });

  const getWorkshopTitle = (workshopId: string) =>
    workshops.find((w) => w.id === workshopId)?.title ?? workshopId;

  const getSessionInfo = (sessionId: string) => {
    const s = sessions.find((ss) => ss.id === sessionId);
    return s ? `${s.date} ${s.startTime}` : sessionId;
  };

  const bookingStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      pending: t.centerDetail.bookings.bookingStatuses.pending,
      approved: t.centerDetail.bookings.bookingStatuses.approved,
      rejected: t.centerDetail.bookings.bookingStatuses.rejected,
      confirmed: t.centerDetail.bookings.bookingStatuses.confirmed,
      cancelled: t.centerDetail.bookings.bookingStatuses.cancelled,
      cancellation_requested: t.centerDetail.bookings.bookingStatuses.cancellation_requested,
    };
    return map[status] ?? status;
  };

  const statusColor: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-blue-100 text-blue-800",
    confirmed: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    cancelled: "bg-stone-100 text-stone-700",
    cancellation_requested: "bg-orange-100 text-orange-800",
  };

  const handleCancel = (bookingId: string) => {
    if (window.confirm(db.cancelConfirm)) {
      updateBookingStatus(bookingId, "cancelled");
    }
  };

  return (
    <SectionCard title={db.section}>
      {userBookings.length === 0 ? (
        <p className="text-center text-stone-500 py-4">{db.noBookings}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="p-3 font-semibold text-stone-600">{db.columns.workshop}</th>
                <th className="p-3 font-semibold text-stone-600">{db.columns.date}</th>
                <th className="p-3 font-semibold text-stone-600">{db.columns.participants}</th>
                <th className="p-3 font-semibold text-stone-600">{db.columns.status}</th>
                <th className="p-3 font-semibold text-stone-600 text-right">{db.columns.action}</th>
              </tr>
            </thead>
            <tbody>
              {userBookings.map((b) => (
                <tr key={b.id} className="border-b border-stone-100 hover:bg-stone-50 transition">
                  <td className="p-3 font-medium text-stone-900">{getWorkshopTitle(b.workshopId)}</td>
                  <td className="p-3 text-stone-600">{getSessionInfo(b.sessionId)}</td>
                  <td className="p-3 text-stone-600">{b.participants}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusColor[b.status] ?? "bg-stone-100 text-stone-700"}`}>
                      {bookingStatusLabel(b.status)}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {b.status !== "cancelled" && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold transition"
                      >
                        {db.cancelBooking}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}

// ─── Status Tab ────────────────────────────────────────────────────────────────

function UserStatusTab({ userId, userName }: { userId: string; userName: string }) {
  const { t } = useTranslation();
  const ds = t.userDetail.status;
  const user = useAdminStore((s) => s.users.find((u) => u.id === userId));
  const updateUserStatus = useAdminStore((s) => s.updateUserStatus);

  if (!user) return null;
  const isActive = user.status !== "suspended";

  const bannerCls = isActive
    ? "bg-green-50 border-green-200 text-green-800"
    : "bg-amber-50 border-amber-200 text-amber-800";
  const bannerMsg = isActive ? ds.active : ds.suspended;

  const act = (
    next: "active" | "suspended",
    confirm: string
  ) => {
    if (window.confirm(confirm)) updateUserStatus(userId, next);
  };

  return (
    <SectionCard title={ds.section}>
      {/* Status banner */}
      <div className={`p-4 rounded-xl border mb-5 ${bannerCls}`}>
        <p className="font-medium text-sm">{bannerMsg}</p>
      </div>

      {/* Current status */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-sm text-stone-600">{ds.currentStatus}:</span>
        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {isActive ? ds.active : ds.suspended}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {!isActive && (
          <button
            onClick={() => act("active", ds.enableConfirm(userName))}
            className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium text-sm transition flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" /> {ds.enableBtn}
          </button>
        )}
        {isActive && (
          <button
            onClick={() => act("suspended", ds.suspendConfirm(userName))}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium text-sm transition flex items-center gap-2"
          >
            <UserX className="w-4 h-4" /> {ds.suspendBtn}
          </button>
        )}
        {!isActive && (
          <button
            onClick={() => act("suspended", ds.unsuspendConfirm(userName))}
            className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-medium text-sm transition flex items-center gap-2"
          >
            <Ban className="w-4 h-4" /> {ds.disableBtn}
          </button>
        )}
      </div>
    </SectionCard>
  );
}
