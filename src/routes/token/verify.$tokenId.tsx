import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export const Route = createFileRoute('/token/verify/$tokenId')({
  component: TokenVerifyComponent,
});

function TokenVerifyComponent() {
  const { tokenId } = Route.useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchToken = async () => {
    try {
      const res = await fetch(`/api/food/verify/${tokenId}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to verify token');
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToken();
    const token = localStorage.getItem('dxm26_admin_token');
    if (token) {
      setIsAdmin(true);
    }
  }, [tokenId]);

  const handleRedeem = async () => {
    setRedeemLoading(true);
    const token = localStorage.getItem('dxm26_admin_token');
    try {
      const res = await fetch(`/api/food/redeem/${tokenId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to redeem');
      await fetchToken(); // refresh state
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRedeemLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-primary to-purple-500"></div>
        
        <h2 className="text-3xl font-black text-center text-white mb-8 tracking-wide">TOKEN VERIFICATION</h2>

        {error ? (
          <div className="text-center py-8">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-500 mb-2">Invalid Token</h3>
            <p className="text-gray-400">{error}</p>
          </div>
        ) : data ? (
          <div className="space-y-6">
            <div className="text-center">
              {data.redeemed ? (
                <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-full font-bold mb-4 border border-red-500/30">
                  <XCircle size={20} /> ALREADY REDEEMED
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full font-bold mb-4 border border-green-500/30">
                  <CheckCircle2 size={20} /> TOKEN VALID
                </div>
              )}
            </div>

            <div className="bg-black/50 rounded-xl p-5 border border-white/5 space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Participant Name</p>
                <p className="font-semibold text-lg text-white">{data.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">College</p>
                <p className="font-medium text-gray-300">{data.college_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Food Preference</p>
                <p className={`font-bold ${data.food_type === 'Vegetarian' ? 'text-green-400' : 'text-red-400'}`}>
                  {data.food_type}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Token ID</p>
                <p className="font-mono text-sm bg-white/10 inline-block px-2 py-1 rounded text-gray-300">
                  {data.token_id}
                </p>
              </div>
            </div>

            {isAdmin && !data.redeemed && (
              <button 
                onClick={handleRedeem}
                disabled={redeemLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all flex items-center justify-center"
              >
                {redeemLoading ? <Loader2 className="animate-spin" /> : 'REDEEM TOKEN'}
              </button>
            )}
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}
