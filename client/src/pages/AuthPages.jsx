import { useEffect, useState } from "react";
import { CheckCircle2, CheckSquare, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-[#0b1020] lg:grid lg:grid-cols-2">
      <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-gradient-to-br from-[#171438] via-[#342275] to-[#5740b8] p-12 text-white lg:flex xl:p-16">
        <div className="pointer-events-none absolute -right-32 top-12 h-96 w-96 rounded-full border-[60px] border-white/[0.05]" />
        <div className="pointer-events-none absolute -bottom-36 -left-20 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="relative flex items-center gap-3 text-xl font-extrabold">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur">
            <CheckSquare size={25} />
          </div>
          <div>
            <p>TaskFlow</p>
            <p className="text-xs font-medium text-indigo-200/70">
              Make space for focus
            </p>
          </div>
        </div>

        <div className="relative max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-100">
            <Sparkles size={14} />
            Plan. Focus. Finish.
          </span>
          <h2 className="mt-6 text-5xl font-black leading-[1.08] tracking-tight xl:text-6xl">
            Make every day
            <span className="block bg-gradient-to-r from-indigo-200 to-fuchsia-200 bg-clip-text text-transparent">
              a productive day.
            </span>
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-8 text-indigo-100/80">
            Bring your tasks, priorities and deadlines together in one calm,
            focused workspace.
          </p>
          <div className="mt-9 grid max-w-md gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
              <CheckCircle2 className="text-emerald-200" size={20} />
              <p className="mt-3 text-sm font-bold">Clear your next step</p>
              <p className="mt-1 text-xs leading-5 text-indigo-100/60">
                Make big goals feel manageable.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
              <Sparkles className="text-amber-200" size={20} />
              <p className="mt-3 text-sm font-bold">Celebrate progress</p>
              <p className="mt-1 text-xs leading-5 text-indigo-100/60">
                Every completed task counts.
              </p>
            </div>
          </div>
        </div>

        <p className="relative text-sm text-indigo-200/60">
          TaskFlow · Your personal productivity space
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-md rounded-[2rem] border border-white bg-white p-6 shadow-[0_24px_80px_rgba(27,31,59,0.10)] sm:p-10">
          <div className="mb-8 flex items-center gap-2 font-extrabold text-indigo-700 lg:hidden">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white">
              <CheckSquare size={21} />
            </span>
            TaskFlow
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-500">
            Welcome to TaskFlow
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
          {children}
        </div>
      </section>
    </div>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const [welcomeFading, setWelcomeFading] = useState(false);
  const [destination, setDestination] = useState("/dashboard");

  useEffect(() => {
    if (!welcome) {
      return;
    }

    const fadeTimer = setTimeout(() => setWelcomeFading(true), 2000);
    const navigateTimer = setTimeout(
      () => navigate(destination, { replace: true }),
      3500,
    );

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navigateTimer);
    };
  }, [welcome, destination, navigate]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const user = await login(form);
      setDestination(user.role === "admin" ? "/admin" : "/dashboard");
      setWelcome(true);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to login. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AuthShell
        title="Welcome back"
        subtitle="Sign in to continue managing your tasks."
      >
        <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="block text-sm font-semibold text-slate-700">
            Email
            <input
              className={inputClass}
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Password
            <input
              className={inputClass}
              type="password"
              autoComplete="current-password"
              required
              minLength="6"
              placeholder="Enter your password"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
            />
          </label>
          {error && (
            <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-600">
              {error}
            </p>
          )}
          <button
            disabled={busy}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-indigo-300 disabled:opacity-60"
          >
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            className="font-bold text-indigo-600 hover:underline"
            to="/register"
          >
            Create account
          </Link>
        </p>
      </AuthShell>
      {welcome && (
        <div
          role="status"
          aria-live="polite"
          className={`login-welcome fixed inset-0 z-[100] grid place-items-center bg-gradient-to-br from-[#0b1020] via-[#201b53] to-[#342275] px-6 text-center text-white ${
            welcomeFading ? "opacity-0" : "opacity-100"
          }`}
        >
          <div>
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20">
              <CheckSquare size={32} />
            </div>
            <h1 className="mt-7 text-4xl font-black tracking-tight sm:text-6xl">
              Welcome back to
              <span className="mt-2 block bg-gradient-to-r from-indigo-200 to-fuchsia-200 bg-clip-text text-transparent">
                TASKFLOW
              </span>
            </h1>
          </div>
        </div>
      )}
    </>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const user = await register(form);
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to create account. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start organizing your work with TaskFlow."
    >
      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block text-sm font-semibold text-slate-700">
          Full name
          <input
            className={inputClass}
            required
            minLength="2"
            maxLength="60"
            autoComplete="name"
            placeholder="Your name"
            value={form.name}
            onChange={(event) =>
              setForm({ ...form, name: event.target.value })
            }
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Email
          <input
            className={inputClass}
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Password
          <input
            className={inputClass}
            type="password"
            autoComplete="new-password"
            required
            minLength="6"
            placeholder="At least 6 characters"
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
          />
        </label>
        {error && (
          <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-600">
            {error}
          </p>
        )}
        <button
          disabled={busy}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-indigo-300 disabled:opacity-60"
        >
          {busy ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Already registered?{" "}
        <Link
          className="font-bold text-indigo-600 hover:underline"
          to="/login"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
