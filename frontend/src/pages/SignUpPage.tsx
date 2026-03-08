import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, BookOpen, UserPlus } from "lucide-react";
import useAuthStore from "../store/authStore";

export function SignUpPage() {
  const navigate = useNavigate();
  const signup = useAuthStore((s) => s.signup);

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [telephone, setTelephone] = useState("");
  const [address, setAddress] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [role, setRole] = useState("USER");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Regex for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }

    if (!telephone.trim()) {
      setError("Telephone is required.");
      return;
    }

    if (!address.trim()) {
      setError("Address is required.");
      return;
    }

    if (!birthDate) {
      setError("Birth date is required.");
      return;
    }

    const birthDateValue = new Date(birthDate);
    if (Number.isNaN(birthDateValue.getTime()) || birthDateValue > new Date()) {
      setError("Birth date must be in the past.");
      return;
    }

    setLoading(true);
    try {
      await signup({
        username: username.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        telephone: telephone.trim(),
        address: address.trim(),
        birthDate,
        role,
      });
      navigate("/login", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign up failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-md mb-4">
              <BookOpen className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-bold text-stone-800">Create account</h1>
            <p className="text-stone-500 mt-1 text-sm">Join Thai Glocal and start exploring</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-stone-700 mb-1.5">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your_username"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition text-stone-800 text-sm"
              />
            </div>

            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-stone-700 mb-1.5">
                First name
              </label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition text-stone-800 text-sm"
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-stone-700 mb-1.5">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition text-stone-800 text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition text-stone-800 text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1.5">
                Password <span className="text-stone-400 font-normal">(min. 6 characters)</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition text-stone-800 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-stone-700 mb-1.5">
                Confirm password
              </label>
              <input
                id="confirm"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition text-stone-800 text-sm"
              />
            </div>

            {/* Telephone */}
            <div>
              <label htmlFor="telephone" className="block text-sm font-medium text-stone-700 mb-1.5">
                Telephone
              </label>
              <input
                id="telephone"
                type="tel"
                autoComplete="tel"
                required
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="0812345678"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition text-stone-800 text-sm"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-stone-700 mb-1.5">
                Address
              </label>
              <input
                id="address"
                type="text"
                autoComplete="street-address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, Bangkok"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition text-stone-800 text-sm"
              />
            </div>

            {/* Birth Date */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-stone-700 mb-1.5">
                Birth date
              </label>
              <input
                id="birthDate"
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition text-stone-800 text-sm"
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-stone-700 mb-1.5">
                Account Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition text-stone-800 text-sm bg-white"
              >
                <option value="USER">Standard User</option>
                <option value="CENTER_ADMIN">Center Admin</option>
                <option value="CENTER_STAFF">Center Staff</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-medium rounded-xl transition-colors shadow-sm text-sm"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {loading ? "Creating accountโ€ฆ" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500">
            Already have an account?{" "}
            <Link to="/login" className="text-amber-600 hover:text-amber-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

