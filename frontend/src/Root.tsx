import { useEffect } from "react";
import { Outlet, ScrollRestoration } from "react-router";
import { Toaster } from "sonner";
import { Navbar } from "./components/Navbar";
import useAuthStore from "./store/authStore";
import useLanguageStore from "./store/languageStore";

export function Root() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const { language, setLanguage } = useLanguageStore();

  // When user logs in, restore their saved language preference
  useEffect(() => {
    if (user?.language) {
      setLanguage(user.language);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // When language changes, persist it to the user profile
  useEffect(() => {
    if (user) {
      updateProfile({ language });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <>
      <ScrollRestoration />
      <Navbar />
      <Outlet />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "12px",
            fontFamily: "inherit",
            fontSize: "0.875rem",
          },
        }}
      />
    </>
  );
}
