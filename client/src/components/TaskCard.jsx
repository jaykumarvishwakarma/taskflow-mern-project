import { CalendarDays, Flag, Pencil, Trash2 } from "lucide-react";

const priorityStyle = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-orange-50 text-orange-700",
  high: "bg-rose-50 text-rose-700",
};

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  return (
    <article className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-4 py-4 transition hover:bg-indigo-50/40 sm:grid-cols-[minmax(0,1.4fr)_minmax(72px,0.6fr)_minmax(100px,0.8fr)_minmax(112px,0.9fr)_68px] sm:gap-x-2 sm:px-5 sm:py-3.5">
      <div className="col-span-2 flex min-w-0 items-center gap-3 sm:col-span-1">
        <span
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${
            task.status === "completed"
              ? "bg-emerald-400"
              : task.status === "in-progress"
                ? "bg-blue-400"
                : "bg-amber-400"
          }`}
        />
        <div className="min-w-0">
          <h3
            className={`truncate text-sm font-bold ${
              task.status === "completed"
                ? "text-slate-400 line-through"
                : "text-slate-800"
            }`}
          >
            {task.title}
          </h3>
          <p className="mt-1 truncate text-xs text-slate-400">
            {task.description || "No description added."}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:justify-self-start">
        <span className="text-[10px] font-medium text-slate-400 sm:hidden">
          Priority
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${priorityStyle[task.priority]}`}
        >
          <Flag size={11} />
          {task.priority}
        </span>
      </div>

      <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 sm:justify-self-start">
        <CalendarDays size={14} className="shrink-0 text-indigo-400" />
        <span className="sm:hidden">Due </span>
        {task.dueDate
          ? new Date(task.dueDate).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "No deadline"}
      </span>

      <select
        aria-label={`Change status for ${task.title}`}
        value={task.status}
        onChange={(event) => onStatusChange(task._id, event.target.value)}
        className="w-full max-w-full rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-600 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-indigo-100 hover:text-indigo-600"
          aria-label={`Edit ${task.title}`}
        >
          <Pencil size={15} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(task._id)}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-100 hover:text-rose-600"
          aria-label={`Delete ${task.title}`}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </article>
  );
}
