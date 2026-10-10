import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  RotateCcw,
  Video,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  CreditCard,
  MessageCircle,
  Mail,
  ArrowLeft,
  ShieldAlert,
  HelpCircle,
  FileText
} from 'lucide-react';

export const ReturnPolicyPage: React.FC = () => {
  const { setCurrentView, storeSettings } = useStore();

  const policyPoints = [
    {
      icon: CheckCircle2,
      title: 'Eligible Situations Only',
      text: 'Returns and refunds are accepted strictly for damaged in transit, defective, or incorrect items.',
      badge: 'Accepted',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      icon: Video,
      title: 'Mandatory Unboxing Video',
      text: 'A continuous, uncut unboxing video is mandatory. The video must be recorded before opening the package and throughout the entire unpacking process.',
      badge: 'Strict Requirement',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      icon: AlertTriangle,
      title: 'No Video = No Return / Refund',
      text: 'Without a clear, continuous unboxing video showing the outer seal being opened and contents inspected, return or refund requests cannot be processed.',
      badge: 'Crucial',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      icon: Clock,
      title: '48-Hour Reporting Window',
      text: 'Please contact us within 48 hours of delivery with your unboxing video and clear high-resolution photos of the issue.',
      badge: 'Within 48 Hours',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      icon: XCircle,
      title: 'Exclusions & Handmade Character',
      text: 'Returns are not accepted for change of mind, wrong color/design choice, or minor handmade variations in color tone or sculpting details.',
      badge: 'Not Accepted',
      badgeColor: 'bg-stone-100 text-stone-700 border-stone-200'
    },
    {
      icon: Sparkles,
      title: 'Custom & Personalized Creations',
      text: 'Custom/personalized clay items are non-refundable unless they arrive damaged or incorrect.',
      badge: 'Custom Policy',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      icon: CreditCard,
      title: 'Original Payment Method Reversal',
      text: 'Approved refunds will be processed directly to the original payment method (UPI, Card, Net Banking, or original transaction channel).',
      badge: 'Fast Reversal',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  ];

  const unboxingVideoRules = [
    'Start recording before cutting or breaking any outer tape or postal seal.',
    'Keep the shipping label and tracking barcode clearly visible in the video frame.',
    'Show the continuous unpacking without pausing, cutting, or editing the video.',
    'Carefully inspect each clay piece in front of the camera lens.',
    'Point out any physical damage, breakage, missing parts, or incorrect design immediately.'
  ];

  return (
    <div className="py-10 sm:py-16 bg-[#FFFDF9] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#7D6B5D]">
          <button
            onClick={() => setCurrentView('home')}
            className="hover:text-[#4A3728] transition-colors flex items-center gap-1 cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <span>/</span>
          <span className="text-[#4A3728] font-bold">Return & Refund Policy</span>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF2F4] border border-[#F9D5DF] text-xs font-bold text-[#B85B75] uppercase tracking-wider">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Customer Protection & Quality Guarantee</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A3728] tracking-tight">
            Return & Refund Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#7D6B5D] leading-relaxed">
            Every piece at <strong>PAINITE CRAFTS</strong> is molded, detailed, perfected through our handmade crafting process, and packaged by hand with extreme love and care. Please review our official return and refund guidelines below.
          </p>
        </div>

        {/* Priority Highlight Box: Mandatory Unboxing Video Rule */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50/90 via-rose-50/50 to-amber-50/60 border-2 border-amber-200 shadow-sm space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif text-lg font-bold text-[#4A3728]">
                  Mandatory Continuous Unboxing Video
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold tracking-wide uppercase">
                  No Video = No Return / Refund
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#7D6B5D] mt-1 leading-relaxed">
                Because our items are fragile handcrafted clay art, a continuous, unedited video recorded <strong>from before cutting the parcel seal through unpacking</strong> is strictly mandatory to verify transit damage or missing pieces.
              </p>
            </div>
          </div>

          {/* Unboxing Checklist */}
          <div className="p-4 rounded-2xl bg-white/80 border border-amber-200/80 space-y-2">
            <h3 className="text-xs font-bold text-[#4A3728] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>How to Record an Acceptable Unboxing Video:</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-[#7D6B5D]">
              {unboxingVideoRules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 7 Policy Pillars Grid */}
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-[#4A3728] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#C5A059]" />
            <span>Policy Terms & Conditions</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policyPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-white border border-[#F2E8E0] shadow-xs hover:border-[#E8DCCF] transition-all space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#FDF9F6] border border-[#F2E8E0] flex items-center justify-center text-[#4A3728]">
                        <Icon className="w-4 h-4 text-[#C5A059]" />
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${point.badgeColor}`}>
                        {point.badge}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-sm text-[#4A3728]">
                      {point.title}
                    </h3>
                    <p className="text-xs text-[#7D6B5D] leading-relaxed">
                      {point.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step-by-Step Reporting Guide */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#F2E8E0] shadow-xs space-y-6">
          <div className="border-b border-[#F2E8E0] pb-4">
            <h3 className="font-serif text-lg font-bold text-[#4A3728]">
              How to Submit a Return or Refund Claim
            </h3>
            <p className="text-xs text-[#7D6B5D]">
              Follow these simple 3 steps within 48 hours of parcel delivery:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#FDF9F6] border border-[#F2E8E0] space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[#4A3728] text-white font-bold flex items-center justify-center">
                1
              </div>
              <h4 className="font-bold text-[#4A3728]">Record Unboxing</h4>
              <p className="text-[#7D6B5D] leading-relaxed">
                Take a continuous video before opening the package and during unpacking showing the damage.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FDF9F6] border border-[#F2E8E0] space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[#4A3728] text-white font-bold flex items-center justify-center">
                2
              </div>
              <h4 className="font-bold text-[#4A3728]">Contact Within 48h</h4>
              <p className="text-[#7D6B5D] leading-relaxed">
                Message our team on WhatsApp or Email with your Order Number, video file, and close-up photos.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FDF9F6] border border-[#F2E8E0] space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[#4A3728] text-white font-bold flex items-center justify-center">
                3
              </div>
              <h4 className="font-bold text-[#4A3728]">Prompt Resolution</h4>
              <p className="text-[#7D6B5D] leading-relaxed">
                Once verified, we immediately arrange a free craft replacement or issue a full refund to your original payment method.
              </p>
            </div>
          </div>

          {/* Direct Support Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Painite Crafts Team, I have an issue with my order and I have the unboxing video ready.')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact on WhatsApp ({storeSettings.whatsappNumber})</span>
            </a>

            <a
              href={`mailto:${storeSettings.email}?subject=${encodeURIComponent('Order Issue / Refund Request with Unboxing Video')}`}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#4A3728] hover:bg-[#5D4636] text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Email Studio Support ({storeSettings.email})</span>
            </a>
          </div>
        </div>

        {/* Frequently Asked Policy Questions */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF7F2] border border-[#E8DCCF] space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#C5A059]" />
            <h3 className="font-serif text-base font-bold text-[#4A3728]">
              Important Policy Clarifications
            </h3>
          </div>

          <div className="space-y-3 text-xs text-[#7D6B5D]">
            <div className="p-3.5 rounded-xl bg-white border border-[#E8DCCF]">
              <strong className="text-[#4A3728] block mb-1">
                Q: Why are minor variations in clay details not eligible for returns?
              </strong>
              Each charm and figure is sculpted by human hand without assembly line machines. Micro-variations in clay shading, facial expressions, and tiny handmade textures give each keepsake its unique soul.
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#E8DCCF]">
              <strong className="text-[#4A3728] block mb-1">
                Q: How long does an approved refund take to reflect?
              </strong>
              Once approved, refunds are credited back to your original source account (UPI, Debit/Credit card, Net banking) within 3 to 5 business days.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
