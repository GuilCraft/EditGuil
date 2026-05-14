import { useRef, useState } from "react";
import { api, resolveImage } from "@/lib/api";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

export default function ImageInput({ label, value, onChange, testid }) {
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);

  const onPick = () => fileRef.current?.click();

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const { data } = await api.post("/admin/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(data.url);
      toast.success("Image uploadée");
    } catch (err) {
      const d = err?.response?.data?.detail;
      toast.error(typeof d === "string" ? d : "Échec de l'upload");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <label className="font-mono-label text-[10px] text-muted-foreground block mb-2">{label}</label>
      <div className="flex gap-3 items-start">
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="URL https://… ou /api/uploads/…"
            data-testid={testid}
            className="w-full bg-card border border-border focus:border-foreground outline-none p-3 text-sm rounded-none"
          />
          <button
            type="button"
            onClick={onPick}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-3 py-2 bg-card border border-border hover:border-foreground font-mono-label text-[10px] disabled:opacity-50"
          >
            <Upload size={12} strokeWidth={1.5} />
            {uploading ? "Upload…" : "Uploader un fichier"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
        </div>
        {value && (
          <div className="relative w-24 h-24 border border-border bg-card shrink-0">
            <img src={resolveImage(value)} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -top-2 -right-2 w-5 h-5 bg-background border border-border flex items-center justify-center"
              aria-label="Supprimer"
            >
              <X size={10} strokeWidth={2} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
