import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  ArrowRight,
  Tag,
  Check,
  Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartTotal,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    setCurrentView,
    freeShippingThreshold,
    isStoreActive,
    storeSettings
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const threshold = freeShippingThreshold || 999;
  const progressToFreeShipping = Math.min(
    100,
    Math.round((cartSubtotal / threshold) * 100)
  );
  const amountNeededForFreeShipping = Math.max(0, threshold - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-[#4A3728]/40 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-[#FDF9F6] border-l border-[#F2E8E0] shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-6 border-b border-[#F2E8E0] bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#F8D7DA]/50 flex items-center justify-center text-[#4A3728]">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#4A3728]">
                      Your Studio Bag
                    </h2>
                    <span className="text-xs text-[#7D6B5D]">
                      {cart.reduce((c, i) => c + i.quantity, 0)} handcrafted items
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-full text-[#7D6B5D] hover:bg-[#FDF9F6] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Indicator */}
              <div className="bg-white px-5 py-3 border-b border-[#F2E8E0] text-xs">
                <div className="flex items-center justify-between mb-1.5 font-semibold text-[#4A3728]">
                  <div className="flex items-center gap-1.5 text-[#4A3728]">
                    <Truck className="w-3.5 h-3.5 text-[#C5A059]" />
                    {amountNeededForFreeShipping === 0 ? (
                      <span className="text-[#C5A059]">You unlocked FREE Studio Shipping!</span>
                    ) : (
                      <span>
                        Add ₹{amountNeededForFreeShipping} more for <strong>FREE shipping</strong>
                      </span>
                    )}
                  </div>
                  <span className="text-[#7D6B5D]">{progressToFreeShipping}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#F2E8E0] overflow-hidden">
                  <div
                    className="h-full bg-[#4A3728] rounded-full transition-all duration-500"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                {cart.length === 0 ? (
                  <div className="text-center py-16 flex flex-col items-center justify-center text-[#7D6B5D]">
                    <div className="w-20 h-20 rounded-full bg-white border border-[#F2E8E0] flex items-center justify-center mb-4 text-3xl">
                      🧺
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#4A3728]">
                      Your basket is empty
                    </h3>
                    <p className="text-xs text-[#7D6B5D] mt-1 max-w-xs leading-relaxed">
                      Discover tiny clay animals, phone charms, and handcrafted keepsakes in our studio store.
                    </p>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        setCurrentView('shop');
                      }}
                      className="mt-6 px-6 py-2.5 rounded-full bg-[#4A3728] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#5D4636]"
                    >
                      Browse Handmade Crafts
                    </button>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div
                      key={`${item.product.id}-${idx}`}
                      className="flex gap-3.5 p-3 rounded-2xl bg-white border border-[#F2E8E0] shadow-xs"
                    >
                      {/* Product Thumbnail */}
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-18 h-18 rounded-xl object-cover bg-[#FDF9F6] border border-[#F2E8E0] shrink-0"
                        referrerPolicy="no-referrer"
                      />

                      {/* Product Meta */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-serif text-sm font-bold text-[#4A3728] line-clamp-1">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-[#7D6B5D] hover:text-[#4A3728] p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Price & Quantity Controls */}
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#F2E8E0]">
                          <span className="text-xs font-bold text-[#4A3728]">
                            ₹{item.product.price * item.quantity}
                          </span>

                          <div className="flex items-center rounded-lg bg-[#FDF9F6] border border-[#F2E8E0] p-0.5">
                            <button
                              onClick={() =>
                                updateCartQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              className="w-5 h-5 flex items-center justify-center text-[#4A3728] hover:bg-white rounded transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 text-center text-xs font-bold text-[#4A3728]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateCartQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              className="w-5 h-5 flex items-center justify-center text-[#4A3728] hover:bg-white rounded transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer Summary & Checkout */}
              {cart.length > 0 && (
                <div className="p-4 sm:p-6 bg-white border-t border-[#F2E8E0] space-y-3">
                  {/* Coupon Code Input */}
                  <div>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8D7DA]/30 border border-[#EAD0D3] text-xs">
                        <div className="flex items-center gap-1.5 text-[#4A3728] font-semibold">
                          <Tag className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>Code '{appliedCoupon.code}' applied (-₹{couponDiscount})</span>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-[#7D6B5D] hover:text-[#4A3728] font-bold text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Code: CLAYLOVE10"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          className="flex-1 px-3.5 py-1.5 rounded-full bg-[#FDF9F6] border border-[#F2E8E0] text-xs text-[#4A3728] uppercase placeholder:normal-case focus:outline-none focus:border-[#D4AF37]"
                        />
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-full bg-[#FDF9F6] text-xs font-bold text-[#4A3728] border border-[#F2E8E0] hover:bg-[#F8D7DA]/40"
                        >
                          Apply
                        </button>
                      </form>
                    )}
                    {couponError && <p className="text-[11px] text-red-500 mt-1">{couponError}</p>}
                    {couponSuccess && (
                      <p className="text-[11px] text-emerald-600 mt-1">{couponSuccess}</p>
                    )}
                  </div>

                  {/* Price Calculation */}
                  <div className="space-y-1.5 text-xs text-[#7D6B5D] pt-2 border-t border-[#F2E8E0]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#4A3728]">₹{cartSubtotal}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-[#C5A059] font-medium">
                        <span>Coupon Discount</span>
                        <span>-₹{couponDiscount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Estimated Shipping</span>
                      <span>
                        {cartSubtotal >= threshold ? (
                          <span className="text-emerald-600 font-semibold">FREE</span>
                        ) : (
                          '₹49'
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-[#4A3728] pt-2 border-t border-[#F2E8E0]">
                      <span>Total Amount</span>
                      <span className="text-base">₹{cartTotal}</span>
                    </div>
                  </div>

                  {/* Checkout Button or Store Inactive Message */}
                  {!isStoreActive ? (
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-center space-y-1">
                      <p className="font-bold text-[11px] uppercase tracking-wider text-amber-800">Store Temporarily Paused</p>
                      <p className="text-[11px] leading-relaxed opacity-90">{storeSettings.storeInactiveMessage || 'Checkout is temporarily paused for crafting & restock.'}</p>
                    </div>
                  ) : (
                    <button
                      id="cart-proceed-checkout-btn"
                      onClick={handleProceedToCheckout}
                      className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#4A3728] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#5D4636] active:scale-95 transition-all shadow-xs cursor-pointer"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#F8D7DA]" />
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

