
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Filter, Star, Zap, TrendingUp } from 'lucide-react';
import { MOCK_BUSINESSES } from '../data';
import { Category } from '../types';

const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Object.values(Category)];

  const filteredBusinesses = MOCK_BUSINESSES.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         b.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Discover Amazing Businesses</h1>
        <p className="text-slate-600 text-lg">Find top-rated services, trending products, and exclusive offers.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-6 mb-12">
        <div className="flex-grow flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex-grow flex items-center pl-4 gap-2">
            <Search className="w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by business name or service..." 
              className="w-full bg-transparent border-none focus:ring-0 text-slate-700 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="h-8 w-[1px] bg-slate-200 hidden md:block" />
          <div className="hidden md:flex items-center px-4 gap-2 text-slate-500 whitespace-nowrap">
            <MapPin className="w-5 h-5" />
            <span>Anywhere</span>
          </div>
          <button className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBusinesses.map(business => (
          <Link 
            key={business.id} 
            to={`/b/${business.slug}`}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200"
          >
            <div className="relative h-56">
              <img src={business.logo} alt={business.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {business.isFeatured && (
                <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                  <Star className="w-3 h-3 fill-current" /> Featured
                </div>
              )}
              {business.offers.length > 0 && (
                <div className="absolute bottom-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-bold">
                  {business.offers.length} Active Deals
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div className="text-xs font-bold text-indigo-600 tracking-widest uppercase">{business.category}</div>
                <div className="flex items-center gap-1 text-sm font-bold text-slate-900">
                  <Star className="w-4 h-4 text-amber-500 fill-current" /> {business.rating}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">{business.name}</h3>
              <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                <MapPin className="w-3 h-3" /> {business.location}
              </div>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2">{business.description}</p>
              
              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <div className="bg-slate-100 p-2 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-tighter">Fast Growing</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredBusinesses.length === 0 && (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
          <Search className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No businesses found</h3>
          <p className="text-slate-500">Try adjusting your filters or search keywords.</p>
        </div>
      )}
    </div>
  );
};

export default Explore;
