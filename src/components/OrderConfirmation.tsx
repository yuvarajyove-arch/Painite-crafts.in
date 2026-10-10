import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  CheckCircle2,
  Heart,
  Truck,
  Package,
  ArrowRight,
  Sparkles,
  Calendar,
  MapPin,
  XCircle,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { motion } from 'motion/react';
import { CancelOrderModal } from './CancelOrderModal';

export const OrderConfirmation: React.FC = () => {
  const { currentOrder, setCurrentView } = useStore();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const order = currentOrder || {
    id: 'ord-demo',
    orderNumber: 'PC-2026-8491',
    date: new Date().toISOString().split('T')[0],
    totalAmount: 448,
    status: 'Order Placed' as const,
    customer: {
      fullName: 'Ananya Sharma',
      email: 'ananya@example.com',
      phone: '+91 98765 43210',
      address: 'Flat 402, Rosewood Blossom Apartments, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038'
    },
    items: [],
    shippingMethod: 'Standard Craft Shipping' as const,
    paymentMethod: 'UPI' as const,
    paymentStatus: 'Paid' as const,
    trackingSteps: []
  };

  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="py-12 sm:py-20 bg-[#FFFDF9] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl sm:rounded-[36px] border border-[#FCE7EC] p-6 sm:p-12 shadow-sm text-center"
        >
          {/* Animated Pulsing Clay Icon */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6">
            <div className={`w-full h-full rounded-full border-2 flex items-center justify-center shadow-md ${
              isCancelled
                ? 'bg-rose-50 border-rose-200'
                : 'bg-gradient-to-br from-[#FFF5F7] to-[#FCE7EC] border-[#F9D5DF]'
            }`}>
              <span className="text-4xl sm:text-5xl">
                {isCancelled ? '🚫' : '🧸'}
              </span>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-xs ${
                isCancelled ? 'bg-rose-600' : 'bg-[#D9829B]'
              }`}
            >
              {isCancelled ? '✕' : '♥'}
            </motion.div>
          </div>

          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
            isCancelled
              ? 'bg-rose-100 text-rose-800'
              : 'bg-[#FCE7EC] text-[#B85B75]'
          }`}>
            {isCancelled ? <XCircle className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{isCancelled ? 'Order Cancelled' : 'Order Confirmed'} • #{order.orderNumber}</span>
          </div>

          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#3D272A] mt-2">
            {isCancelled ? 'This order has been cancelled' : 'Your little creation is on its way! ♥'}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#6E5357] max-w-lg mx-auto leading-relaxed">
            {isCancelled
              ? 'We have cancelled this order from our crafting queue. If you paid online, your refund will be processed back to your account.'
              : 'Thank you for supporting our handmade clay studio! Our artisans are preparing your materials with love and attention to every detail.'}
          </p>

          {/* Cancelled Alert Banner */}
          {isCancelled && (
            <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-left space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-rose-800 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>Cancellation Confirmed</span>
              </div>
              {order.cancellationReason && (
                <p className="text-rose-700">
                  <strong>Reason:</strong> {order.cancellationReason}
                </p>
              )}
              {order.paymentStatus === 'Refunded' && (
                <p className="text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Full refund of ₹{order.totalAmount} has been registered to your original payment method.</span>
                </p>
              )}
            </div>
          )}

          {/* Order Snapshot Card */}
          <div className="mt-8 p-6 rounded-2xl bg-[#FAF7F2] border border-[#F5EFEB] text-left space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-[#F5EFEB]">
              <div>
                <span className="text-[11px] text-[#6E5357] uppercase font-bold block">Order ID</span>
                <span className="font-bold text-[#3D272A]">#{order.orderNumber}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#6E5357] uppercase font-bold block">Date</span>
                <span className="font-bold text-[#3D272A]">{order.date}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#6E5357] uppercase font-bold block">Payment</span>
                <span className={`font-bold ${isCancelled ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {order.paymentMethod} ({order.paymentStatus})
                </span>
                {(order as any).razorpayPaymentId && (
                  <span className="block text-[10px] text-[#6E5357] truncate font-mono mt-0.5" title={(order as any).razorpayPaymentId}>
                    ID: {(order as any).razorpayPaymentId}
                  </span>
                )}
              </div>
              <div>
                <span className="text-[11px] text-[#6E5357] uppercase font-bold block">Total Amount</span>
                <span className="font-bold text-[#3D272A] text-sm">₹{order.totalAmount}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D9829B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#3D272A] block">Shipping Address:</span>
                  <span className="text-[#6E5357] text-xs">
                    {order.customer.fullName}, {order.customer.address}, {order.customer.city} - {order.customer.pincode}
                  </span>
                </div>
              </div>

              {!isCancelled && (
                <div className="flex items-start gap-2.5 sm:text-right">
                  <Calendar className="w-4 h-4 text-[#D4A373] shrink-0 mt-0.5 sm:hidden" />
                  <div>
                    <span className="font-bold text-[#3D272A] block">Est. Delivery Date:</span>
                    <span className="text-[#B85B75] font-semibold text-xs">4 - 6 Business Days</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              id="track-order-confirmation-btn"
              onClick={() => {
                setCurrentView('tracking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#3D272A] text-white text-xs sm:text-sm font-semibold hover:bg-[#5C3A42] transition-colors shadow-xs cursor-pointer"
            >
              <Truck className="w-4 h-4 text-[#FCE7EC]" />
              <span>Track Live Craft Status</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FFFDF9] border-2 border-[#F9D5DF] text-[#3D272A] text-xs sm:text-sm font-semibold hover:bg-[#FCE7EC] transition-colors cursor-pointer"
            >
              <span>Continue Exploring Crafts</span>
              <ArrowRight className="w-4 h-4 text-[#B85B75]" />
            </button>

            {!isCancelled && (
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(true)}
                className="flex items-center gap-1.5 px-5 py-3 rounded-full text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel This Order</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Cancellation Modal */}
      <CancelOrderModal
        isOpen={isCancelModalOpen}
        order={currentOrder}
        onClose={() => setIsCancelModalOpen(false)}
      />
    </div>
  );
};

