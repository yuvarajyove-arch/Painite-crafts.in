import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import {
  Heart,
  Star,
  ShoppingBag,
  Sparkles,
  ArrowLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Share2,
  Plus,
  Minus,
  MessageSquareHeart,
  Info,
  Video,
  AlertTriangle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProductId,
    products,
    setCurrentView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCartOpen,
    addProductReview,
    user,
    setIsAuthModalOpen,
    showToast
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'care' | 'returns' | 'reviews'>('details');

  // Review Form State
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAuthorName, setReviewAuthorName] = useState(user?.name || '');

  const wishlisted = isInWishlist(product.id);

  // Related products from same category
  const relatedProducts = (products || [])
    .filter(
      (p) =>
        p &&
        p.id !== product.id &&
        (p.category || '').toLowerCase() === (product.category || '').toLowerCase()
    )
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setIsCartOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard! 📋');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    addProductReview(product.id, {
      userName: reviewAuthorName || 'Clay Enthusiast',
      rating: reviewRating,
      comment: reviewComment,
      verifiedPurchase: true,
      userAvatar: user?.avatar
    });

    setReviewComment('');
    setIsReviewFormOpen(false);
  };

  return (
    <div className="py-6 sm:py-10 bg-[#FDF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Back Navigation Bar */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => {
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#7D6B5D] hover:text-[#4A3728] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
            <span>Back to Shop</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-[#F2E8E0] text-xs font-semibold text-[#7D6B5D] hover:bg-[#F8D7DA]/30 hover:text-[#4A3728] transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>

        {/* Main Product Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 bg-white rounded-3xl sm:rounded-[36px] border border-[#F2E8E0] p-4 sm:p-8 lg:p-10 shadow-xs">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Primary Large Image */}
            <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FDF9F6] border border-[#F2E8E0] shadow-inner group">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-108 cursor-zoom-in"
                referrerPolicy="no-referrer"
              />

              {/* Wishlist floating toggle */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md shadow-md text-[#7D6B5D] hover:text-[#4A3728] transition-all hover:scale-110 active:scale-90"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-[#C5A059] stroke-[#C5A059]' : ''}`} />
              </button>

              {/* Badge */}
              {product.badge && (
                <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[10px] uppercase tracking-wider font-bold text-[#4A3728] shadow-xs border border-[#F2E8E0]">
                  <Sparkles className="w-3 h-3 text-[#C5A059]" />
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail Carousel */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden bg-[#FDF9F6] border-2 shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#4A3728] ring-2 ring-[#F8D7DA]'
                        : 'border-[#F2E8E0] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Studio Guarantee Mini Strip */}
            <div className="mt-2 p-4 rounded-2xl bg-[#FDF9F6] border border-[#F2E8E0] flex items-center justify-around text-xs text-[#7D6B5D]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                <span>Individually Hand-Sculpted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Water-Resistant Resin Sealed</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Purchase Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 bg-[#FDF9F6] px-2.5 py-1 rounded-full text-xs border border-[#F2E8E0]">
                  <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                  <span className="font-bold text-[#4A3728]">{product.rating}</span>
                  <span className="text-[#7D6B5D]">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Product Title */}
              <h1 className="mt-2.5 font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#4A3728] leading-tight">
                {product.name}
              </h1>

              {/* Price & Savings */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-bold text-2xl sm:text-3xl text-[#4A3728]">
                  ₹{product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-base text-[#7D6B5D] line-through">
                      ₹{product.originalPrice}
                    </span>
                    <span className="text-xs font-bold text-[#4A3728] bg-[#F8D7DA]/60 border border-[#EAD0D3] px-2.5 py-0.5 rounded-full">
                      SAVE ₹{product.originalPrice - product.price}
                    </span>
                  </>
                )}
                <span className="text-xs text-[#7D6B5D] ml-auto">
                  {product.inStock ? (
                    <span className="text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      In Stock ({product.stockCount} left)
                    </span>
                  ) : (
                    <span className="text-amber-800 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      Made to Order (3-4 days)
                    </span>
                  )}
                </span>
              </div>

              {/* Short Description */}
              <p className="mt-4 text-sm sm:text-base text-[#7D6B5D] leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Quantity Selector & Action Buttons */}
              <div className="mt-6 pt-6 border-t border-[#F2E8E0] space-y-3">
                <div className="flex items-center gap-4">
                  {/* Quantity Counter */}
                  <div className="flex items-center rounded-full bg-[#FDF9F6] border border-[#F2E8E0] p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#4A3728] hover:bg-white transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-[#4A3728]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#4A3728] hover:bg-white transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    id="add-to-cart-detail-btn"
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#4A3728] text-white font-semibold text-xs uppercase tracking-wider hover:bg-[#5D4636] hover:shadow-md active:scale-95 transition-all shadow-xs"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#F8D7DA]" />
                    <span>Add to Bag • ₹{product.price * quantity}</span>
                  </button>
                </div>

                {/* Buy Now Instant Checkout Button */}
                <button
                  id="buy-now-detail-btn"
                  onClick={handleBuyNow}
                  className="w-full py-3 px-6 rounded-full bg-[#F8D7DA] text-[#4A3728] font-bold text-xs uppercase tracking-wider hover:bg-[#F2CCD1] border border-[#EAD0D3] active:scale-95 transition-all"
                >
                  Buy Now with 1-Click Checkout
                </button>
              </div>

              {/* Delivery & Studio Info Badges */}
              <div className="mt-6 pt-4 border-t border-[#F2E8E0] grid grid-cols-3 gap-2 text-center text-[11px] text-[#7D6B5D]">
                <div className="p-2.5 rounded-2xl bg-[#FDF9F6] border border-[#F2E8E0]">
                  <Truck className="w-4 h-4 mx-auto mb-1 text-[#C5A059]" />
                  <span className="font-semibold text-[#4A3728] block">Fast Dispatch</span>
                  <span>24-48 Hours</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#FDF9F6] border border-[#F2E8E0]">
                  <RotateCcw className="w-4 h-4 mx-auto mb-1 text-[#C5A059]" />
                  <span className="font-semibold text-[#4A3728] block">Zero Breakage</span>
                  <span>Safe Guarantee</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#FDF9F6] border border-[#F2E8E0]">
                  <Sparkles className="w-4 h-4 mx-auto mb-1 text-[#C5A059]" />
                  <span className="font-semibold text-[#4A3728] block">Gift Wrapped</span>
                  <span>Artisan Gift Box</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs (Description, Materials, Care, Reviews) */}
        <div className="mt-10 bg-white rounded-3xl border border-[#F2E8E0] p-6 sm:p-10 shadow-xs">
          {/* Tab Navigation */}
          <div className="flex border-b border-[#F2E8E0] gap-4 sm:gap-8 overflow-x-auto pb-1">
            {[
              { id: 'details', label: 'Product Details' },
              { id: 'materials', label: 'Materials & Dimensions' },
              { id: 'care', label: 'Handmade Process & Care' },
              { id: 'returns', label: 'Return & Refund Policy' },
              { id: 'reviews', label: `Customer Reviews (${product.reviews.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#4A3728] text-[#4A3728]'
                    : 'border-transparent text-[#7D6B5D] hover:text-[#4A3728]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className="pt-6">
            {activeTab === 'details' && (
              <div className="prose text-sm text-[#7D6B5D] leading-relaxed max-w-3xl space-y-4">
                <p>{product.fullDescription}</p>
                <div className="p-4 rounded-2xl bg-[#F8D7DA]/30 border border-[#EAD0D3] flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#4A3728] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#7D6B5D]">
                    <strong>Note on handmade charm:</strong> As each piece is individually sculpted without factory molds, slight variations in color tone and micro-details occur naturally, making your piece one-of-a-kind.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="space-y-6 max-w-2xl text-sm">
                <div>
                  <h4 className="font-bold text-[#4A3728] text-xs uppercase tracking-wider mb-2">
                    Materials Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(product.materials) && product.materials.length > 0
                      ? product.materials
                      : typeof product.materials === 'string'
                      ? (product.materials as string).split(',').map((m) => m.trim()).filter(Boolean)
                      : ['Artisan Clay', 'UV Glaze Sealant']
                    ).map((mat, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-[#FDF9F6] text-xs font-medium text-[#4A3728] border border-[#F2E8E0]">
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-[#4A3728] text-xs uppercase tracking-wider mb-1">
                    Size & Dimensions
                  </h4>
                  <p className="text-[#7D6B5D] text-xs font-medium">{product.dimensions || 'Approx 3.5cm × 3.0cm'}</p>
                </div>

                <div>
                  <h4 className="font-bold text-[#4A3728] text-xs uppercase tracking-wider mb-1">
                    Shipping & Packaging
                  </h4>
                  <p className="text-[#7D6B5D] text-xs">{product.shippingInfo || 'Ships within 24-48 business hours with protective studio packaging.'}</p>
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-4 max-w-2xl text-sm text-[#7D6B5D]">
                <div className="p-4 rounded-2xl bg-[#FDF9F6] border border-[#F2E8E0]">
                  <h4 className="font-bold text-[#4A3728] text-xs uppercase tracking-wider mb-1">
                    Handmade Crafting Process
                  </h4>
                  <p className="text-xs leading-relaxed">
                    {(product.handmadeDetails || 'Individually sculpted at studio workbench.')
                      .replace(/\s*and\s+oven[- ]?cured/gi, '')
                      .replace(/\s*oven[- ]?cured\s*and/gi, '')
                      .replace(/\s*oven[- ]?cured/gi, '')
                      .replace(/\s{2,}/g, ' ')
                      .trim()}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FDF9F6] border border-[#F2E8E0]">
                  <h4 className="font-bold text-[#4A3728] text-xs uppercase tracking-wider mb-1">
                    Care Instructions
                  </h4>
                  <p className="text-xs leading-relaxed">{product.careInstructions}</p>
                </div>
              </div>
            )}

            {activeTab === 'returns' && (
              <div className="space-y-5 max-w-3xl text-xs sm:text-sm text-[#7D6B5D]">
                {/* Mandatory Video Highlight */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-start gap-3.5">
                  <Video className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-[#4A3728] block text-xs sm:text-sm">
                      Mandatory Continuous Unboxing Video
                    </span>
                    <p className="text-xs text-[#7D6B5D] leading-relaxed">
                      A continuous unboxing video recorded from <strong>before opening the package and throughout the entire unpacking process</strong> is mandatory. No unboxing video = no return or refund.
                    </p>
                  </div>
                </div>

                {/* Policy Points Checklist */}
                <div className="p-5 rounded-2xl bg-[#FDF9F6] border border-[#F2E8E0] space-y-3">
                  <h4 className="font-bold text-[#4A3728] text-xs uppercase tracking-wider">
                    Official Return & Refund Terms:
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Eligible reasons:</strong> Returns/refunds are accepted only for damaged, defective, or incorrect items.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Timeframe:</strong> Please contact us within 48 hours of delivery with your unboxing video and photos of the issue.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Exclusions:</strong> Returns are not accepted for change of mind, wrong color/design choice, or minor handmade variations.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                      <span><strong>Personalized items:</strong> Custom/personalized items are non-refundable unless they arrive damaged or incorrect.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <RotateCcw className="w-4 h-4 text-[#4A3728] shrink-0 mt-0.5" />
                      <span><strong>Refund settlement:</strong> Approved refunds will be processed to the original payment method.</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-1 flex items-center justify-between flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setCurrentView('return-policy');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A3728] hover:text-[#C5A059] underline cursor-pointer"
                  >
                    <span>Read Full Policy Details & Video Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] text-[#7D6B5D]">
                    Need assistance? Chat directly on WhatsApp from our footer.
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Review Header & Write Review Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F2E8E0] gap-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-serif font-bold text-[#4A3728]">
                      {product.rating}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'fill-[#C5A059] text-[#C5A059]'
                                : 'text-[#F2E8E0]'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-[#7D6B5D]">Based on {product.reviews.length} collector reviews</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4A3728] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#5D4636] transition-colors"
                  >
                    <MessageSquareHeart className="w-3.5 h-3.5 text-[#F8D7DA]" />
                    <span>{isReviewFormOpen ? 'Close Form' : 'Write a Review'}</span>
                  </button>
                </div>

                {/* Review Form (Expandable) */}
                <AnimatePresence>
                  {isReviewFormOpen && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleSubmitReview}
                      className="p-5 rounded-2xl bg-[#F8D7DA]/30 border border-[#EAD0D3] space-y-4"
                    >
                      <h4 className="font-serif font-bold text-[#4A3728] text-base">
                        Leave a Review for {product.name}
                      </h4>

                      <div>
                        <label className="block text-xs font-bold text-[#4A3728] uppercase mb-1.5">
                          Your Rating
                        </label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="p-1 text-2xl focus:outline-none transition-transform hover:scale-120"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  star <= reviewRating
                                    ? 'fill-[#C5A059] text-[#C5A059]'
                                    : 'text-[#C5A059]/30'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#4A3728] uppercase mb-1">
                            Your Name
                          </label>
                          <input
                            type="text"
                            required
                            value={reviewAuthorName}
                            onChange={(e) => setReviewAuthorName(e.target.value)}
                            placeholder="e.g. Sanya Sharma"
                            className="w-full px-4 py-2 rounded-full bg-white border border-[#F2E8E0] text-xs text-[#4A3728] focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#4A3728] uppercase mb-1">
                          Your Review & Clay Experience
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Tell us what you love about this piece..."
                          className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#F2E8E0] text-xs text-[#4A3728] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-full bg-[#4A3728] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#5D4636] transition-colors"
                      >
                        Submit Review ♥
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Reviews List */}
                {product.reviews.length === 0 ? (
                  <div className="text-center py-8 text-[#7D6B5D] text-xs">
                    <p>No reviews yet for this drop. Be the first to share the love!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {product.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl bg-[#FDF9F6] border border-[#F2E8E0]"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            {rev.userAvatar ? (
                              <img
                                src={rev.userAvatar}
                                alt={rev.userName}
                                className="w-7 h-7 rounded-full object-cover border border-[#F2E8E0]"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-[#F8D7DA] text-[#4A3728] font-bold text-xs flex items-center justify-center">
                                {rev.userName[0]}
                              </div>
                            )}
                            <div>
                              <span className="font-bold text-xs text-[#4A3728] block">
                                {rev.userName}
                              </span>
                              {rev.verifiedPurchase && (
                                <span className="text-[10px] text-emerald-800 font-semibold flex items-center gap-0.5">
                                  ✓ Verified Clay Collector
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center gap-0.5">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-[#C5A059] text-[#C5A059]" />
                              ))}
                            </div>
                            <span className="text-[10px] text-[#7D6B5D]">{rev.date}</span>
                          </div>
                        </div>
                        <p className="text-xs text-[#7D6B5D] leading-relaxed pl-9">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-14 sm:mt-20">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A3728] mb-6">
              More Cute Pieces in {product.category}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
