import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  Truck,
  Sparkles,
  Package,
  CheckCircle2,
  Clock,
  Heart,
  MapPin,
  Calendar,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Award,
  Gift,
  Palette,
  ArrowRight,
  RefreshCw,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CancelOrderModal } from './CancelOrderModal';
import { OrderTrackingStatus, TrackingStep } from '../types';

interface StepMeta {
  title: OrderTrackingStatus;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  shortDesc: string;
  longDesc: string;
  stageNote: string;
}

const ORDER_STEPS_META: StepMeta[] = [
  {
    title: 'Order Placed',
    label: 'Order Placed',
    icon: ShoppingBag,
    shortDesc: 'Received in studio queue',
    longDesc: 'Your order has been registered in our studio queue and is pending artisan assignment.',
    stageNote: 'Clay block reserved and order sheet queued for artisan desk.'
  },
  {
    title: 'Order Confirmed',
    label: 'Confirmed',
    icon: ShieldCheck,
    shortDesc: 'Artisan assigned & materials prepped',
    longDesc: 'Our master clay artisan has reviewed your pieces, chosen the color batch, and prepped the workbench.',
    stageNote: 'Custom pigments selected and workspace conditioned for shaping.'
  },
  {
    title: 'Crafting Your Piece',
    label: 'Crafting',
    icon: Sparkles,
    shortDesc: 'Sculpting & handmade crafting',
    longDesc: 'Your creation is being gently hand-sculpted through our handmade crafting process and brought to life with love.',
    stageNote: 'Slow hand-molding and dedicated handmade crafting in progress.'
  },
  {
    title: 'Quality Check',
    label: 'Quality Check',
    icon: Award,
    shortDesc: 'Detailing inspection & durability test',
    longDesc: 'Every angle is inspected under studio magnification for smooth seams, clean gloss, and sturdy hardware attachments.',
    stageNote: 'Triple durability test & structural inspection cleared.'
  },
  {
    title: 'Packed with Love',
    label: 'Packed',
    icon: Gift,
    shortDesc: 'Gift wrapping & ribbon sealed',
    longDesc: 'Carefully cushioned in protective pink tissue, tied with satin ribbon, and tucked with a handwritten thank you card.',
    stageNote: 'Signature gift wrap applied with bubble safety lining.'
  },
  {
    title: 'Shipped',
    label: 'Shipped',
    icon: Truck,
    shortDesc: 'Dispatched with courier tracking',
    longDesc: 'Handed over to our reliable delivery partner. Your tracking ID is live and on the move to your city.',
    stageNote: 'Package in transit with express courier partner.'
  },
  {
    title: 'Delivered',
    label: 'Delivered',
    icon: CheckCircle2,
    shortDesc: 'Arrived at your doorstep',
    longDesc: 'Your handcrafted treasure has arrived at your address. Enjoy your cute new piece of art!',
    stageNote: 'Package successfully handed over to recipient.'
  }
];

