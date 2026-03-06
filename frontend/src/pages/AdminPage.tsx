import { useState, useEffect } from "react";
import { Navigate } from "react-router";
import useAuthStore from "../store/authStore";
import useAdminStore, { CenterRegistrationRequest } from "../store/adminStore";
import { CheckCircle2, XCircle, Search, Trash2, Shield, AlertTriangle } from "lucide-react";

export function AdminPage() {
  const user = useAuthStore((s) => s.user);
  const syncUsers = useAdminStore((s) => s.syncUsers);
  const [activeTab, setActiveTab] = useState<"requests" | "centers" | "privileges">("requests");

  useEffect(() => {
    syncUsers();
  }, [syncUsers, activeTab]);

  if (!user) return <Navigate to="/login" replace />;
  // Assuming "admin" or "super_admin" roles can access this
  if (user.role !== "admin" && user.role !== "super_admin") {
    // If not admin, you could show access denied or redirect
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-stone-800">Access Denied</h1>
          <p className="text-stone-500 mt-2">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Admin Management Panel</h1>
          <p className="text-stone-500">Manage centers, requests, and user privileges.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-stone-200">
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-6 py-3 rounded-t-xl font-medium whitespace-nowrap transition-colors ${
              activeTab === "requests"
                ? "bg-amber-500 text-white"
                : "bg-white text-stone-600 hover:bg-stone-100"
            }`}
          >
            Register Center Requests
          </button>
          <button
            onClick={() => setActiveTab("centers")}
            className={`px-6 py-3 rounded-t-xl font-medium whitespace-nowrap transition-colors ${
              activeTab === "centers"
                ? "bg-amber-500 text-white"
                : "bg-white text-stone-600 hover:bg-stone-100"
            }`}
          >
            Center Management
          </button>
          <button
            onClick={() => setActiveTab("privileges")}
            className={`px-6 py-3 rounded-t-xl font-medium whitespace-nowrap transition-colors ${
              activeTab === "privileges"
                ? "bg-amber-500 text-white"
                : "bg-white text-stone-600 hover:bg-stone-100"
            }`}
          >
            Privilege Management
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "requests" && <RequestsTab />}
        {activeTab === "centers" && <CentersTab />}
        {activeTab === "privileges" && <PrivilegesTab />}
      </div>
    </div>
  );
}

function RequestsTab() {
  const requests = useAdminStore((s) => s.registrationRequests);
  const [selectedReq, setSelectedReq] = useState<CenterRegistrationRequest | null>(null);

  if (selectedReq) {
    return <RequestDetail req={selectedReq} onBack={() => setSelectedReq(null)} />;
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-stone-200">
        <h2 className="text-xl font-bold text-stone-800">Registration Requests</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="p-4 font-semibold text-stone-600">Center Name</th>
              <th className="p-4 font-semibold text-stone-600">Leader</th>
              <th className="p-4 font-semibold text-stone-600">Date</th>
              <th className="p-4 font-semibold text-stone-600">Status</th>
              <th className="p-4 font-semibold text-stone-600 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                <td className="p-4 font-medium text-stone-900">{req.name}</td>
                <td className="p-4 text-stone-600">{req.communityLeaderFirstName} {req.communityLeaderLastName}</td>
                <td className="p-4 text-stone-600">{new Date(req.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                    ${req.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      req.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'}`}>
                    {req.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setSelectedReq(req)}
                    className="text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-stone-500">No requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RequestDetail({ req, onBack }: { req: CenterRegistrationRequest, onBack: () => void }) {
  const updateStatus = useAdminStore((s) => s.updateRequestStatus);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 lg:p-8">
      <button onClick={onBack} className="text-stone-500 hover:text-stone-800 text-sm font-medium mb-6 flex items-center gap-1">
        ← Back to List
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8 border-b border-stone-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">{req.name}</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            ${req.status === 'pending' ? 'bg-amber-100 text-amber-800' :
              req.status === 'approved' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'}`}>
            {req.status}
          </span>
        </div>
        {req.status === "pending" && (
          <div className="flex gap-3">
            <button
              onClick={() => { updateStatus(req.id, "approved"); onBack(); }}
              className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2 text-sm"
            >
              <CheckCircle2 className="w-4 h-4" /> Approve
            </button>
            <button
              onClick={() => { updateStatus(req.id, "rejected"); onBack(); }}
              className="px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-colors flex items-center gap-2 text-sm"
            >
              <XCircle className="w-4 h-4" /> Reject
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-bold text-stone-800 mb-4 border-b border-stone-100 pb-2">Center Information</h3>
          <div className="space-y-4">
            <div><span className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Address</span><span className="text-stone-800">{req.address}</span></div>
            <div>
              <span className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Phone Numbers</span>
              <ul className="text-stone-800 list-disc list-inside">
                {req.telephones.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
            <div><span className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Email</span><span className="text-stone-800">{req.email}</span></div>
            <div><span className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Line ID</span><span className="text-stone-800">{req.lineId || "-"}</span></div>
            <div><span className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Facebook</span><span className="text-stone-800">{req.facebook || "-"}</span></div>
            <div><span className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Website</span><span className="text-stone-800">{req.website || "-"}</span></div>
            <div>
              <span className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Providers</span>
              <span className="text-stone-800">{req.providers?.join(", ") || "-"}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-stone-800 mb-4 border-b border-stone-100 pb-2">Community Leader</h3>
          <div className="space-y-4">
            <div><span className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Name</span><span className="text-stone-800">{req.communityLeaderFirstName} {req.communityLeaderLastName}</span></div>
            <div><span className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Phone</span><span className="text-stone-800">{req.communityLeaderTelephone}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CentersTab() {
  const centers = useAdminStore((s) => s.adminCenters);
  const deleteCenter = useAdminStore((s) => s.deleteCenter);

  const confirmDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      deleteCenter(id);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-stone-200">
        <h2 className="text-xl font-bold text-stone-800">Center Management</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="p-4 font-semibold text-stone-600">Center ID</th>
              <th className="p-4 font-semibold text-stone-600">Center Name</th>
              <th className="p-4 font-semibold text-stone-600">Location</th>
              <th className="p-4 font-semibold text-stone-600 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {centers.map((center) => (
              <tr key={center.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                <td className="p-4 text-stone-500 text-sm font-mono">{center.id}</td>
                <td className="p-4 font-medium text-stone-900">{center.name}</td>
                <td className="p-4 text-stone-600">{center.location}, {center.province}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => confirmDelete(center.id, center.name)}
                    className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Center"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {centers.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-stone-500">No centers registered.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PrivilegesTab() {
  const users = useAdminStore((s) => s.users);
  const updateUserRole = useAdminStore((s) => s.updateUserRole);
  const updateUserStatus = useAdminStore((s) => s.updateUserStatus);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-stone-200 flex flex-wrap gap-4 items-center justify-between">
        <h2 className="text-xl font-bold text-stone-800">Privilege Management</h2>
        <div className="relative w-full sm:w-72">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search username or email..."
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
              <th className="p-4 font-semibold text-stone-600">User</th>
              <th className="p-4 font-semibold text-stone-600">Role</th>
              <th className="p-4 font-semibold text-stone-600">Status</th>
              <th className="p-4 font-semibold text-stone-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-stone-900">{u.name}</div>
                  <div className="text-sm text-stone-500">{u.email}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider
                    ${u.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                      u.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                      u.role === 'center' ? 'bg-amber-100 text-amber-800' :
                      'bg-stone-100 text-stone-700'}`}>
                    {u.role || 'user'}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold
                    ${u.status === 'suspended' ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'}`}>
                    {u.status === 'suspended' ? 'Suspended' : 'Active'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <button
                      onClick={() => updateUserRole(u.id, "super_admin")}
                      className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                    >
                       <Shield className="w-3.5 h-3.5" /> Super Admin
                    </button>
                    <button
                      onClick={() => updateUserRole(u.id, "admin")}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition"
                    >
                       Sub Admin
                    </button>
                    <button
                      onClick={() => updateUserRole(u.id, "user")}
                      className="px-3 py-1.5 bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-lg text-xs font-semibold transition"
                    >
                       Revoke Admin
                    </button>
                    <div className="w-px h-6 bg-stone-200 mx-1"></div>
                    {u.status === "suspended" ? (
                      <button
                         onClick={() => updateUserStatus(u.id, "active")}
                         className="px-3 py-1.5 border border-green-200 text-green-600 hover:bg-green-50 rounded-lg text-xs font-semibold transition"
                      >
                         Unsuspend
                      </button>
                    ) : (
                      <button
                         onClick={() => updateUserStatus(u.id, "suspended")}
                         className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold transition"
                      >
                         Suspend Account
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-stone-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
