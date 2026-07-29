import DxLogo from '../../assets/dxm26-logo.png';
import { QRCodeSVG } from 'qrcode.react';
import { Leaf, Drumstick, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FoodTokenCard({ token, id }: { token: any, id?: string }) {
  const isVeg = token.food_type === 'Vegetarian';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      id={id}
      className={`relative w-full max-w-2xl mx-auto rounded-3xl overflow-hidden border ${isVeg ? 'border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.15)]' : 'border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)]'} bg-black/40 backdrop-blur-xl`}
    >
      <div className="flex flex-col md:flex-row">
        {/* Left/Top Section - Logo and Type */}
        <div className={`flex flex-col items-center justify-center p-8 md:w-1/3 ${isVeg ? 'bg-green-950/40 text-green-500' : 'bg-red-950/40 text-red-500'} border-b md:border-b-0 md:border-r border-white/10 border-dashed relative`}>
          {isVeg ? <Leaf size={64} className="mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" /> : <Drumstick size={64} className="mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />}
          <h2 className="text-3xl font-black tracking-wider uppercase text-center">
            {isVeg ? 'VEG' : 'NON-VEG'}
          </h2>
          <p className="text-sm tracking-widest mt-1 opacity-80 font-medium">TOKEN</p>
          <div className="flex gap-1 mt-3 opacity-70">
            {[1,2,3].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>)}
          </div>
          
          {/* Ticket cutouts */}
          <div className="hidden md:block absolute -right-3 top-0 bottom-0 w-6 h-full flex flex-col justify-between py-4">
            <div className="w-6 h-6 rounded-full bg-background absolute -top-3 -right-3 shadow-inner"></div>
            <div className="w-6 h-6 rounded-full bg-background absolute -bottom-3 -right-3 shadow-inner"></div>
          </div>
        </div>
        
        {/* Middle Section - Details */}
        <div className="p-8 flex-1 relative">
          <div className="absolute top-4 right-4 flex flex-col items-end opacity-20">
            <h1 className="text-4xl font-black italic">DXM '26</h1>
          </div>
          
          <div className="mb-6 relative z-10">
                {/* DXM logo and small caption */}
                <img src={DxLogo} alt="DXM 26" className="h-8 mb-2" />
                <span className="text-sm font-medium opacity-80">DXM '26</span>
            <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase">Great Moments</p>
          </div>
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3 border-b border-white/5 pb-2">
              <div className={`p-1.5 rounded-full ${isVeg ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-0.5">NAME</p>
                <p className="font-semibold text-lg leading-none">{token.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 border-b border-white/5 pb-2">
              <div className={`p-1.5 rounded-full ${isVeg ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-0.5">COLLEGE NAME</p>
                <p className="font-semibold text-sm leading-tight text-white/90">{token.college_name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - QR Code */}
        <div className={`flex flex-col items-center justify-center p-6 md:w-1/4 ${isVeg ? 'bg-green-950/20' : 'bg-red-950/20'} border-t md:border-t-0 md:border-l border-white/10 border-dashed relative`}>
          <div className="bg-white p-2 rounded-xl mb-4 shadow-lg">
            <QRCodeSVG value={token.qr_code || ''} size={100} level="H" />
          </div>
          
          <div className="text-center w-full">
            <div className={`text-[10px] font-bold tracking-widest mb-1 ${isVeg ? 'text-green-400' : 'text-red-400'} uppercase`}>Token ID</div>
            <div className="bg-black/40 py-1.5 px-3 rounded-md border border-white/10 font-mono text-xs font-semibold tracking-wider w-full text-center">
              {token.token_id}
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-center gap-1 text-[10px] font-semibold text-green-500">
            <CheckCircle2 size={12} /> APPROVED
          </div>
        </div>
      </div>
      
      {/* Footer Banner */}
      <div className={`py-2 text-center text-xs font-bold tracking-widest uppercase ${isVeg ? 'bg-green-900/60 text-green-300' : 'bg-red-900/60 text-red-300'}`}>
        {token.food_type.toUpperCase()} TOKEN
      </div>
    </motion.div>
  );
}
