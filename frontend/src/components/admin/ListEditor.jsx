import { Plus, ChevronUp, ChevronDown, Trash2 } from "lucide-react";

export default function ListEditor({ items, onChange, renderItem, newItem, label }) {
  const list = Array.isArray(items) ? items : [];

  const update = (idx, patch) => {
    const next = [...list];
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  };

  const remove = (idx) => {
    onChange(list.filter((_, i) => i !== idx));
  };

  const move = (idx, dir) => {
    const next = [...list];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  const add = () => {
    onChange([...list, typeof newItem === "function" ? newItem() : { ...newItem }]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-mono-label text-[10px] text-muted-foreground">{label} ({list.length})</p>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-2 px-3 py-2 border border-border hover:border-foreground font-mono-label text-[10px]"
        >
          <Plus size={12} strokeWidth={1.5} /> Ajouter
        </button>
      </div>
      <div className="space-y-4">
        {list.map((it, idx) => (
          <div key={idx} className="border border-border p-5 bg-background">
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono-label text-[10px] text-muted-foreground">
                {String(idx + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  className="w-7 h-7 border border-border hover:border-foreground flex items-center justify-center disabled:opacity-30"
                  aria-label="Monter"
                >
                  <ChevronUp size={12} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => move(idx, 1)}
                  disabled={idx === list.length - 1}
                  className="w-7 h-7 border border-border hover:border-foreground flex items-center justify-center disabled:opacity-30"
                  aria-label="Descendre"
                >
                  <ChevronDown size={12} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="w-7 h-7 border border-border hover:border-destructive hover:text-destructive flex items-center justify-center"
                  aria-label="Supprimer"
                >
                  <Trash2 size={12} strokeWidth={1.5} />
                </button>
              </div>
            </div>
            {renderItem(it, idx, (patch) => update(idx, patch))}
          </div>
        ))}
        {list.length === 0 && (
          <p className="text-center py-8 text-sm text-muted-foreground border border-dashed border-border">
            Aucun élément. Clique sur "Ajouter".
          </p>
        )}
      </div>
    </div>
  );
}
