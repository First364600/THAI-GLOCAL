import { useState } from "react";
import { useNavigate } from "react-router";
import { User, Phone, MapPin, Save, LogOut, AtSign, IdCard } from "lucide-react";
import useAuthStore from "../store/authStore";

function Avatar({ name, size = 80 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";
  return (
    <div
      className="rounded-full bg-amber-500 flex items-center justify-center text-white font-bold select-none"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

const inputCls = "w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition text-stone-800 text-sm";
const labelCls = "block text-sm font-medium text-stone-700 mb-1.5";

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuthStore();

  const [username, setUsername] = useState(user?.username ?? "");
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [telephone, setTelephone] = useState(user?.telephone ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [saved, setSaved] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  const USERNAME_REGEX = /^[a-zA-Z0-9_.]+$/;

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || user.email;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && !USERNAME_REGEX.test(username.trim())) {
      setUsernameError("Username can only contain letters, numbers, _ and .");
      return;
    }
    updateProfile({
      username: username.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      telephone: telephone.trim(),
      address: address.trim(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Hero card */}
        <div
          className="rounded-2xl p-8 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-6"
          style={{ background: "linear-gradient(135deg, #78350f 0%, #b45309 100%)" }}
        >
          <Avatar name={displayName} size={88} />
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-white">{displayName}</h1>
            {user.username && <p className="text-amber-300 text-sm mt-0.5">@{user.username}</p>}
            <p className="text-amber-200 text-sm mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* Edit form */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
          <h2 className="text-lg font-semibold text-stone-800 mb-6">Edit Profile</h2>

          <form onSubmit={handleSave} className="flex flex-col gap-5">

            {/* Username */}
            <div>
              <label htmlFor="p-username" className={labelCls}>Username</label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  id="p-username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (e.target.value && !USERNAME_REGEX.test(e.target.value))
                      setUsernameError("Username can only contain letters, numbers, _ and .");
                    else
                      setUsernameError("");
                  }}
                  placeholder="e.g. somchai99"
                  className={inputCls + (usernameError ? " border-red-400 focus:border-red-400 focus:ring-red-100" : "")}
                />
              </div>
            </div>

            {/* First / Last name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="p-firstname" className={labelCls}>First name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    id="p-firstname"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Somchai"
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="p-lastname" className={labelCls}>Last name</label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    id="p-lastname"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Jaidee"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label className={labelCls}>
                Email address <span className="text-stone-400 font-normal">(cannot change)</span>
              </label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full px-4 py-2.5 rounded-xl border border-stone-100 bg-stone-50 text-stone-400 text-sm cursor-not-allowed"
              />
            </div>

            {/* Telephone */}
            <div>
              <label htmlFor="p-tel" className={labelCls}>Telephone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  id="p-tel"
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="e.g. 081-234-5678"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="p-address" className={labelCls}>Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                <textarea
                  id="p-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  placeholder="123 Moo 4, Tambon Mae Rim, Chiang Mai 50180"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition text-stone-800 text-sm resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm ${
                saved ? "bg-green-500 text-white" : "bg-amber-500 hover:bg-amber-600 text-white"
              }`}
            >
              <Save className="w-4 h-4" />
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Sign out */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

