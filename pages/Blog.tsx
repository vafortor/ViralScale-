
import React, { useState } from 'react';
import { BookOpen, ArrowRight, Zap, Target, CheckCircle2 } from 'lucide-react';
import { MOCK_BLOG_POSTS } from '../data';

const Blog: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      setEmail('');
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="mb-16">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-6">Growth Resources</h1>
        <p className="text-xl text-slate-600 max-w-2xl">
          Everything you need to master the ViralScale platform and grow your brand organically.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        {MOCK_BLOG_POSTS.map(post => (
          <div key={post.id} className="group cursor-pointer">
            <div className="relative h-72 rounded-[2.5rem] overflow-hidden mb-6 shadow-xl">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-indigo-600">
                {post.category}
              </div>
            </div>
            <div className="text-sm text-slate-400 font-bold mb-3 tracking-widest uppercase">{post.date}</div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors leading-tight">{post.title}</h2>
            <p className="text-slate-500 text-lg mb-6">{post.excerpt}</p>
            <div className="flex items-center gap-2 text-indigo-600 font-bold group-hover:gap-4 transition-all">
              Read Growth Hack <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-12 text-white text-center relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-bold mb-6">Want personalized growth tips?</h3>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">Join 12,000+ founders receiving our weekly "Viral Loop" newsletter.</p>
          
          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                className="flex-grow bg-slate-800 border-none rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : 'Subscribe'}
              </button>
            </form>
          ) : (
            <div className="max-w-md mx-auto bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-center gap-3 text-emerald-400 mb-2">
                <CheckCircle2 className="w-6 h-6" />
                <span className="font-bold text-lg">You're on the list!</span>
              </div>
              <p className="text-slate-400 text-sm">Check your inbox for the latest growth hacks.</p>
              <button 
                onClick={() => setIsSubscribed(false)}
                className="mt-4 text-xs font-bold text-slate-500 hover:text-white transition-colors underline"
              >
                Subscribe another email
              </button>
            </div>
          )}
        </div>
        <Zap className="absolute -right-12 -top-12 w-64 h-64 text-white/5 opacity-10 pointer-events-none" />
      </div>
    </div>
  );
};

export default Blog;
