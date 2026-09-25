import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ListTodo,
  FolderKanban,
  CalendarDays,
  Images,
  MapPinned,
  Landmark,
  Users,
  UserCog,
  Settings,
  LogOut,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppStore";
import { logout } from "@/store/slices/authSlice";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/issues", label: "Issues", icon: ListTodo },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/activities", label: "Activities", icon: CalendarDays },
  { to: "/admin/gallery", label: "Gallery", icon: Images },
  { to: "/admin/wards", label: "Wards", icon: MapPinned },
  { to: "/admin/institutions", label: "Institutions", icon: Landmark },
  { to: "/admin/volunteers", label: "Volunteers", icon: Users },
  { to: "/admin/users", label: "Users", icon: UserCog },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white sm:flex">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-600 text-xs font-bold text-white">
            আক
          </span>
          <span className="font-bold text-forest-900">Kanchana Admin</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? "bg-forest-50 text-forest-700" : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                <Icon size={17} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t border-slate-100 p-3">
          <div className="mb-2 px-2 text-xs text-slate-400">
            {user?.name} · {user?.role}
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut size={17} />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
