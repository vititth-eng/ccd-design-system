/**
 * The workbench's own control, deliberately not a design-system component.
 *
 * No "use client" directive on purpose. Only client modules import this, so it
 * inherits their boundary — and marking it an entry point makes Next treat its
 * props as a server/client crossing, which flags the onChange callback as an
 * unserialisable prop. The callback is fine; the boundary claim was wrong.
 *
 * CCD has no segmented control and does not need one invented here — the rule
 * is that a component follows from a decided pattern, never the other way
 * round. This exists so the instrument has knobs. It stays in _workbench and
 * never graduates to v3/components without a pattern asking for it.
 */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly { id: T; label: string }[];
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex rounded-md border border-border p-0.5"
    >
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          aria-pressed={value === o.id}
          className={`rounded-sm px-2.5 py-1 text-sm font-medium transition-colors ${
            value === o.id
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
