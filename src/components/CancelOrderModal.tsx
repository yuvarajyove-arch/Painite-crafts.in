import React, { useState } from 'react';
import { Order } from '../types';
import { useStore } from '../context/StoreContext';
import {
  X,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Package,
  ArrowRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CancelOrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelled?: (orderId: string) => void;
}

const CANCELLATION_REASONS = [
  'Ordered by mistake',
  'Need to change shipping address / contact details',
  'Want to modify items or personalization notes',
  'Delivery timeline is too long / urgent need',
  'Found an alternative / Changed my mind',
  'Incorrect payment method chosen',
  'Other reason'
];

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  order,
  isOpen,
  onClose,
  onCancelled
}) => {
  const { cancelOrder } = useStore();
  const [selectedReason, setSelectedReason] = useState<string>(CANCELLATION_REASONS[0]);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isConfirmedStep, setIsConfirmedStep] = useState<boolean>(false);

  if (!isOpen || !order) return null;

  const isPrepaid = order.paymentStatus === 'Paid' || order.paymentMethod !== 'Cash on Delivery';

  const handleConfirmCancel = () => {
    setIsSubmitting(true);
    const finalReason = customNotes.trim()
      ? `${selectedReason}: ${customNotes.trim()}`
      : selectedReason;

    setTimeout(() => {
      const success = cancelOrder(order.id, finalReason, 'Customer');
      setIsSubmitting(false);
      if (success) {
        setIsConfirmedStep(true);
        if (onCancelled) {
          onCancelled(order.id);
        }
      }
    }, 400);
  };

  const handleCloseAndReset = () => {
    setIsConfirmedStep(false);
    setSelectedReason(CANCELLATION_REASONS[0]);
    setCustomNotes('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white rounded-3xl sm:rounded-[32px] border border-[#FCE7EC] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 pb-4 border-b border-[#FAF7F2] flex items-center justify-between bg-gradient-to-r from-[#FFF5F7] to-[#FAF7F2]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-title text-lg font-bold text-[#3D272A]">
                  {isConfirmedStep ? 'Order Cancelled' : 'Cancel Your Order'}
                </h3>
                <p className="text-xs text-[#6E5357]">
                  Order #{order.orderNumber} • ₹{order.totalAmount}
                </p>
              </div>
            </div>

            <button
              onClick={handleCloseAndReset}
              className="w-8 h-8 rounded-full bg-white border border-[#F2E8E0] text-[#7D6B5D] hover:text-[#3D272A] hover:bg-[#FCE7EC] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-[#4A3728]">
            {isConfirmedStep ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-200 text-rose-600 flex items-center justify-center mx-auto text-2xl shadow-xs">
                  ✓
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <h4 className="font-serif-title text-xl font-bold text-[#3D272A]">
                    Order #{order.orderNumber} is Cancelled
                  </h4>
                  <p className="text-xs text-[#6E5357] leading-relaxed">
                    We have updated our studio queue and stopped crafting for this order.
                  </p>
                </div>

                {isPrepaid && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left space-y-1 max-w-sm mx-auto">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold">
                      <RotateCcw className="w-4 h-4 shrink-0" />
                      <span>Full Refund of ₹{order.totalAmount} Initiated</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 leading-relaxed">
                      Your refund has been registered and will reflect back in your source payment account (UPI / Card / Net Banking) in 3 to 5 business days.
                    </p>
                  </div>
                )}

                <div className="pt-3">
                  <button
                    onClick={handleCloseAndReset}
                    className="px-6 py-2.5 rounded-full bg-[#3D272A] text-white text-xs font-bold hover:bg-[#5C3A42] transition-colors cursor-pointer shadow-xs"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Order summary banner */}
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#F5EFEB] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-[#B85B75]" />
                    <span className="font-semibold text-xs">
                      {order.items.length} item(s) • Current Status: <strong>{order.status}</strong>
                    </span>
                  </div>
                  <span className="font-bold text-sm text-[#3D272A]">
                    ₹{order.totalAmount}
                  </span>
                </div>

                {/* Refund Assurance Banner */}
                {isPrepaid ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-900 block text-xs">
                        100% Full Refund Guarantee
                      </span>
                      <p className="text-[11px] text-emerald-700 mt-0.5 leading-relaxed">
                        Since this order was prepaid via <strong>{order.paymentMethod}</strong>, canceling will automatically initiate a full refund of <strong>₹{order.totalAmount}</strong> back to your original source account.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-900 block text-xs">
                        Cash on Delivery Order
                      </span>
                      <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                        This order will be cancelled with no payment or penalty charged.
                      </p>
                    </div>
                  </div>
                )}

                {/* Reason Selection */}
                <div className="space-y-2">
                  <label className="font-bold text-xs uppercase tracking-wider text-[#7D6B5D] block">
                    Please tell us why you are canceling:
                  </label>
                  <div className="space-y-1.5">
                    {CANCELLATION_REASONS.map((reason) => (
                      <label
                        key={reason}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-colors cursor-pointer text-xs ${
                          selectedReason === reason
                            ? 'bg-[#FFF5F7] border-[#F9D5DF] text-[#3D272A] font-semibold'
                            : 'bg-white border-[#F2E8E0] text-[#6E5357] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="cancellationReason"
                          checked={selectedReason === reason}
                          onChange={() => setSelectedReason(reason)}
                          className="accent-[#B85B75] w-3.5 h-3.5"
                        />
                        <span>{reason}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Comments (Optional) */}
                <div className="space-y-1.5">
                  <label className="font-bold text-xs uppercase tracking-wider text-[#7D6B5D] block">
                    Additional details or suggestions (optional):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. I need to change my pincode or order 2 pieces instead..."
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs text-[#3D272A] focus:outline-none focus:border-[#D9829B]"
                  />
                </div>

                {/* Warning note */}
                <p className="text-[11px] text-[#7D6B5D] italic">
                  Note: Cancellation cannot be reversed once confirmed. You can always place a new order anytime from our studio catalog.
                </p>
              </>
            )}
          </div>

          {/* Modal Footer Actions */}
          {!isConfirmedStep && (
            <div className="p-4 sm:p-5 border-t border-[#FAF7F2] bg-[#FAF7F2]/60 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleCloseAndReset}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white border border-[#F2E8E0] text-xs font-bold text-[#4A3728] hover:bg-[#FCE7EC] transition-colors cursor-pointer"
              >
                Keep Order
              </button>

              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Confirm Order Cancellation</span>
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
