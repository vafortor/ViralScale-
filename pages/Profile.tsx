
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Globe, 
  MessageSquare, 
  Share2, 
  Calendar, 
  Zap, 
  CheckCircle2, 
  Star,
  ArrowRight,
  Phone,
  Mail,
  Users,
  Timer,
  X,
  Clock,
  Ticket,
  Check,
  Copy
} from 'lucide-react';
import { MOCK_BUSINESSES } from '../data';

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
    <div className="flex gap-2 items-center text-amber-600 font-mono font-bold text-xs bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
      <Timer className="w-3.5 h-3.5 animate-pulse" />
      <span>{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
    </div>
  );
};

const Profile: React.FC = () => {
  const { slug } = useParams();
  const business = MOCK_BUSINESSES.find(b => b.slug === slug);
  
  // Lead Capture State
  const [leadForm, setLeadForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  
  // Booking State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'success'>('idle');

  // Incentive Claim State
  const [claimedOfferId, setClaimedOfferId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!business) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">Business Not Found</h1>
        <Link to="/explore" className="text-indigo-600 font-bold hover:underline">Return to directory</Link>
      </div>
    );
  }

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus('success');
    setTimeout(() => {
      setShowBookingModal(false);
      setBookingStatus('idle');
    }, 2000);
  };

  const handleClaimOffer = (offerId: string) => {
    setClaimedOfferId(offerId);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const referralLink = `${window.location.origin}/#/b/${business.slug}?ref=user123`;

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Cover Header */}
      <div className="h-64 md:h-80 bg-slate-900 relative">
        <img 
          src={`https://picsum.photos/seed/${business.slug}/1200/400`} 
          alt="Cover" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        <div className="absolute -bottom-16 left-4 md:left-8 lg:left-12 flex flex-col md:flex-row md:items-end gap-6 z-10">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl p-1 shadow-2xl overflow-hidden border-4 border-white">
            <img src={business.logo} alt={business.name} className="w-full h-full object-cover rounded-[1.2rem]" />
          </div>
          <div className="pb-4">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2">{business.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <span className="flex items-center gap-1 font-bold text-white"><Star className="w-4 h-4 text-amber-400 fill-current" /> {business.rating}</span>
              <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm"><MapPin className="w-4 h-4" /> {business.location}</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {business.reviewCount}+ Customers</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 md:right-12 z-10 flex gap-3">
           <button 
             onClick={() => setShowBookingModal(true)}
             className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-bold shadow-xl hover:bg-slate-50 transition-all flex items-center gap-2"
           >
             <Calendar className="w-4 h-4" /> Book Now
           </button>
           <button 
             onClick={() => copyToClipboard(window.location.href, 'share-main')}
             className="p-3 bg-white/20 backdrop-blur-md text-white rounded-2xl hover:bg-white/30 transition-all"
           >
             {copiedId === 'share-main' ? <Check className="w-5 h-5 text-green-400" /> : <Share2 className="w-5 h-5" />}
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2">
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">About</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">{business.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="text-slate-700 font-medium">www.{business.slug}.com</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-slate-700 font-medium">+1 (555) 000-0000</span>
                </div>
              </div>
            </div>

            {/* Micro-Incentives & Offers */}
            {business.offers.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                   <Ticket className="w-6 h-6 text-indigo-600" />
                   <h2 className="text-2xl font-bold text-slate-900">Exclusive Incentives</h2>
                </div>
                <div className="space-y-6">
                  {business.offers.map(offer => {
                    const isClaimed = claimedOfferId === offer.id;
                    return (
                      <div key={offer.id} className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 relative group overflow-hidden hover:border-indigo-200 transition-all shadow-sm">
                        <div className="flex-grow z-10">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">SAVE {offer.discount}</div>
                            <CountdownTimer expiryDate={offer.expiryDate} />
                          </div>
                          <h3 className="text-2xl font-bold text-slate-900 mb-2">{offer.title}</h3>
                          <p className="text-slate-600 text-sm mb-4">{offer.description}</p>
                          {offer.viralBonus && (
                            <div className="inline-flex items-center gap-2 text-indigo-700 font-bold text-xs bg-indigo-50 px-3 py-2 rounded-xl">
                              <Zap className="w-3 h-3 fill-current" /> Referral Bonus: {offer.viralBonus}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-center gap-3 z-10 min-w-[200px]">
                          {!isClaimed ? (
                            <button 
                              onClick={() => handleClaimOffer(offer.id)}
                              className="w-full px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                            >
                              Claim Incentive <Zap className="w-4 h-4" />
                            </button>
                          ) : (
                            <div className="w-full space-y-3">
                              <div className="bg-slate-900 text-white p-4 rounded-2xl text-center border-2 border-dashed border-indigo-400">
                                <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Coupon Code</div>
                                <div className="text-xl font-mono font-bold tracking-[0.2em]">{offer.couponCode || 'CLAIMED'}</div>
                              </div>
                              <button 
                                onClick={() => copyToClipboard(`${referralLink}&offer=${offer.id}`, `offer-${offer.id}`)}
                                className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                              >
                                {copiedId === `offer-${offer.id}` ? <><Check className="w-3 h-3" /> Link Copied!</> : <><Share2 className="w-3 h-3" /> Share to Earn Points</>}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* User Reviews */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Community Reviews</h2>
                <button className="px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold text-sm hover:border-indigo-600 transition-all">Add Review</button>
              </div>
              <div className="space-y-6">
                {[1, 2].map(i => (
                  <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">U</div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">Happy Customer</div>
                          <div className="text-xs text-slate-400">Verified User • 3 days ago</div>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed">"Their viral referral program actually works. I invited 3 friends and got my next booking at a massive discount. Great service quality too!"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lead Capture Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-indigo-50 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                 <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
                   <MessageSquare className="w-5 h-5" />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-slate-900">Inquiry Form</h3>
                   <p className="text-xs text-slate-400">Typical response: Under 2 hours</p>
                 </div>
              </div>
              
              {!submitted ? (
                <form onSubmit={handleLeadSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Your Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Alex Johnson"
                      className="w-full px-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-600 focus:outline-none focus:bg-white transition-all"
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({...leadForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="alex@example.com"
                      className="w-full px-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-600 focus:outline-none focus:bg-white transition-all"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Message</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="How can they help you?"
                      className="w-full px-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-600 focus:outline-none focus:bg-white transition-all resize-none"
                      value={leadForm.message}
                      onChange={(e) => setLeadForm({...leadForm, message: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                    Send Inquiry <ArrowRight className="w-5 h-5" />
                  </button>
                  <p className="text-[10px] text-center text-slate-400 px-4 leading-relaxed">
                    By submitting, you consent to sharing your info with this business.
                  </p>
                </form>
              ) : (
                <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">Success!</h4>
                  <p className="text-slate-500 mb-8">Thanks {leadForm.name.split(' ')[0]}, the business will be in touch shortly.</p>
                  <button onClick={() => setSubmitted(false)} className="text-indigo-600 font-bold hover:underline">Send another inquiry</button>
                </div>
              )}

              {/* Referral Loop Widget */}
              <div className="mt-8 pt-8 border-t border-slate-100">
                <div className="bg-slate-900 rounded-[2rem] p-6 text-white overflow-hidden relative">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold mb-3 text-sm">
                      <Share2 className="w-4 h-4" /> Share & Earn
                    </div>
                    <p className="text-xs text-slate-300 mb-4 leading-relaxed">Refer 5 friends to this business and unlock a <span className="text-white font-bold">Premium Featured Credit</span>.</p>
                    <button 
                      onClick={() => copyToClipboard(referralLink, 'referral-widget')}
                      className="w-full py-3 bg-white text-slate-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"
                    >
                      {copiedId === 'referral-widget' ? (
                        <>Copied! <Check className="w-3.5 h-3.5 text-green-600" /></>
                      ) : (
                        <>Copy My Referral Link <Zap className="w-3 h-3 text-amber-500 fill-current" /></>
                      )}
                    </button>
                  </div>
                  <Zap className="absolute -right-8 -top-8 w-24 h-24 text-white/5 opacity-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowBookingModal(false)} />
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Schedule Service</h3>
                  <p className="text-sm text-slate-500">{business.name}</p>
                </div>
                <button onClick={() => setShowBookingModal(false)} className="p-2 bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {bookingStatus === 'idle' ? (
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Service Type</label>
                      <select className="w-full px-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-600 focus:outline-none font-medium">
                        <option>General Service Inquiry</option>
                        {business.offers.map(o => <option key={o.id}>{o.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Preferred Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                          required
                          type="date"
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-600 focus:outline-none font-medium"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Preferred Time</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                          required
                          type="time"
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-600 focus:outline-none font-medium"
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl">
                    Confirm Booking Request <CheckCircle2 className="w-5 h-5" />
                  </button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">Request Confirmed!</h4>
                  <p className="text-slate-500">The business has been notified and will confirm via email.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
