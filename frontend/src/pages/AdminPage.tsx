import { useState, useEffect } from "react";
import { Navigate } from "react-router";
import useAuthStore from "../store/authStore";
import useAdminStore, { AdminCenter, CenterRegistrationRequest, CenterStatus } from "../store/adminStore";
import { useTranslation } from "../i18n/useTranslation";
import { AdminCenterDetail } from "./AdminCenterDetail";
import { AdminUserDetail } from "./AdminUserDetail";
import { CheckCircle2, XCircle, Search, Trash2, Shield, AlertTriangle, Type } from "lucide-react";
import { Center } from "../data/mockData";

export const getDisplayName = (u: any) =>
  [u.firstName, u.lastName].filter(Boolean).join(' ') || u.username || u.email || '';

// ─── Toggle Switch ───────────────────────────────────────────────────────────
function ToggleSwitch({
  checked,
  onChange,
  label,
  disabled = false,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      title={label}
      className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors focus:outline-none ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${
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
  if (user.role !== "SYSTEM_ADMIN" && user.role !== "SUPER_ADMIN") {
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
    ...(user.role === "SYSTEM_ADMIN" ? [{ key: "privileges" as const, label: t.admin.tabs.privileges }] : []),
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
        {activeTab === "privileges" && user.role === "SYSTEM_ADMIN" && <PrivilegesTab />}
      </div>
    </div>
  );
}

// ─── RequestsTab ─────────────────────────────────────────────────────────────
function RequestsTab() {
  const pendingCenters = useAdminStore((s) => s.pendingCenters);
  const updateCenterStatus = useAdminStore((s) => s.updateCenterStatus);
  const { t } = useTranslation();
  const [selectedReq, setSelectedReq] = useState<any | null>(null);

  if (selectedReq) {
    return <CenterRequestDetail req={selectedReq} onBack={() => setSelectedReq(null)} />;
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
            {pendingCenters.map((req: any) => (
              <tr key={req.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                <td className="p-4 font-medium text-stone-900">{req.centerName || req.name}</td>
                <td className="p-4 text-stone-600">
                  {req.leaderFirstName} {req.leaderLastName}
                </td>
                <td className="p-4 text-stone-600">
                  {new Date(req.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                    {t.requests.statuses.pending}
                  </span>
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
            {pendingCenters.length === 0 && (
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

// ─── CenterRequestDetail ─────────────────────────────────────────────────────
function CenterRequestDetail({
  req,
  onBack,
}: {
  req: any;
  onBack: () => void;
}) {
  const updateCenterStatus = useAdminStore((s) => s.updateCenterStatus);
  const fetchPendingCenters = useAdminStore((s) => s.fetchPendingCenters);  // เพิ่มบรรทัดนี้
  const { t } = useTranslation();
  const d = t.requests.detail;

  const handleApprove = async () => {
    await updateCenterStatus(req.centerId || req.id, "APPROVED");
    await fetchPendingCenters();  // เพิ่มบรรทัดนี้
    onBack();
  };

  const handleReject = async () => {
    await updateCenterStatus(req.centerId || req.id, "REJECTED");
    await fetchPendingCenters();  // เพิ่มบรรทัดนี้
    onBack();
  };

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
          <h2 className="text-2xl font-bold text-stone-900 mb-2">{req.centerName || req.name}</h2>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
            {t.requests.statuses.pending}
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleApprove}
            className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2 text-sm"
          >
            <CheckCircle2 className="w-4 h-4" /> {d.approve}
          </button>
          <button
            onClick={handleReject}
            className="px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-colors flex items-center gap-2 text-sm"
          >
            <XCircle className="w-4 h-4" /> {d.reject}
          </button>
        </div>
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
                {(req.telephones || []).map((tel: string, i: number) => <li key={i}>{tel}</li>)}
              </ul>
            </div>
            <InfoRow label={d.email} value={req.email} />
            <InfoRow label={d.lineId} value={req.line || "-"} />
            <InfoRow label={d.facebook} value={req.facebook || "-"} />
            <InfoRow label={d.website} value={req.webSite || "-"} />
          </dl>
        </div>
        <div>
          <h3 className="text-lg font-bold text-stone-800 mb-4 border-b border-stone-100 pb-2">
            {d.leaderInfo}
          </h3>
          <dl className="space-y-4">
            <InfoRow label={d.name} value={`${req.leaderFirstName} ${req.leaderLastName}`} />
            <InfoRow label={d.phone} value={req.leaderTelephone} />
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
            {centers.map((center: AdminCenter) => (
              <tr key={center.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                <td className="p-4 text-stone-500 text-sm font-mono">{center.centerId}</td>
                <td className="p-4 font-medium text-stone-900">{center.centerName || center.name}</td>
                <td className="p-4 text-stone-600 text-sm">
                  {center.subDistrict}, {center.district}, {center.province}
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${statusColor(center.id)}`}>
                    {statusLabel(center.id)}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        console.log("Center data:", center);  // Debug: ดูข้อมูล center
                        setSelectedId(center.id);
                      }}
                      className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-xs font-semibold transition"
                    >
                      {t.centers.manage}
                    </button>
                    <button
                      onClick={() => confirmDelete(center.id, center.centerName)}
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
  const currentUser = useAuthStore((s) => s.user); 
  const updateUserStatus = useAdminStore((s) => s.updateUserStatus);
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  if (selectedUserId) {
    return <AdminUserDetail userId={selectedUserId} onBack={() => setSelectedUserId(null)} />;
  }

  // เพิ่มการตรวจสอบ currentUser
  if (!currentUser) {
    return <div className="p-8 text-center text-stone-500">Loading...</div>;
  }

  const filtered = users.filter((u) =>
    getDisplayName(u).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roleLabel = (role?: string) => {
    const map: Record<string, string> = {
      USER: t.userMgmt.roles.USER,
      CENTER_ADMIN: t.userMgmt.roles.CENTER_ADMIN,
      SYSTEM_ADMIN: t.userMgmt.roles.SYSTEM_ADMIN,
      SUPER_ADMIN: t.userMgmt.roles.SUPER_ADMIN,
    };
    return map[role ?? "USER"] ?? role ?? "User";
  };

  const roleColor = (role?: string) => {
    switch (role) {
      case "SUPER_ADMIN": return "bg-purple-100 text-purple-800";
      case "SYSTEM_ADMIN": return "bg-blue-100 text-blue-800";
      case "CENTER_ADMIN": return "bg-amber-100 text-amber-800";
      default: return "bg-stone-100 text-stone-700";
    }
  };

  const handleToggle = (userId: string, currentStatus: string | undefined, name: string) => {
    // ตรวจสอบ currentUser ก่อน
    if (!currentUser) {
      alert("Please login first");
      return;
    }

    // Convert both to string เพื่อ compare
    const currentUserId = String(currentUser.id);
    const targetUserId = String(userId);
    
    console.log("Comparing:", currentUserId, "===", targetUserId, "Result:", currentUserId === targetUserId);

    if (currentUserId === targetUserId) {
      alert(t.privileges.systemAdminProtected || "Cannot modify your own account");
      return;
    }

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
              const isCurrentUser = String(currentUser?.id) === String(u.id);              
              return (
                <tr key={u.id} className={`border-b border-stone-100 hover:bg-stone-50 transition-colors ${!isActive ? "opacity-60" : ""}`}>
                  <td className="p-4 text-stone-400 text-xs font-mono max-w-30 truncate" title={u.id}>
                    {u.id}
                  </td>
                  <td className="p-4 font-medium text-stone-900">
                    {getDisplayName(u)}
                    {isCurrentUser && <span className="text-xs text-amber-600 ml-2">(You)</span>}
                  </td>
                  <td className="p-4 text-stone-600 text-sm">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${roleColor(u.role)}`}>
                      {roleLabel(u.role)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold
                      ${isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                      {isActive ? t.userMgmt.status.active : t.userMgmt.status.disabled}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-3">
                      <ToggleSwitch
                        checked={isActive}
                        onChange={() => handleToggle(u.id, u.status, getDisplayName(u))}
                        label={isActive ? t.userMgmt.toggle.disable : t.userMgmt.toggle.enable}
                        disabled={isCurrentUser || u.role === "SYSTEM_ADMIN"}
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
            {filteredUsers.map((u) => {
              const isSystemAdmin = u.role === "SYSTEM_ADMIN";
              return (
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
                        ${u.role === "SYSTEM_ADMIN" ? "bg-red-100 text-red-800" :
                          u.role === "super_admin" ? "bg-purple-100 text-purple-800" :
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
                    {!isSystemAdmin && (
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <button
                          onClick={() => updateUserRole(u.id, "SUPER_ADMIN")}
                          className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                        >
                          <Shield className="w-3.5 h-3.5" /> {t.privileges.superAdmin}
                        </button>
                        <button
                          onClick={() => updateUserRole(u.id, "USER")}
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
                    )}
                    {isSystemAdmin && (
                      <span className="text-xs text-stone-500 italic">
                        {t.privileges.systemAdminProtected || "Cannot modify System Admin"}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
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
