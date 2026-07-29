import gearChrome from "@/assets/gear-chrome.png";
import gearDark from "@/assets/gear-dark.png";


/**
 * Site-wide decorative mechanical backdrop.
 * Deep-black / midnight-blue base with a visible, animated gear
 * transmission (multiple gears spinning at different speeds and
 * directions). No colored glow orbs — clean industrial look.
 */
export function MechBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
      {/* Solid deep base — no grid, no blueprint */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 800px at 20% 10%, oklch(0.16 0.05 250), transparent 60%), radial-gradient(1000px 700px at 85% 90%, oklch(0.14 0.06 260), transparent 60%), linear-gradient(180deg, oklch(0.06 0.02 260), oklch(0.04 0.02 260))",
        }}
      />



      {/* GEAR TRANSMISSION — top-left cluster */}
      <img
        src={gearChrome}
        alt=""
        loading="lazy"
        className="absolute -left-16 -top-16 h-72 w-72 opacity-70 animate-gear-cw-fast"
      />
      <img
        src={gearDark}
        alt=""
        loading="lazy"
        className="absolute left-44 top-24 h-44 w-44 opacity-65 animate-gear-ccw-med"
      />
      <img
        src={gearChrome}
        alt=""
        loading="lazy"
        className="absolute left-56 -top-8 h-28 w-28 opacity-60 animate-gear-cw-med"
      />

      {/* Right-side transmission */}
      <img
        src={gearDark}
        alt=""
        loading="lazy"
        className="absolute -right-20 top-1/3 h-[26rem] w-[26rem] opacity-55 animate-gear-ccw-slow"
      />
      <img
        src={gearChrome}
        alt=""
        loading="lazy"
        className="absolute right-52 top-[38%] h-40 w-40 opacity-60 animate-gear-cw-med"
      />

      {/* Bottom cluster */}
      <img
        src={gearChrome}
        alt=""
        loading="lazy"
        className="absolute left-1/4 -bottom-16 h-64 w-64 opacity-60 animate-gear-cw-slow"
      />
      <img
        src={gearDark}
        alt=""
        loading="lazy"
        className="absolute left-[38%] bottom-10 h-36 w-36 opacity-55 animate-gear-ccw-fast"
      />
      <img
        src={gearChrome}
        alt=""
        loading="lazy"
        className="absolute left-[52%] -bottom-8 h-52 w-52 opacity-55 animate-gear-ccw-med"
      />

      {/* Small accent gears */}
      <img
        src={gearDark}
        alt=""
        loading="lazy"
        className="absolute right-1/4 top-16 h-24 w-24 opacity-50 animate-gear-cw-fast"
      />
      <img
        src={gearChrome}
        alt=""
        loading="lazy"
        className="absolute right-1/3 bottom-1/4 h-20 w-20 opacity-50 animate-gear-ccw-fast"
      />

      {/* Vignette top/bottom for readability */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
