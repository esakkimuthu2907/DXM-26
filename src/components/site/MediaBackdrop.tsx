import v1 from "@/assets/mech-bg-1.mp4.asset.json";
import v2 from "@/assets/mech-bg-2.mp4.asset.json";
import hero from "@/assets/mech-bg-hero.png.asset.json";

// Uses mix-blend-mode: screen — pure black in the source blends into the
// site's black background, effectively removing it.
export function MediaBackdrop({ variant = "video" }: { variant?: "video" | "image" | "dual" }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
      {(variant === "video" || variant === "dual") && (
        <video
          src={v1.url}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-70"
          style={{ mixBlendMode: "screen" }}
        />
      )}
      {variant === "dual" && (
        <video
          src={v2.url}
          autoPlay
          muted
          loop
          playsInline
          className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-60"
          style={{ mixBlendMode: "screen" }}
        />
      )}
      {variant === "image" && (
        <img
          src={hero.url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          style={{ mixBlendMode: "screen" }}
        />
      )}
      {/* subtle vignette so foreground text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background/80" />
    </div>
  );
}
