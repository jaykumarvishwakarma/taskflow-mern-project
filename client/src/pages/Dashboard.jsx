import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ListTodo,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import TaskCard from "../components/TaskCard";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const emptyForm = {
  title: "",
  description: "",
  priority: "medium",
  status: "pending",
  dueDate: "",
};

function getErrorMessage(error, fallback) {
  return error.response?.data?.message || fallback;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api
      .get("/tasks")
      .then(({ data }) => {
        if (active) {
          setTasks(data.tasks);
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(getErrorMessage(requestError, "Could not load tasks."));
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

  const stats = useMemo(
    () => ({
      total: tasks.length,
      pending: tasks.filter((task) => task.status === "pending").length,
      progress: tasks.filter((task) => task.status === "in-progress").length,
      completed: tasks.filter((task) => task.status === "completed").length,
    }),
    [tasks],
  );
  const completionRate = stats.total
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;
  const todayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const visibleTasks = tasks.filter((task) => {
    const matchesStatus = filter === "all" || task.status === filter;
    const searchText = `${task.title} ${task.description}`.toLowerCase();
    return matchesStatus && searchText.includes(query.trim().toLowerCase());
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModal(true);
  };

  const openEdit = (task) => {
    setEditing(task);
    setForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().slice(0, 10)
        : "",
    });
    setError("");
    setModal(true);
  };

  const saveTask = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const payload = { ...form, dueDate: form.dueDate || null };
      if (editing) {
        const { data } = await api.put(`/tasks/${editing._id}`, payload);
        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task._id === editing._id ? data.task : task,
          ),
        );
      } else {
        const { data } = await api.post("/tasks", payload);
        setTasks((currentTasks) => [data.task, ...currentTasks]);
      }

      setModal(false);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Could not save task."));
    }
  };

  const deleteTask = async (id) => {
    if (
      !window.confirm(
        "Delete this task? / Kya aap task delete karna chahte hain?",
      )
    ) {
      return;
    }

    try {
      await api.delete(`/tasks/${id}`);
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== id),
      );
      setError("");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Could not delete task."));
    }
  };

  const changeStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/tasks/${id}/status`, { status });
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task._id === id ? data.task : task)),
      );
      setError("");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Could not update status."));
    }
  };

  const statCards = [
    {
      label: "Total tasks",
      value: stats.total,
      note: "Across your workspace",
      icon: ListTodo,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Pending",
      value: stats.pending,
      note: "Ready when you are",
      icon: Clock3,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "In progress",
      value: stats.progress,
      note: "Keep the momentum",
      icon: Clock3,
      color: "bg-sky-50 text-sky-600",
    },
    {
      label: "Completed",
      value: stats.completed,
      note: "Nice work!",
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="mx-auto max-w-[1440px] space-y-8">
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#4338ca] via-[#6546dc] to-[#9b4de0] px-6 py-7 text-white shadow-xl shadow-indigo-200/70 sm:px-9 sm:py-9">
        <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full border-[38px] border-white/[0.07]" />
        <div className="pointer-events-none absolute -bottom-36 right-1/4 h-72 w-72 rounded-full bg-fuchsia-300/15 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_260px] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-50">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              Productivity overview
            </span>
            <h1 className="mt-5 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.7rem]">
              Good to see you, {user?.name?.split(" ")[0] || "there"}!
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
              Make today count. One focused step at a time.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={openCreate}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-indigo-700 shadow-lg shadow-indigo-950/10 transition hover:-translate-y-0.5 hover:bg-indigo-50"
              >
                <Plus size={18} />
                Create a task
                <ArrowUpRight size={16} />
              </button>
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-3 text-xs font-medium text-white/90">
                <CalendarDays size={15} />
                {todayLabel}
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-inner shadow-white/5 backdrop-blur-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-indigo-100">
                  Completion rate
                </p>
                <p className="mt-2 text-4xl font-extrabold tracking-tight">
                  {completionRate}%
                </p>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15">
                <CheckCircle2 size={22} />
              </div>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-indigo-100">
              {stats.completed} of {stats.total} tasks completed
            </p>
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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="group rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(27,31,59,0.04)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(27,31,59,0.09)]"
          >
            <div className="flex items-center justify-between">
              <span
                className={`grid h-11 w-11 place-items-center rounded-2xl ${stat.color}`}
              >
                <stat.icon size={20} />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300">
                TaskFlow
              </span>
            </div>
            <p className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900">
              {stat.value}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-700">
              {stat.label}
            </p>
            <p className="mt-1 text-xs text-slate-400">{stat.note}</p>
          </div>
        ))}
      </section>

      <section className="space-y-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-300"
              style={{
                color: "var(--workspace-text-color)",
                opacity: 0.68,
              }}
            >
              Stay on track
            </p>
            <h2
              className="mt-1 text-2xl font-extrabold tracking-tight text-white"
              style={{ color: "var(--workspace-text-color)" }}
            >
              Your tasks
            </h2>
            <p
              className="mt-1 text-sm text-slate-400"
              style={{
                color: "var(--workspace-text-color)",
                opacity: 0.68,
              }}
            >
              Manage your work and keep moving forward.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={17}
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tasks..."
                aria-label="Search tasks"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 sm:w-56"
              />
            </div>
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filter tasks by status"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="all">All tasks</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid min-h-56 place-items-center rounded-3xl border border-slate-200 bg-white text-sm font-medium text-slate-400 shadow-sm">
            Loading your tasks...
          </div>
        ) : visibleTasks.length > 0 ? (
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(27,31,59,0.04)]">
              <div className="hidden border-b border-slate-100 bg-slate-50/80 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:grid sm:grid-cols-[minmax(0,1.4fr)_minmax(72px,0.6fr)_minmax(100px,0.8fr)_minmax(112px,0.9fr)_68px] sm:gap-x-2">
                <span>Task</span>
                <span>Priority</span>
                <span>Due date</span>
                <span>Status</span>
                <span className="text-right">Actions</span>
              </div>
              <div className="divide-y divide-slate-100">
                {visibleTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={openEdit}
                    onDelete={deleteTask}
                    onStatusChange={changeStatus}
                  />
                ))}
              </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-3xl border border-dashed border-indigo-200 bg-gradient-to-br from-white via-indigo-50/70 to-violet-50 px-6 py-14 text-center">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-100/70 blur-2xl" />
            <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-white text-indigo-600 shadow-lg shadow-indigo-100">
              <Sparkles size={27} />
            </div>
            <h3 className="relative mt-5 text-lg font-extrabold text-slate-900">
              {tasks.length === 0 ? "Start with one small win" : "No tasks found"}
            </h3>
            <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {tasks.length === 0
                ? "Add your first task, set a priority, and turn your plans into progress."
                : "Try another search or status filter to find what you need."}
            </p>
            <button
              type="button"
              onClick={openCreate}
              className="relative mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
            >
              <Plus size={17} />
              Create a task
            </button>
          </div>
        )}
      </section>

      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
          <form
            onSubmit={saveTask}
            className="my-8 w-full max-w-lg rounded-3xl border border-white/70 bg-white p-6 shadow-2xl shadow-slate-950/20 sm:p-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-500">
                  Make it happen
                </p>
                <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                  {editing ? "Edit task" : "Create a task"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModal(false)}
                aria-label="Close task form"
                className="rounded-xl border border-slate-200 px-3 py-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block text-sm font-semibold">
                Task title
                <input
                  required
                  maxLength="100"
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  placeholder="e.g. Complete project report"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </label>
              <label className="block text-sm font-semibold">
                Description
                <textarea
                  rows="3"
                  maxLength="1000"
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="Add some details..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="text-sm font-semibold">
                  Priority
                  <select
                    value={form.priority}
                    onChange={(event) =>
                      setForm({ ...form, priority: event.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-normal outline-none focus:border-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </label>
                <label className="text-sm font-semibold">
                  Status
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({ ...form, status: event.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-normal outline-none focus:border-indigo-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </label>
                <label className="text-sm font-semibold">
                  Deadline
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(event) =>
                      setForm({ ...form, dueDate: event.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-normal outline-none focus:border-indigo-500"
                  />
                </label>
              </div>
              {error && (
                <p role="alert" className="text-sm text-rose-600">
                  {error}
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700">
                {editing ? "Save changes" : "Create task"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
