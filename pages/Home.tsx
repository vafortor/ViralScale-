
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Zap, TrendingUp, Users, Target, ArrowRight, Share2, Award, Briefcase } from 'lucide-react';
import { MOCK_BUSINESSES } from '../data';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-indigo-50/50 rounded-full blur-3xl -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold mb-8 animate-bounce">
            <Zap className="w-4 h-4" /> 
            <span>Boost your growth by 10x today</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
            Make Your Business <br />
            <span className="text-indigo-600">Go Viral</span> and Scale
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            The platform that combines a business directory with powerful marketing tools. 
            Capture leads, manage referrals, and turn attention into revenue.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link to="/dashboard" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-200">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/explore" className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold text-lg hover:border-indigo-600 transition-all flex items-center justify-center gap-2">
              Explore Businesses <Search className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-slate-200 pt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">5k+</div>
              <div className="text-slate-500 text-sm uppercase tracking-wide font-semibold">Active Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">1.2M</div>
              <div className="text-slate-500 text-sm uppercase tracking-wide font-semibold">Leads Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">24%</div>
              <div className="text-slate-500 text-sm uppercase tracking-wide font-semibold">Avg. Growth Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">10k+</div>
              <div className="text-slate-500 text-sm uppercase tracking-wide font-semibold">Viral Campaigns</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="bg-slate-100 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Businesses</h2>
              <p className="text-slate-600">Discover top-rated services and products trending this week.</p>
            </div>
            <Link to="/explore" className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_BUSINESSES.filter(b => b.isFeatured).map(business => (
              <Link 
                key={business.id} 
                to={`/b/${business.slug}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200"
              >
                <div className="relative h-48">
                  <img src={business.logo} alt={business.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Trending
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-xs font-bold text-indigo-600 mb-2 tracking-widest uppercase">{business.category}</div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">{business.name}</h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{business.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-sm text-slate-700 font-medium">
                      <Users className="w-4 h-4 text-indigo-600" /> {business.reviewCount} customers
                    </div>
                    <div className="font-bold text-slate-900">{business.rating} ★</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Viral Loops Feature Section */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                <Share2 className="w-6 h-6" />
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Built-in Viral Distribution</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Traditional marketing is expensive. We built viral loops directly into your business page. 
                Reward customers for sharing your offers, automatically create referral networks, and 
                climb the trending leaderboard.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "Referral Rewards for Customers",
                  "Business-to-Business Referrals",
                  "Automated Social Sharing Templates",
                  "Trending Leaderboards & Badges"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <Zap className="w-3 h-3 fill-current" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/dashboard" className="inline-flex items-center gap-2 text-indigo-600 font-bold text-lg hover:underline">
                Explore growth tools <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-[3rem] p-8 aspect-square flex flex-col justify-center items-center text-white text-center shadow-2xl">
                <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mb-6">
                  <TrendingUp className="w-12 h-12" />
                </div>
                <div className="text-4xl font-bold mb-2">+342%</div>
                <div className="text-indigo-100 text-lg">Viral reach compared to standard ads</div>
                
                <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 max-w-[240px]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">New Referral</div>
                      <div className="text-xs text-slate-500">2 mins ago</div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600">Jane just referred 5 friends to Sparkly Cleaners!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conversion Focus */}
      <section className="bg-slate-900 py-24 text-white rounded-[3rem] mx-4 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold mb-6">More Than Just a Directory</h2>
            <p className="text-slate-400 text-lg">
              We provide the tools you need to convert clicks into customers and customers into brand advocates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Lead Capture</h3>
              <p className="text-slate-400">Integrated forms and WhatsApp buttons to capture leads instantly on your profile.</p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700">
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Booking & Sales</h3>
              <p className="text-slate-400">Schedule appointments or sell products directly through your shareable microsite.</p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700">
              <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Micro-Incentives</h3>
              <p className="text-slate-400">Set up coupon codes and points-based rewards to keep users coming back.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
