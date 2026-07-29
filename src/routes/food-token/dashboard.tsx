import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Download, Printer, LogOut, Clock, XCircle } from 'lucide-react';
import FoodTokenCard from '../../components/food-token/FoodTokenCard';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const Route = createFileRoute('/food-token/dashboard')({
  component: DashboardComponent,
});

function DashboardComponent() {
  const navigate = useNavigate();
  const [token, setToken] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const tokenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const jwt = localStorage.getItem('food_token_auth');
      if (!jwt) {
        navigate({ to: '/food-token/login' });
        return;
      }

      try {
        const res = await fetch('/api/food/me', {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        if (res.status === 401) {
          localStorage.removeItem('food_token_auth');
          navigate({ to: '/food-token/login' });
          return;
        }
        const data = await res.json();
        setToken(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchToken();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('food_token_auth');
    navigate({ to: '/food-token/login' });
  };

  const handleDownloadPDF = async () => {
    if (!tokenRef.current) return;
    try {
      const canvas = await html2canvas(tokenRef.current, { scale: 2, backgroundColor: '#000000' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`DXM26_Food_Token_${token?.token_id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  if (!token) return null;

  return (
    <div className="min-h-screen bg-black p-4 py-8 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Participant Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/10"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {token.status === 'Pending' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center max-w-xl mx-auto backdrop-blur-md"
          >
            <div className="w-16 h-16 bg-yellow-500/20 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Waiting for Admin Approval</h2>
            <p className="text-gray-400">Your request for a {token.food_type} token is under review. Please check back later.</p>
          </motion.div>
        )}

        {token.status === 'Rejected' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-red-950/20 border border-red-500/30 rounded-2xl p-8 text-center max-w-xl mx-auto backdrop-blur-md"
          >
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-2">Request Rejected</h2>
            <p className="text-gray-300 mb-4">Reason: {token.rejection_reason || 'No reason provided.'}</p>
            <button 
              onClick={() => navigate({ to: '/food-token/register' })}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Submit Again
            </button>
          </motion.div>
        )}

        {token.status === 'Approved' && (
          <div className="space-y-8">
            <div className="flex flex-wrap justify-center gap-4 mb-8 print:hidden">
              <button 
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-colors border border-white/10"
              >
                <Download size={20} /> Download PDF
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-medium transition-colors"
              >
                <Printer size={20} /> Print Token
              </button>
            </div>
            
            <div ref={tokenRef} className="print:m-0">
              <FoodTokenCard token={token} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
