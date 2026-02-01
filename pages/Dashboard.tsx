
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Target, 
  Settings, 
  Plus, 
  Zap, 
  TrendingUp, 
  MessageCircle, 
  Megaphone, 
  Sparkles, 
  ArrowRight, 
  Handshake, 
  Image as ImageIcon, 
  Download, 
  X, 
  Calendar, 
  Tag, 
  Gift, 
  Check,
  ExternalLink,
  Timer,
  Clock,
  Briefcase,
  Loader2,
  Copy,
  CheckCheck,
  Trash2,
  AlertCircle,
  MoreVertical,
  CheckCircle2,
  Mail,
  Phone,
  ArrowUpRight,
  Globe,
  Lock,
  Bell,
  Eye,
  Camera,
  MapPin,
  Share2,
  PieChart,
  DollarSign,
  Type,
  Video,
  Twitter,
  Instagram,
  RefreshCw,
  FileText,
  ShieldCheck,
  Award
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { MOCK_ANALYTICS, MOCK_LEADS, MOCK_BUSINESSES, MOCK_BOOKINGS } from '../data';
import { generateViralCopy, optimizeOffer } from '../geminiService';
import { Offer, Booking, Lead } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const CountdownTimer = ({ expiryDate }: { expiryDate: string }) => {
  const [timeLeft, setTimeLeft] = useState<{days:number, hours:number, minutes:number, seconds:number} | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = +new Date(expiryDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryDate]);

  if (!timeLeft) return <span className="text-red-500 font-bold uppercase text-[10px]">Expired</span>;

  return (
    <div className="flex gap-2 items-center text-amber-600 font-mono font-bold text-[10px] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
      <Timer className="w-3 h-3 animate-pulse" />
      <span>{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const flyerRef = useRef<HTMLDivElement>(null);
  const [currentPlan, setCurrentPlan] = useState<string>(localStorage.getItem('viralscale_plan') || 'Free');
  
  // Data States
  const [localBookings, setLocalBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [localLeads, setLocalLeads] = useState<Lead[]>(MOCK_LEADS);
  const [localOffers, setLocalOffers] = useState<Offer[]>(MOCK_BUSINESSES[0].offers);
  
  // Settings States
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [businessSettings, setBusinessSettings] = useState({
    name: 'Sparkly Cleaners',
    email: 'hello@sparklycleaners.com',
    location: 'San Francisco, CA',
    category: 'Home Services',
    description: 'Eco-friendly premium home cleaning services for busy professionals.',
    publicLeaderboard: true,
    autoReplies: true,
    referralBonusEnabled: true
  });

  // Campaign Form State
  const [campaignTopic, setCampaignTopic] = useState('20% off deep clean for new customers');
  const [campaignTone, setCampaignTone] = useState('energetic');
  
  // UI Interaction States
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingManageModal, setShowBookingManageModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadManageModal, setShowLeadManageModal] = useState(false);

  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    discount: '',
    expiryDate: '',
    viralBonus: ''
  });
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleGenerateCopy = async () => {
    if (!campaignTopic) return;
    setIsAIGenerating(true);
    const result = await generateViralCopy(businessSettings.name, businessSettings.category, campaignTopic, campaignTone);
    if (result) {
      setAiResult(result);
    }
    setIsAIGenerating(false);
  };

  const handleOptimizeWithAI = async () => {
    if (!newOffer.title || !newOffer.description) return;
    setIsOptimizing(true);
    const result = await optimizeOffer(newOffer.title, newOffer.description);
    if (result) {
      setNewOffer({
        ...newOffer,
        title: result.optimizedTitle,
        description: result.optimizedDescription,
        viralBonus: result.suggestedViralBonus
      });
    }
    setIsOptimizing(false);
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const offer: Offer = {
      id: Math.random().toString(36).substring(2, 11),
      ...newOffer,
      redeemCount: 0
    };
    setLocalOffers([offer, ...localOffers]);
    setShowOfferModal(false);
    setNewOffer({ title: '', description: '', discount: '', expiryDate: '', viralBonus: '' });
    setActiveTab('offers');
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportFlyer = async () => {
    if (!flyerRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(flyerRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('ViralScale_Flyer_SparklyCleaners.pdf');
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Booking Management Functions
  const openManageBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowBookingManageModal(true);
  };

  const updateBookingStatus = (id: string, newStatus: Booking['status']) => {
    setLocalBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking({ ...selectedBooking, status: newStatus });
    }
  };

  const deleteBooking = (id: string) => {
    if (confirm('Are you sure you want to remove this booking?')) {
      setLocalBookings(prev => prev.filter(b => b.id !== id));
      setShowBookingManageModal(false);
      setSelectedBooking(null);
    }
  };

  // Lead Management Functions
  const openManageLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowLeadManageModal(true);
  };

  const updateLeadStatus = (id: string, newStatus: Lead['status']) => {
    setLocalLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  const deleteLead = (id: string) => {
    if (confirm('Are you sure you want to remove this lead?')) {
      setLocalLeads(prev => prev.filter(l => l.id !== id));
      setShowLeadManageModal(false);
      setSelectedLead(null);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setTimeout(() => {
      setIsSavingSettings(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    }, 1500);
  };

  const Sidebar = () => (
    <div className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 hidden lg:flex flex-col p-6">
      <Link to="/" className="flex items-center gap-2 mb-12">
        <div className="bg-indigo-600 p-1.5 rounded-lg">
          <Zap className="w-5 h-5 text-white fill-current" />
        </div>
        <span className="text-xl font-bold">ViralScale</span>
      </Link>

      <nav className="flex-grow space-y-2 overflow-y-auto pr-2">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'offers', label: 'Incentives', icon: Tag },
          { id: 'leads', label: 'Leads', icon: Users },
          { id: 'bookings', label: 'Bookings', icon: Calendar },
          { id: 'campaigns', label: 'AI Marketing', icon: Megaphone },
          { id: 'referrals', label: 'Partnerships', icon: Handshake },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === item.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <item.icon className="w-5 h-5" /> {item.label}
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-slate-100">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <Settings className="w-5 h-5" /> Settings
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      
      <div className="flex-grow">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 capitalize">{activeTab.replace('-', ' ')}</h1>
              <p className="text-sm text-slate-500">{businessSettings.name} Admin Panel</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm border ${
              currentPlan === 'Growth' ? 'bg-indigo-600 text-white border-indigo-700' :
              currentPlan === 'Enterprise' ? 'bg-slate-900 text-white border-slate-900' :
              currentPlan === 'Starter' ? 'bg-slate-100 text-slate-600 border-slate-200' :
              'bg-slate-50 text-slate-400 border-slate-100'
            }`}>
              {currentPlan === 'Free' ? <Clock className="w-3 h-3" /> : <Award className="w-3 h-3" />}
              {currentPlan} Plan
            </div>
          </div>
          <div className="flex gap-3">
            <Link 
              to={`/b/${businessSettings.name.toLowerCase().replace(' ', '-')}`} 
              target="_blank"
              className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-all"
            >
              View Public Page <ExternalLink className="w-4 h-4" />
            </Link>
            <button 
              onClick={() => setShowOfferModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Incentive
            </button>
          </div>
        </header>

        <main className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {currentPlan === 'Free' && (
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-6 text-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl shadow-indigo-100">
                   <div className="flex items-center gap-4">
                      <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                         <Zap className="w-8 h-8 text-white fill-current animate-pulse" />
                      </div>
                      <div>
                         <h4 className="text-lg font-bold">Upgrade to Growth Tier</h4>
                         <p className="text-indigo-100 text-sm">Unlock AI Campaigns, Unlimited Offers, and advanced viral loops.</p>
                      </div>
                   </div>
                   <Link to="/pricing" className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg whitespace-nowrap">
                     Upgrade Now
                   </Link>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Page Views', value: '12.5k', icon: <TrendingUp className="w-5 h-5" />, color: 'bg-indigo-500', trend: '+12%' },
                  { label: 'Lead Rate', value: ((localLeads.length / 12500) * 100).toFixed(1) + '%', icon: <Target className="w-5 h-5" />, color: 'bg-emerald-500', trend: '+2.1%' },
                  { label: 'Total Leads', value: localLeads.length.toString(), icon: <Users className="w-5 h-5" />, color: 'bg-amber-500', trend: '+18%' },
                  { label: 'Bookings', value: localBookings.filter(b => b.status === 'confirmed').length.toString(), icon: <Calendar className="w-5 h-5" />, color: 'bg-violet-500', trend: '+3' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`${stat.color} p-2 rounded-xl text-white shadow-lg`}>{stat.icon}</div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{stat.trend}</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_ANALYTICS}>
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="views" stroke="#4f46e5" strokeWidth={3} fillOpacity={0.1} fill="#4f46e5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Recent Leads</h3>
                    <button onClick={() => setActiveTab('leads')} className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
                  </div>
                  <div className="space-y-4">
                    {localLeads.slice(0, 3).map(lead => (
                      <div key={lead.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">{lead.name[0]}</div>
                          <div>
                            <div className="font-bold text-slate-900">{lead.name}</div>
                            <div className="text-xs text-slate-500 line-clamp-1">{lead.message}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${
                            lead.status === 'new' ? 'bg-blue-100 text-blue-700' : 
                            lead.status === 'converted' ? 'bg-emerald-100 text-emerald-700' : 
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {lead.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2rem] text-white flex flex-col justify-between overflow-hidden relative">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-400 fill-current" /> Viral Engine Status
                    </h3>
                    <p className="text-slate-400 text-sm mb-6">Your referral loops are converting at <span className="text-white font-bold">4.2x</span> the platform average.</p>
                  </div>
                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-slate-500 uppercase">Weekly Growth Target</span>
                      <span className="text-lg font-bold">78%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full w-[78%] transition-all duration-1000" />
                    </div>
                    <button 
                      onClick={() => setActiveTab('campaigns')}
                      className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all"
                    >
                      Boost Viral Reach
                    </button>
                  </div>
                  <Sparkles className="absolute -right-12 -top-12 w-48 h-48 text-indigo-500/10" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'offers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-900">Incentives & Rewards</h2>
                <div className="text-sm text-slate-500 font-medium">{localOffers.length} Active</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {localOffers.map(offer => (
                  <div key={offer.id} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:border-indigo-200 transition-all flex flex-col group relative">
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-2">
                        <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">{offer.discount} OFF</div>
                        <CountdownTimer expiryDate={offer.expiryDate} />
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"><Settings className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{offer.title}</h3>
                    <p className="text-slate-500 text-sm mb-6 flex-grow">{offer.description}</p>
                    
                    <div className="space-y-4 pt-6 border-t border-slate-100">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 font-medium">Claims</span>
                        <span className="font-bold text-slate-900">{offer.redeemCount}</span>
                      </div>
                      {offer.couponCode && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-400 font-medium">Active Code</span>
                          <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">{offer.couponCode}</span>
                        </div>
                      )}
                      {offer.viralBonus && (
                        <div className="flex items-center gap-2 bg-indigo-50 p-3 rounded-xl text-xs font-bold text-indigo-700">
                          <Zap className="w-3 h-3 fill-current" /> Viral Bonus Enabled
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => setShowOfferModal(true)}
                  className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all"
                >
                  <Plus className="w-10 h-10 mb-4" />
                  <span className="font-bold">Add New Incentive</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
               <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Manage Bookings</h2>
                </div>
                <div className="flex gap-2">
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-bold text-xs shadow-sm">List</button>
                    <button className="px-4 py-2 text-slate-500 font-bold text-xs">Calendar</button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                      <th className="px-8 py-4">Customer</th>
                      <th className="px-8 py-4">Service</th>
                      <th className="px-8 py-4">Date & Time</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {localBookings.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-20 text-center text-slate-400">
                          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                          <p className="font-bold">No bookings found</p>
                        </td>
                      </tr>
                    ) : (
                      localBookings.map(booking => (
                        <tr key={booking.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                {booking.customerName.charAt(0)}
                              </div>
                              <div className="font-bold text-slate-900">{booking.customerName}</div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="text-sm font-medium text-slate-600">{booking.service}</div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="text-sm text-slate-900 font-bold">{booking.date}</div>
                            <div className="text-xs text-slate-400">{booking.time}</div>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                              booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                              'bg-amber-100 text-amber-600'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button 
                              onClick={() => openManageBooking(booking)}
                              className="px-4 py-2 bg-slate-50 text-indigo-600 font-bold text-xs rounded-lg hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-wider"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Total Leads', value: localLeads.length, icon: Users, color: 'text-indigo-600' },
                  { label: 'Conversion Rate', value: ((localLeads.filter(l => l.status === 'converted').length / localLeads.length) * 100).toFixed(1) + '%', icon: TrendingUp, color: 'text-emerald-600' },
                  { label: 'Pipeline Value', value: '$' + (localLeads.length * 150).toLocaleString(), icon: Zap, color: 'text-amber-600' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                      <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                      <Target className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Conversion Pipeline</h2>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-200 hover:bg-slate-100 transition-all">Export CSV</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                        <th className="px-8 py-4">Lead Info</th>
                        <th className="px-8 py-4">Status</th>
                        <th className="px-8 py-4">Source</th>
                        <th className="px-8 py-4">Message Preview</th>
                        <th className="px-8 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {localLeads.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-8 py-20 text-center text-slate-400">
                            <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p className="font-bold">No leads in your pipeline</p>
                          </td>
                        </tr>
                      ) : (
                        localLeads.map(lead => (
                          <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-8 py-5">
                              <div className="font-bold text-slate-900">{lead.name}</div>
                              <div className="text-xs text-slate-400">{lead.email}</div>
                            </td>
                            <td className="px-8 py-5">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                lead.status === 'new' ? 'bg-blue-100 text-blue-600' : 
                                lead.status === 'converted' ? 'bg-emerald-100 text-emerald-600' : 
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {lead.status}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-sm text-slate-500 font-medium">
                              <div className="flex items-center gap-2">
                                <ArrowUpRight className="w-3 h-3 text-slate-300" />
                                {lead.source}
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="text-xs text-slate-500 line-clamp-1 italic max-w-xs">"{lead.message}"</div>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <button 
                                onClick={() => openManageLead(lead)}
                                className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-wider"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="max-w-5xl mx-auto space-y-12 pb-20">
              <div className="bg-gradient-to-br from-slate-900 to-indigo-900 p-12 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-6 h-6 text-indigo-400" />
                    <span className="text-indigo-400 font-bold tracking-widest uppercase text-xs">Viral Campaign Architect</span>
                  </div>
                  <h2 className="text-4xl font-extrabold mb-8">What are we promoting?</h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">Campaign Focus</label>
                      <textarea 
                        rows={3}
                        value={campaignTopic}
                        onChange={(e) => setCampaignTopic(e.target.value)}
                        placeholder="Describe your offer, event, or goal..."
                        className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">Brand Tone</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Energetic', 'Professional', 'Playful', 'FOMO-Driven'].map(tone => (
                          <button
                            key={tone}
                            onClick={() => setCampaignTone(tone.toLowerCase())}
                            className={`px-4 py-3 rounded-xl font-bold text-sm transition-all border ${
                              campaignTone === tone.toLowerCase() 
                              ? 'bg-white text-indigo-900 border-white shadow-lg' 
                              : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            {tone}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={handleGenerateCopy}
                      disabled={isAIGenerating || !campaignTopic}
                      className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-xl shadow-indigo-600/20"
                    >
                      {isAIGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                      {aiResult ? 'Regenerate Campaign' : 'Generate Full Campaign'}
                    </button>
                    {aiResult && (
                      <button 
                        onClick={() => setAiResult(null)}
                        className="px-8 py-4 bg-slate-800 text-slate-300 rounded-2xl font-bold hover:bg-slate-700 transition-all flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" /> Start Over
                      </button>
                    )}
                  </div>
                </div>
                <Zap className="absolute -right-16 -top-16 w-80 h-80 text-white/5 opacity-10" />
              </div>

              {aiResult && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom duration-700">
                  {/* Digital Assets */}
                  <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-indigo-200 transition-all">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                           <div className="p-2 bg-pink-50 text-pink-600 rounded-lg"><Instagram className="w-4 h-4" /></div>
                           <span className="text-xs font-black uppercase tracking-widest text-slate-900">Instagram / FB Caption</span>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(aiResult.instagram, 'ig')}
                          className={`text-[10px] font-bold flex items-center gap-1.5 ${copiedKey === 'ig' ? 'text-emerald-500' : 'text-slate-400 hover:text-indigo-600'}`}
                        >
                          {copiedKey === 'ig' ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedKey === 'ig' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                        {aiResult.instagram}
                      </p>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-indigo-200 transition-all">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                           <div className="p-2 bg-slate-900 text-white rounded-lg"><Video className="w-4 h-4" /></div>
                           <span className="text-xs font-black uppercase tracking-widest text-slate-900">TikTok / Reel Script</span>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(aiResult.tiktokScript, 'tiktok')}
                          className={`text-[10px] font-bold flex items-center gap-1.5 ${copiedKey === 'tiktok' ? 'text-emerald-500' : 'text-slate-400 hover:text-indigo-600'}`}
                        >
                          {copiedKey === 'tiktok' ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedKey === 'tiktok' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                          {aiResult.tiktokScript}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Print & Threads */}
                  <div className="space-y-6">
                    <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                      <div className="relative z-10">
                        <div className="flex justify-between items-center mb-8">
                          <div className="flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-indigo-300" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Flyer Generator</span>
                          </div>
                          <button 
                            onClick={handleExportFlyer}
                            disabled={isExporting}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div ref={flyerRef} className="aspect-[4/5] bg-white rounded-3xl p-8 flex flex-col items-center justify-center text-center text-slate-900">
                          <div className="w-16 h-16 bg-indigo-600 rounded-2xl shadow-xl flex items-center justify-center mb-6">
                             <Zap className="w-8 h-8 text-white fill-current" />
                          </div>
                          <h4 className="text-2xl font-black uppercase tracking-tight leading-tight mb-4">{aiResult.flyerHeadline}</h4>
                          <p className="text-slate-500 text-sm italic mb-6">"{aiResult.flyerSubheadline}"</p>
                          <div className="w-32 h-32 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200 mb-4">
                            <span className="text-[10px] font-bold text-slate-400">QR CODE HERE</span>
                          </div>
                          <div className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Powered by ViralScale.com</div>
                        </div>
                      </div>
                      <Sparkles className="absolute -right-12 -top-12 w-48 h-48 text-white/5 opacity-10" />
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-indigo-200 transition-all">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                           <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Twitter className="w-4 h-4" /></div>
                           <span className="text-xs font-black uppercase tracking-widest text-slate-900">X (Twitter) Thread Hooks</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {aiResult.twitterHooks.map((hook: string, i: number) => (
                          <div key={i} className="group/hook relative p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all">
                            <p className="text-slate-700 text-xs font-bold leading-relaxed pr-8">"{hook}"</p>
                            <button 
                              onClick={() => copyToClipboard(hook, `hook-${i}`)}
                              className="absolute right-3 top-3 p-1.5 text-slate-300 hover:text-indigo-600 transition-colors"
                            >
                              {copiedKey === `hook-${i}` ? <CheckCheck className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'referrals' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Handshake className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Partner Networks</h2>
                    <p className="text-sm text-slate-500">Manage B2B referrals and cross-promotions.</p>
                  </div>
                </div>
                <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Partner
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: 'Home Gardeners Inc', status: 'active', referrals: 24, commission: '$120' },
                  { name: 'Secure Locksmiths', status: 'pending', referrals: 0, commission: '$0' }
                ].map((partner, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 hover:border-indigo-100 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        {partner.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{partner.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${partner.status === 'active' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                          <span className="text-[10px] font-black uppercase text-slate-400">{partner.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="text-sm font-bold text-slate-900">{partner.referrals} referrals</div>
                       <div className="text-xs text-indigo-600 font-medium">Earned {partner.commission}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white overflow-hidden relative">
                <div className="relative z-10">
                   <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                     <Share2 className="w-5 h-5 text-indigo-400" /> Shareable Partner Link
                   </h3>
                   <p className="text-slate-400 text-sm mb-6">Partners use this link to automatically track their referrals to your business.</p>
                   <div className="flex bg-slate-800 p-2 rounded-xl border border-slate-700">
                      <input 
                        readOnly 
                        value="https://viralscale.com/ref/sparkly-cln-p" 
                        className="bg-transparent flex-grow px-4 outline-none text-slate-300 font-mono text-xs"
                      />
                      <button 
                        onClick={() => copyToClipboard('https://viralscale.com/ref/sparkly-cln-p', 'partner-link')}
                        className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${copiedKey === 'partner-link' ? 'bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                      >
                        {copiedKey === 'partner-link' ? 'Copied!' : 'Copy'}
                      </button>
                   </div>
                </div>
                <Handshake className="absolute -right-12 -bottom-12 w-48 h-48 text-indigo-500/10" />
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Avg Customer Value', value: '$185', icon: DollarSign, color: 'text-emerald-600' },
                  { label: 'Growth Multiplier', value: '3.4x', icon: TrendingUp, color: 'text-indigo-600' },
                  { label: 'Viral Reach', value: '42.1k', icon: Zap, color: 'text-amber-600' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-slate-50 rounded-2xl">
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                      <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-96 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" /> Revenue vs. Leads
                  </h3>
                  <div className="flex-grow">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_ANALYTICS}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" hide />
                        <Tooltip />
                        <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRevenue)" />
                        <Area type="monotone" dataKey="leads" stroke="#10b981" fillOpacity={0} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-96 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-emerald-600" /> Traffic Sources
                  </h3>
                  <div className="flex-grow">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Instagram', val: 4500 },
                        { name: 'Direct', val: 3200 },
                        { name: 'Google', val: 2800 },
                        { name: 'Referral', val: 2000 },
                      ]}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="val" radius={[8, 8, 8, 8]}>
                          {[0, 1, 2, 3].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#4f46e5', '#8b5cf6', '#10b981', '#f59e0b'][index % 4]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-1">Business Settings</h2>
                  <p className="text-slate-500">Manage your profile, visibility, and viral engine configurations.</p>
                </div>
                {showSaveSuccess && (
                  <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4" /> Changes Saved Successfully
                  </div>
                )}
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* Profile Section */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-indigo-600" /> Public Profile
                    </h3>
                  </div>
                  <div className="p-8 space-y-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="relative group">
                        <div className="w-32 h-32 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1581578731522-9b7d7b8dc691?auto=format&fit=crop&q=80&w=200" 
                            className="w-full h-full object-cover group-hover:opacity-50 transition-all"
                            alt="Logo"
                          />
                          <button type="button" className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-slate-900 font-bold text-xs bg-white/20 backdrop-blur-sm transition-all">
                            <Camera className="w-6 h-6" />
                          </button>
                        </div>
                        <p className="text-[10px] text-center text-slate-400 mt-2 font-bold uppercase tracking-wider">Update Logo</p>
                      </div>

                      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <div>
                          <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Business Name</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"
                            value={businessSettings.name}
                            onChange={(e) => setBusinessSettings({...businessSettings, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Primary Category</label>
                          <select 
                            className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"
                            value={businessSettings.category}
                            onChange={(e) => setBusinessSettings({...businessSettings, category: e.target.value})}
                          >
                            <option>Home Services</option>
                            <option>Tech & IT</option>
                            <option>Retail</option>
                            <option>Health & Wellness</option>
                            <option>Finance</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Business Location</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                              type="text" 
                              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"
                              value={businessSettings.location}
                              onChange={(e) => setBusinessSettings({...businessSettings, location: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Professional Bio</label>
                      <textarea 
                        rows={3}
                        className="w-full px-4 py-4 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium resize-none"
                        value={businessSettings.description}
                        onChange={(e) => setBusinessSettings({...businessSettings, description: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Growth Engine Settings */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-500 fill-current" /> Viral Engine Control
                    </h3>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-indigo-50/30 transition-all border border-transparent hover:border-indigo-100 group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Public Leaderboard Visibility</p>
                          <p className="text-xs text-slate-400">Allow your business to rank on the weekly trending list.</p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setBusinessSettings({...businessSettings, publicLeaderboard: !businessSettings.publicLeaderboard})}
                        className={`w-12 h-6 rounded-full transition-all relative ${businessSettings.publicLeaderboard ? 'bg-indigo-600' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${businessSettings.publicLeaderboard ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-indigo-50/30 transition-all border border-transparent hover:border-indigo-100 group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Automated AI Replies</p>
                          <p className="text-xs text-slate-400">Gemini will auto-respond to initial inquiries with your brand voice.</p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setBusinessSettings({...businessSettings, autoReplies: !businessSettings.autoReplies})}
                        className={`w-12 h-6 rounded-full transition-all relative ${businessSettings.autoReplies ? 'bg-indigo-600' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${businessSettings.autoReplies ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-indigo-50/30 transition-all border border-transparent hover:border-indigo-100 group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <Gift className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Referral Bonus Engine</p>
                          <p className="text-xs text-slate-400">Enable automated reward distribution for sharing milestones.</p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setBusinessSettings({...businessSettings, referralBonusEnabled: !businessSettings.referralBonusEnabled})}
                        className={`w-12 h-6 rounded-full transition-all relative ${businessSettings.referralBonusEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${businessSettings.referralBonusEnabled ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notifications & Security */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-slate-400" /> Access & Security
                    </h3>
                  </div>
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Admin Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="email" 
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"
                          value={businessSettings.email}
                          onChange={(e) => setBusinessSettings({...businessSettings, email: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3">API Access Key</label>
                      <div className="flex gap-2">
                        <div className="relative flex-grow">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            disabled
                            type="password" 
                            value="sk_viral_89234723948234"
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-mono text-xs"
                          />
                        </div>
                        <button type="button" className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex justify-end">
                  <button 
                    type="submit"
                    disabled={isSavingSettings}
                    className="px-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-bold text-lg hover:bg-slate-800 transition-all flex items-center gap-3 shadow-xl disabled:opacity-50"
                  >
                    {isSavingSettings ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Applying Changes...
                      </>
                    ) : (
                      <>
                        <Check className="w-6 h-6" /> Save All Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Lead Management Modal */}
      {showLeadManageModal && selectedLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowLeadManageModal(false)} />
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Manage Lead</h3>
                    <p className="text-xs text-slate-400">Ref: #{selectedLead.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowLeadManageModal(false)} 
                  className="p-2 bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200/50">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Prospect</span>
                    <span className="font-bold text-slate-900">{selectedLead.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <Mail className="w-4 h-4 text-indigo-400" /> {selectedLead.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" /> Sourced via {selectedLead.source}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">Original Message</span>
                  <div className="p-4 bg-white border border-slate-100 rounded-2xl text-sm text-slate-600 italic leading-relaxed">
                    "{selectedLead.message}"
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {selectedLead.status === 'new' && (
                    <button 
                      onClick={() => updateLeadStatus(selectedLead.id, 'contacted')}
                      className="col-span-2 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                    >
                      <MessageCircle className="w-5 h-5" /> Mark as Contacted
                    </button>
                  )}
                  
                  {selectedLead.status !== 'converted' && (
                    <button 
                      onClick={() => updateLeadStatus(selectedLead.id, 'converted')}
                      className={`${selectedLead.status === 'contacted' ? 'col-span-2' : ''} py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100`}
                    >
                      <CheckCircle2 className="w-5 h-5" /> Mark as Converted
                    </button>
                  )}

                  <button 
                    onClick={() => deleteLead(selectedLead.id)}
                    className="py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl font-bold flex items-center justify-center gap-2 hover:text-red-600 hover:border-red-200 transition-all"
                  >
                    <Trash2 className="w-5 h-5" /> Delete Lead
                  </button>
                  
                  {selectedLead.status === 'converted' && (
                    <div className="col-span-2 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-center gap-3 text-emerald-700 font-bold">
                      <Zap className="w-5 h-5 fill-current" /> Customer Converted!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Management Modal */}
      {showBookingManageModal && selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowBookingManageModal(false)} />
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Manage Booking</h3>
                    <p className="text-xs text-slate-400">Ref: #{selectedBooking.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowBookingManageModal(false)} 
                  className="p-2 bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200/50">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Customer</span>
                    <span className="font-bold text-slate-900">{selectedBooking.customerName}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200/50">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Service</span>
                    <span className="font-bold text-indigo-600">{selectedBooking.service}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200/50">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Date</span>
                    <span className="font-bold text-slate-900">{selectedBooking.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Current Status</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      selectedBooking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 
                      selectedBooking.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {selectedBooking.status !== 'confirmed' && (
                    <button 
                      onClick={() => updateBookingStatus(selectedBooking.id, 'confirmed')}
                      className="col-span-2 py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all"
                    >
                      <CheckCircle2 className="w-5 h-5" /> Confirm Booking
                    </button>
                  )}
                  
                  {selectedBooking.status === 'confirmed' && (
                    <button 
                      className="col-span-2 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
                    >
                      <Check className="w-5 h-5" /> Mark as Completed
                    </button>
                  )}

                  {selectedBooking.status !== 'cancelled' && (
                    <button 
                      onClick={() => updateBookingStatus(selectedBooking.id, 'cancelled')}
                      className="py-4 bg-white border border-red-200 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
                    >
                      <X className="w-5 h-5" /> Cancel
                    </button>
                  )}

                  <button 
                    onClick={() => deleteBooking(selectedBooking.id)}
                    className={`py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl font-bold flex items-center justify-center gap-2 hover:text-red-600 hover:border-red-200 transition-all ${selectedBooking.status === 'cancelled' ? 'col-span-2' : ''}`}
                  >
                    <Trash2 className="w-5 h-5" /> Remove
                  </button>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-indigo-50 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-indigo-600 font-medium leading-relaxed">
                  Status changes will trigger automated email notifications to the customer and update their referral loop progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Incentive Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowOfferModal(false)} />
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900">New Incentive</h2>
                  <p className="text-slate-500">Configure a reward to drive leads and viral shares.</p>
                </div>
                <button 
                  onClick={() => setShowOfferModal(false)}
                  className="p-2 bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateOffer} className="space-y-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Incentive Title</label>
                      <button 
                        type="button"
                        onClick={handleOptimizeWithAI}
                        disabled={isOptimizing || !newOffer.title}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> 
                        {isOptimizing ? 'Working...' : 'Gemini AI Optimize'}
                      </button>
                    </div>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. Early Bird Spring Discount"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-600 bg-slate-50 focus:outline-none focus:bg-white transition-all font-medium"
                        value={newOffer.title}
                        onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Terms & Conditions</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="e.g. Valid for first-time customers only..."
                      className="w-full px-5 py-4 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-600 bg-slate-50 focus:outline-none focus:bg-white transition-all font-medium resize-none"
                      value={newOffer.description}
                      onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Discount / Perk</label>
                      <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                          required
                          type="text" 
                          placeholder="e.g. 25% OFF or Free Gift"
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-600 bg-slate-50 focus:outline-none focus:bg-white transition-all font-medium"
                          value={newOffer.discount}
                          onChange={(e) => setNewOffer({...newOffer, discount: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3">End Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                          required
                          type="date" 
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-600 bg-slate-50 focus:outline-none focus:bg-white transition-all font-medium"
                          value={newOffer.expiryDate}
                          onChange={(e) => setNewOffer({...newOffer, expiryDate: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-indigo-50/50 rounded-[2rem] border border-indigo-100 relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-5 h-5 text-indigo-600 fill-current" />
                      <label className="text-xs font-black uppercase tracking-widest text-indigo-900">Viral Loop Logic</label>
                    </div>
                    <p className="text-xs text-indigo-600/70 mb-6 font-medium">Define what happens when a customer shares this incentive.</p>
                    <div className="relative">
                      <Gift className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                      <input 
                        type="text" 
                        placeholder="e.g. Refer 3 friends to get a 100% Free Upgrade"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white focus:ring-2 focus:ring-indigo-600 bg-white focus:outline-none transition-all font-medium text-indigo-900 shadow-sm"
                        value={newOffer.viralBonus}
                        onChange={(e) => setNewOffer({...newOffer, viralBonus: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                  <button 
                    type="submit"
                    className="flex-grow py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                  >
                    Deploy Incentive <Check className="w-6 h-6" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowOfferModal(false)}
                    className="py-5 px-8 bg-slate-50 text-slate-500 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
