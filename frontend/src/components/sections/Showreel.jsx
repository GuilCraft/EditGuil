import { useState } from "react";
import { Play, Pause } from "lucide-react";

export default function Showreel() {
  const [playing, setPlaying] = useState(false);

  return (
    <section
      id="showreel"
      data-testid="showreel-section"
      className="py-24 md:py-32 max-w-[1440px] mx-auto px-6 md:px-12"
    >
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="font-mono-label text-[10px] text-muted-foreground mb-4">
            03 — Showreel 2025
          </p>
          <h2 className="font-serif-display text-5xl md:text-7xl tracking-tight">
            Une sélection
            <br />
            <span className="italic text-muted-foreground">en mouvement</span>.
          </h2>
        </div>
        <div className="hidden md:flex flex-col items-end gap-1 font-mono-label text-[10px] text-muted-foreground">
          <span>TC : 00:00:00:00</span>
          <span>RUNTIME : 02:48</span>
          <span>FORMAT : 16:9 / 4K</span>
        </div>
      </div>

      {/* Video player frame */}
      <div
        data-testid="showreel-player"
        className="relative w-full aspect-video bg-card border border-border group overflow-hidden"
        onClick={() => setPlaying((p) => !p)}
      >
        {/* Placeholder image */}
        <img
          src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000&auto=format&fit=crop"
          alt="Showreel preview"
          className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-700"
        />

        {/* Top bar */}
        <div className="absolute top-0 inset-x-0 flex items-center justify-between p-5 font-mono-label text-[10px] text-foreground/80 bg-gradient-to-b from-black/60 to-transparent">
          <span>● REC — EDITGUIL // SHOWREEL.MP4</span>
          <span className="hidden sm:inline">CAMERA A — 24FPS</span>
        </div>

        {/* Center play */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            data-testid="showreel-play-btn"
            aria-label={playing ? "Pause showreel" : "Play showreel"}
            className="w-24 h-24 md:w-32 md:h-32 border border-foreground/80 backdrop-blur-md bg-black/30 text-foreground flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
          >
            {playing ? (
              <Pause size={32} strokeWidth={1.25} />
            ) : (
              <Play size={32} strokeWidth={1.25} fill="currentColor" className="ml-1" />
            )}
          </button>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 inset-x-0 p-5 flex items-center justify-between font-mono-label text-[10px] text-foreground/80 bg-gradient-to-t from-black/70 to-transparent">
          <span>00:00 / 02:48</span>
          <span>4K · DOLBY · 2025</span>
        </div>

        {/* Frame corners */}
        <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-foreground/60" />
        <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-foreground/60" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-l border-b border-foreground/60" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-foreground/60" />
      </div>

      <p className="mt-6 font-mono-label text-[10px] text-muted-foreground">
        * Vidéo placeholder — sera remplacée par le showreel final.
      </p>
    </section>
  );
}
