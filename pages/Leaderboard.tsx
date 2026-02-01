
import React from 'react';
import { Award, TrendingUp, Zap, Users, Star, ArrowUp } from 'lucide-react';
import { MOCK_BUSINESSES } from '../data';
import { Link } from 'react-router-dom';

const Leaderboard: React.FC = () => {
  // Sort businesses by mock "viral score"
  const leaderboardItems = [...MOCK_BUSINESSES].sort((a, b) => b.reviewCount - a.reviewCount);

  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-bold mb-6">
          <Award className="w-4 h-4" /> 
          <span>Weekly Viral Ranking</span>
        </div>
        <h1 className="text-5xl font-extrabold text-slate-900 mb-6">Trending Leaderboard</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          The most shared and engaged businesses of the week. Top 3 get free featured placement!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {leaderboardItems.map((business, index) => (
          <Link 
            to={`/b/${business.slug}`}
            key={business.id} 
            className={`group flex flex-col md:flex-row items-center gap-8 p-6 rounded-[2.5rem] border transition-all duration-300 ${
              index < 3 ? 'bg-white border-indigo-200 shadow-xl scale-105 z-10' : 'bg-slate-50/50 border-slate-100 hover:bg-white hover:border-slate-200'
            }`}
          >
            <div className="flex items-center gap-8 w-full md:w-auto">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-2xl ${
                index === 0 ? 'bg-amber-400 text-white shadow-lg shadow-amber-200' : 
                index === 1 ? 'bg-slate-300 text-white shadow-lg shadow-slate-100' :
                index === 2 ? 'bg-orange-400 text-white shadow-lg shadow-orange-100' :
                'bg-slate-200 text-slate-500'
              }`}>
                {index + 1}
              </div>
              <img src={business.logo} alt={business.name} className="w-16 h-16 rounded-2xl object-cover shadow-md" />
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{business.name}</h3>
                <div className="text-sm font-medium text-slate-500">{business.category}</div>
              </div>
            </div>

            <div className="flex-grow flex flex-wrap justify-center md:justify-end gap-12 items-center w-full md:w-auto">
              <div className="text-center">
                <div className="flex items-center gap-1 text-slate-900 font-bold justify-center">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  {business.reviewCount * 12}
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Viral Reach</div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 text-slate-900 font-bold justify-center">
                  <Users className="w-4 h-4 text-emerald-500" />
                  {business.reviewCount}
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Leads Generated</div>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold">
                  <ArrowUp className="w-3 h-3" /> Trending
                </div>
              </div>
              <div className="w-full md:w-32 bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full" 
                  style={{ width: `${100 - (index * 15)}%` }} 
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
