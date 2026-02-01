
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Menu,
  X,
  Zap,
  ArrowRight,
  TrendingUp,
  BookOpen,
  PlusCircle
} from 'lucide-react';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import Blog from './pages/Blog';
import Leaderboard from './pages/Leaderboard';
import Onboarding from './pages/Onboarding';
import AIAgent from './components/AIAgent';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  if (isDashboard) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-100">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              ViralScale
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/explore" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Explore</Link>
            <Link to="/leaderboard" className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-medium transition-colors">
              <TrendingUp className="w-4 h-4" /> Trending
            </Link>
            <Link to="/blog" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Resources</Link>
            <Link to="/pricing" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Pricing</Link>
            <Link to="/dashboard" className="px-5 py-2.5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-100">
              Dashboard
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden p-4 bg-white border-b border-slate-200 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4">
            <Link to="/explore" onClick={() => setIsOpen(false)} className="text-lg font-medium p-2">Explore</Link>
            <Link to="/leaderboard" onClick={() => setIsOpen(false)} className="text-lg font-medium p-2">Leaderboard</Link>
            <Link to="/blog" onClick={() => setIsOpen(false)} className="text-lg font-medium p-2">Resources</Link>
            <Link to="/pricing" onClick={() => setIsOpen(false)} className="text-lg font-medium p-2">Pricing</Link>
            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="px-4 py-3 bg-indigo-600 text-white rounded-xl text-center font-bold">
              My Business Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/dashboard')) return null;

  return (
    <footer className="bg-slate-900 text-slate-400 py-16 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Zap className="w-4 h-4 text-white fill-current" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">ViralScale</span>
            </Link>
            <p className="max-w-xs text-slate-400 leading-relaxed">
              Empowering 5,000+ businesses to scale through viral growth loops and AI-powered marketing.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Discovery</h4>
            <ul className="space-y-3">
              <li><Link to="/explore" className="hover:text-indigo-400 transition-colors">Directory</Link></li>
              <li><Link to="/leaderboard" className="hover:text-indigo-400 transition-colors">Leaderboard</Link></li>
              <li><Link to="/blog" className="hover:text-indigo-400 transition-colors">Growth Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Business</h4>
            <ul className="space-y-3">
              <li><Link to="/onboarding" className="hover:text-indigo-400 transition-colors">List your Business</Link></li>
              <li><Link to="/pricing" className="hover:text-indigo-400 transition-colors">Pro Tools</Link></li>
              <li><Link to="/dashboard" className="hover:text-indigo-400 transition-colors">Owner Login</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-16 pt-8 text-sm text-center">
          (c) 2026 Ghit Solutions. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/b/:slug" element={<Profile />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/onboarding" element={<Onboarding />} />
          </Routes>
        </main>
        <Footer />
        <AIAgent />
      </div>
    </HashRouter>
  );
};

export default App;
