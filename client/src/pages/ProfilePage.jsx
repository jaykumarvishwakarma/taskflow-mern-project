import { ArrowLeft, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || "User";
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const details = [
    { label: "Full name", value: user?.name || "Not set", icon: UserRound },
    { label: "Email address", value: user?.email || "Not set", icon: Mail },
    {
      label: "Account role",
      value: user?.role || "user",
      icon: ShieldCheck,
      capitalize: true,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_16px_50px_rgba(27,31,59,0.12)]">
        <div className="relative h-36 overflow-hidden bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 sm:h-44">
          <div className="absolute -right-10 -top-32 h-72 w-72 rounded-full border-[34px] border-white/10" />
          <div className="absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="relative p-6 text-white sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-100">
              Account
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
              My profile
            </h1>
            <p className="mt-1 text-sm text-indigo-100/80">
              Your TaskFlow account at a glance.
            </p>
          </div>
        </div>

        <div className="px-5 pb-7 sm:px-8 sm:pb-9">
          <div className="-mt-8 flex flex-col gap-4 sm:-mt-9 sm:flex-row sm:items-end sm:justify-between">
            <div className="grid h-16 w-16 place-items-center rounded-2xl border-4 border-white bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-extrabold text-white shadow-lg shadow-indigo-200 sm:h-[76px] sm:w-[76px]">
              {initials}
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold capitalize text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {user?.role || "user"} account
            </span>
          </div>

          <div className="mt-7">
            <h2 className="text-xl font-extrabold text-slate-900">
              Account details
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your profile information used in this workspace.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {details.map((detail) => (
              <div
                key={detail.label}
                className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-100 text-indigo-600">
                  <detail.icon size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400">
                    {detail.label}
                  </p>
                  <p
                    className={`mt-1 truncate text-sm font-semibold text-slate-800 ${
                      detail.capitalize ? "capitalize" : ""
                    }`}
                  >
                    {detail.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
