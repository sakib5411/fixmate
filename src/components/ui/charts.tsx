import type { MonthPoint } from "@/lib/types";
import { BOOKING_STATUS_CLASS, BOOKING_STATUS_LABEL } from "@/lib/constants";
import type { BookingStatus } from "@/lib/types";

export function BarChart({
  data,
  format,
  accent = "bg-brand-500",
}: {
  data: MonthPoint[];
  format?: (value: number) => string;
  accent?: string;
}) {
  const max = Math.max(1, ...data.map((point) => point.value));

  return (
    <div className="flex h-44 items-end gap-2 sm:gap-3">
      {data.map((point) => {
        const height = Math.max(4, Math.round((point.value / max) * 100));
        return (
          <div key={point.month} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <span className="text-[10px] font-semibold text-ink-500">
              {format ? format(point.value) : point.value}
            </span>
            <div className="flex w-full flex-1 items-end">
              <div
                className={`w-full rounded-t-lg ${accent} transition-all`}
                style={{ height: `${height}%` }}
                title={`${point.month}: ${format ? format(point.value) : point.value}`}
              />
            </div>
            <span className="text-[11px] font-medium text-ink-500">{point.month}</span>
          </div>
        );
      })}
    </div>
  );
}

export function StatusBreakdown({
  breakdown,
}: {
  breakdown: Record<string, number>;
}) {
  const entries = (Object.keys(BOOKING_STATUS_LABEL) as BookingStatus[])
    .map((status) => ({ status, count: breakdown[status] ?? 0 }))
    .filter((entry) => entry.count > 0);

  const total = entries.reduce((sum, entry) => sum + entry.count, 0);

  if (!total) {
    return <p className="py-8 text-center text-sm text-ink-500">No job activity yet.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-ink-100">
        {entries.map((entry) => (
          <div
            key={entry.status}
            className={`h-full ${BOOKING_STATUS_CLASS[entry.status].split(" ")[0]}`}
            style={{ width: `${(entry.count / total) * 100}%` }}
            title={`${BOOKING_STATUS_LABEL[entry.status]}: ${entry.count}`}
          />
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {entries.map((entry) => (
          <li key={entry.status} className="flex items-center gap-2 text-xs text-ink-600">
            <span
              className={`size-2.5 shrink-0 rounded-full ${BOOKING_STATUS_CLASS[entry.status].split(" ")[0]}`}
            />
            <span className="truncate">{BOOKING_STATUS_LABEL[entry.status]}</span>
            <span className="ml-auto font-semibold text-ink-900">{entry.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
