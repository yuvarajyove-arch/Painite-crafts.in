import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Building,
  Banknote,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Tag,
  Sparkles,
  MapPin,
  Clock,
  Video,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartTotal,
    appliedCoupon,
    couponDiscount,
    placeOrder,
    setCurrentView,
    user,
    addSavedAddress,
    showToast,
    isStoreActive,
    storeSettings
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Address
  const defaultAddr = user?.addresses?.[0];
  const [addressLine, setAddressLine] = useState(defaultAddr?.addressLine || '');
  const [apartment, setApartment] = useState(defaultAddr?.apartment || '');
  const [landmark, setLandmark] = useState(defaultAddr?.landmark || '');
  const [city, setCity] = useState(defaultAddr?.city || '');
  const [stateName, setStateName] = useState(defaultAddr?.state || 'Karnataka');
  const [pincode, setPincode] = useState(defaultAddr?.pincode || '');
  const [deliveryNotes, setDeliveryNotes] = useState(defaultAddr?.deliveryNotes || '');
  const [saveAddressForFuture, setSaveAddressForFuture] = useState(true);

  // Synchronize form values whenever real authenticated user changes
  React.useEffect(() => {
    if (user) {
      if (user.name) setFullName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone && user.phone !== '+91 98765 43210') setPhone(user.phone);
      if (user.addresses && user.addresses.length > 0) {
        const preferred = user.addresses.find((a) => a.isDefault) || user.addresses[0];
        if (preferred) {
          setAddressLine(preferred.addressLine || '');
          setApartment(preferred.apartment || '');
          setLandmark(preferred.landmark || '');
          setCity(preferred.city || '');
          setStateName(preferred.state || 'Karnataka');
          setPincode(preferred.pincode || '');
          setDeliveryNotes(preferred.deliveryNotes || '');
        }
      }
    }
  }, [user]);

  // Shipping
  const [shippingMethod, setShippingMethod] = useState<'Standard Craft Shipping' | 'Express Studio Delivery'>(
    'Standard Craft Shipping'
  );

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Credit/Debit Card' | 'Net Banking' | 'Cash on Delivery'>('UPI');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const shippingCost = shippingMethod === 'Express Studio Delivery' ? 99 : (cartSubtotal > 599 ? 0 : 49);
  const finalPayable = Math.max(0, cartSubtotal - couponDiscount + shippingCost);

  // Helper to ensure Razorpay SDK script is loaded
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const customerData = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: addressLine.trim(),
      apartment: apartment.trim(),
      landmark: landmark.trim(),
      city: city.trim(),
      state: stateName.trim(),
      pincode: pincode.trim(),
      deliveryNotes: deliveryNotes.trim()
    };

    const saveCustomerAddressIfRequested = () => {
      if (saveAddressForFuture) {
        const addresses = user?.addresses || [];
        const isAlreadySaved = addresses.some(
          (a) =>
            a.addressLine.trim().toLowerCase() === customerData.address.toLowerCase() &&
            (a.apartment || '').trim().toLowerCase() === (customerData.apartment || '').toLowerCase() &&
            a.pincode.trim() === customerData.pincode
        );

        if (!isAlreadySaved) {
          addSavedAddress({
            fullName: customerData.fullName,
            phone: customerData.phone,
            addressLine: customerData.address,
            apartment: customerData.apartment,
            landmark: customerData.landmark,
            city: customerData.city,
            state: customerData.state,
            pincode: customerData.pincode,
            deliveryNotes: customerData.deliveryNotes,
            isDefault: addresses.length === 0
          });
        }
      }
    };

    // 1. CASH ON DELIVERY HANDLING
    if (paymentMethod === 'Cash on Delivery') {
      setTimeout(() => {
        saveCustomerAddressIfRequested();
        placeOrder({
          items: cart,
          subtotal: cartSubtotal,
          discount: couponDiscount,
          couponCode: appliedCoupon?.code,
          shippingFee: shippingCost,
          totalAmount: finalPayable,
          customer: customerData,
          shippingMethod,
          paymentMethod,
          paymentStatus: 'Pending'
        });

        setIsProcessing(false);
        setCurrentView('order-confirmation');

        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#FCE7EC', '#D9829B', '#D4A373', '#FAF7F2']
        });

        showToast('COD Order placed & kept in your account! Crafting will begin shortly ♥');
      }, 800);
      return;
    }

    // 2. RAZORPAY STANDARD WEB CHECKOUT (UPI, Card, Net Banking)
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !(window as any).Razorpay) {
        setIsProcessing(false);
        showToast('Unable to load Razorpay payment gateway. Please check your internet connection.');
        return;
      }

      // Step 1: Call Backend to Create Order (amount in paise, min 100 paise)
      const amountInPaise = Math.max(100, Math.round(finalPayable * 100));

      const createOrderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `rcpt_order_${Date.now()}`,
          notes: {
            customer_name: fullName,
            customer_email: email,
            items_count: cart.length
          }
        })
      });

      if (!createOrderRes.ok) {
        const errData = await createOrderRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to initialize Razorpay order on server.');
      }

      const orderData = await createOrderRes.json();

      // Step 2: Open Razorpay Standard Checkout Modal
      const options = {
        key: orderData.key_id || ((import.meta as any).env?.VITE_RAZORPAY_KEY_ID as string) || 'rzp_live_TV8Ghw1tG4RX3L',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'PAINITE CRAFTS',
        description: `Artisan Clay Order (${cart.length} items)`,
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=200&auto=format&fit=crop&q=80',
        order_id: orderData.order_id,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          try {
            // Step 3: Call Backend to Verify Payment Signature
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              // Signature successfully verified! Complete order placement
              saveCustomerAddressIfRequested();
              placeOrder({
                items: cart,
                subtotal: cartSubtotal,
                discount: couponDiscount,
                couponCode: appliedCoupon?.code,
                shippingFee: shippingCost,
                totalAmount: finalPayable,
                customer: customerData,
                shippingMethod,
                paymentMethod,
                paymentStatus: 'Paid',
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              });

              setIsProcessing(false);
              setCurrentView('order-confirmation');

              confetti({
                particleCount: 90,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#FCE7EC', '#D9829B', '#D4A373', '#FAF7F2']
              });

              showToast('Payment successful! Your order has been placed ♥');
            } else {
              setIsProcessing(false);
              showToast(verifyData.message || 'Payment signature verification failed.');
            }
          } catch (verifyErr: any) {
            setIsProcessing(false);
            console.error('Payment Verification error:', verifyErr);
            showToast('Error validating payment response. Please contact studio support.');
          }
        },
        prefill: {
          name: fullName,
          email: email,
          contact: phone
        },
        notes: {
          delivery_city: city,
          shipping_pincode: pincode
        },
        theme: {
          color: '#4A3728'
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            showToast('Payment process was cancelled. You can retry anytime.');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on('payment.failed', function (failedResp: any) {
        setIsProcessing(false);
        console.error('Razorpay Payment Failed:', failedResp.error);
        showToast(`Payment Failed: ${failedResp.error?.description || 'Transaction unsuccessful'}`);
      });

      rzp.open();
    } catch (err: any) {
      setIsProcessing(false);
      console.error('Razorpay Checkout Init Error:', err);
      showToast(err.message || 'Failed to open Razorpay payment gateway.');
    }
  };

  if (!isStoreActive) {
    return (
      <div className="py-20 text-center max-w-lg mx-auto px-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto mb-4 text-2xl">
          🌸
        </div>
        <h2 className="font-serif-title text-2xl font-bold text-[#3D272A]">
          Studio Checkout is Temporarily Paused
        </h2>
        <p className="text-xs text-[#6E5357] mt-3 mb-6 leading-relaxed">
          {storeSettings.storeInactiveMessage || 'Painite Crafts is temporarily taking a creative studio break. New orders cannot be accepted right now, but your bag is saved!'}
        </p>
        <button
          onClick={() => setCurrentView('shop')}
          className="px-6 py-3 rounded-full bg-[#3D272A] text-white text-xs font-semibold hover:bg-[#5D4636] transition-colors"
        >
          Return to Browse Shop
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4">
        <h2 className="font-serif-title text-2xl font-bold text-[#3D272A]">
          Your bag is currently empty
        </h2>
        <p className="text-xs text-[#6E5357] mt-2 mb-6">
          Add some sweet clay pieces before proceeding to checkout!
        </p>
        <button
          onClick={() => setCurrentView('shop')}
          className="px-6 py-3 rounded-full bg-[#3D272A] text-white text-xs font-semibold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-[#FFFDF9] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title & Breadcrumb Progress */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#3D272A]">
              Studio Checkout
            </h1>
            <p className="text-xs text-[#6E5357] mt-0.5">
              Secure 256-bit encrypted checkout with India-wide shipping.
            </p>
          </div>

          {/* Stepper indicator */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            {[
              { num: 1, label: 'Contact' },
              { num: 2, label: 'Address' },
              { num: 3, label: 'Shipping' },
              { num: 4, label: 'Payment' }
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-1">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    step === s.num
                      ? 'bg-[#3D272A] text-white'
                      : step > s.num
                      ? 'bg-[#D9829B] text-white'
                      : 'bg-[#FAF7F2] text-[#6E5357] border border-[#F5EFEB]'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </span>
                <span className={`hidden md:inline ${step === s.num ? 'text-[#3D272A]' : 'text-[#6E5357]'}`}>
                  {s.label}
                </span>
                {s.num < 4 && <span className="text-[#F9D5DF] mx-1">›</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Main Form Container */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#FCE7EC] p-6 sm:p-8 shadow-xs">
            {/* STEP 1: Contact Info */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="font-serif-title text-lg font-bold text-[#3D272A] flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#FCE7EC] text-[#B85B75] text-xs flex items-center justify-center font-bold">1</span>
                  Contact Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3D272A] uppercase mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs text-[#3D272A] focus:outline-none focus:border-[#D9829B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3D272A] uppercase mb-1.5">
                      Email Address (for order tracking) *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs text-[#3D272A] focus:outline-none focus:border-[#D9829B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3D272A] uppercase mb-1.5">
                      Mobile Number (for delivery updates) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs text-[#3D272A] focus:outline-none focus:border-[#D9829B]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      if (!fullName || !email || !phone) {
                        showToast('Please enter complete contact details');
                        return;
                      }
                      setStep(2);
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#3D272A] text-white text-xs font-semibold hover:bg-[#5C3A42]"
                  >
                    <span>Continue to Delivery Address</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Delivery Address */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-title text-lg font-bold text-[#3D272A] flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#FCE7EC] text-[#B85B75] text-xs flex items-center justify-center font-bold">2</span>
                    Delivery Address
                  </h3>

                  {user?.addresses && user.addresses.length > 0 && (
                    <span className="text-[11px] text-[#B85B75] font-semibold bg-[#FFF5F7] px-2.5 py-1 rounded-full border border-[#F9D5DF]">
                      {user.addresses.length} saved {user.addresses.length === 1 ? 'address' : 'addresses'}
                    </span>
                  )}
                </div>

                {/* Saved Address Quick Selectors */}
                {user?.addresses && user.addresses.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-[#FFF5F7] border border-[#F9D5DF] space-y-2">
                    <span className="text-[11px] font-bold text-[#3D272A] uppercase tracking-wider block">
                      Choose From Your Saved Addresses:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {user.addresses.map((sa) => {
                        const isMatch =
                          apartment === sa.apartment &&
                          addressLine === sa.addressLine &&
                          pincode === sa.pincode;
                        return (
                          <button
                            key={sa.id}
                            type="button"
                            onClick={() => {
                              if (sa.fullName) setFullName(sa.fullName);
                              if (sa.phone) setPhone(sa.phone);
                              setApartment(sa.apartment || '');
                              setAddressLine(sa.addressLine || '');
                              setLandmark(sa.landmark || '');
                              setCity(sa.city || '');
                              setStateName(sa.state || '');
                              setPincode(sa.pincode || '');
                              if (sa.deliveryNotes) setDeliveryNotes(sa.deliveryNotes);
                              showToast(`Loaded ${sa.fullName}'s saved address`);
                            }}
                            className={`p-2.5 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                              isMatch
                                ? 'bg-white border-[#B85B75] shadow-xs'
                                : 'bg-white/70 border-[#F5EFEB] hover:bg-white'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-[#3D272A] truncate">{sa.fullName}</span>
                                {sa.isDefault && (
                                  <span className="text-[9px] bg-[#3D272A] text-white px-1.5 py-0.2 rounded-sm font-bold">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#6E5357] line-clamp-1 mt-0.5">{sa.apartment || sa.addressLine}</p>
                              <p className="text-[10px] text-[#7D6B5D]">{sa.city}, {sa.state} - {sa.pincode}</p>
                            </div>
                            <span className="text-[10px] text-[#B85B75] font-bold mt-1">
                              {isMatch ? '✓ Selected' : 'Use this address'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3D272A] uppercase mb-1.5">
                      Flat / House No. / Building / Apartment / Floor *
                    </label>
                    <input
                      type="text"
                      required
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      placeholder="e.g. Flat 402, 4th Floor, Tower B, Rosewood Blossom"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs text-[#3D272A] focus:outline-none focus:border-[#D9829B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3D272A] uppercase mb-1.5">
                      Street Address / Road / Colony / Area *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      placeholder="e.g. 100 Feet Road, HAL 2nd Stage, Indiranagar"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs text-[#3D272A] focus:outline-none focus:border-[#D9829B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3D272A] uppercase mb-1.5 flex items-center justify-between">
                      <span>Nearby Landmark</span>
                      <span className="text-[10px] text-[#7D6B5D] normal-case">(Helps courier partner locate easily)</span>
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Near BDA Complex / Metro Pillar 124 / Starbucks"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs text-[#3D272A] focus:outline-none focus:border-[#D9829B]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#3D272A] uppercase mb-1.5">
                        City / Town *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Bengaluru"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs text-[#3D272A] focus:outline-none focus:border-[#D9829B]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#3D272A] uppercase mb-1.5">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        placeholder="e.g. Karnataka"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs text-[#3D272A] focus:outline-none focus:border-[#D9829B]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#3D272A] uppercase mb-1.5">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="e.g. 560038"
                        maxLength={6}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs font-mono text-[#3D272A] focus:outline-none focus:border-[#D9829B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3D272A] uppercase mb-1.5 flex items-center justify-between">
                      <span>Delivery Instructions / Gift Tag Message</span>
                      <span className="text-[10px] text-[#7D6B5D] normal-case">(Optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder="e.g. Please ring doorbell / Fragile clay gift pack / Leave with security"
                      className="w-full px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs text-[#3D272A] focus:outline-none focus:border-[#D9829B] resize-none"
                    />
                  </div>

                  {/* Save address to account checkbox */}
                  <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#FFF5F7] border border-[#F9D5DF] cursor-pointer hover:bg-[#FFEBF0] transition-colors">
                    <input
                      type="checkbox"
                      checked={saveAddressForFuture}
                      onChange={(e) => setSaveAddressForFuture(e.target.checked)}
                      className="w-4 h-4 rounded-md accent-[#B85B75] cursor-pointer"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-[#3D272A] block">
                        Save this address to My Account
                      </span>
                      <span className="text-[11px] text-[#7D6B5D]">
                        Keep this address saved for fast 1-click checkout in future orders
                      </span>
                    </div>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E5357] hover:text-[#3D272A]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Contact</span>
                  </button>
                  <button
                    onClick={() => {
                      if (!apartment.trim() || !addressLine.trim() || !city.trim() || !stateName.trim() || !pincode.trim()) {
                        showToast('Please fill in complete delivery address details');
                        return;
                      }
                      if (pincode.trim().length !== 6) {
                        showToast('Please enter a valid 6-digit Indian PIN code');
                        return;
                      }
                      setStep(3);
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#3D272A] text-white text-xs font-semibold hover:bg-[#5C3A42]"
                  >
                    <span>Continue to Shipping</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Shipping Method */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="font-serif-title text-lg font-bold text-[#3D272A] flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#FCE7EC] text-[#B85B75] text-xs flex items-center justify-center font-bold">3</span>
                  Shipping Speed & Packaging
                </h3>

                <div className="space-y-3">
                  <label
                    onClick={() => setShippingMethod('Standard Craft Shipping')}
                    className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      shippingMethod === 'Standard Craft Shipping'
                        ? 'border-[#B85B75] bg-[#FFF5F7]'
                        : 'border-[#F5EFEB] bg-[#FAF7F2] opacity-80'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-[#D9829B] mt-0.5" />
                      <div>
                        <span className="font-bold text-xs text-[#3D272A] block">
                          Standard Studio Shipping
                        </span>
                        <span className="text-[11px] text-[#6E5357]">
                          Delivered in 4-6 business days with bubble wrap and rigid keepsake box.
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#3D272A]">
                      {cartSubtotal > 599 ? 'FREE' : '₹49'}
                    </span>
                  </label>

                  <label
                    onClick={() => setShippingMethod('Express Studio Delivery')}
                    className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      shippingMethod === 'Express Studio Delivery'
                        ? 'border-[#B85B75] bg-[#FFF5F7]'
                        : 'border-[#F5EFEB] bg-[#FAF7F2] opacity-80'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-[#D4A373] mt-0.5" />
                      <div>
                        <span className="font-bold text-xs text-[#3D272A] block">
                          Express Studio Air Delivery ⚡
                        </span>
                        <span className="text-[11px] text-[#6E5357]">
                          Priority air dispatch in 2-3 business days with signature gift seal.
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#3D272A]">₹99</span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E5357] hover:text-[#3D272A]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#3D272A] text-white text-xs font-semibold hover:bg-[#5C3A42]"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Payment Options (Razorpay/UPI Simulation) */}
            {step === 4 && (
              <motion.form onSubmit={handlePlaceOrder} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="font-serif-title text-lg font-bold text-[#3D272A] flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#FCE7EC] text-[#B85B75] text-xs flex items-center justify-center font-bold">4</span>
                  Select Payment Method
                </h3>

                {/* Payment Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                    { id: 'Credit/Debit Card', label: 'Cards (Razorpay)', icon: CreditCard },
                    { id: 'Net Banking', label: 'Net Banking', icon: Building },
                    { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: Banknote }
                  ].map((pay) => {
                    const Icon = pay.icon;
                    const isSelected = paymentMethod === pay.id;
                    return (
                      <button
                        type="button"
                        key={pay.id}
                        onClick={() => setPaymentMethod(pay.id as any)}
                        className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'border-[#B85B75] bg-[#FFF5F7] text-[#3D272A] font-bold shadow-xs'
                            : 'border-[#F5EFEB] bg-[#FAF7F2] text-[#6E5357] hover:bg-[#FCE7EC]'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-[#B85B75]' : 'text-[#6E5357]'}`} />
                        <span className="text-[11px] leading-tight">{pay.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* UPI Detail Interface */}
                {paymentMethod === 'UPI' && (
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#FCE7EC] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#3D272A] block">
                        Direct UPI & QR Code (via Razorpay)
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Instant Verification</span>
                    </div>
                    <p className="text-xs text-[#6E5357]">
                      When you click Pay below, Razorpay Standard Web Checkout will open to let you complete payment via Google Pay, PhonePe, Paytm, BHIM or by scanning dynamic QR.
                    </p>
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {[
                        { label: 'GPay', emoji: '🟢' },
                        { label: 'PhonePe', emoji: '🟣' },
                        { label: 'Paytm', emoji: '🔵' },
                        { label: 'Any UPI / QR', emoji: '📷' }
                      ].map((app, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-xl border border-[#F5EFEB] bg-white text-center shadow-2xs"
                        >
                          <span className="block text-base">{app.emoji}</span>
                          <span className="text-[10px] font-bold text-[#3D272A]">{app.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Card Interface */}
                {paymentMethod === 'Credit/Debit Card' && (
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#FCE7EC] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#3D272A]">Debit & Credit Cards (via Razorpay)</span>
                      <div className="flex gap-1 text-[10px] font-bold text-[#6E5357]">
                        <span>Visa</span> • <span>Mastercard</span> • <span>RuPay</span> • <span>Amex</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#6E5357]">
                      Protected by 256-bit bank grade encryption. Razorpay Standard Checkout modal will open securely when you click pay.
                    </p>
                    <div className="p-3 rounded-xl bg-white border border-[#FCE7EC] flex items-center justify-between text-xs">
                      <span className="text-[#6E5357]">Zero transaction fee for customers</span>
                      <span className="text-emerald-700 font-bold">100% Secure Checkout</span>
                    </div>
                  </div>
                )}

                {/* Net Banking Interface */}
                {paymentMethod === 'Net Banking' && (
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#FCE7EC] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#3D272A]">Net Banking & All Major Banks</span>
                      <span className="text-[10px] font-bold text-[#6E5357]">50+ Indian Banks</span>
                    </div>
                    <p className="text-xs text-[#6E5357]">
                      HDFC, ICICI, SBI, Axis, Kotak, Punjab National Bank, and all major Indian retail & corporate banks supported via Razorpay.
                    </p>
                  </div>
                )}

                {/* Cash on Delivery Note */}
                {paymentMethod === 'Cash on Delivery' && (
                  <div className="p-4 rounded-2xl bg-[#FFF5F7] border border-[#F9D5DF] text-xs text-[#6E5357] space-y-1">
                    <p className="font-bold text-[#3D272A]">Cash on Delivery (COD)</p>
                    <p>Please keep exact cash ready upon arrival of our courier partner at your delivery address.</p>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E5357] hover:text-[#3D272A]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#3D272A] text-white text-sm font-semibold hover:bg-[#5C3A42] hover:shadow-md active:scale-95 transition-all shadow-xs disabled:opacity-50"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#FCE7EC]" />
                    <span>{isProcessing ? 'Processing Order...' : `Pay ₹${finalPayable} & Place Order ♥`}</span>
                  </button>
                </div>
              </motion.form>
            )}
          </div>

          {/* Right Sticky Order Summary Panel */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#FCE7EC] p-6 shadow-xs sticky top-28 space-y-4">
            <h3 className="font-serif-title text-base font-bold text-[#3D272A] pb-3 border-b border-[#FAF7F2]">
              Order Summary ({cart.length} items)
            </h3>

            {/* Items Mini List */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-xl object-cover bg-[#FAF7F2] shrink-0 border border-[#FCE7EC]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#3D272A] truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[10px] text-[#6E5357]">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-semibold text-[#3D272A]">
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-[#FAF7F2] space-y-2 text-xs text-[#6E5357]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#3D272A]">₹{cartSubtotal}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-[#B85B75] font-medium">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({shippingMethod})</span>
                <span>{shippingCost === 0 ? <span className="text-emerald-700 font-semibold">FREE</span> : `₹${shippingCost}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#3D272A] pt-3 border-t border-[#FAF7F2]">
                <span>Total Payable</span>
                <span className="text-base">₹{finalPayable}</span>
              </div>
            </div>

            {/* Shipping Destination Preview */}
            {step >= 2 && (apartment || addressLine) && (
              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#F5EFEB] space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-[#3D272A]">
                  <MapPin className="w-3.5 h-3.5 text-[#B85B75]" />
                  <span>Delivering to:</span>
                </div>
                <p className="text-[11px] text-[#6E5357] leading-relaxed">
                  <span className="font-semibold text-[#3D272A]">{fullName || 'Customer'}</span> ({phone})<br />
                  {apartment && <span>{apartment}<br /></span>}
                  {addressLine && <span>{addressLine}<br /></span>}
                  {landmark && <span className="text-[10px] text-[#7D6B5D]">Landmark: {landmark}<br /></span>}
                  {city}, {stateName} - {pincode}
                </p>
              </div>
            )}

            {/* Return Policy Notice */}
            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-[11px] text-[#4A3728] space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Video className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Return & Refund Guarantee</span>
              </div>
              <p className="text-[#7D6B5D] text-[10px] leading-tight">
                48h claim window for transit damage or defective items. Continuous unboxing video is strictly required.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCurrentView('return-policy');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[10px] text-amber-900 font-bold underline cursor-pointer hover:text-amber-950"
              >
                Read Full Return & Refund Policy →
              </button>
            </div>

            {/* Trust Footer */}
            <div className="pt-1 text-[11px] text-[#6E5357] flex items-center justify-center gap-1.5 text-center">
              <ShieldCheck className="w-4 h-4 text-[#D4A373]" />
              <span>Includes Free Gift Packaging & Ribbon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