export const OrderTrackingPage: React.FC = () => {
  const { orders, currentOrder, setCurrentView } = useStore();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [activeStepTab, setActiveStepTab] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [searchInput, setSearchInput] = useState(
    currentOrder?.orderNumber || (orders[0] ? orders[0].orderNumber : 'PC-2026-8491')
  );

  const selectedOrder = orders.find(
    (o) => o.orderNumber.toUpperCase() === searchInput.trim().toUpperCase()
  ) || orders[0];

  const canCancel = selectedOrder && selectedOrder.status !== 'Cancelled' && selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Shipped';
  const isCancelled = selectedOrder?.status === 'Cancelled';

  // Determine standard steps list
  const stepsList = selectedOrder?.trackingSteps && selectedOrder.trackingSteps.length > 0 
    ? selectedOrder.trackingSteps 
    : [
        { title: 'Order Placed' as const, description: 'Received in studio queue', date: 'Aug 20, 10:15 AM', completed: true, current: false },
        { title: 'Order Confirmed' as const, description: 'Artisan assigned & materials prepped', date: 'Aug 20, 11:30 AM', completed: true, current: false },
        { title: 'Crafting Your Piece' as const, description: 'Sculpting at studio workbench', date: 'Aug 21, 02:00 PM', completed: false, current: true },
        { title: 'Quality Check' as const, description: 'Handmade detailing & strength testing', completed: false, current: false },
        { title: 'Packed with Love' as const, description: 'Pink gift wrapping & ribbon sealed', completed: false, current: false },
        { title: 'Shipped' as const, description: 'Dispatched with tracking ID', completed: false, current: false },
        { title: 'Delivered' as const, description: 'Delivered to your doorstep', completed: false, current: false }
      ];

  // Calculate current stage index and progress percentage
  const currentStepIndex = stepsList.findIndex((s) => s.current);
  const lastCompletedIndex = stepsList.map(s => s.completed).lastIndexOf(true);
  const activeStepIdx = currentStepIndex !== -1 ? currentStepIndex : (lastCompletedIndex !== -1 ? lastCompletedIndex : 0);
  const totalStages = stepsList.length;
  
  // Calculate percentage: 0 to 100%
  const progressPercent = selectedOrder?.status === 'Delivered' 
    ? 100 
    : isCancelled 
    ? 0 
    : Math.min(100, Math.round(((activeStepIdx + (currentStepIndex !== -1 ? 0.4 : 0)) / (totalStages - 1)) * 100));

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const currentActiveMeta = ORDER_STEPS_META[activeStepIdx] || ORDER_STEPS_META[0];
  const CurrentActiveIcon = currentActiveMeta.icon;

  return (
    <div className="py-8 sm:py-14 bg-[#FFFDF9] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Section */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF5F7] border border-[#FCE7EC] text-xs font-semibold text-[#B85B75] uppercase tracking-wider mb-3">
            <Truck className="w-3.5 h-3.5" />
            <span>Live Artisan Tracker</span>
          </div>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#3D272A] tracking-tight">
            Track Your Clay Piece
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#6E5357] leading-relaxed">
            Follow your order&apos;s journey step-by-step from raw clay molding and handmade crafting process to signature gift packaging.
          </p>

          {/* Search Box */}
          <div className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D9829B]" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. PC-2026-8491)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-[#FCE7EC] text-xs text-[#3D272A] uppercase placeholder:normal-case font-medium focus:outline-none focus:border-[#B85B75] shadow-2xs"
              />
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#3D272A] text-white text-xs font-semibold hover:bg-[#5C3A42] transition-colors cursor-pointer shadow-xs shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Track Order</span>
            </button>
          </div>

          {/* Quick Select from existing customer orders */}
          {orders.length > 1 && (
            <div className="mt-3 flex items-center justify-center gap-2 flex-wrap text-[11px] text-[#7D6B5D]">
              <span className="font-medium">Recent Orders:</span>
              {orders.slice(0, 3).map((ord) => (
                <button
                  key={ord.id}
                  onClick={() => setSearchInput(ord.orderNumber)}
                  className={`px-2.5 py-0.5 rounded-lg border transition-all cursor-pointer font-mono text-[11px] ${
                    selectedOrder?.id === ord.id
                      ? 'bg-[#B85B75] text-white border-[#B85B75] font-bold shadow-2xs'
                      : 'bg-white text-[#3D272A] border-[#FCE7EC] hover:bg-[#FFF5F7]'
                  }`}
                >
                  #{ord.orderNumber}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Tracking Container */}
        {selectedOrder ? (
          <div className="bg-white rounded-3xl sm:rounded-[36px] border border-[#FCE7EC] p-5 sm:p-10 shadow-xs space-y-8">
            
            {/* Status Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#FAF7F2] gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#B85B75] bg-[#FFF5F7] px-2.5 py-0.5 rounded-full border border-[#F9D5DF]">
                    Handcrafted Order
                  </span>
                  <span className="text-xs text-[#7D6B5D]">•</span>
                  <span className="text-xs text-[#7D6B5D] font-mono">#{selectedOrder.orderNumber}</span>
                </div>
                <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#3D272A] mt-1">
                  Order #{selectedOrder.orderNumber}
                </h2>
                <p className="text-xs text-[#7D6B5D] mt-1">
                  Placed on <strong className="text-[#3D272A]">{selectedOrder.date}</strong> • Total <strong className="text-[#3D272A]">₹{selectedOrder.totalAmount}</strong> • {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${
                  isCancelled
                    ? 'bg-rose-50 border-rose-200'
                    : selectedOrder.status === 'Delivered'
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-[#FFF5F7] border-[#F9D5DF]'
                }`}>
                  {isCancelled ? (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : selectedOrder.status === 'Delivered' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-[#B85B75] animate-pulse shrink-0" />
                  )}
                  <div className="text-left">
                    <span className="text-[10px] text-[#7D6B5D] uppercase font-bold block">Current Stage:</span>
                    <span className={`text-xs font-bold ${
                      isCancelled
                        ? 'text-rose-700'
                        : selectedOrder.status === 'Delivered'
                        ? 'text-emerald-700'
                        : 'text-[#B85B75]'
                    }`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                {canCancel && (
                  <button
                    onClick={() => setIsCancelModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel Order</span>
                  </button>
                )}
              </div>
            </div>

            {/* Cancelled Banner or Active Status Spotlight Banner */}
            {isCancelled ? (
              <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-xl shrink-0 shadow-xs border border-rose-200">
                    🚫
                  </div>
                  <div className="text-xs space-y-1">
                    <span className="font-bold text-rose-950 text-sm block">
                      This order was cancelled {selectedOrder.cancelledDate ? `on ${selectedOrder.cancelledDate}` : ''}.
                    </span>
                    {selectedOrder.cancellationReason && (
                      <span className="text-rose-800 block">
                        <strong>Reason:</strong> {selectedOrder.cancellationReason}
                      </span>
                    )}
                    {selectedOrder.paymentStatus === 'Refunded' ? (
                      <span className="text-emerald-800 font-semibold block">
                        ✓ Full refund of ₹{selectedOrder.totalAmount} has been registered to your original payment method.
                      </span>
                    ) : (
                      <span className="text-rose-700">
                        No payment was captured or refund processing initiated.
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCurrentView('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-full bg-white text-[#3D272A] border border-rose-200 text-xs font-bold hover:bg-rose-100 transition-colors shrink-0 cursor-pointer shadow-2xs"
                >
                  Order Something Else →
                </button>
              </div>
            ) : (
              /* ACTIVE SPOTLIGHT CARD */
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#FFF5F7] via-[#FFFDF9] to-[#FAF7F2] border border-[#F9D5DF] shadow-2xs relative overflow-hidden"
              >
                {/* Background decorative clay blossom */}
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#FCE7EC]/50 rounded-full blur-2xl pointer-events-none" />

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-[#F9D5DF] flex items-center justify-center text-[#B85B75] shadow-xs shrink-0">
                        <CurrentActiveIcon className="w-7 h-7 stroke-[1.75]" />
                      </div>
                      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B85B75] opacity-75" />
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#B85B75] border-2 border-white" />
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-[#B85B75] uppercase tracking-wider">
                          Active Milestone • Stage {activeStepIdx + 1} of {totalStages}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white text-[#B85B75] text-[10px] font-bold border border-[#F9D5DF]">
                          {progressPercent}% Complete
                        </span>
                      </div>
                      <h3 className="font-serif-title text-lg sm:text-xl font-bold text-[#3D272A]">
                        {currentActiveMeta.title}
                      </h3>
                      <p className="text-xs text-[#6E5357] max-w-xl leading-relaxed">
                        {currentActiveMeta.longDesc}
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-auto shrink-0 bg-white/90 backdrop-blur-xs p-3.5 rounded-2xl border border-[#F9D5DF]/80 text-center md:text-right space-y-1">
                    <span className="text-[10px] font-bold text-[#7D6B5D] uppercase block">
                      Estimated Delivery
                    </span>
                    <div className="flex items-center justify-center md:justify-end gap-1.5 text-xs font-bold text-[#3D272A]">
                      <Calendar className="w-3.5 h-3.5 text-[#B85B75]" />
                      <span>3 - 5 Business Days</span>
                    </div>
                    <span className="text-[10px] text-[#7D6B5D] block">
                      Express Studio Dispatch
                    </span>
                  </div>
                </div>

                {/* Animated Miniature Progress Bar inside Spotlight */}
                <div className="mt-5 pt-4 border-t border-[#FCE7EC]/80">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#7D6B5D] mb-1.5">
                    <span className="flex items-center gap-1.5 text-[#3D272A]">
                      <Sparkles className="w-3.5 h-3.5 text-[#B85B75]" />
                      <span>{currentActiveMeta.stageNote}</span>
                    </span>
                    <span className="font-mono text-[#B85B75] font-bold">{progressPercent}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#FAF7F2] rounded-full overflow-hidden border border-[#FCE7EC]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-[#E8A5B8] via-[#B85B75] to-[#8C3A52] relative"
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VISUAL STEP-BY-STEP PROGRESS INDICATOR (Horizontal Stepper) */}
            {!isCancelled && (
              <div className="py-2">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#3D272A] flex items-center gap-2">
                      <span>Artisan Progress Pathway</span>
                    </h3>
                    <p className="text-xs text-[#7D6B5D] mt-0.5">
                      Visual milestone checkpoint indicator for your studio order.
                    </p>
                  </div>

                  <span className="text-xs font-bold text-[#B85B75] bg-[#FFF5F7] px-3 py-1 rounded-full border border-[#F9D5DF] shrink-0">
                    Stage {activeStepIdx + 1} / {totalStages}
                  </span>
                </div>

                {/* Desktop & Tablet Horizontal Visual Stepper */}
                <div className="hidden md:block bg-[#FAF7F2]/50 p-6 rounded-3xl border border-[#F5EFEB]">
                  <div className="relative">
                    {/* Background Progress Rail Track */}
                    <div className="absolute top-5 left-6 right-6 h-1.5 bg-[#EFE9E4] rounded-full z-0" />

                    {/* Animated Filled Progress Track */}
                    <motion.div
                      className="absolute top-5 left-6 h-1.5 bg-gradient-to-r from-[#E8A5B8] via-[#B85B75] to-[#8C3A52] rounded-full z-0"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `calc(${(activeStepIdx / (totalStages - 1)) * 100}% - 12px)` 
                      }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />

                    {/* Stepper Milestones Grid */}
                    <div className="relative z-10 grid grid-cols-7 gap-2">
                      {ORDER_STEPS_META.map((meta, idx) => {
                        const stepData = stepsList[idx];
                        const isCompleted = stepData?.completed || idx < activeStepIdx;
                        const isCurrent = stepData?.current || idx === activeStepIdx;
                        const isPending = !isCompleted && !isCurrent;
                        const Icon = meta.icon;

                        return (
                          <div 
                            key={idx}
                            className="flex flex-col items-center text-center group cursor-pointer"
                            onClick={() => setActiveStepTab(activeStepTab === idx ? null : idx)}
                          >
                            {/* Milestone Icon Circle */}
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className={`relative w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                                isCompleted
                                  ? 'bg-[#B85B75] border-[#B85B75] text-white shadow-xs'
                                  : isCurrent
                                  ? 'bg-white border-[#B85B75] text-[#B85B75] shadow-md ring-4 ring-[#FCE7EC]'
                                  : 'bg-white border-[#E5DDD7] text-[#9E8E81] hover:border-[#D9829B]'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                              ) : (
                                <Icon className={`w-4 h-4 ${isCurrent ? 'stroke-[2.5] text-[#B85B75]' : ''}`} />
                              )}

                              {/* Active Pulse Radar */}
                              {isCurrent && (
                                <span className="absolute -inset-1 rounded-2xl border-2 border-[#B85B75] animate-ping opacity-30 pointer-events-none" />
                              )}
                            </motion.div>

                            {/* Step Number & Title */}
                            <div className="mt-2.5 space-y-0.5">
                              <span className={`text-[10px] font-mono block font-bold ${
                                isCurrent ? 'text-[#B85B75]' : isCompleted ? 'text-[#7D6B5D]' : 'text-[#A8988C]'
                              }`}>
                                Step {idx + 1}
                              </span>
                              <span className={`text-[11px] font-bold leading-tight block line-clamp-1 ${
                                isCurrent
                                  ? 'text-[#B85B75]'
                                  : isCompleted
                                  ? 'text-[#3D272A]'
                                  : 'text-[#8C7B6E]'
                              }`}>
                                {meta.label}
                              </span>
                            </div>

                            {/* Step Timestamp if completed */}
                            {stepData?.date && (
                              <span className="text-[9px] text-[#8C7B6E] font-medium mt-0.5 block truncate max-w-[85px]">
                                {stepData.date}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Mobile Scroller Mini-Stepper */}
                <div className="block md:hidden bg-[#FAF7F2]/60 p-4 rounded-2xl border border-[#F5EFEB]">
                  <div className="flex items-center justify-between text-xs font-bold text-[#3D272A] mb-3">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#B85B75] animate-pulse" />
                      <span>{ORDER_STEPS_META[activeStepIdx]?.title}</span>
                    </span>
                    <span className="text-[#B85B75] font-mono">{progressPercent}%</span>
                  </div>

                  <div className="h-2 w-full bg-[#EFE9E4] rounded-full overflow-hidden mb-3">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#E8A5B8] to-[#B85B75] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>

                  {/* Horizontal Scrollable Icons */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {ORDER_STEPS_META.map((meta, idx) => {
                      const isCompleted = idx < activeStepIdx;
                      const isCurrent = idx === activeStepIdx;
                      const Icon = meta.icon;

                      return (
                        <div
                          key={idx}
                          className={`shrink-0 px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-[11px] font-bold transition-all ${
                            isCurrent
                              ? 'bg-white border-[#B85B75] text-[#B85B75] shadow-xs ring-2 ring-[#FCE7EC]'
                              : isCompleted
                              ? 'bg-[#B85B75] border-[#B85B75] text-white'
                              : 'bg-white/80 border-[#EFE9E4] text-[#8C7B6E]'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{idx + 1}. {meta.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* DETAILED VERTICAL TIMELINE WITH ANIMATED CARDS */}
            {!isCancelled && (
              <div className="py-2">
                <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#3D272A] mb-6">
                  Detailed Crafting Milestones
                </h3>

                <div className="relative pl-7 sm:pl-9 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#FCE7EC]">
                  {stepsList.map((step, idx) => {
                    const meta = ORDER_STEPS_META[idx] || ORDER_STEPS_META[0];
                    const Icon = meta.icon;
                    const isCompleted = step.completed || idx < activeStepIdx;
                    const isCurrent = step.current || idx === activeStepIdx;

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="relative flex items-start gap-4 group"
                      >
                        {/* Step Marker Node */}
                        <div
                          className={`absolute -left-7 sm:-left-9 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            isCompleted
                              ? 'bg-[#B85B75] border-white text-white shadow-xs'
                              : isCurrent
                              ? 'bg-white border-[#B85B75] text-[#B85B75] ring-4 ring-[#FCE7EC] shadow-sm'
                              : 'bg-white border-[#E5DDD7] text-[#A8988C]'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                          ) : isCurrent ? (
                            <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-[#B85B75]" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-[#D5CBC4]" />
                          )}
                        </div>

                        {/* Step Content Card */}
                        <div
                          className={`flex-1 p-4 rounded-2xl border transition-all duration-200 ${
                            isCurrent
                              ? 'bg-[#FFF5F7] border-[#F9D5DF] shadow-xs'
                              : isCompleted
                              ? 'bg-white border-[#F5EFEB] hover:border-[#FCE7EC]'
                              : 'bg-[#FAF7F2]/40 border-[#F5EFEB] opacity-80'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4
                                className={`font-serif-title text-sm sm:text-base font-bold ${
                                  isCurrent
                                    ? 'text-[#B85B75]'
                                    : isCompleted
                                    ? 'text-[#3D272A]'
                                    : 'text-[#6E5357]'
                                }`}
                              >
                                {step.title}
                              </h4>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded-full bg-[#B85B75] text-white text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                  Current Stage
                                </span>
                              )}
                              {isCompleted && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                                  Completed ✓
                                </span>
                              )}
                            </div>

                            {step.date && (
                              <span className="text-[11px] text-[#7D6B5D] font-medium flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[#B85B75]" />
                                <span>{step.date}</span>
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-[#6E5357] leading-relaxed">
                            {step.description || meta.longDesc}
                          </p>

                          {/* Extra studio highlight for current stage */}
                          {isCurrent && (
                            <div className="mt-3 pt-2.5 border-t border-[#FCE7EC] flex items-center gap-2 text-[11px] text-[#8C3A52] font-semibold">
                              <Sparkles className="w-3.5 h-3.5 text-[#B85B75] shrink-0" />
                              <span>{meta.stageNote}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Items & Delivery Destination Grid */}
            <div className="pt-6 border-t border-[#FAF7F2] grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <h4 className="font-bold text-[#3D272A] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#B85B75]" />
                  <span>Items in this Creation:</span>
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#F5EFEB]">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-10 h-10 rounded-xl object-cover border border-[#FCE7EC]"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-[#3D272A] text-xs block truncate">
                          {item.product.name}
                        </span>
                        <span className="text-[11px] text-[#7D6B5D]">
                          Qty: {item.quantity} • ₹{item.product.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#3D272A] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#B85B75]" />
                  <span>Delivery Destination:</span>
                </h4>
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#F5EFEB] space-y-1.5 text-xs text-[#6E5357] leading-relaxed">
                  <p className="font-bold text-[#3D272A] text-sm">{selectedOrder.customer.fullName}</p>
                  <p className="text-[11px] font-semibold text-[#B85B75]">📞 {selectedOrder.customer.phone}</p>
                  {selectedOrder.customer.apartment && <p>{selectedOrder.customer.apartment}</p>}
                  {selectedOrder.customer.address && <p>{selectedOrder.customer.address}</p>}
                  {selectedOrder.customer.landmark && (
                    <p className="text-[11px] text-[#7D6B5D]">
                      <span className="font-semibold">Landmark:</span> {selectedOrder.customer.landmark}
                    </p>
                  )}
                  <p className="font-semibold text-[#3D272A]">
                    {selectedOrder.customer.city}, {selectedOrder.customer.state} - {selectedOrder.customer.pincode}
                  </p>
                  {selectedOrder.customer.deliveryNotes && (
                    <div className="mt-2 pt-2 border-t border-[#F5EFEB] text-[11px] text-[#7D6B5D] italic">
                      “{selectedOrder.customer.deliveryNotes}”
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Cancellation Callout if allowed */}
            {canCancel && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-amber-950">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    Need to modify or cancel? You can cancel this order before dispatch.
                  </span>
                </div>
                <button
                  onClick={() => setIsCancelModalOpen(true)}
                  className="px-4 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer shadow-2xs"
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#FCE7EC] p-6">
            <p className="text-sm text-[#6E5357]">No order found matching “{searchInput}”.</p>
          </div>
        )}
      </div>

      {/* Cancellation Modal */}
      <CancelOrderModal
        isOpen={isCancelModalOpen}
        order={selectedOrder}
        onClose={() => setIsCancelModalOpen(false)}
      />
    </div>
  );
};


