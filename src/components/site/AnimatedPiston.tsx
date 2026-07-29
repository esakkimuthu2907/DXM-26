import { motion } from "framer-motion";

/**
 * Pure-SVG animated piston with cylinder, connecting rod, crankshaft,
 * exhaust puffs and spark plug ignition. Mechanical / exploded-view feel.
 */
export function AnimatedPiston({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 220"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="metal" x1="0" x2="1">
          <stop offset="0" stopColor="#8a8f99" />
          <stop offset="0.5" stopColor="#e6e8ec" />
          <stop offset="1" stopColor="#6b7280" />
        </linearGradient>
        <linearGradient id="fire" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="oklch(0.85 0.18 80)" />
          <stop offset="0.5" stopColor="oklch(0.72 0.24 45)" />
          <stop offset="1" stopColor="oklch(0.6 0.26 20)" />
        </linearGradient>
      </defs>

      {/* Cylinder walls */}
      <rect x="60" y="20" width="80" height="120" rx="6"
        fill="none" stroke="url(#metal)" strokeWidth="3" />
      <rect x="66" y="26" width="68" height="108" rx="3"
        fill="oklch(0.1 0.02 260)" />

      {/* Spark plug */}
      <rect x="94" y="4" width="12" height="18" rx="2" fill="url(#metal)" />
      <motion.circle
        cx="100" cy="26" r="4"
        fill="url(#fire)"
        animate={{ opacity: [0, 1, 0], r: [2, 6, 2] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeOut" }}
        style={{ filter: "drop-shadow(0 0 8px oklch(0.72 0.24 45))" }}
      />

      {/* Combustion flame */}
      <motion.path
        d="M72 34 Q100 60 128 34 L128 44 Q100 72 72 44 Z"
        fill="url(#fire)"
        animate={{ opacity: [0.2, 0.9, 0.2], scaleY: [0.6, 1.1, 0.6] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "100px 40px" }}
      />

      {/* Piston + rod (moves up/down) */}
      <motion.g
        animate={{ y: [0, 46, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="68" y="60" width="64" height="26" rx="3" fill="url(#metal)" />
        <rect x="68" y="66" width="64" height="3" fill="oklch(0.15 0.02 260)" />
        <rect x="68" y="76" width="64" height="3" fill="oklch(0.15 0.02 260)" />
        <rect x="95" y="86" width="10" height="48" fill="url(#metal)" />
      </motion.g>

      {/* Crankshaft */}
      <circle cx="100" cy="170" r="26" fill="none" stroke="url(#metal)" strokeWidth="3" />
      <motion.g
        style={{ transformOrigin: "100px 170px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="100" cy="170" r="22" fill="oklch(0.14 0.02 260)" stroke="url(#metal)" strokeWidth="2" />
        <circle cx="100" cy="152" r="5" fill="url(#fire)"
          style={{ filter: "drop-shadow(0 0 6px oklch(0.72 0.24 45))" }} />
        <line x1="100" y1="170" x2="100" y2="152" stroke="url(#metal)" strokeWidth="3" />
      </motion.g>

      {/* Exhaust puffs */}
      {[0, 0.3, 0.6].map((delay, i) => (
        <motion.circle
          key={i}
          cx={155 + i * 6}
          cy={40}
          r="4"
          fill="oklch(0.7 0.02 260)"
          animate={{ opacity: [0, 0.5, 0], y: [-2, -30, -40], scale: [0.5, 1.4, 1.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
}
