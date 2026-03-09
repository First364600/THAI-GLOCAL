import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Menu, X, BookOpen, Map, CalendarCheck, User, LogOut, Building2, ShieldAlert, Globe } from "lucide-react";
import useBookingStore from "../store/bookingStore";
import useAuthStore from "../store/authStore";
import useLanguageStore from "../store/languageStore";
import { useTranslation } from "../i18n/useTranslation";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const bookings = useBookingStore((s) => s.bookings);
  const activeCount = bookings.filter((b) => b.status === "confirmed").length;
  const { user, logout } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = user
    ? ([user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || user.email)
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || user.email
    : "";

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMenuOpen(false);
    navigate("/");
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "th" : "en");
  };

  const navLinks = [
    { to: "/", label: t.nav.home, icon: null },
    { to: "/workshops", label: t.nav.workshops, icon: null },
    { to: "/centers", label: t.nav.centers, icon: Map },
    ...(user
      ? [
          { to: "/my-bookings", label: t.nav.myBookings, icon: CalendarCheck },
          { to: "/my-center", label: t.nav.myCenter, icon: Building2 },
        ]
      : []),
    ...(user && (user.role === "admin" || user.role === "super_admin")
      ? [{ to: "/admin", label: t.nav.adminPanel, icon: ShieldAlert }]
      : []),
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-md group-hover:bg-amber-600 transition-colors">
              <BookOpen className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-amber-700 font-semibold tracking-tight" style={{ fontSize: "1rem" }}>
                Thai Glocal
              </span>
              <span className="text-amber-500" style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}>
                ไทยโกลคอล
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-200 relative ${
                  isActive(link.to)
                    ? "bg-amber-50 text-amber-700"
                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                }`}
                style={{ fontSize: "0.875rem" }}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
                {link.to === "/my-bookings" && activeCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-white rounded-full flex items-center justify-center"
                    style={{ fontSize: "0.6rem" }}
                  >
                    {activeCount}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Auth area + Language switch (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-amber-300 hover:bg-amber-50 transition-colors text-stone-600 hover:text-amber-700"
              title={t.langSwitch.label}
              style={{ fontSize: "0.8rem" }}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="font-semibold tracking-wide">{language === "en" ? "TH" : "EN"}</span>
            </button>

            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-stone-50 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-semibold shadow-sm select-none"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {initials}
                  </div>
                  <span className="text-stone-700 font-medium" style={{ fontSize: "0.875rem" }}>
                    {displayName.split(" ")[0]}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-stone-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-stone-50">
                      <p className="text-xs font-medium text-stone-800 truncate">{displayName}</p>
                      <p className="text-xs text-stone-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:bg-stone-50 transition-colors text-sm"
                    >
                      <User className="w-4 h-4" />
                      {t.nav.myProfile}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.nav.signOut}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-50 transition-colors"
                  style={{ fontSize: "0.875rem" }}
                >
                  {t.nav.signIn}
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors shadow-sm"
                  style={{ fontSize: "0.875rem" }}
                >
                  {t.nav.signUp}
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-amber-100 px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors ${
                isActive(link.to)
                  ? "bg-amber-50 text-amber-700"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              {link.icon && <link.icon className="w-4 h-4" />}
              {link.label}
              {link.to === "/my-bookings" && activeCount > 0 && (
                <span
                  className="ml-auto w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center"
                  style={{ fontSize: "0.65rem" }}
                >
                  {activeCount}
                </span>
              )}
            </Link>
          ))}

          <div className="mt-2 pt-2 border-t border-stone-100 flex flex-col gap-1">
            {/* Language Toggle (mobile) */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-stone-600 hover:bg-amber-50 hover:text-amber-700 transition-colors text-sm font-medium"
            >
              <Globe className="w-4 h-4" />
              {t.langSwitch.label}: {language === "en" ? "English → ภาษาไทย" : "ภาษาไทย → English"}
            </button>

            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2">
                  <div
                    className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-semibold shadow-sm select-none"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-800">{displayName}</p>
                    <p className="text-xs text-stone-400">{user.email}</p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  {t.nav.myProfile}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  {t.nav.signOut}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors text-center text-sm"
                >
                  {t.nav.signIn}
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-center transition-colors text-sm font-medium"
                >
                  {t.nav.signUp}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
