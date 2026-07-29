import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import FoodPreferenceSelector from '../../components/food-token/FoodPreferenceSelector';

export const Route = createFileRoute('/food-token/register')({
  component: RegisterComponent,
});

function RegisterComponent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    college_name: '',
    email: '',
    mobile: '',
    reg_id: '',
    password: '',
    confirm_password: '',
    secret_code: '',
    food_type: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }
    if (formData.secret_code !== '26VECMECH') {
      setError('Invalid Secret Code');
      return;
    }
    if (!formData.food_type) {
      setError('Please select a food preference');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/food/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Request Submitted</h2>
          <p className="text-gray-400 mb-6">Your food token request has been submitted successfully. Please wait for Admin approval. Your token will be available after approval.</p>
          <button 
            onClick={() => navigate({ to: '/food-token/login' })}
            className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Food Token Registration</h2>
        <p className="text-gray-400 text-center mb-8">Register for your symposium meal</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">College Name *</label>
              <input required name="college_name" value={formData.college_name} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address *</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Mobile Number *</label>
              <input required name="mobile" value={formData.mobile} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password *</label>
              <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password *</label>
              <input required type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Registration ID (Optional)</label>
              <input name="reg_id" value={formData.reg_id} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Secret Code *</label>
              <input required name="secret_code" value={formData.secret_code} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
            </div>
          </div>

          <div className="pt-4">
            <label className="block text-sm font-medium text-gray-300 mb-3 text-center">Food Preference *</label>
            <FoodPreferenceSelector 
              value={formData.food_type} 
              onChange={(val) => setFormData({ ...formData, food_type: val })} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-green-500/25 transition-all flex justify-center items-center mt-6"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Request Food Token'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
