import { useState, useEffect } from "react";
import { Navigate } from "react-router";
import useAuthStore from "../store/authStore";
import useAdminStore, { CenterRegistrationRequest, CenterStatus } from "../store/adminStore";
import { useTranslation } from "../i18n/useTranslation";
import { AdminCenterDetail } from "./AdminCenterDetail";
import { AdminUserDetail } from "./AdminUserDetail";
import { CheckCircle2, XCircle, Search, Trash2, Shield, AlertTriangle } from "lucide-react";

export const getDisplayName = (u: any) =>
  [u.firstName, u.lastName].filter(Boolean).join(' ') || u.username || u.email || '';

// ─── Toggle Switch ───────────────────────────────────────────────────────────
function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      title={label}
      className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors focus:outline-none ${
        checked ? "bg-green-500" : "bg-stone-300"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ─── AdminPage ───────────────────────────────────────────────────────────────
export function AdminPage() {
  const user = useAuthStore((s) => s.user);
  const syncUsers = useAdminStore((s: any) => s.syncUsers);
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"requests" | "centers" | "users" | "privileges">(
    "requests"
  );

  useEffect(() => {
    syncUsers();
  // syncUsers is a stable Zustand selector reference; run once on mount only
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin" && user.role !== "super_admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-stone-800">{t.admin.accessDenied}</h1>
          <p className="text-stone-500 mt-2">{t.admin.accessDeniedMsg}</p>
        </div>
      </div>
    );
  }

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: "requests", label: t.admin.tabs.requests },
    { key: "centers", label: t.admin.tabs.centers },
    { key: "users", label: t.admin.tabs.userManagement },
    { key: "privileges", label: t.admin.tabs.privileges },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">{t.admin.title}</h1>
          <p className="text-stone-500">{t.admin.subtitle}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-stone-200">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-3 rounded-t-xl font-medium whitespace-nowrap transition-colors ${
                activeTab === key
                  ? "bg-amber-500 text-white"
                  : "bg-white text-stone-600 hover:bg-stone-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "requests" && <RequestsTab />}
        {activeTab === "centers" && <CentersTab />}
        {activeTab === "users" && <UserManagementTab />}
        {activeTab === "privileges" && <PrivilegesTab />}
      </div>
    </div>
  );
}

