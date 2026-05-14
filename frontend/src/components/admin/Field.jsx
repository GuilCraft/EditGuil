export function TextField({ label, value, onChange, multiline = false, rows = 3, placeholder, testid }) {
  return (
    <div>
      <label className="font-mono-label text-[10px] text-muted-foreground block mb-2">{label}</label>
      {multiline ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          data-testid={testid}
          className="w-full bg-card border border-border focus:border-foreground outline-none p-3 text-sm rounded-none resize-y"
        />
      ) : (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          data-testid={testid}
          className="w-full bg-card border border-border focus:border-foreground outline-none p-3 text-sm rounded-none"
        />
      )}
    </div>
  );
}

export function ToggleField({ label, value, onChange, testid }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer" data-testid={testid}>
      <span className="font-mono-label text-[10px] text-muted-foreground">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5 border border-border transition-colors ${value ? "bg-foreground" : "bg-card"}`}
        aria-pressed={!!value}
      >
        <span
          className={`absolute top-0.5 w-3.5 h-3.5 transition-transform ${value ? "translate-x-5 bg-background" : "translate-x-0.5 bg-foreground"}`}
        />
      </button>
    </label>
  );
}
