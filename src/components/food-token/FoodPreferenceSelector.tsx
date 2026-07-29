import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Drumstick } from 'lucide-react';

export default function FoodPreferenceSelector({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onChange('Vegetarian')}
        className={`cursor-pointer rounded-xl p-4 flex flex-col items-center justify-center gap-2 border-2 transition-all ${
          value === 'Vegetarian'
            ? 'border-green-500 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
            : 'border-white/10 bg-white/5 hover:bg-white/10'
        }`}
      >
        <div className={`p-3 rounded-full ${value === 'Vegetarian' ? 'bg-green-500 text-white' : 'bg-white/10 text-gray-400'}`}>
          <Leaf size={32} />
        </div>
        <span className={`font-semibold ${value === 'Vegetarian' ? 'text-green-500' : 'text-gray-400'}`}>
          Vegetarian Meal
        </span>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onChange('Non-Vegetarian')}
        className={`cursor-pointer rounded-xl p-4 flex flex-col items-center justify-center gap-2 border-2 transition-all ${
          value === 'Non-Vegetarian'
            ? 'border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
            : 'border-white/10 bg-white/5 hover:bg-white/10'
        }`}
      >
        <div className={`p-3 rounded-full ${value === 'Non-Vegetarian' ? 'bg-red-500 text-white' : 'bg-white/10 text-gray-400'}`}>
          <Drumstick size={32} />
        </div>
        <span className={`font-semibold ${value === 'Non-Vegetarian' ? 'text-red-500' : 'text-gray-400'}`}>
          Non-Vegetarian Meal
        </span>
      </motion.div>
    </div>
  );
}
