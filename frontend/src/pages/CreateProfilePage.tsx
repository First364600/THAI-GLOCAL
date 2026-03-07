import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { User, Phone, MapPin, ArrowRight, AtSign, IdCard, BookOpen } from "lucide-react";
import useAuthStore from "../store/authStore";

const inputCls = "w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition text-stone-800 text-sm";
const labelCls = "block text-sm font-medium text-stone-700 mb-1.5";

export function CreateProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [address, setAddress] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const USERNAME_REGEX = /^[a-zA-Z0-9_.]+$/;

  if (!user) return <Navigate to="/login" replace />;

  // If profile already completed, skip this page
  if (user.firstName && user.username) {
    return <Navigate to="/profile" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!USERNAME_REGEX.test(username.trim())) {
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
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-md mb-4">
              <BookOpen className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-bold text-stone-800">Complete your profile</h1>
            <p className="text-stone-500 mt-1 text-sm text-center">
              Tell us a bit about yourself to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Username */}
            <div>
              <label htmlFor="cp-username" className={labelCls}>
                Username
              </label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  id="cp-username"
                  type="text"
                  required
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
              {usernameError && (
                <p className="mt-1.5 text-xs text-red-500">{usernameError}</p>
              )}
            </div>

            {/* First / Last name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cp-firstname" className={labelCls}>
                  First name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    id="cp-firstname"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Somchai"
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="cp-lastname" className={labelCls}>
                  Last name
                </label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    id="cp-lastname"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Jaidee"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* Telephone */}
            <div>
              <label htmlFor="cp-tel" className={labelCls}>
                Telephone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  id="cp-tel"
                  type="tel"
                  required
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="e.g. 081-234-5678"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="cp-address" className={labelCls}>
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                <textarea
                  id="cp-address"
                  required
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
              className="mt-1 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors shadow-sm text-sm"
            >
              <ArrowRight className="w-4 h-4" />
              Save & Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
