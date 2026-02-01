
import React, { useState, useEffect } from 'react';
/* Added missing ArrowRight to imports */
import { Check, Zap, Target, TrendingUp, ShieldCheck, X, CreditCard, Lock, Loader2, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'processing' | 'success'>('details');
  const [currentPlan, setCurrentPlan] = useState<string>(localStorage.getItem('viralscale_plan') || 'Free');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '19',
      description: 'Perfect for new businesses getting traction.',
      features: ['Basic Business Profile', 'Up to 3 active offers', '100 Lead capture limit', 'Social share buttons', 'Basic analytics'],
      color: 'slate'
    },
    {
      id: 'growth',
      name: 'Growth',
      price: '79',
      description: 'For SMEs ready to go viral and automate growth.',
      features: [
        'Unlimited active offers',
        'Advanced Referral Engine',
        'AI Marketing Generator (Gemini)',
        'Unlimited leads & CRM access',
        'Microsite landing pages',
        'Featured status (1 day/mo)'
      ],
      color: 'indigo',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '199',
      description: 'For large brands and multi-location businesses.',
      features: [
        'Multi-location support',
        'Team collaboration tools',
        'API & Webhook access',
        'Custom branding (No Watermark)',
        'Dedicated account manager',
        'Priority placement'
      ],
      color: 'slate'
    }
  ];

  const handleStartCheckout = (plan: any) => {
    setSelectedPlan(plan);
    setIsCheckingOut(true);
    setCheckoutStep('details');
  };

  const handleConfirmPayment = () => {
    setCheckoutStep('processing');
    setTimeout(() => {
      setCheckoutStep('success');
      localStorage.setItem('viralscale_plan', selectedPlan.name);
      setCurrentPlan(selectedPlan.name);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-6">Grow Without Limits</h1>
        <p className="text-xl text-slate-600">
          Choose the plan that fits your business size. Scale from your first 100 customers to millions.
        </p>
        <div className="mt-8 inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full text-indigo-600 font-bold text-sm border border-indigo-100">
          Current Plan: <span className="text-indigo-900 underline">{currentPlan}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`bg-white p-8 rounded-[2.5rem] border flex flex-col transition-all relative ${
              plan.popular 
              ? 'border-indigo-600 shadow-2xl scale-105 z-10' 
              : 'border-slate-200 shadow-sm hover:border-indigo-300'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Most Popular
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
              <p className="text-slate-500 text-sm mb-6">{plan.description}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">${plan.price}</span>
                <span className="text-slate-500 font-medium">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-grow">
              {plan.features.map((feat, i) => (
                <li key={i} className={`flex items-center gap-3 text-sm ${plan.popular ? 'text-slate-700 font-medium' : 'text-slate-600'}`}>
                  <Check className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-indigo-600' : 'text-indigo-400'}`} /> {feat}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleStartCheckout(plan)}
              disabled={currentPlan === plan.name}
              className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                currentPlan === plan.name
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default'
                : plan.popular 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {currentPlan === plan.name ? (
                <><CheckCircle2 className="w-5 h-5" /> Current Plan</>
              ) : (
                <>Get Started <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-24 bg-slate-100 rounded-[3rem] p-12 text-center">
        <h3 className="text-2xl font-bold mb-4">Enterprise Grade Security</h3>
        <div className="flex flex-wrap justify-center gap-8 opacity-50">
          <div className="flex items-center gap-2 font-bold"><ShieldCheck className="w-5 h-5" /> PCI Compliant</div>
          <div className="flex items-center gap-2 font-bold"><Lock className="w-5 h-5" /> SSL Secured</div>
          <div className="flex items-center gap-2 font-bold"><CreditCard className="w-5 h-5" /> Stripe Verified</div>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckingOut && selectedPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsCheckingOut(false)} />
          
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            {checkoutStep === 'details' && (
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-extrabold text-slate-900">Checkout</h2>
                    <p className="text-slate-500">Upgrade to <span className="text-indigo-600 font-bold">{selectedPlan.name}</span></p>
                  </div>
                  <button onClick={() => setIsCheckingOut(false)} className="p-2 bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Subscription Period</span>
                    <span className="text-slate-900 font-bold">Monthly</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Plan Price</span>
                    <span className="text-slate-900 font-bold">${selectedPlan.price}/mo</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-bold text-slate-900">Total Due Today</span>
                    <span className="text-2xl font-black text-indigo-600">${selectedPlan.price}.00</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Card Information</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="4242 4242 4242 4242" 
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-600 focus:outline-none focus:bg-white transition-all font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="MM/YY" className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-mono" />
                    <input type="text" placeholder="CVC" className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-mono" />
                  </div>
                </div>

                <div className="mt-10">
                  <button 
                    onClick={handleConfirmPayment}
                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all"
                  >
                    <Lock className="w-5 h-5" /> Pay & Subscribe
                  </button>
                  <p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed">
                    Secure 256-bit encrypted checkout. You can cancel your subscription at any time from your settings panel.
                  </p>
                </div>
              </div>
            )}

            {checkoutStep === 'processing' && (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <div className="relative mb-8">
                   <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                   <Zap className="absolute inset-0 m-auto w-8 h-8 text-indigo-600 fill-current animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Processing Payment</h3>
                <p className="text-slate-500">Securing your viral growth license...</p>
              </div>
            )}

            {checkoutStep === 'success' && (
              <div className="p-12 md:p-16 text-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-50">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">You're Subscribed!</h2>
                <p className="text-slate-500 text-lg mb-10">Welcome to the <span className="text-indigo-600 font-bold">{selectedPlan.name}</span> tier. Your business growth is about to accelerate.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                   {['AI Copywriter', 'Viral Loops', 'Adv. Stats'].map(f => (
                     <div key={f} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-bold text-slate-600 flex items-center justify-center gap-2">
                       <Zap className="w-3 h-3 text-amber-500 fill-current" /> {f}
                     </div>
                   ))}
                </div>

                {/* Fixed syntax error in button component below */}
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 shadow-xl flex items-center justify-center gap-2"
                >
                  Go to Dashboard <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