// ─── RequestsTab ─────────────────────────────────────────────────────────────
function RequestsTab() {
  const requests = useAdminStore((s) => s.registrationRequests);
  const { t } = useTranslation();
  const [selectedReq, setSelectedReq] = useState<CenterRegistrationRequest | null>(null);

  if (selectedReq) {
    return <RequestDetail req={selectedReq} onBack={() => setSelectedReq(null)} />;
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-stone-200">
        <h2 className="text-xl font-bold text-stone-800">{t.requests.title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="p-4 font-semibold text-stone-600">{t.requests.columns.centerName}</th>
              <th className="p-4 font-semibold text-stone-600">{t.requests.columns.leader}</th>
              <th className="p-4 font-semibold text-stone-600">{t.requests.columns.date}</th>
              <th className="p-4 font-semibold text-stone-600">{t.requests.columns.status}</th>
              <th className="p-4 font-semibold text-stone-600 text-right">{t.requests.columns.action}</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                <td className="p-4 font-medium text-stone-900">{req.name}</td>
                <td className="p-4 text-stone-600">
                  {req.communityLeaderFirstName} {req.communityLeaderLastName}
                </td>
                <td className="p-4 text-stone-600">
                  {new Date(req.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <StatusBadge status={req.status} />
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setSelectedReq(req)}
                    className="text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors"
                  >
                    {t.requests.viewDetails}
                  </button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-stone-500">
                  {t.requests.noRequests}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const map: Record<string, { color: string; label: string }> = {
    pending: { color: "bg-amber-100 text-amber-800", label: t.requests.statuses.pending },
    approved: { color: "bg-green-100 text-green-800", label: t.requests.statuses.approved },
    rejected: { color: "bg-red-100 text-red-800", label: t.requests.statuses.rejected },
  };
  const { color, label } = map[status] ?? { color: "bg-stone-100 text-stone-700", label: status };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${color}`}>
      {label}
    </span>
  );
}

function RequestDetail({
  req,
  onBack,
}: {
  req: CenterRegistrationRequest;
  onBack: () => void;
}) {
  const updateStatus = useAdminStore((s: any) => s.updateUserStatus);
  const { t } = useTranslation();
  const d = t.requests.detail;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 lg:p-8">
      <button
        onClick={onBack}
        className="text-stone-500 hover:text-stone-800 text-sm font-medium mb-6 flex items-center gap-1"
      >
        {d.backToList}
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8 border-b border-stone-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">{req.name}</h2>
          <StatusBadge status={req.status} />
        </div>
        {req.status === "pending" && (
          <div className="flex gap-3">
            <button
              onClick={() => { updateStatus(req.id, "approved"); onBack(); }}
              className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2 text-sm"
            >
              <CheckCircle2 className="w-4 h-4" /> {d.approve}
            </button>
            <button
              onClick={() => { updateStatus(req.id, "rejected"); onBack(); }}
              className="px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-colors flex items-center gap-2 text-sm"
            >
              <XCircle className="w-4 h-4" /> {d.reject}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-bold text-stone-800 mb-4 border-b border-stone-100 pb-2">
            {d.centerInfo}
          </h3>
          <dl className="space-y-4">
            <InfoRow label={d.address} value={req.address} />
            <div>
              <dt className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">{d.phones}</dt>
              <ul className="text-stone-800 list-disc list-inside">
                {req.telephones.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
            <InfoRow label={d.email} value={req.email} />
            <InfoRow label={d.lineId} value={req.lineId || "-"} />
            <InfoRow label={d.facebook} value={req.facebook || "-"} />
            <InfoRow label={d.website} value={req.website || "-"} />
            <InfoRow label={d.providers} value={req.providers?.join(", ") || "-"} />
          </dl>
        </div>
        <div>
          <h3 className="text-lg font-bold text-stone-800 mb-4 border-b border-stone-100 pb-2">
            {d.leaderInfo}
          </h3>
          <dl className="space-y-4">
            <InfoRow label={d.name} value={`${req.communityLeaderFirstName} ${req.communityLeaderLastName}`} />
            <InfoRow label={d.phone} value={req.communityLeaderTelephone} />
          </dl>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">{label}</dt>
      <dd className="text-stone-800">{value}</dd>
    </div>
  );
}

// ─── CentersTab ───────────────────────────────────────────────────────────────
function CentersTab() {
  const centers = useAdminStore((s) => s.adminCenters);
  const centerStatuses = useAdminStore((s) => s.centerStatuses);
  const deleteCenter = useAdminStore((s) => s.deleteCenter);
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (selectedId) {
    return <AdminCenterDetail centerId={selectedId} onBack={() => setSelectedId(null)} />;
  }

  const statusLabel = (id: string) => {
    const st: CenterStatus = centerStatuses[id] ?? "active";
    return t.centers.centerStatuses[st];
  };
  const statusColor = (id: string) => {
    const st: CenterStatus = centerStatuses[id] ?? "active";
    return st === "active" ? "bg-green-100 text-green-700"
         : st === "suspended" ? "bg-amber-100 text-amber-700"
         : "bg-red-100 text-red-700";
  };

  const confirmDelete = (id: string, name: string) => {
    if (window.confirm(t.centers.deleteConfirm(name))) {
      deleteCenter(id);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-stone-200">
        <h2 className="text-xl font-bold text-stone-800">{t.centers.title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="p-4 font-semibold text-stone-600">{t.centers.columns.centerId}</th>
              <th className="p-4 font-semibold text-stone-600">{t.centers.columns.centerName}</th>
              <th className="p-4 font-semibold text-stone-600">{t.centers.columns.location}</th>
              <th className="p-4 font-semibold text-stone-600">{t.centers.columns.status}</th>
              <th className="p-4 font-semibold text-stone-600 text-right">{t.centers.columns.action}</th>
            </tr>
          </thead>
          <tbody>
            {centers.map((center) => (
              <tr key={center.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                <td className="p-4 text-stone-500 text-sm font-mono">{center.id}</td>
                <td className="p-4 font-medium text-stone-900">{center.name}</td>
                <td className="p-4 text-stone-600">{center.location}, {center.province}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${statusColor(center.id)}`}>
                    {statusLabel(center.id)}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedId(center.id)}
                      className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-xs font-semibold transition"
                    >
                      {t.centers.manage}
                    </button>
                    <button
                      onClick={() => confirmDelete(center.id, center.name)}
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {centers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-stone-500">{t.centers.noCenters}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── UserManagementTab ────────────────────────────────────────────────────────
function UserManagementTab() {
  const users = useAdminStore((s) => s.users);
  const updateUserStatus = useAdminStore((s) => s.updateUserStatus);
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  if (selectedUserId) {
    return <AdminUserDetail userId={selectedUserId} onBack={() => setSelectedUserId(null)} />;
  }

  const filtered = users.filter((u) =>
    getDisplayName(u).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roleLabel = (role?: string) => {
    const map: Record<string, string> = {
      user: t.userMgmt.roles.user,
      center: t.userMgmt.roles.center,
      admin: t.userMgmt.roles.admin,
      super_admin: t.userMgmt.roles.super_admin,
    };
    return map[role ?? "user"] ?? t.userMgmt.roles.user;
  };

  const roleColor = (role?: string) => {
    switch (role) {
      case "super_admin": return "bg-purple-100 text-purple-800";
      case "admin":       return "bg-blue-100 text-blue-800";
      case "center":      return "bg-amber-100 text-amber-800";
      default:            return "bg-stone-100 text-stone-700";
    }
  };

  const handleToggle = (userId: string, currentStatus: string | undefined, name: string) => {
    if (currentStatus !== "suspended") {
      if (!window.confirm(t.userMgmt.disableConfirm(name))) return;
      updateUserStatus(userId, "suspended");
    } else {
      updateUserStatus(userId, "active");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-stone-200 flex flex-wrap gap-4 items-center justify-between">
        <h2 className="text-xl font-bold text-stone-800">{t.userMgmt.title}</h2>
        <div className="relative w-full sm:w-72">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder={t.userMgmt.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="p-4 font-semibold text-stone-600">{t.userMgmt.columns.userId}</th>
              <th className="p-4 font-semibold text-stone-600">{t.userMgmt.columns.username}</th>
              <th className="p-4 font-semibold text-stone-600">{t.userMgmt.columns.email}</th>
              <th className="p-4 font-semibold text-stone-600">{t.userMgmt.columns.role}</th>
              <th className="p-4 font-semibold text-stone-600">{t.userMgmt.columns.status}</th>
              <th className="p-4 font-semibold text-stone-600 text-center">{t.userMgmt.columns.action}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const isActive = u.status !== "suspended";
              return (
                <tr key={u.id} className={`border-b border-stone-100 hover:bg-stone-50 transition-colors ${!isActive ? "opacity-60" : ""}`}>
                  <td className="p-4 text-stone-400 text-xs font-mono max-w-[120px] truncate" title={u.id}>
                    {u.id}
                  </td>
                  <td className="p-4 font-medium text-stone-900">{getDisplayName(u)}</td>
                  <td className="p-4 text-stone-600 text-sm">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${roleColor(u.role)}`}>
                      {roleLabel(u.role)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                      {isActive ? t.userMgmt.status.active : t.userMgmt.status.disabled}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-3">
                      <ToggleSwitch
                        checked={isActive}
                        onChange={() => handleToggle(u.id, u.status, getDisplayName(u))}
                        label={isActive ? t.userMgmt.toggle.disable : t.userMgmt.toggle.enable}
                      />
                      <span className="text-xs text-stone-500 w-14">
                        {isActive ? t.userMgmt.toggle.disable : t.userMgmt.toggle.enable}
                      </span>
                      <button
                        onClick={() => setSelectedUserId(u.id)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition"
                      >
                        {t.userMgmt.viewDetails}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-stone-500">
                  {t.userMgmt.noUsers}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── PrivilegesTab ────────────────────────────────────────────────────────────
function PrivilegesTab() {
  const users = useAdminStore((s) => s.users);
  const updateUserRole = useAdminStore((s) => s.updateUserRole);
  const updateUserStatus = useAdminStore((s) => s.updateUserStatus);
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(u => {
    const displayName = getDisplayName(u).toLowerCase();
    const q = searchQuery.toLowerCase();
    return displayName.includes(q) || (u.email?.toLowerCase() ?? '').includes(q);
  });

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-stone-200 flex flex-wrap gap-4 items-center justify-between">
        <h2 className="text-xl font-bold text-stone-800">{t.privileges.title}</h2>
        <div className="relative w-full sm:w-72">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder={t.privileges.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="p-4 font-semibold text-stone-600">{t.privileges.columns.user}</th>
              <th className="p-4 font-semibold text-stone-600">{t.privileges.columns.role}</th>
              <th className="p-4 font-semibold text-stone-600">{t.privileges.columns.status}</th>
              <th className="p-4 font-semibold text-stone-600 text-right">{t.privileges.columns.actions}</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr
                key={u.id}
                className="border-b border-stone-100 hover:bg-stone-50 transition-colors"
              >
                <td className="p-4">
                  <div className="font-medium text-stone-900">{getDisplayName(u)}</div>
                  <div className="text-sm text-stone-500">{u.email}</div>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider
                      ${u.role === "super_admin" ? "bg-purple-100 text-purple-800" :
                        u.role === "admin" ? "bg-blue-100 text-blue-800" :
                        u.role === "center" ? "bg-amber-100 text-amber-800" :
                        "bg-stone-100 text-stone-700"}`}
                  >
                    {u.role || "user"}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold
                      ${u.status === "suspended" ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"}`}
                  >
                    {u.status === "suspended" ? t.common.suspended : t.common.active}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <button
                      onClick={() => updateUserRole(u.id, "super_admin")}
                      className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                    >
                      <Shield className="w-3.5 h-3.5" /> {t.privileges.superAdmin}
                    </button>
                    <button
                      onClick={() => updateUserRole(u.id, "admin")}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition"
                    >
                      {t.privileges.subAdmin}
                    </button>
                    <button
                      onClick={() => updateUserRole(u.id, "user")}
                      className="px-3 py-1.5 bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-lg text-xs font-semibold transition"
                    >
                      {t.privileges.revokeAdmin}
                    </button>
                    <div className="w-px h-6 bg-stone-200 mx-1" />
                    {u.status === "suspended" ? (
                      <button
                        onClick={() => updateUserStatus(u.id, "active")}
                        className="px-3 py-1.5 border border-green-200 text-green-600 hover:bg-green-50 rounded-lg text-xs font-semibold transition"
                      >
                        {t.privileges.unsuspend}
                      </button>
                    ) : (
                      <button
                        onClick={() => updateUserStatus(u.id, "suspended")}
                        className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold transition"
                      >
                        {t.privileges.suspend}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-stone-500">
                  {t.privileges.noUsers}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
