import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ListTodo,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import api from "../services/api";

const initialData = { users: [], tasks: [] };

function getErrorMessage(error, fallback) {
  return error.response?.data?.message || fallback;
}

export default function AdminDashboard() {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api
      .get("/admin/overview")
      .then(({ data: overview }) => {
        if (active) {
          setData(overview);
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(getErrorMessage(requestError, "Unable to load admin data."));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const removeTask = async (id) => {
    if (!window.confirm("Delete this task?")) {
      return;
    }

    try {
      await api.delete(`/admin/tasks/${id}`);
      setData((currentData) => ({
        ...currentData,
        tasks: currentData.tasks.filter((task) => task._id !== id),
      }));
      setError("");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Could not delete the task."));
    }
  };

  const removeUser = async (id) => {
    if (!window.confirm("Delete this user and their tasks?")) {
      return;
    }

    try {
      await api.delete(`/admin/users/${id}`);
      setData((currentData) => ({
        users: currentData.users.filter((user) => user._id !== id),
        tasks: currentData.tasks.filter((task) => task.user?._id !== id),
      }));
      setError("");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Could not delete the user."));
    }
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-8">
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#171438] via-[#342275] to-[#5740b8] px-6 py-7 text-white shadow-xl shadow-indigo-200/70 sm:px-9 sm:py-9">
        <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full border-[38px] border-white/[0.07]" />
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-100">
              <ShieldCheck size={14} />
              Control center
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Admin dashboard
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100/75">
              A clear view of your community, activity, and workspace health.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-300/15 text-emerald-200">
              <ShieldCheck size={20} />
            </span>
            <div>
              <p className="text-sm font-bold">Admin access</p>
              <p className="text-xs text-indigo-100/60">Protected workspace</p>
            </div>
            <ArrowUpRight size={16} className="ml-2 text-indigo-200/70" />
          </div>
        </div>
      </section>

      {error && (
        <p
          role="alert"
          className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700"
        >
          {error}
        </p>
      )}

      {loading ? (
        <div className="grid min-h-56 place-items-center rounded-3xl border border-slate-200 bg-white text-sm font-medium text-slate-400 shadow-sm">
          Loading admin workspace...
        </div>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_30px_rgba(27,31,59,0.04)] transition hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(27,31,59,0.09)]">
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Users size={22} />
                </span>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  Community
                </span>
              </div>
              <p className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900">
                {data.users.length}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                Registered users
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Accounts in your workspace
              </p>
            </div>
            <div className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_30px_rgba(27,31,59,0.04)] transition hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(27,31,59,0.09)]">
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-50 text-violet-600">
                  <ListTodo size={22} />
                </span>
                <span className="rounded-full bg-violet-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-600">
                  Activity
                </span>
              </div>
              <p className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900">
                {data.tasks.length}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                Total tasks
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Tasks created across accounts
              </p>
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(27,31,59,0.04)]">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-bold text-slate-900">Users</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Review and manage registered accounts
                </p>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                {data.users.length} total
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 text-[10px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-3 sm:px-6">Name</th>
                    <th className="px-5 py-3">Email</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3 text-right sm:px-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.users.map((user) => (
                    <tr
                      key={user._id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4 font-semibold text-slate-800 sm:px-6">
                        {user.name}
                      </td>
                      <td className="px-5 py-4 text-slate-500">{user.email}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right sm:px-6">
                        {user.role !== "admin" && (
                          <button
                            type="button"
                            onClick={() => removeUser(user._id)}
                            className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                            title="Delete user"
                            aria-label={`Delete ${user.name}`}
                          >
                            <Trash2 size={17} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {data.users.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-10 text-center text-sm text-slate-400"
                      >
                        No users to show yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(27,31,59,0.04)]">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-bold text-slate-900">All tasks</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Workspace activity at a glance
                </p>
              </div>
              <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
                {data.tasks.length} total
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 text-[10px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-3 sm:px-6">Task</th>
                    <th className="px-5 py-3">Owner</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right sm:px-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.tasks.map((task) => (
                    <tr
                      key={task._id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4 font-semibold text-slate-800 sm:px-6">
                        {task.title}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {task.user?.name || "Unknown"}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
                          {task.status.replace("-", " ")}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right sm:px-6">
                        <button
                          type="button"
                          onClick={() => removeTask(task._id)}
                          className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                          title="Delete task"
                          aria-label={`Delete ${task.title}`}
                        >
                          <Trash2 size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {data.tasks.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-10 text-center text-sm text-slate-400"
                      >
                        No tasks to show yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
