
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Zap, Target, Briefcase, Loader2, CheckCircle2, MapPin } from 'lucide-react';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Home Services',
    location: '',
    goal: 'viral'
  });

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location) return;

    setIsSubmitting(true);
    
    // Simulate world-class onboarding process
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Redirect to dashboard after a brief success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-100">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Growth Profile Created!</h1>
        <p className="text-slate-500 text-lg">Setting up your viral dashboard and AI tools...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest mb-4">
          Step 1 of 1: Profile Setup
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Start Growing Today</h1>
        <p className="text-slate-50 text-lg">Create your business profile in 3 minutes and launch your first viral loop.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-12">
        <form onSubmit={handleCreateProfile} className="space-y-8">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Business Name</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                required
                type="text" 
                placeholder="e.g. Acme Services"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:outline-none bg-slate-50 font-medium transition-all focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:outline-none bg-slate-50 font-medium transition-all focus:bg-white"
              >
                <option value="Tech">Tech</option>
                <option value="Retail">Retail</option>
                <option value="Home Services">Home Services</option>
                <option value="Food & Drink">Food & Drink</option>
                <option value="Health">Health & Wellness</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  required
                  type="text" 
                  placeholder="City, State"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:outline-none bg-slate-50 font-medium transition-all focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Goal for using ViralScale</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setFormData({...formData, goal: 'leads'})}
                className={`p-4 rounded-2xl border-2 transition-all font-bold text-sm flex items-center gap-3 ${
                  formData.goal === 'leads' 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                  : 'border-slate-200 text-slate-600 hover:border-indigo-200'
                }`}
              >
                <Target className="w-5 h-5" /> Generate Leads
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, goal: 'viral'})}
                className={`p-4 rounded-2xl border-2 transition-all font-bold text-sm flex items-center gap-3 ${
                  formData.goal === 'viral' 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                  : 'border-slate-200 text-slate-600 hover:border-indigo-200'
                }`}
              >
                <Zap className="w-5 h-5" /> Go Viral
              </button>
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Scaling your brand...
                </>
              ) : (
                <>
                  Create My Growth Profile <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Secure verified business listing
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
