import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CheckSquare,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Palette,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const defaultWorkspaceColor = "#0b1020";
const workspaceColors = [
  { name: "Midnight", value: "#0b1020" },
  { name: "Graphite", value: "#172033" },
  { name: "Ocean", value: "#102a43" },
  { name: "Forest", value: "#12332c" },
  { name: "Plum", value: "#29163f" },
];

function getReadableTextColor(hexColor) {
  const channels = hexColor
    .slice(1)
    .match(/.{2}/g)
    .map((channel) => parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4,
    );
  const luminance =
    0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];

  return luminance > 0.42 ? "#172033" : "#f8fafc";
}

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [workspaceColor, setWorkspaceColor] = useState(() => {
    const savedColor = localStorage.getItem("taskflow_workspace_color");
    return /^#[\da-f]{6}$/i.test(savedColor || "")
      ? savedColor
      : defaultWorkspaceColor;
  });
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const pageTitle = pathname.startsWith("/admin")
    ? "Admin console"
    : pathname === "/profile"
      ? "My profile"
      : pathname === "/tasks"
        ? "My tasks"
        : "Overview";
  const initials =
    user?.name
      ?.split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";
  const workspaceTextColor = getReadableTextColor(workspaceColor);

  useEffect(() => {
    localStorage.setItem("taskflow_workspace_color", workspaceColor);
  }, [workspaceColor]);

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? "bg-white text-indigo-700 shadow-lg shadow-slate-950/10"
        : "text-indigo-100/70 hover:bg-white/10 hover:text-white"
    }`;

  const signOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen md:flex"
      style={{
        backgroundColor: workspaceColor,
        "--workspace-text-color": workspaceTextColor,
      }}
    >
      <aside className="relative z-10 flex w-full flex-col overflow-hidden bg-gradient-to-b from-[#171438] via-[#201b53] to-[#171438] p-4 text-white md:fixed md:inset-y-0 md:w-72 md:p-5">
        <div className="pointer-events-none absolute -right-20 top-28 h-56 w-56 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-20 h-52 w-52 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative mb-7 flex items-center gap-3 px-2 py-2">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-500 shadow-lg shadow-indigo-950/30">
            <CheckSquare size={23} />
          </div>
          <div>
            <p className="text-lg font-extrabold tracking-tight">TaskFlow</p>
            <p className="text-xs text-indigo-200/70">Make space for focus</p>
          </div>
          <span className="ml-auto rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-200">
            Workspace
          </span>
        </div>

        <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-200/50">
          Menu
        </p>
        <nav className="relative flex flex-wrap gap-2 md:flex-col">
          <NavLink to="/dashboard" className={linkClass}>
            <LayoutDashboard size={18} />
            <span>Overview</span>
            <ArrowUpRight
              size={15}
              className="ml-auto opacity-0 transition group-[.active]:opacity-70"
            />
          </NavLink>
          <NavLink to="/tasks" className={linkClass}>
            <ListTodo size={18} />
            <span>My tasks</span>
          </NavLink>
          {user?.role === "admin" && (
            <NavLink to="/admin" className={linkClass}>
              <ShieldCheck size={18} />
              <span>Admin</span>
            </NavLink>
          )}
        </nav>

        <div className="relative mt-6 hidden rounded-2xl border border-white/10 bg-white/[0.06] p-4 md:block">
          <div className="mb-3 grid h-9 w-9 place-items-center rounded-xl bg-amber-300/15 text-amber-200">
            <span aria-hidden="true">✦</span>
          </div>
          <p className="text-sm font-bold">A little progress adds up.</p>
          <p className="mt-1 text-xs leading-5 text-indigo-100/60">
            Keep your next step small, clear, and achievable.
          </p>
        </div>

        <div className="relative mt-5 flex items-center gap-2 border-t border-white/10 pt-4 md:mt-auto">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            aria-label={`Open ${user?.name || "user"} profile`}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-xl text-left transition hover:bg-white/5"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-fuchsia-300 to-indigo-300 text-sm font-extrabold text-indigo-950 ring-2 ring-white/10">
              {initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">
                {user?.name}
              </span>
              <span className="block text-xs capitalize text-indigo-200/60">
                {user?.role || "user"} account · View profile
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={signOut}
            title="Log out"
            aria-label="Log out"
            className="rounded-xl p-2.5 text-indigo-100/60 transition hover:bg-rose-400/10 hover:text-rose-200"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1 md:ml-72">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-white/10 bg-[#11152a]/90 px-5 text-white shadow-lg shadow-black/10 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-indigo-300">
                  Personal workspace
                </p>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                <span className="text-xs font-medium text-slate-400">
                  {pageTitle}
                </span>
              </div>
              <p className="mt-0.5 text-sm font-bold text-white">
                A little progress goes a long way
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setColorPickerOpen((open) => !open)}
                aria-expanded={colorPickerOpen}
                aria-haspopup="dialog"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
              >
                <Palette size={16} />
                <span className="hidden sm:inline">Background</span>
              </button>
              {colorPickerOpen && (
                <div
                  role="dialog"
                  aria-label="Choose workspace background color"
                  className="absolute right-0 top-full z-50 mt-3 w-64 rounded-2xl border border-slate-200 bg-white p-4 text-slate-800 shadow-2xl shadow-black/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">Workspace color</p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Pick any background shade
                      </p>
                    </div>
                    <span
                      className="h-7 w-7 rounded-full border border-slate-200"
                      style={{ backgroundColor: workspaceColor }}
                    />
                  </div>

                  <label className="mt-4 flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-300">
                    Custom color
                    <input
                      type="color"
                      value={workspaceColor}
                      onChange={(event) =>
                        setWorkspaceColor(event.target.value)
                      }
                      aria-label="Choose a custom background color"
                      className="h-8 w-10 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                    />
                  </label>

                  <div className="mt-4">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Quick colors
                    </p>
                    <div className="flex items-center gap-2">
                      {workspaceColors.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          title={color.name}
                          aria-label={`Set ${color.name} background`}
                          aria-pressed={workspaceColor === color.value}
                          onClick={() => setWorkspaceColor(color.value)}
                          className={`h-8 w-8 rounded-full border-2 transition hover:scale-110 ${
                            workspaceColor === color.value
                              ? "border-indigo-500 ring-2 ring-indigo-100"
                              : "border-white shadow-sm"
                          }`}
                          style={{ backgroundColor: color.value }}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setWorkspaceColor(defaultWorkspaceColor)}
                    className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    <RotateCcw size={13} />
                    Reset to default
                  </button>
                </div>
              )}
            </div>
            <span className="hidden rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 sm:inline-flex sm:items-center sm:gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              All systems ready
            </span>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              title="Open profile"
              aria-label={`Open ${user?.name || "user"} profile`}
              className="grid h-9 w-9 place-items-center rounded-full bg-indigo-400/15 text-xs font-bold text-indigo-200 ring-1 ring-white/10 transition hover:bg-indigo-400/25 hover:ring-indigo-300/40"
            >
              {initials}
            </button>
          </div>
        </header>
        <main className="min-w-0 px-4 py-6 sm:px-7 sm:py-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
