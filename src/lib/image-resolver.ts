import gears from "@/assets/bg-gears.jpg";
import robot from "@/assets/bg-robot.jpg";
import turbine from "@/assets/bg-turbine.jpg";
import hero from "@/assets/hero-engine.jpg";

// Map seeded /src/assets/... paths to bundled URLs so images resolve in prod.
const MAP: Record<string, string> = {
  "/src/assets/bg-gears.jpg": gears,
  "/src/assets/bg-robot.jpg": robot,
  "/src/assets/bg-turbine.jpg": turbine,
  "/src/assets/hero-engine.jpg": hero,
};

export function resolveImage(url?: string | null, fallback?: string): string {
  if (!url) return fallback ?? turbine;
  return MAP[url] ?? url;
}

export const FALLBACK_IMAGES = { gears, robot, turbine, hero };
