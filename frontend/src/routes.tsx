import { createBrowserRouter, Navigate } from "react-router";
import { Root } from "./Root";
import { HomePage } from "./pages/HomePage";
import { WorkshopsPage } from "./pages/WorkshopsPage";
import { WorkshopDetailPage } from "./pages/WorkshopDetailPage";
import { MyBookingsPage } from "./pages/MyBookingsPage";
import { CentersPage, CenterDetailPage } from "./pages/CentersPage";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { ProfilePage } from "./pages/ProfilePage";
import { MyCenterPage } from "./pages/MyCenterPage";
import { WorkshopSessionsPage } from "./pages/WorkshopSessionsPage";
import { CreateProfilePage } from "./pages/CreateProfilePage";
import { AdminPage } from "./pages/AdminPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "home", element: <Navigate to="/" replace /> },
      { path: "workshops", Component: WorkshopsPage },
      { path: "workshops/:id", Component: WorkshopDetailPage },
      { path: "centers", Component: CentersPage },
      { path: "centers/:id", Component: CenterDetailPage },
      { path: "my-bookings", Component: MyBookingsPage },
      { path: "login", Component: LoginPage },
      { path: "signup", Component: SignUpPage },
      { path: "profile", Component: ProfilePage },
      { path: "my-center", Component: MyCenterPage },
      { path: "my-center/workshop/:workshopId", Component: WorkshopSessionsPage },
      { path: "admin", Component: AdminPage },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
  // Standalone page — no Navbar so users must complete their profile
  { path: "/create-profile", Component: CreateProfilePage },
]);
