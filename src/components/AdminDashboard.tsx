import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Order, Category } from '../types';
import { ProductImageUploader } from './ProductImageUploader';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  Check,
  X,
  Search,
  SlidersHorizontal,
  DollarSign,
  Users,
  Sparkles,
  Settings,
  Mail,
  MessageCircle,
  Instagram,
  Youtube,
  Truck,
  Save,
  RotateCcw,
  ShieldCheck,
  Power,
  Layers,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  ArrowUpRight,
  Receipt,
  FileText,
  MapPin,
  Copy,
  Printer,
  ExternalLink,
  Phone,
  Building2,
  Navigation,
  CheckCheck,
  Calendar,
  CalendarDays,
  RefreshCw,
  History,
  Lock,
  Unlock,
  Archive,
  Sun,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    orders,
    updateOrderStatus,
    updateOrderCourier,
    addNewProduct,
    deleteProduct,
    updateProduct,
    showToast,
    storeSettings,
    updateStoreSettings,
    isStoreActive,
    adminCredentials,
    updateAdminCredentials,
    logoutAdmin,
    issueRefund,
    deleteOrder,
    purgeExpiredOrders,
    refreshOrders,
    isAdminAuthenticated,
    setCurrentView,
    openAdminPortal
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'products' | 'orders' | 'refunds' | 'settings'>('overview');

  // Search & Filter state
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [refundFilter, setRefundFilter] = useState<'All' | 'Requests' | 'Refunded' | 'Eligible'>('All');

  // Orders View Mode, Calendar Filtering & 1-Month Retention States
  const [orderViewMode, setOrderViewMode] = useState<'today' | 'past' | 'all'>('today');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('All');
  const [datePresetFilter, setDatePresetFilter] = useState<'all' | 'today' | 'yesterday' | 'this_week' | 'this_month' | 'older_than_month'>('all');
  const [orderSortBy, setOrderSortBy] = useState<'newest' | 'oldest' | 'amount_high' | 'amount_low'>('newest');
  const [isRefreshingOrders, setIsRefreshingOrders] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
  const [isDeletingOrder, setIsDeletingOrder] = useState(false);
  const [isPurgingOrders, setIsPurgingOrders] = useState(false);

  // Shipping Label & Courier Management State
  const [selectedOrderForShippingLabel, setSelectedOrderForShippingLabel] = useState<Order | null>(null);
  const [editingCourierOrderId, setEditingCourierOrderId] = useState<string | null>(null);
  const [courierInput, setCourierInput] = useState('');
  const [trackingInput, setTrackingInput] = useState('');
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Add / Edit Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState(categories[0]?.name || 'Keychains');
  const [newPrice, setNewPrice] = useState<number | string>(299);
  const [newOriginalPrice, setNewOriginalPrice] = useState<number | string>(349);
  const [newDescription, setNewDescription] = useState('');
  const [newImages, setNewImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=700&auto=format&fit=crop&q=80'
  ]);
  const [newMaterials, setNewMaterials] = useState('Artisan Clay, UV Glaze Sealant');
  const [newDimensions, setNewDimensions] = useState('Approx 3.5cm × 3.0cm');
  const [newHandmadeDetails, setNewHandmadeDetails] = useState('Individually sculpted at studio workbench.');
  const [newInStock, setNewInStock] = useState<boolean>(true);
  const [newStockCount, setNewStockCount] = useState<number>(15);
  const [newIsNew, setNewIsNew] = useState<boolean>(true);
  const [newBadge, setNewBadge] = useState<string>('New Drop');

  // Inline Quick Price Edit State
  const [editingInlinePriceId, setEditingInlinePriceId] = useState<string | null>(null);
  const [inlinePriceInput, setInlinePriceInput] = useState<string>('');

  // Add / Edit Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catImageUrl, setCatImageUrl] = useState('https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80');
  const [catAccentColor, setCatAccentColor] = useState('#FCE7EC');

  // Refund Modal State
  const [selectedOrderForRefund, setSelectedOrderForRefund] = useState<Order | null>(null);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundReason, setRefundReason] = useState<string>('Customer Request / Return');
  const [refundNotes, setRefundNotes] = useState<string>('');
  const [refundTxnId, setRefundTxnId] = useState<string>('');

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    isStoreActive: storeSettings.isStoreActive !== false,
    storeInactiveMessage: storeSettings.storeInactiveMessage || '🌸 Painite Crafts is temporarily taking a creative studio break. Checkout is currently paused.',
    offlineResumingNotice: storeSettings.offlineResumingNotice || 'We will be resuming online studio orders very shortly! Follow our craftsmanship on Instagram or WhatsApp us for custom inquiries.',
    announcementText: storeSettings.announcementText || 'Handcrafted with love. Every piece tells a story.',
    announcementHighlight: storeSettings.announcementHighlight || 'Free Studio Shipping on orders over ₹999',
    showAnnouncementBar: storeSettings.showAnnouncementBar !== false,
    freeShippingThreshold: storeSettings.freeShippingThreshold || 999,
    email: storeSettings.email,
    phone: storeSettings.phone || '+91 7207427137',
    whatsappNumber: storeSettings.whatsappNumber,
    whatsappUrl: storeSettings.whatsappUrl,
    instagramHandle: storeSettings.instagramHandle,
    instagramUrl: storeSettings.instagramUrl,
    youtubeName: storeSettings.youtubeName,
    youtubeUrl: storeSettings.youtubeUrl,
  });

  // Admin Credentials Form State
  const [adminCredsForm, setAdminCredsForm] = useState({
    adminId: adminCredentials.adminId,
    password: adminCredentials.password
  });
  const [showPassword, setShowPassword] = useState(false);

  // Computed Stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'Delivered').length;
  const cancelledOrdersCount = orders.filter((o) => o.status === 'Cancelled').length;
  const totalRefundedAmount = orders.reduce((sum, o) => sum + (o.refundAmount || 0), 0);
  const refundRequestsCount = orders.filter((o) => o.refundStatus === 'Requested').length;

  // Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setNewName('');
    setNewCategory(categories[0]?.name || 'Keychains');
    setNewPrice(299);
    setNewOriginalPrice(349);
    setNewDescription('');
    setNewImages([
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=700&auto=format&fit=crop&q=80'
    ]);
    setNewMaterials('Artisan Clay, UV Glaze Sealant');
    setNewDimensions('Approx 3.5cm × 3.0cm');
    setNewHandmadeDetails('Individually sculpted at studio workbench.');
    setNewInStock(true);
    setNewStockCount(15);
    setNewIsNew(true);
    setNewBadge('New Drop');
    setIsAddProductOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setNewName(prod.name);
    setNewCategory(prod.category);
    setNewPrice(prod.price);
    setNewOriginalPrice(prod.originalPrice !== undefined ? prod.originalPrice : '');
    setNewDescription(prod.shortDescription || prod.fullDescription || '');
    setNewImages(prod.images && prod.images.length > 0 ? [...prod.images] : []);
    setNewMaterials(
      Array.isArray(prod.materials) && prod.materials.length > 0
        ? prod.materials.join(', ')
        : typeof prod.materials === 'string'
        ? prod.materials
        : 'Artisan Clay, UV Glaze Sealant'
    );
    setNewDimensions(prod.dimensions || 'Approx 3.5cm × 3.0cm');
    const cleanHandmade = (prod.handmadeDetails || 'Individually sculpted at studio workbench.')
      .replace(/\s*and\s+oven[- ]?cured/gi, '')
      .replace(/\s*oven[- ]?cured\s*and/gi, '')
      .replace(/\s*oven[- ]?cured/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
    setNewHandmadeDetails(cleanHandmade || 'Individually sculpted at studio workbench.');
    setNewInStock(prod.inStock !== false);
    setNewStockCount(prod.stockCount !== undefined ? prod.stockCount : 15);
    setNewIsNew(!!prod.isNew);
    setNewBadge(prod.badge || (prod.isNew ? 'New Drop' : ''));
    setIsAddProductOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    if (!newImages || newImages.length === 0) {
      showToast('⚠️ Please upload or select at least one product photo.');
      return;
    }

    const materialsArray = newMaterials.split(',').map((m) => m.trim()).filter(Boolean);
    const dimensionsVal = newDimensions.trim() || 'Approx 3.5cm × 3.0cm';
    const cleanHandmadeVal = (newHandmadeDetails.trim() || 'Individually sculpted at studio workbench.')
      .replace(/\s*and\s+oven[- ]?cured/gi, '')
      .replace(/\s*oven[- ]?cured\s*and/gi, '')
      .replace(/\s*oven[- ]?cured/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim() || 'Individually sculpted at studio workbench.';
    const parsedPrice = Math.max(0, Number(newPrice) || 0);
    const parsedOriginalPrice = newOriginalPrice !== '' && !isNaN(Number(newOriginalPrice))
      ? Math.max(0, Number(newOriginalPrice))
      : undefined;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: newName.trim(),
        category: newCategory,
        price: parsedPrice,
        originalPrice: parsedOriginalPrice,
        shortDescription: newDescription,
        fullDescription: newDescription,
        images: newImages,
        inStock: newInStock,
        stockCount: Number(newStockCount),
        badge: newBadge ? newBadge : undefined,
        isNew: newIsNew,
        materials: materialsArray.length ? materialsArray : ['Artisan Clay', 'Resin Seal'],
        dimensions: dimensionsVal,
        handmadeDetails: cleanHandmadeVal
      });
      showToast(`Updated "${newName}" — Price, materials, dimensions & crafting details saved! ✨`);
    } else {
      addNewProduct({
        name: newName.trim(),
        slug: newName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: newCategory,
        price: parsedPrice,
        originalPrice: parsedOriginalPrice,
        shortDescription: newDescription || `Handcrafted ${newName} created by studio artisans.`,
        fullDescription: newDescription || `Each ${newName} is molded, detailed, and glazed with water-resistant resin finish in our studio.`,
        images: newImages,
        rating: 5.0,
        reviewsCount: 0,
        inStock: newInStock,
        stockCount: Number(newStockCount),
        badge: newBadge ? newBadge : (newIsNew ? 'New Drop' : undefined),
        isNew: newIsNew,
        materials: materialsArray.length ? materialsArray : ['Artisan Clay', 'Resin Seal'],
        dimensions: dimensionsVal,
        handmadeDetails: cleanHandmadeVal,
        careInstructions: 'Avoid harsh immersion in water. Clean with soft cloth.',
        shippingInfo: 'Ships within 24-48 business hours.',
        reviews: []
      });
      showToast(`New item "${newName}" added at ₹${parsedPrice}! 🌸`);
    }

    setIsAddProductOpen(false);
    setEditingProduct(null);
  };

  const handleSaveInlinePrice = (prodId: string) => {
    const parsed = Math.max(0, Number(inlinePriceInput));
    if (!isNaN(parsed) && parsed >= 0) {
      updateProduct(prodId, { price: parsed });
      showToast(`Price updated to ₹${parsed}! ✨`);
    }
    setEditingInlinePriceId(null);
    setInlinePriceInput('');
  };

  const handleOpenCategoryModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setCatName(cat.name);
      setCatDescription(cat.description);
      setCatImageUrl(cat.image);
      setCatAccentColor(cat.accentColor || '#FCE7EC');
    } else {
      setEditingCategory(null);
      setCatName('');
      setCatDescription('');
      setCatImageUrl('https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80');
      setCatAccentColor('#FCE7EC');
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      showToast('Category name is required.');
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: catName.trim(),
        description: catDescription.trim() || `Handcrafted ${catName.trim()} collection.`,
        image: catImageUrl.trim() || editingCategory.image,
        accentColor: catAccentColor
      });
      showToast(`Category "${catName}" updated! 📂`);
    } else {
      addCategory({
        name: catName.trim(),
        description: catDescription.trim(),
        image: catImageUrl.trim(),
        accentColor: catAccentColor
      });
    }

    setIsCategoryModalOpen(false);
  };

  const handleOpenRefundModal = (order: Order) => {
    setSelectedOrderForRefund(order);
    const maxRefundable = order.totalAmount - (order.refundAmount || 0);
    setRefundAmount(maxRefundable);
    setRefundReason(order.refundReason || 'Customer Request / Return');
    setRefundNotes('');
    setRefundTxnId(`RFND-${Date.now().toString().slice(-6)}`);
  };

  const copyFullAddress = (ord: Order) => {
    const lines = [
      `SHIP TO:`,
      `Name: ${ord.customer.fullName}`,
      `Phone: ${ord.customer.phone}`,
      `Email: ${ord.customer.email}`,
      ord.customer.apartment ? `Flat/Bldg: ${ord.customer.apartment}` : null,
      ord.customer.address ? `Street/Area: ${ord.customer.address}` : null,
      ord.customer.landmark ? `Landmark: ${ord.customer.landmark}` : null,
      `City/State/PIN: ${ord.customer.city}, ${ord.customer.state} - ${ord.customer.pincode}`,
      ord.customer.deliveryNotes ? `Delivery Instructions: ${ord.customer.deliveryNotes}` : null,
      `Order: #${ord.orderNumber} (${ord.shippingMethod})`,
      `Payment: ${ord.paymentMethod} (₹${ord.totalAmount}) [${ord.paymentStatus}]`
    ].filter(Boolean).join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(lines);
      setCopiedOrderId(ord.id);
      setTimeout(() => setCopiedOrderId(null), 2500);
      showToast(`Copied full delivery address for #${ord.orderNumber} 📋`);
    }
  };

  const handleOpenCourierEdit = (ord: Order) => {
    setEditingCourierOrderId(ord.id);
    setCourierInput(ord.courierName || 'Delhivery Express');
    setTrackingInput(ord.trackingNumber || `DLH${Date.now().toString().slice(-8)}IN`);
  };

  const handleSaveCourier = (orderId: string) => {
    updateOrderCourier(orderId, courierInput, trackingInput);
    setEditingCourierOrderId(null);
  };

  const handleProcessRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForRefund) return;

    if (refundAmount <= 0) {
      showToast('Refund amount must be greater than zero.');
      return;
    }

    const maxRefundable = selectedOrderForRefund.totalAmount - (selectedOrderForRefund.refundAmount || 0);
    if (refundAmount > maxRefundable) {
      showToast(`Cannot refund more than remaining balance ₹${maxRefundable}.`);
      return;
    }

    issueRefund(selectedOrderForRefund.id, {
      amount: refundAmount,
      reason: refundReason,
      txnId: refundTxnId,
      notes: refundNotes
    });

    setSelectedOrderForRefund(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings({
      isStoreActive: settingsForm.isStoreActive,
      storeInactiveMessage: settingsForm.storeInactiveMessage,
      offlineResumingNotice: settingsForm.offlineResumingNotice,
      announcementText: settingsForm.announcementText,
      announcementHighlight: settingsForm.announcementHighlight,
      showAnnouncementBar: settingsForm.showAnnouncementBar,
      freeShippingThreshold: Number(settingsForm.freeShippingThreshold),
      email: settingsForm.email,
      phone: settingsForm.phone,
      whatsappNumber: settingsForm.whatsappNumber,
      whatsappUrl: settingsForm.whatsappUrl,
      instagramHandle: settingsForm.instagramHandle,
      instagramUrl: settingsForm.instagramUrl,
      youtubeName: settingsForm.youtubeName,
      youtubeUrl: settingsForm.youtubeUrl,
    });
  };

  const handleSaveAdminCreds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminCredsForm.adminId.trim() || !adminCredsForm.password.trim()) {
      showToast('Admin ID and Password cannot be empty.');
      return;
    }
    updateAdminCredentials(adminCredsForm);
  };

  // Order Date & Retention Helpers
  const getOrderMetadata = (ord: Order) => {
    let orderDateObj: Date;
    if (ord.createdAt) {
      orderDateObj = new Date(ord.createdAt);
    } else if (ord.date) {
      orderDateObj = new Date(`${ord.date}T12:00:00`);
    } else {
      orderDateObj = new Date();
    }

    if (isNaN(orderDateObj.getTime())) {
      orderDateObj = new Date();
    }

    const todayObj = new Date();
    const todayStr = todayObj.toISOString().split('T')[0];
    const orderDateStr = ord.date || orderDateObj.toISOString().split('T')[0];

    const isToday = orderDateStr === todayStr;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = days[orderDateObj.getDay()];

    const formattedDate = orderDateObj.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const timeStr = ord.time || (ord.trackingSteps?.[0]?.date?.includes(':') ? ord.trackingSteps[0].date : orderDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));

    const ageInMs = Date.now() - orderDateObj.getTime();
    const ageInDays = Math.max(0, Math.floor(ageInMs / (1000 * 60 * 60 * 24)));
    const isOlderThanMonth = ageInDays >= 30;
    const daysLeftUntilDelete = Math.max(0, 30 - ageInDays);

    return {
      dateObj: orderDateObj,
      dateStr: orderDateStr,
      dayOfWeek,
      formattedDate,
      timeStr,
      isToday,
      ageInDays,
      isOlderThanMonth,
      daysLeftUntilDelete
    };
  };

  const handleRefreshDailyOrders = async () => {
    setIsRefreshingOrders(true);
    await refreshOrders();
    setTimeout(() => {
      setIsRefreshingOrders(false);
    }, 600);
  };

  const handleDeleteOrderConfirm = async () => {
    if (!orderToDelete) return;
    setIsDeletingOrder(true);
    try {
      await deleteOrder(orderToDelete.id);
      setOrderToDelete(null);
    } finally {
      setIsDeletingOrder(false);
    }
  };

  const handlePurgeAllExpiredOrders = async () => {
    setIsPurgingOrders(true);
    try {
      await purgeExpiredOrders(30);
      setIsPurgeModalOpen(false);
    } finally {
      setIsPurgingOrders(false);
    }
  };

  // Filtered views
  const filteredProducts = (products || []).filter((p) => {
    if (!p) return false;
    const catName = p.category || '';
    const prodName = p.name || '';
    const prodDesc = p.shortDescription || '';
    const matchesCat =
      selectedCategoryFilter === 'All' ||
      catName.toLowerCase() === selectedCategoryFilter.toLowerCase();
    const matchesSearch =
      prodName.toLowerCase().includes(productSearch.toLowerCase()) ||
      prodDesc.toLowerCase().includes(productSearch.toLowerCase()) ||
      catName.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const todayOrdersCount = orders.filter((o) => getOrderMetadata(o).isToday).length;
  const expiredOrdersCount = orders.filter((o) => getOrderMetadata(o).isOlderThanMonth).length;

  const filteredOrders = orders.filter((o) => {
    const meta = getOrderMetadata(o);
    
    // Status filter
    const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;

    // Search filter
    const q = orderSearch.toLowerCase();
    const matchesSearch =
      !orderSearch ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer.fullName.toLowerCase().includes(q) ||
      o.customer.phone.includes(q) ||
      o.customer.city.toLowerCase().includes(q) ||
      o.customer.pincode.includes(q) ||
      meta.dayOfWeek.toLowerCase().includes(q) ||
      meta.formattedDate.toLowerCase().includes(q) ||
      (o.items && o.items.some((it) => it.product.name.toLowerCase().includes(q)));

    if (!matchesStatus || !matchesSearch) return false;

    // View Mode & Calendar filtering
    if (orderViewMode === 'today') {
      return meta.isToday;
    }

    if (orderViewMode === 'past') {
      // Direct Date Picker filter
      if (selectedDateFilter) {
        if (meta.dateStr !== selectedDateFilter) return false;
      }

      // Day of Week filter
      if (selectedDayFilter !== 'All') {
        if (meta.dayOfWeek !== selectedDayFilter) return false;
      }

      // Date Preset Filter
      if (datePresetFilter === 'today') {
        if (!meta.isToday) return false;
      } else if (datePresetFilter === 'yesterday') {
        const yest = new Date();
        yest.setDate(yest.getDate() - 1);
        const yestStr = yest.toISOString().split('T')[0];
        if (meta.dateStr !== yestStr) return false;
      } else if (datePresetFilter === 'this_week') {
        if (meta.ageInDays > 7) return false;
      } else if (datePresetFilter === 'this_month') {
        const nowMonth = new Date().getMonth();
        const nowYear = new Date().getFullYear();
        if (meta.dateObj.getMonth() !== nowMonth || meta.dateObj.getFullYear() !== nowYear) return false;
      } else if (datePresetFilter === 'older_than_month') {
        if (!meta.isOlderThanMonth) return false;
      }

      return true;
    }

    // All mode: optional date/day filters still apply if selected
    if (selectedDateFilter && meta.dateStr !== selectedDateFilter) return false;
    if (selectedDayFilter !== 'All' && meta.dayOfWeek !== selectedDayFilter) return false;
    if (datePresetFilter === 'older_than_month' && !meta.isOlderThanMonth) return false;

    return true;
  }).sort((a, b) => {
    const metaA = getOrderMetadata(a);
    const metaB = getOrderMetadata(b);

    if (orderSortBy === 'newest') {
      return metaB.dateObj.getTime() - metaA.dateObj.getTime();
    }
    if (orderSortBy === 'oldest') {
      return metaA.dateObj.getTime() - metaB.dateObj.getTime();
    }
    if (orderSortBy === 'amount_high') {
      return b.totalAmount - a.totalAmount;
    }
    if (orderSortBy === 'amount_low') {
      return a.totalAmount - b.totalAmount;
    }
    return 0;
  });

  const filteredRefundOrders = orders.filter((o) => {
    if (refundFilter === 'Requests') return o.refundStatus === 'Requested';
    if (refundFilter === 'Refunded') return o.refundStatus === 'Refunded' || o.refundStatus === 'Partially Refunded';
    if (refundFilter === 'Eligible') return o.paymentStatus === 'Paid' && o.refundStatus !== 'Refunded';
    return true;
  });

  if (!isAdminAuthenticated) {
    return (
      <div id="admin-access-denied" className="py-20 bg-[#FFFDF9] min-h-[75vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#F2E8E0] p-8 text-center shadow-xl space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto shadow-xs">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#4A3728]">
              Restricted Admin Access
            </h2>
            <p className="text-xs text-[#7D6B5D] mt-2 leading-relaxed">
              Painite Crafts Studio Dashboard is strictly restricted to authorized studio administrators with verified credentials.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#E8DCCF] bg-[#FAF7F2] hover:bg-[#F2E8E0] text-xs font-bold text-[#4A3728] transition-colors cursor-pointer"
            >
              Return to Store
            </button>
            <button
              onClick={openAdminPortal}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#4A3728] hover:bg-[#32231A] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-[#F8D7DA]" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-dashboard-root" className="py-8 sm:py-12 bg-[#FFFDF9] min-h-screen text-[#4A3728]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Store Active Status Alert Banner */}
        {!isStoreActive && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-200/70 flex items-center justify-center shrink-0 text-amber-800">
                <Power className="w-5 h-5 text-amber-800" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Store Status: PAUSED / OFFLINE</p>
                <p className="text-xs text-amber-900 mt-0.5">Customers can browse, but new orders and checkouts are currently disabled.</p>
              </div>
            </div>
            <button
              onClick={() => {
                updateStoreSettings({ isStoreActive: true });
                setSettingsForm((prev) => ({ ...prev, isStoreActive: true }));
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition-colors shadow-xs"
            >
              Turn Store LIVE Now 🟢
            </button>
          </motion.div>
        )}

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#FCE7EC] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                Studio Management Suite
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                isStoreActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {isStoreActive ? '● Store LIVE' : '○ Store Offline'}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A3728]">
              Painite Crafts Admin Portal
            </h1>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="admin-add-category-quick-btn"
              onClick={() => handleOpenCategoryModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F8D7DA]/60 hover:bg-[#F8D7DA] text-[#4A3728] text-xs font-bold border border-[#EAD0D3] transition-colors"
            >
              <Layers className="w-4 h-4 text-[#C48B9F]" />
              <span>+ Add Category</span>
            </button>

            <button
              id="admin-add-product-quick-btn"
              onClick={handleOpenAddProduct}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4A3728] text-white text-xs font-bold hover:bg-[#5D4636] transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#F8D7DA]" />
              <span>+ Add Product</span>
            </button>

            <button
              id="admin-logout-btn"
              onClick={logoutAdmin}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-white hover:bg-red-50 text-stone-600 hover:text-red-700 text-xs font-semibold border border-[#E8DCCF] transition-colors"
              title="Logout of Admin Mode"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit Admin</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#FCE7EC] gap-2 sm:gap-6 mb-8 overflow-x-auto pb-1 text-xs sm:text-sm font-bold scrollbar-none">
          {[
            { id: 'overview', label: 'Studio Overview', icon: TrendingUp },
            { id: 'categories', label: `Categories (${categories.length})`, icon: Layers },
            { id: 'products', label: `Products (${products.length})`, icon: ShoppingBag },
            { id: 'orders', label: `Orders (${orders.length})`, icon: Package },
            { id: 'refunds', label: `Refunds ${refundRequestsCount > 0 ? `(${refundRequestsCount} New)` : ''}`, icon: RotateCcw },
            { id: 'settings', label: 'Store & Security Settings', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`admin-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-2 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#4A3728] text-[#4A3728]'
                    : 'border-transparent text-[#7D6B5D] hover:text-[#4A3728]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C48B9F]' : 'text-[#7D6B5D]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 1. OVERVIEW STATS TAB */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-[#F2E8E0] shadow-xs">
                <div className="flex items-center justify-between text-[#7D6B5D]">
                  <span className="text-xs font-medium">Total Studio Sales</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="font-serif text-2xl font-bold text-[#4A3728] mt-1">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-emerald-600 font-semibold mt-2 block">
                  ↑ 100% Verified checkout
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#F2E8E0] shadow-xs">
                <div className="flex items-center justify-between text-[#7D6B5D]">
                  <span className="text-xs font-medium">Active Orders</span>
                  <Clock className="w-4 h-4 text-[#C5A059]" />
                </div>
                <p className="font-serif text-2xl font-bold text-[#4A3728] mt-1">
                  {activeOrdersCount}
                </p>
                <span className="text-[11px] text-[#C5A059] font-semibold mt-2 block">
                  In Workbench / Transit Queue
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#F2E8E0] shadow-xs">
                <div className="flex items-center justify-between text-[#7D6B5D]">
                  <span className="text-xs font-medium">Categories & Crafts</span>
                  <Layers className="w-4 h-4 text-[#C48B9F]" />
                </div>
                <p className="font-serif text-2xl font-bold text-[#4A3728] mt-1">
                  {categories.length} <span className="text-sm font-sans font-normal text-[#7D6B5D]">Cats</span> / {products.length} <span className="text-sm font-sans font-normal text-[#7D6B5D]">Items</span>
                </p>
                <span className="text-[11px] text-[#7D6B5D] font-semibold mt-2 block">
                  Dynamic collections enabled
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#F2E8E0] shadow-xs">
                <div className="flex items-center justify-between text-[#7D6B5D]">
                  <span className="text-xs font-medium">Total Refunded</span>
                  <RotateCcw className="w-4 h-4 text-purple-600" />
                </div>
                <p className="font-serif text-2xl font-bold text-[#4A3728] mt-1">
                  ₹{totalRefundedAmount.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-purple-700 font-semibold mt-2 block">
                  {refundRequestsCount} pending requests
                </span>
              </div>
            </div>

            {/* Quick Workbench Queue */}
            <div className="bg-white rounded-3xl border border-[#F2E8E0] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-[#4A3728]">
                  Recent Orders & Workbench Queue
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#C48B9F] hover:underline flex items-center gap-1"
                >
                  <span>View All Orders</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#F2E8E0] text-[#7D6B5D] uppercase font-bold">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Items</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Payment</th>
                      <th className="pb-3">Stage</th>
                      <th className="pb-3 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2E8E0]">
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id} className="hover:bg-[#FDF9F6]/60">
                        <td className="py-3 font-bold text-[#4A3728]">#{o.orderNumber}</td>
                        <td className="py-3">
                          <span className="font-semibold block">{o.customer.fullName}</span>
                          <span className="text-[10px] text-[#7D6B5D]">{o.customer.phone}</span>
                        </td>
                        <td className="py-3">{o.items.length} items</td>
                        <td className="py-3 font-bold">₹{o.totalAmount}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            o.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            o.paymentStatus === 'Refunded' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            o.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : o.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-[#F8D7DA]/40 border border-[#EAD0D3] text-[#4A3728]'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleOpenRefundModal(o)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors"
                          >
                            Refund
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. DYNAMIC CATEGORY MANAGEMENT TAB */}
        {/* ========================================================================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#F2E8E0] shadow-xs">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#4A3728]">
                  Dynamic Categories & Collections
                </h3>
                <p className="text-xs text-[#7D6B5D] mt-0.5">
                  Add, edit, or remove store categories like Keychains, Phone Cases, 3D Prints, Charms, Magnets & more.
                </p>
              </div>
              <button
                id="admin-add-category-main-btn"
                onClick={() => handleOpenCategoryModal()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4A3728] text-white text-xs font-bold hover:bg-[#5D4636] transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#F8D7DA]" />
                <span>Create New Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat) => {
                const productCount = products.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).length;
                return (
                  <div
                    key={cat.id}
                    id={`category-card-${cat.id}`}
                    className="bg-white rounded-3xl border border-[#F2E8E0] p-5 shadow-xs flex flex-col justify-between hover:border-[#C48B9F]/40 transition-all group"
                  >
                    <div>
                      <div className="relative h-36 rounded-2xl overflow-hidden mb-4 bg-stone-100">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[11px] font-bold text-[#4A3728] shadow-xs">
                          {productCount} {productCount === 1 ? 'Product' : 'Products'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-serif text-base font-bold text-[#4A3728]">
                          {cat.name}
                        </h4>
                        <span className="text-[10px] font-mono text-[#7D6B5D] bg-[#FDF9F6] px-2 py-0.5 rounded-md border border-[#F2E8E0]">
                          /{cat.slug}
                        </span>
                      </div>
                      <p className="text-xs text-[#7D6B5D] line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#F2E8E0]">
                      <span className="text-[11px] text-[#7D6B5D]">
                        Active in store catalog
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenCategoryModal(cat)}
                          className="p-1.5 rounded-lg text-[#7D6B5D] hover:text-[#4A3728] hover:bg-[#FDF9F6] transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCategoryToDelete(cat)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. PRODUCTS MANAGEMENT TAB */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-[#F2E8E0] p-6 shadow-xs space-y-5">
            {/* Search, Category Filter, and Add Button */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7D6B5D]" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FDF9F6] border border-[#F2E8E0] text-xs text-[#4A3728] focus:outline-hidden focus:border-[#C48B9F]"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-[#7D6B5D] shrink-0">Category:</label>
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#FDF9F6] border border-[#F2E8E0] text-xs font-semibold text-[#4A3728] focus:outline-hidden"
                  >
                    <option value="All">All Categories ({products.length})</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleOpenAddProduct}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4A3728] text-white text-xs font-bold hover:bg-[#32231A] transition-colors shrink-0 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#F8D7DA]" />
                  <span>New Product</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#F2E8E0] text-[#7D6B5D] uppercase font-bold">
                    <th className="pb-3">Image</th>
                    <th className="pb-3">Craft Name</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Drop Status</th>
                    <th className="pb-3">Stock Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2E8E0]">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[#FDF9F6]/60 transition-colors">
                      <td className="py-3">
                        <div className="relative w-10 h-10">
                          <img
                            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=700&auto=format&fit=crop&q=80'}
                            alt={prod.name}
                            className="w-10 h-10 rounded-xl object-cover border border-[#F2E8E0]"
                          />
                          {prod.images && prod.images.length > 1 && (
                            <span
                              title={`${prod.images.length} product photos`}
                              className="absolute -bottom-1 -right-1 bg-[#4A3728] text-[#F8D7DA] text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-white shadow-xs"
                            >
                              {prod.images.length}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="font-bold text-[#4A3728] block">{prod.name}</span>
                        {prod.badge && (
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-[#F8D7DA]/60 text-[10px] font-bold text-[#4A3728]">
                            {prod.badge}
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-md bg-[#F8D7DA]/40 text-[11px] font-semibold text-[#4A3728]">
                          {prod.category}
                        </span>
                      </td>
                      <td className="py-3">
                        {editingInlinePriceId === prod.id ? (
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-[#4A3728]">₹</span>
                            <input
                              type="number"
                              min="0"
                              value={inlinePriceInput}
                              onChange={(e) => setInlinePriceInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleSaveInlinePrice(prod.id);
                                } else if (e.key === 'Escape') {
                                  setEditingInlinePriceId(null);
                                }
                              }}
                              autoFocus
                              className="w-18 px-2 py-1 text-xs font-bold bg-white rounded-lg border-2 border-[#4A3728] text-[#4A3728] focus:outline-hidden"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveInlinePrice(prod.id)}
                              className="p-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-2xs"
                              title="Save Price"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingInlinePriceId(null)}
                              className="p-1 rounded-md bg-stone-200 text-stone-600 hover:bg-stone-300 cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingInlinePriceId(prod.id);
                              setInlinePriceInput(String(prod.price));
                            }}
                            className="group/price flex items-center gap-1 font-bold text-[#4A3728] hover:text-[#C5A059] px-2 py-1 rounded-lg hover:bg-white border border-transparent hover:border-[#E8DCCF] transition-all cursor-pointer"
                            title="Click to edit price directly"
                          >
                            <span>₹{prod.price}</span>
                            {prod.originalPrice && prod.originalPrice > prod.price && (
                              <span className="text-[10px] text-[#7D6B5D] line-through font-normal">
                                ₹{prod.originalPrice}
                              </span>
                            )}
                            <Edit2 className="w-3 h-3 text-[#C5A059] opacity-0 group-hover/price:opacity-100 transition-opacity ml-0.5" />
                          </button>
                        )}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => {
                            const newIsNew = !prod.isNew;
                            updateProduct(prod.id, {
                              isNew: newIsNew,
                              badge: newIsNew ? (prod.badge || 'New Drop') : undefined
                            });
                          }}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                            prod.isNew
                              ? 'bg-[#F8D7DA] text-[#4A3728] border border-[#EAD0D3] hover:bg-[#F2C0C6]'
                              : 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200'
                          }`}
                          title="Click to toggle New Drop tag"
                        >
                          {prod.isNew ? '✨ New Drop' : 'Classic'}
                        </button>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => updateProduct(prod.id, { inStock: !prod.inStock })}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                            prod.inStock
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                          }`}
                          title="Click to toggle In Stock / Out of Stock"
                        >
                          {prod.inStock ? `● In Stock (${prod.stockCount ?? 15})` : '○ Out of Stock'}
                        </button>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1.5 rounded-lg text-[#7D6B5D] hover:text-[#4A3728] hover:bg-[#FDF9F6] transition-colors cursor-pointer"
                            title="Edit Craft"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setProductToDelete(prod)}
                            className="p-1.5 rounded-lg text-[#7D6B5D] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. ORDERS & CRAFTING QUEUE TAB */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-[#F2E8E0] p-5 sm:p-7 shadow-xs space-y-6">
            {/* Top Header: View Mode Switcher, Refresh & Bulk Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#F2E8E0]">
              {/* Segmented View Switcher */}
              <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#FDF9F6] border border-[#F2E8E0]">
                <button
                  type="button"
                  onClick={() => {
                    setOrderViewMode('today');
                    setSelectedDateFilter('');
                    setSelectedDayFilter('All');
                    setDatePresetFilter('all');
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    orderViewMode === 'today'
                      ? 'bg-[#3D272A] text-white shadow-xs'
                      : 'text-[#7D6B5D] hover:text-[#4A3728] hover:bg-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span>Today's Live Queue</span>
                  <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                    orderViewMode === 'today' ? 'bg-white/20 text-white' : 'bg-[#F2E8E0] text-[#7D6B5D]'
                  }`}>
                    {todayOrdersCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderViewMode('past')}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    orderViewMode === 'past'
                      ? 'bg-[#3D272A] text-white shadow-xs'
                      : 'text-[#7D6B5D] hover:text-[#4A3728] hover:bg-white'
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5 text-[#B85B75]" />
                  <span>Past Orders & Calendar Archive</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOrderViewMode('all');
                    setSelectedDateFilter('');
                    setSelectedDayFilter('All');
                    setDatePresetFilter('all');
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    orderViewMode === 'all'
                      ? 'bg-[#3D272A] text-white shadow-xs'
                      : 'text-[#7D6B5D] hover:text-[#4A3728] hover:bg-white'
                  }`}
                >
                  <History className="w-3.5 h-3.5 text-[#7D6B5D]" />
                  <span>All Orders History</span>
                  <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                    orderViewMode === 'all' ? 'bg-white/20 text-white' : 'bg-[#F2E8E0] text-[#7D6B5D]'
                  }`}>
                    {orders.length}
                  </span>
                </button>
              </div>

              {/* Action Buttons: Refresh & Purge Old Orders */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleRefreshDailyOrders}
                  disabled={isRefreshingOrders}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-[#FDF9F6] border border-[#F2E8E0] text-xs font-bold text-[#4A3728] shadow-2xs transition-all cursor-pointer active:scale-98"
                  title="Refresh orders from live Firestore database"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#B85B75] ${isRefreshingOrders ? 'animate-spin' : ''}`} />
                  <span>{isRefreshingOrders ? 'Syncing...' : 'Daily Refresh / Sync'}</span>
                </button>

                {expiredOrdersCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsPurgeModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold text-rose-700 transition-colors cursor-pointer shadow-2xs"
                    title="Clean up orders older than 30 days"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Purge 1+ Month Old ({expiredOrdersCount})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mode-Specific Header Banner */}
            {orderViewMode === 'today' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-r from-[#FFF5F7] via-[#FDF9F6] to-[#FFF9F5] border border-[#F9D5DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#F9D5DF] flex items-center justify-center text-amber-500 shadow-2xs shrink-0 mt-0.5">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#4A3728]">
                        Daily Orders Queue • {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Live Today
                      </span>
                    </div>
                    <p className="text-xs text-[#7D6B5D] mt-0.5">
                      Your workbench refreshes each day fresh! Currently showing <strong>{todayOrdersCount} new orders</strong> received today.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setOrderViewMode('past')}
                    className="text-xs font-bold text-[#B85B75] hover:underline flex items-center gap-1 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-[#F9D5DF]"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Browse Past Dates</span>
                  </button>
                </div>
              </div>
            )}

            {/* Search & Filter Controls */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Search Box */}
                <div className="relative sm:col-span-2 lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7D6B5D]" />
                  <input
                    type="text"
                    placeholder="Search by Order #, Customer, Phone, City, PIN, Item..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FDF9F6] border border-[#F2E8E0] text-xs text-[#4A3728] focus:outline-hidden focus:border-[#C48B9F]"
                  />
                </div>

                {/* Stage Filter */}
                <div>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FDF9F6] border border-[#F2E8E0] text-xs font-semibold text-[#4A3728] focus:outline-hidden"
                  >
                    <option value="All">All Crafting Stages ({orders.length})</option>
                    <option value="Order Placed">1. Order Placed</option>
                    <option value="Order Confirmed">2. Order Confirmed</option>
                    <option value="Crafting Your Piece">3. Crafting Your Piece</option>
                    <option value="Quality Check">4. Quality Check</option>
                    <option value="Packed with Love">5. Packed with Love</option>
                    <option value="Shipped">6. Shipped</option>
                    <option value="Delivered">7. Delivered</option>
                    <option value="Cancelled">❌ Cancelled</option>
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <select
                    value={orderSortBy}
                    onChange={(e) => setOrderSortBy(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FDF9F6] border border-[#F2E8E0] text-xs font-semibold text-[#4A3728] focus:outline-hidden"
                  >
                    <option value="newest">🕒 Newest First</option>
                    <option value="oldest">🕰️ Oldest First</option>
                    <option value="amount_high">💰 Highest Amount</option>
                    <option value="amount_low">🪙 Lowest Amount</option>
                  </select>
                </div>
              </div>

              {/* Advanced Date, Day & Time Archive Bar (Visible for Past Orders & All History) */}
              {(orderViewMode === 'past' || orderViewMode === 'all') && (
                <div className="p-4 rounded-2xl bg-[#FDF9F6] border border-[#F2E8E0] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#4A3728] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#B85B75]" />
                      <span>Filter by Specific Date, Day of the Week & Retention Age:</span>
                    </span>

                    {(selectedDateFilter || selectedDayFilter !== 'All' || datePresetFilter !== 'all') && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDateFilter('');
                          setSelectedDayFilter('All');
                          setDatePresetFilter('all');
                        }}
                        className="text-[11px] font-bold text-[#B85B75] hover:underline cursor-pointer"
                      >
                        Reset Date Filters
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {/* Specific Date Picker */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#7D6B5D] block">
                        📅 Select Specific Date:
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={selectedDateFilter}
                          onChange={(e) => {
                            setSelectedDateFilter(e.target.value);
                            if (e.target.value) setDatePresetFilter('all');
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8DCCF] text-xs font-semibold text-[#4A3728] focus:outline-hidden focus:border-[#C48B9F]"
                        />
                        {selectedDateFilter && (
                          <button
                            type="button"
                            onClick={() => setSelectedDateFilter('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
                            title="Clear date"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Day of Week Selector */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#7D6B5D] block">
                        🗓️ Select Day of Week:
                      </label>
                      <select
                        value={selectedDayFilter}
                        onChange={(e) => setSelectedDayFilter(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8DCCF] text-xs font-semibold text-[#4A3728] focus:outline-hidden focus:border-[#C48B9F]"
                      >
                        <option value="All">All Days (Mon - Sun)</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </select>
                    </div>

                    {/* Retention & Date Presets */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#7D6B5D] block">
                        ⏳ Quick Range / Retention:
                      </label>
                      <select
                        value={datePresetFilter}
                        onChange={(e) => {
                          setDatePresetFilter(e.target.value as any);
                          if (e.target.value !== 'all') setSelectedDateFilter('');
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8DCCF] text-xs font-semibold text-[#4A3728] focus:outline-hidden focus:border-[#C48B9F]"
                      >
                        <option value="all">All Date Ranges</option>
                        <option value="today">Today Only</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="this_week">Past 7 Days</option>
                        <option value="this_month">This Month</option>
                        <option value="older_than_month">🗑️ Older Than 1 Month (&gt;30d Deletable)</option>
                      </select>
                    </div>
                  </div>

                  {/* Quick Preset Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {[
                      { id: 'all', label: 'All Dates' },
                      { id: 'today', label: 'Today' },
                      { id: 'yesterday', label: 'Yesterday' },
                      { id: 'this_week', label: 'Last 7 Days' },
                      { id: 'this_month', label: 'This Month' },
                      { id: 'older_than_month', label: '🗑️ > 1 Month (Deletable)' }
                    ].map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setDatePresetFilter(preset.id as any);
                          setSelectedDateFilter('');
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                          datePresetFilter === preset.id
                            ? 'bg-[#3D272A] text-white'
                            : 'bg-white text-[#7D6B5D] hover:bg-[#F2E8E0] border border-[#E8DCCF]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Results Count & Filter Status Header */}
            <div className="flex items-center justify-between text-xs text-[#7D6B5D] px-1">
              <span>
                Showing <strong>{filteredOrders.length}</strong> {filteredOrders.length === 1 ? 'order' : 'orders'}
                {orderViewMode === 'today' && " placed today"}
                {selectedDateFilter && ` on ${selectedDateFilter}`}
                {selectedDayFilter !== 'All' && ` (${selectedDayFilter}s)`}
              </span>

              {datePresetFilter === 'older_than_month' && (
                <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[11px]">
                  Showing orders eligible for permanent deletion (&gt; 30 days old)
                </span>
              )}
            </div>

            {/* Orders Cards List */}
            <div className="space-y-5">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-14 bg-[#FDF9F6] rounded-3xl border border-dashed border-[#F2E8E0] p-8 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#F2E8E0] flex items-center justify-center text-[#7D6B5D] mx-auto shadow-2xs">
                    <Package className="w-6 h-6 opacity-60" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-[#4A3728]">
                      {orderViewMode === 'today' ? "No Orders Placed Yet Today" : "No Orders Found"}
                    </h4>
                    <p className="text-xs text-[#7D6B5D] max-w-md mx-auto mt-1">
                      {orderViewMode === 'today'
                        ? "Your workbench is clean and fresh for today! You can browse past dates in the Calendar Archive tab anytime."
                        : "No orders match your selected date, day of week, or search filters."}
                    </p>
                  </div>
                  {orderViewMode === 'today' ? (
                    <button
                      type="button"
                      onClick={() => setOrderViewMode('past')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3D272A] text-white text-xs font-bold hover:bg-[#5C3A42] transition-colors cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>View Past Orders Archive</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDateFilter('');
                        setSelectedDayFilter('All');
                        setDatePresetFilter('all');
                        setOrderSearch('');
                        setOrderStatusFilter('All');
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#4A3728] text-xs font-bold hover:bg-[#F2E8E0] border border-[#F2E8E0] transition-colors cursor-pointer"
                    >
                      <span>Clear All Filters</span>
                    </button>
                  )}
                </div>
              ) : (
                filteredOrders.map((ord) => {
                  const meta = getOrderMetadata(ord);

                  return (
                    <div
                      key={ord.id}
                      id={`order-card-${ord.id}`}
                      className="p-5 sm:p-6 rounded-3xl bg-[#FDF9F6] border border-[#F2E8E0] space-y-4 hover:border-[#C48B9F]/50 transition-all shadow-2xs"
                    >
                      {/* Header Row */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-[#F2E8E0] gap-3">
                        <div className="space-y-2">
                          {/* Order ID, Date, Day of Week & Time */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-serif text-lg font-bold text-[#4A3728]">
                              Order #{ord.orderNumber}
                            </span>

                            {/* Date, Day of Week & Time Pill */}
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-[#E8DCCF] text-xs font-bold text-[#4A3728] shadow-2xs">
                              <Calendar className="w-3 h-3 text-[#B85B75]" />
                              <span>{meta.dayOfWeek}, {meta.formattedDate}</span>
                              <span className="text-[#7D6B5D] font-normal">•</span>
                              <Clock className="w-3 h-3 text-[#7D6B5D]" />
                              <span className="text-[#7D6B5D] font-medium">{meta.timeStr}</span>
                            </span>

                            {/* Relative Age Badge */}
                            {meta.isToday ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                🟢 Placed Today
                              </span>
                            ) : meta.isOlderThanMonth ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                                🗄️ {meta.ageInDays} Days Old (&gt;1 Month)
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF7F2] text-[#7D6B5D] border border-[#F2E8E0]">
                                ⏳ {meta.ageInDays} {meta.ageInDays === 1 ? 'day' : 'days'} ago
                              </span>
                            )}
                          </div>

                          {/* Status and Payment Chips */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.status === 'Cancelled'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : ord.status === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-[#FFF5F7] text-[#B85B75] border border-[#F9D5DF]'
                            }`}>
                              ● {ord.status}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              ord.paymentStatus === 'Refunded' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                              'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {ord.paymentStatus} • {ord.paymentMethod}
                            </span>
                            {ord.refundStatus && ord.refundStatus !== 'None' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                                Refund: {ord.refundStatus}
                              </span>
                            )}
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF7F2] text-[#4A3728] border border-[#F2E8E0]">
                              {ord.shippingMethod || 'Standard Studio Shipping'}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons & Order Total */}
                        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
                          <button
                            type="button"
                            onClick={() => copyFullAddress(ord)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FCE7EC] text-[#4A3728] text-xs font-bold border border-[#F2E8E0] transition-colors cursor-pointer shadow-2xs"
                            title="Copy full delivery address formatted for courier booking"
                          >
                            {copiedOrderId === ord.id ? (
                              <>
                                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-[#7D6B5D]" />
                                <span>Copy Address</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedOrderForShippingLabel(ord)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#3D272A] hover:text-white text-[#4A3728] text-xs font-bold border border-[#F2E8E0] transition-colors cursor-pointer shadow-2xs"
                            title="Generate printable dispatch invoice label"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#B85B75]" />
                            <span>Label</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenRefundModal(ord)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 transition-colors cursor-pointer shadow-2xs"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Refund</span>
                          </button>

                          {/* 1-Month Enforced Delete Button */}
                          {meta.isOlderThanMonth ? (
                            <button
                              type="button"
                              onClick={() => setOrderToDelete(ord)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                              title="Order is older than 1 month. Click to permanently delete order record."
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Record</span>
                            </button>
                          ) : (
                            <div
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 text-stone-500 text-xs font-medium border border-stone-200 cursor-not-allowed select-none"
                              title={`Protected: Orders can only be deleted after 1 month (30 days). Retention unlocks in ${meta.daysLeftUntilDelete} days.`}
                            >
                              <Lock className="w-3.5 h-3.5 text-stone-400" />
                              <span>Delete in {meta.daysLeftUntilDelete}d</span>
                            </div>
                          )}

                          <div className="pl-2 border-l border-[#F2E8E0]">
                            <span className="font-serif text-lg font-bold text-[#4A3728]">
                              ₹{ord.totalAmount}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Cancellation Details Banner if cancelled */}
                      {ord.status === 'Cancelled' && (
                        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2 text-rose-900">
                            <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                            <span>
                              <strong>Cancelled by {ord.cancelledBy || 'Customer'} {ord.cancelledDate ? `on ${ord.cancelledDate}` : ''}:</strong>{' '}
                              {ord.cancellationReason || 'No specific reason provided'}
                            </span>
                          </div>
                          {ord.paymentStatus === 'Refunded' && (
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0 text-[11px]">
                              ✓ Refunded ₹{ord.totalAmount}
                            </span>
                          )}
                        </div>
                      )}

                      {/* FULL DISPATCH ADDRESS HIGHLIGHT BOX */}
                      <div className="p-4 rounded-2xl bg-white border border-[#F2E8E0] shadow-2xs space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#FAF7F2] pb-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-xl bg-[#FFF5F7] border border-[#F9D5DF] flex items-center justify-center text-[#B85B75] shrink-0">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-[#7D6B5D] uppercase tracking-wider block">
                                Full Shipping & Delivery Address
                              </span>
                              <span className="font-bold text-sm text-[#4A3728]">
                                {ord.customer.fullName}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <a
                              href={`tel:${ord.customer.phone}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF7F2] text-[#4A3728] font-bold border border-[#F2E8E0] hover:bg-[#FCE7EC] transition-colors"
                            >
                              <Phone className="w-3 h-3 text-[#B85B75]" />
                              <span>{ord.customer.phone}</span>
                            </a>
                            {ord.customer.email && (
                              <a
                                href={`mailto:${ord.customer.email}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF7F2] text-[#7D6B5D] font-medium border border-[#F2E8E0] hover:bg-[#FCE7EC] transition-colors"
                              >
                                <Mail className="w-3 h-3 text-[#7D6B5D]" />
                                <span>{ord.customer.email}</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Detailed Address Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1.5">
                            <div className="flex items-start gap-2">
                              <Building2 className="w-4 h-4 text-[#7D6B5D] shrink-0 mt-0.5" />
                              <div>
                                <span className="text-[10px] uppercase font-bold text-[#7D6B5D] block">Flat / House / Floor:</span>
                                <span className="font-medium text-[#4A3728]">
                                  {ord.customer.apartment || 'N/A'}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <Navigation className="w-4 h-4 text-[#7D6B5D] shrink-0 mt-0.5" />
                              <div>
                                <span className="text-[10px] uppercase font-bold text-[#7D6B5D] block">Street / Colony / Area:</span>
                                <span className="font-medium text-[#4A3728]">
                                  {ord.customer.address}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-[#B85B75] shrink-0 mt-0.5" />
                              <div>
                                <span className="text-[10px] uppercase font-bold text-[#7D6B5D] block">Landmark:</span>
                                <span className="inline-block px-2 py-0.5 rounded-md bg-[#FFF5F7] text-[#B85B75] font-semibold border border-[#F9D5DF]">
                                  {ord.customer.landmark || 'None specified'}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <div className="w-4 h-4 rounded-full bg-[#3D272A] text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                                PIN
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-bold text-[#7D6B5D] block">City, State & Pincode:</span>
                                <span className="font-bold text-[#4A3728]">
                                  {ord.customer.city}, {ord.customer.state} — <code className="font-mono text-xs bg-[#FAF7F2] px-1.5 py-0.5 rounded-md border border-[#F2E8E0]">{ord.customer.pincode}</code>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Delivery Instructions or Notes */}
                        {ord.customer.deliveryNotes && (
                          <div className="p-2.5 rounded-xl bg-[#FFF9F5] border border-amber-200 text-xs flex items-start gap-2">
                            <span className="text-amber-700 font-bold shrink-0">📝 Delivery Note:</span>
                            <span className="text-amber-900 italic font-medium">“{ord.customer.deliveryNotes}”</span>
                          </div>
                        )}
                      </div>

                      {/* Courier & Tracking Assignment */}
                      <div className="p-3.5 rounded-2xl bg-white border border-[#F2E8E0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-[#7D6B5D]" />
                          <span className="font-bold text-[#7D6B5D]">Dispatch Partner:</span>
                          {editingCourierOrderId === ord.id ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <input
                                type="text"
                                placeholder="Courier (e.g. Delhivery)"
                                value={courierInput}
                                onChange={(e) => setCourierInput(e.target.value)}
                                className="px-2.5 py-1 rounded-lg bg-[#FDF9F6] border border-[#E8DCCF] font-semibold text-xs text-[#4A3728] w-36"
                              />
                              <input
                                type="text"
                                placeholder="Tracking AWB #"
                                value={trackingInput}
                                onChange={(e) => setTrackingInput(e.target.value)}
                                className="px-2.5 py-1 rounded-lg bg-[#FDF9F6] border border-[#E8DCCF] font-mono text-xs text-[#4A3728] w-40"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveCourier(ord.id)}
                                className="px-3 py-1 rounded-lg bg-[#3D272A] text-white font-bold hover:bg-[#5C3A42] transition-colors cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingCourierOrderId(null)}
                                className="px-2 py-1 rounded-lg bg-[#FAF7F2] text-[#7D6B5D] hover:bg-[#F2E8E0] transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[#4A3728]">
                                {ord.courierName ? `${ord.courierName} (${ord.trackingNumber || 'Pending AWB'})` : 'Not assigned yet'}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleOpenCourierEdit(ord)}
                                className="text-[11px] text-[#B85B75] font-bold hover:underline ml-1 cursor-pointer"
                              >
                                {ord.courierName ? 'Edit AWB' : '+ Assign Courier'}
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {ord.razorpayPaymentId && (
                            <span className="text-[11px] text-[#7D6B5D]">
                              Txn: <code className="font-mono">{ord.razorpayPaymentId}</code>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Ordered Items List */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#F2E8E0] text-xs">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-10 h-10 rounded-lg object-cover border border-[#F2E8E0]"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-[#4A3728] truncate">{item.product.name}</p>
                              <p className="text-[#7D6B5D] text-[11px]">Qty: {item.quantity} × ₹{item.product.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Stage Selector & Update */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-[#F2E8E0] gap-2">
                        <span className="text-xs font-bold text-[#7D6B5D] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#B85B75]" />
                          <span>Update Crafting & Delivery Stage:</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                            className="px-3.5 py-2 rounded-xl bg-white border border-[#C48B9F]/40 text-xs font-bold text-[#4A3728] focus:outline-hidden focus:ring-2 focus:ring-[#C48B9F]/30 cursor-pointer shadow-2xs"
                          >
                            <option value="Order Placed">1. Order Placed</option>
                            <option value="Order Confirmed">2. Order Confirmed</option>
                            <option value="Crafting Your Piece">3. Crafting Your Piece</option>
                            <option value="Quality Check">4. Quality Check</option>
                            <option value="Packed with Love">5. Packed with Love</option>
                            <option value="Shipped">6. Shipped</option>
                            <option value="Delivered">7. Delivered</option>
                            <option value="Cancelled">❌ Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. REFUND MANAGEMENT TAB */}
        {/* ========================================================================= */}
        {activeTab === 'refunds' && (
          <div className="space-y-6">
            {/* Refund Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-[#F2E8E0] shadow-xs">
                <span className="text-xs text-[#7D6B5D] font-medium">Total Refunded to Date</span>
                <p className="font-serif text-2xl font-bold text-purple-700 mt-1">
                  ₹{totalRefundedAmount.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-[#7D6B5D] block mt-1">Across all cancelled/modified orders</span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#F2E8E0] shadow-xs">
                <span className="text-xs text-[#7D6B5D] font-medium">Pending Refund Requests</span>
                <p className="font-serif text-2xl font-bold text-amber-600 mt-1">
                  {refundRequestsCount}
                </p>
                <span className="text-[11px] text-amber-700 block mt-1">Awaiting studio admin action</span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#F2E8E0] shadow-xs">
                <span className="text-xs text-[#7D6B5D] font-medium">Refund Policy</span>
                <p className="text-xs text-[#4A3728] font-semibold mt-1.5 leading-relaxed">
                  Direct Razorpay / UPI reversal within 5-7 business days for customer peace of mind.
                </p>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="bg-white rounded-3xl border border-[#F2E8E0] p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-serif text-lg font-bold text-[#4A3728]">
                  Customer Order Refunds & Reversals
                </h3>
                <div className="flex items-center gap-2 text-xs">
                  {(['All', 'Requests', 'Refunded', 'Eligible'] as const).map((filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setRefundFilter(filterType)}
                      className={`px-3 py-1.5 rounded-full font-bold transition-colors ${
                        refundFilter === filterType
                          ? 'bg-[#4A3728] text-white'
                          : 'bg-[#FDF9F6] text-[#7D6B5D] hover:text-[#4A3728] border border-[#F2E8E0]'
                      }`}
                    >
                      {filterType === 'Requests' ? `Requests (${refundRequestsCount})` : filterType}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#F2E8E0] text-[#7D6B5D] uppercase font-bold">
                      <th className="pb-3">Order</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Original Total</th>
                      <th className="pb-3">Refund Status</th>
                      <th className="pb-3">Refunded Amount</th>
                      <th className="pb-3">Reason / Ref</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2E8E0]">
                    {filteredRefundOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#FDF9F6]/60">
                        <td className="py-3 font-bold text-[#4A3728]">
                          #{ord.orderNumber}
                          <span className="block text-[10px] font-normal text-[#7D6B5D]">{ord.date}</span>
                        </td>
                        <td className="py-3">
                          <span className="font-semibold text-[#4A3728] block">{ord.customer.fullName}</span>
                          <span className="text-[10px] text-[#7D6B5D]">{ord.customer.phone}</span>
                        </td>
                        <td className="py-3 font-bold text-[#4A3728]">₹{ord.totalAmount}</td>
                        <td className="py-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            ord.refundStatus === 'Refunded' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                            ord.refundStatus === 'Partially Refunded' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                            ord.refundStatus === 'Requested' ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse' :
                            'bg-stone-100 text-stone-600'
                          }`}>
                            {ord.refundStatus || 'None'}
                          </span>
                        </td>
                        <td className="py-3 font-bold text-purple-700">
                          {ord.refundAmount ? `₹${ord.refundAmount}` : '—'}
                        </td>
                        <td className="py-3 text-[#7D6B5D] max-w-xs truncate">
                          {ord.refundReason || '—'}
                          {ord.refundTxnId && <span className="block text-[10px] font-mono text-purple-600">{ord.refundTxnId}</span>}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            id={`issue-refund-btn-${ord.id}`}
                            onClick={() => handleOpenRefundModal(ord)}
                            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 transition-colors"
                          >
                            {ord.refundStatus === 'Refunded' ? 'View Details' : 'Process Refund'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. STORE SETTINGS & ADMIN CREDENTIALS TAB */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            
            {/* 1. Store Online / Offline Toggle Card */}
            <div className="bg-white rounded-3xl border border-[#F2E8E0] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#4A3728] flex items-center gap-2">
                    <Power className={`w-5 h-5 ${settingsForm.isStoreActive ? 'text-emerald-600' : 'text-rose-600'}`} />
                    <span>Store Status & Online Availability</span>
                  </h3>
                  <p className="text-xs text-[#7D6B5D] mt-1">
                    When active, customers can browse and place orders normally. When switched off, the store switches to a full-screen offline notice page and checkout is paused.
                  </p>
                </div>

                {/* Big Visual Toggle */}
                <button
                  id="admin-store-active-toggle"
                  type="button"
                  onClick={() => setSettingsForm({ ...settingsForm, isStoreActive: !settingsForm.isStoreActive })}
                  className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-hidden cursor-pointer ${
                    settingsForm.isStoreActive ? 'bg-emerald-600' : 'bg-rose-500'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      settingsForm.isStoreActive ? 'translate-x-9' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className={`p-4 rounded-2xl border ${
                settingsForm.isStoreActive ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
              }`}>
                <div className="flex items-center gap-2 mb-2 font-bold text-xs">
                  <span className={`w-2.5 h-2.5 rounded-full ${settingsForm.isStoreActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span>{settingsForm.isStoreActive ? 'Store is Currently LIVE (Open for orders)' : 'Store is Currently OFFLINE (Full-page restock notice active)'}</span>
                </div>
                {!settingsForm.isStoreActive && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#4A3728] uppercase mb-1">
                        Studio Note Message (Shown on full-page offline screen):
                      </label>
                      <textarea
                        rows={2}
                        value={settingsForm.storeInactiveMessage}
                        onChange={(e) => setSettingsForm({ ...settingsForm, storeInactiveMessage: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E8DCCF] text-xs text-[#4A3728] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#4A3728] uppercase mb-1">
                        Resuming Notice / Timeframe (e.g. "Resuming shortly! Follow on Instagram..."):
                      </label>
                      <input
                        type="text"
                        value={settingsForm.offlineResumingNotice}
                        onChange={(e) => setSettingsForm({ ...settingsForm, offlineResumingNotice: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E8DCCF] text-xs text-[#4A3728] focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Top Announcement Bar Customization Card */}
            <div className="bg-white rounded-3xl border border-[#F2E8E0] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#4A3728] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#C48B9F]" />
                    <span>Top Announcement Bar & Header Banner</span>
                  </h3>
                  <p className="text-xs text-[#7D6B5D] mt-1">
                    Edit the promotional ticker message that appears at the very top of every store page.
                  </p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-bold text-[#7D6B5D]">Show Bar</span>
                  <input
                    type="checkbox"
                    checked={settingsForm.showAnnouncementBar}
                    onChange={(e) => setSettingsForm({ ...settingsForm, showAnnouncementBar: e.target.checked })}
                    className="w-4 h-4 accent-[#4A3728] rounded-md"
                  />
                </label>
              </div>

              {/* Live Preview of Announcement Bar */}
              <div className="rounded-2xl border border-[#EAD0D3] overflow-hidden">
                <div className="bg-[#F8D7DA] text-[#4A3728] text-[10px] sm:text-[11px] py-1.5 px-4 text-center font-semibold tracking-widest uppercase flex items-center justify-center gap-2">
                  <span className="text-[#C5A059]">♥</span>
                  <span>{settingsForm.announcementText || 'Handcrafted with love. Every piece tells a story.'}</span>
                  {settingsForm.announcementHighlight && (
                    <>
                      <span className="hidden md:inline text-[#EAD0D3]">•</span>
                      <span className="hidden md:inline font-bold text-[#4A3728]">
                        {settingsForm.announcementHighlight}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A3728] uppercase mb-1.5">
                    Primary Announcement Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcementText}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                    placeholder="e.g. Handcrafted with love. Every piece tells a story."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDF9F6] border border-[#E8DCCF] text-xs text-[#4A3728] focus:outline-hidden focus:border-[#C48B9F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3728] uppercase mb-1.5">
                    Highlight / Free Shipping Notice
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcementHighlight}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcementHighlight: e.target.value })}
                    placeholder="e.g. Free Studio Shipping on orders over ₹999"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDF9F6] border border-[#E8DCCF] text-xs text-[#4A3728] focus:outline-hidden focus:border-[#C48B9F]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Admin ID & Password Security Management */}
            <div className="bg-white rounded-3xl border border-[#F2E8E0] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F2E8E0]">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif text-lg font-bold text-[#4A3728]">
                  Admin Portal Login Credentials (ID & Password)
                </h3>
              </div>
              <p className="text-xs text-[#7D6B5D]">
                Manage the Admin ID and Password used to log in to the Studio Management Suite.
              </p>

              <form onSubmit={handleSaveAdminCreds} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#4A3728] uppercase mb-1.5">
                      Admin ID / Login Email
                    </label>
                    <input
                      type="text"
                      required
                      value={adminCredsForm.adminId}
                      onChange={(e) => setAdminCredsForm({ ...adminCredsForm, adminId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDF9F6] border border-[#E8DCCF] text-xs text-[#4A3728] focus:outline-hidden focus:border-[#C48B9F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A3728] uppercase mb-1.5">
                      Admin Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={adminCredsForm.password}
                        onChange={(e) => setAdminCredsForm({ ...adminCredsForm, password: e.target.value })}
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#FDF9F6] border border-[#E8DCCF] text-xs text-[#4A3728] focus:outline-hidden focus:border-[#C48B9F]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7D6B5D] hover:text-[#4A3728]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#4A3728] hover:bg-[#32231A] text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    <Save className="w-4 h-4 text-[#F8D7DA]" />
                    <span>Update Admin Credentials</span>
                  </button>
                </div>
              </form>
            </div>

            {/* 3. Studio Shipping & Contact Channels */}
            <div className="bg-white rounded-3xl border border-[#F2E8E0] p-6 shadow-xs space-y-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#4A3728]">
                  Shipping Threshold & Studio Contact Links
                </h3>
                <p className="text-xs text-[#7D6B5D] mt-0.5">
                  Update customer communication channels and automated free shipping rules.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-[#4A3728] uppercase mb-1.5">
                    Free Shipping Threshold (INR)
                  </label>
                  <div className="relative max-w-xs">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-[#7D6B5D]">₹</span>
                    <input
                      type="number"
                      required
                      value={settingsForm.freeShippingThreshold}
                      onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#FDF9F6] border border-[#E8DCCF] text-xs text-[#4A3728] font-bold focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#FDF9F6] border border-[#F2E8E0] space-y-2">
                    <div className="flex items-center gap-2 font-bold text-xs text-[#4A3728]">
                      <Mail className="w-4 h-4 text-[#C48B9F]" />
                      <span>Studio Support Email</span>
                    </div>
                    <input
                      type="email"
                      required
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E8DCCF] text-xs text-[#4A3728] focus:outline-hidden"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FDF9F6] border border-[#F2E8E0] space-y-2">
                    <div className="flex items-center gap-2 font-bold text-xs text-[#4A3728]">
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>WhatsApp Order Helpline</span>
                    </div>
                    <input
                      type="text"
                      required
                      value={settingsForm.whatsappNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E8DCCF] text-xs text-[#4A3728] focus:outline-hidden"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FDF9F6] border border-[#F2E8E0] space-y-2">
                    <div className="flex items-center gap-2 font-bold text-xs text-[#4A3728]">
                      <Instagram className="w-4 h-4 text-pink-600" />
                      <span>Instagram Handle</span>
                    </div>
                    <input
                      type="text"
                      required
                      value={settingsForm.instagramHandle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, instagramHandle: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E8DCCF] text-xs text-[#4A3728] focus:outline-hidden"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FDF9F6] border border-[#F2E8E0] space-y-2">
                    <div className="flex items-center gap-2 font-bold text-xs text-[#4A3728]">
                      <Youtube className="w-4 h-4 text-red-600" />
                      <span>YouTube Channel Link</span>
                    </div>
                    <input
                      type="text"
                      required
                      value={settingsForm.youtubeUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, youtubeUrl: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E8DCCF] text-xs text-[#4A3728] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-[#4A3728] text-white text-xs font-bold hover:bg-[#5D4636] transition-colors shadow-xs"
                  >
                    <Save className="w-4 h-4 text-[#F8D7DA]" />
                    <span>Save All Store Settings</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: ADD / EDIT DYNAMIC CATEGORY */}
        {/* ========================================================================= */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A3728]/50 backdrop-blur-xs">
            <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#F2E8E0] p-6 sm:p-8 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2E8E0]">
                <h3 className="font-serif text-xl font-bold text-[#4A3728]">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h3>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-1 rounded-full text-[#7D6B5D] hover:bg-[#FDF9F6]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#4A3728] uppercase mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="e.g. Phone Cases, 3D Prints, Charms..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDF9F6] border border-[#E8DCCF] text-xs font-semibold text-[#4A3728] focus:outline-hidden focus:border-[#C48B9F]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#4A3728] uppercase mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={catDescription}
                    onChange={(e) => setCatDescription(e.target.value)}
                    placeholder="Brief description for customer category hero..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDF9F6] border border-[#E8DCCF] text-xs text-[#4A3728] focus:outline-hidden focus:border-[#C48B9F]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#4A3728] uppercase mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={catImageUrl}
                    onChange={(e) => setCatImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDF9F6] border border-[#E8DCCF] text-xs text-[#4A3728] focus:outline-hidden focus:border-[#C48B9F]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-[#4A3728] hover:bg-[#32231A] text-white font-bold transition-colors shadow-md"
                  >
                    {editingCategory ? 'Update Category ✨' : 'Publish Category to Store ✨'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: ADD / EDIT PRODUCT */}
        {/* ========================================================================= */}
        {isAddProductOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A3728]/50 backdrop-blur-xs">
            <div className="relative w-full max-w-xl bg-white rounded-3xl border border-[#F2E8E0] p-6 sm:p-8 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2E8E0]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#C48B9F]" />
                  <h3 className="font-serif text-xl font-bold text-[#4A3728]">
                    {editingProduct ? `Edit Craft: ${editingProduct.name}` : 'Add New Creation to Catalog'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddProductOpen(false)}
                  className="p-1.5 rounded-full text-[#7D6B5D] hover:bg-[#FDF9F6]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                {/* Name */}
                <div>
                  <label className="block font-bold text-[#4A3728] uppercase mb-1">
                    Craft Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Pastel Daisy Bear Keychain"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDF9F6] border border-[#E8DCCF] font-semibold text-[#4A3728] focus:outline-hidden focus:border-[#C48B9F]"
                  />
                </div>

                {/* Category & Pricing */}
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-[#4A3728] uppercase mb-1 text-xs">
                        Category *
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDF9F6] border border-[#E8DCCF] font-semibold text-[#4A3728] focus:outline-hidden"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-[#4A3728] uppercase mb-1 text-xs">
                        Selling Price (₹) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#4A3728]">₹</span>
                        <input
                          type="number"
                          required
                          min="0"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          placeholder="e.g. 299"
                          className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#FDF9F6] border border-[#E8DCCF] font-bold text-[#4A3728] focus:outline-hidden"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-[#4A3728] uppercase mb-1 text-xs">
                        Original MRP (₹) <span className="text-[10px] text-[#7D6B5D] font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7D6B5D]">₹</span>
                        <input
                          type="number"
                          min="0"
                          value={newOriginalPrice}
                          onChange={(e) => setNewOriginalPrice(e.target.value)}
                          placeholder="e.g. 399"
                          className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#FDF9F6] border border-[#E8DCCF] text-[#7D6B5D] focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live Pricing Preview */}
                  {Number(newPrice) > 0 && (
                    <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DCCF] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[#7D6B5D]">Storefront Display:</span>
                        <span className="font-serif font-bold text-sm text-[#4A3728]">₹{Number(newPrice) || 0}</span>
                        {Number(newOriginalPrice) > Number(newPrice) && (
                          <span className="text-[#7D6B5D] line-through text-xs">₹{Number(newOriginalPrice)}</span>
                        )}
                      </div>
                      {Number(newOriginalPrice) > Number(newPrice) && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          Save ₹{Number(newOriginalPrice) - Number(newPrice)} ({Math.round(((Number(newOriginalPrice) - Number(newPrice)) / Number(newOriginalPrice)) * 100)}% OFF)
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Status Options Box: Product is New, In Stock, Out of Stock, Badge */}
                <div className="p-4 rounded-2xl bg-[#FDF9F6] border border-[#E8DCCF] space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#4A3728] flex items-center justify-between border-b border-[#E8DCCF]/60 pb-2">
                    <span>Product Availability & Tag Status</span>
                    <span className="text-[#C48B9F] font-semibold lowercase">side-by-side options</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* 1. Stock Status Radio (In Stock vs Out of Stock) */}
                    <div>
                      <label className="block font-bold text-[#4A3728] mb-1.5">
                        Stock Availability:
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setNewInStock(true)}
                          className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                            newInStock
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-white text-emerald-800 border-[#E8DCCF] hover:bg-emerald-50'
                          }`}
                        >
                          <span>🟢 In Stock</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewInStock(false)}
                          className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                            !newInStock
                              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                              : 'bg-white text-rose-800 border-[#E8DCCF] hover:bg-rose-50'
                          }`}
                        >
                          <span>🔴 Out of Stock</span>
                        </button>
                      </div>
                    </div>

                    {/* 2. New Product Toggle (✨ Product is New) */}
                    <div>
                      <label className="block font-bold text-[#4A3728] mb-1.5">
                        New Product Tag:
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setNewIsNew(true);
                            if (!newBadge) setNewBadge('New Drop');
                          }}
                          className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                            newIsNew
                              ? 'bg-[#4A3728] text-[#F8D7DA] border-[#4A3728] shadow-xs'
                              : 'bg-white text-[#7D6B5D] border-[#E8DCCF] hover:bg-[#F8D7DA]/30'
                          }`}
                        >
                          <span>✨ New Drop</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewIsNew(false)}
                          className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                            !newIsNew
                              ? 'bg-stone-200 text-[#4A3728] border-stone-300 shadow-xs'
                              : 'bg-white text-[#7D6B5D] border-[#E8DCCF] hover:bg-stone-50'
                          }`}
                        >
                          <span>Classic Craft</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Badge Customization */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block font-bold text-[#4A3728] mb-1">
                        Stock Quantity (Units)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newStockCount}
                        onChange={(e) => setNewStockCount(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8DCCF] text-xs font-semibold text-[#4A3728] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#4A3728] mb-1">
                        Custom Badge Tag (Optional)
                      </label>
                      <select
                        value={newBadge}
                        onChange={(e) => setNewBadge(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8DCCF] text-xs font-semibold text-[#4A3728] focus:outline-hidden"
                      >
                        <option value="New Drop">✨ New Drop</option>
                        <option value="Best Seller">🔥 Best Seller</option>
                        <option value="Artisan Favorite">🌸 Artisan Favorite</option>
                        <option value="Limited Edition">💎 Limited Edition</option>
                        <option value="Handmade Special">🎨 Handmade Special</option>
                        <option value="">No Badge</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block font-bold text-[#4A3728] uppercase mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Brief description of craftsmanship, colors, and finish..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDF9F6] border border-[#E8DCCF] focus:outline-hidden"
                  />
                </div>

                {/* Materials & Dimensions Specifications */}
                <div className="p-4 rounded-2xl bg-[#FDF9F6] border border-[#E8DCCF] space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#4A3728] flex items-center justify-between border-b border-[#E8DCCF]/60 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#C48B9F]" />
                      <span>Materials &amp; Dimensions (Shown at bottom of craft page)</span>
                    </div>
                    <span className="text-[#7D6B5D] text-[10px] font-normal lowercase">editable specs</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block font-bold text-[#4A3728] mb-1">
                        Materials Used (comma-separated tags) *
                      </label>
                      <input
                        type="text"
                        required
                        value={newMaterials}
                        onChange={(e) => setNewMaterials(e.target.value)}
                        placeholder="e.g. Premium Artisan Clay, Acrylic Details, Gloss Glaze Sealant, Gold Alloy Clasp"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8DCCF] text-xs font-semibold text-[#4A3728] focus:outline-hidden focus:border-[#C48B9F]"
                      />
                      <p className="text-[10px] text-[#7D6B5D] mt-1">
                        Separate multiple materials with commas. Each item renders as an individual tag pill under &quot;Materials Used&quot; at the bottom of the product page.
                      </p>
                    </div>

                    <div>
                      <label className="block font-bold text-[#4A3728] mb-1">
                        Size &amp; Dimensions *
                      </label>
                      <input
                        type="text"
                        required
                        value={newDimensions}
                        onChange={(e) => setNewDimensions(e.target.value)}
                        placeholder="e.g. 3.2 cm height × 2.6 cm width (Weight: 14g)"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8DCCF] text-xs font-semibold text-[#4A3728] focus:outline-hidden focus:border-[#C48B9F]"
                      />
                      <p className="text-[10px] text-[#7D6B5D] mt-1">
                        This text replaces the default dimensions and updates the &quot;Size &amp; Dimensions&quot; specification tab at the bottom of the product page.
                      </p>
                    </div>

                    <div>
                      <label className="block font-bold text-[#4A3728] mb-1">
                        Handmade Crafting Process (Care &amp; Crafting Tab) *
                      </label>
                      <input
                        type="text"
                        required
                        value={newHandmadeDetails}
                        onChange={(e) => setNewHandmadeDetails(e.target.value)}
                        placeholder="e.g. Individually sculpted at studio workbench."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8DCCF] text-xs font-semibold text-[#4A3728] focus:outline-hidden focus:border-[#C48B9F]"
                      />
                      <p className="text-[10px] text-[#7D6B5D] mt-1">
                        Displayed under &quot;Handmade Crafting Process&quot; in the product details page.
                      </p>
                    </div>

                    {/* Live Preview of Bottom Tab */}
                    {(newMaterials.trim() || newDimensions.trim() || newHandmadeDetails.trim()) && (
                      <div className="pt-2 border-t border-[#E8DCCF]/50">
                        <span className="text-[10px] font-bold text-[#7D6B5D] uppercase tracking-wider block mb-1.5">
                          Live Storefront Preview (Bottom Tabs):
                        </span>
                        <div className="bg-white p-3 rounded-xl border border-[#F2E8E0] space-y-2">
                          <div>
                            <span className="text-[10px] font-semibold text-[#7D6B5D] block mb-1">Materials Used:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {newMaterials
                                .split(',')
                                .map((m) => m.trim())
                                .filter(Boolean)
                                .map((mat, idx) => (
                                  <span key={idx} className="px-2.5 py-0.5 rounded-full bg-[#FDF9F6] text-[10px] font-medium text-[#4A3728] border border-[#F2E8E0]">
                                    {mat}
                                  </span>
                                ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold text-[#7D6B5D] block">Size &amp; Dimensions:</span>
                            <span className="text-[11px] text-[#4A3728] font-medium">
                              {newDimensions || 'Approx 3.5cm × 3.0cm'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold text-[#7D6B5D] block">Handmade Crafting Process:</span>
                            <span className="text-[11px] text-[#4A3728] font-medium">
                              {newHandmadeDetails || 'Individually sculpted at studio workbench.'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Images Upload System */}
                <div className="pt-1">
                  <ProductImageUploader
                    images={newImages}
                    onChange={setNewImages}
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddProductOpen(false)}
                    className="px-5 py-3 rounded-2xl bg-[#FDF9F6] text-[#7D6B5D] hover:text-[#4A3728] font-bold border border-[#E8DCCF] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-[#4A3728] hover:bg-[#32231A] text-white font-bold shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#F8D7DA]" />
                    <span>{editingProduct ? 'Save Craft Changes ✨' : 'Publish Craft to Studio Store ✨'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: ISSUE REFUND */}
        {/* ========================================================================= */}
        {selectedOrderForRefund && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A3728]/50 backdrop-blur-xs">
            <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#F2E8E0] p-6 sm:p-8 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2E8E0]">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-purple-700" />
                  <h3 className="font-serif text-xl font-bold text-[#4A3728]">
                    Process Order Refund
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrderForRefund(null)}
                  className="p-1 rounded-full text-[#7D6B5D] hover:bg-[#FDF9F6]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-900 space-y-1">
                <p><strong>Order:</strong> #{selectedOrderForRefund.orderNumber} ({selectedOrderForRefund.date})</p>
                <p><strong>Customer:</strong> {selectedOrderForRefund.customer.fullName} ({selectedOrderForRefund.customer.phone})</p>
                <p><strong>Total Amount:</strong> ₹{selectedOrderForRefund.totalAmount} • <strong>Already Refunded:</strong> ₹{selectedOrderForRefund.refundAmount || 0}</p>
                {selectedOrderForRefund.razorpayPaymentId && (
                  <p><strong>Razorpay Payment ID:</strong> <code className="font-mono">{selectedOrderForRefund.razorpayPaymentId}</code></p>
                )}
              </div>

              <form onSubmit={handleProcessRefund} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-[#4A3728] uppercase mb-1">
                    Refund Amount (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-[#7D6B5D]">₹</span>
                    <input
                      type="number"
                      required
                      min={1}
                      max={selectedOrderForRefund.totalAmount - (selectedOrderForRefund.refundAmount || 0)}
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#FDF9F6] border border-[#E8DCCF] font-bold text-[#4A3728]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#4A3728] uppercase mb-1">
                    Refund Reason
                  </label>
                  <select
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDF9F6] border border-[#E8DCCF] font-semibold text-[#4A3728]"
                  >
                    <option value="Customer Cancellation">Customer Cancellation</option>
                    <option value="Damaged in Transit / Quality Issue">Damaged in Transit / Quality Issue</option>
                    <option value="Material / Color Mismatch">Material / Color Mismatch</option>
                    <option value="Out of Stock / Studio Delay">Out of Stock / Studio Delay</option>
                    <option value="Customer Return / Exchange Request">Customer Return / Exchange Request</option>
                    <option value="Goodwill Reversal">Goodwill Reversal</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#4A3728] uppercase mb-1">
                    Transaction / Reversal Reference ID
                  </label>
                  <input
                    type="text"
                    value={refundTxnId}
                    onChange={(e) => setRefundTxnId(e.target.value)}
                    placeholder="e.g. RFND-928472 or Razorpay Refund ID"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDF9F6] border border-[#E8DCCF] font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#4A3728] uppercase mb-1">
                    Admin Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={refundNotes}
                    onChange={(e) => setRefundNotes(e.target.value)}
                    placeholder="Internal notes about the reversal..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDF9F6] border border-[#E8DCCF]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Authorize & Issue Refund of ₹{refundAmount}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: PRINT SHIPPING DISPATCH LABEL & INVOICE */}
        {/* ========================================================================= */}
        {selectedOrderForShippingLabel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A3728]/60 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#F2E8E0] p-6 sm:p-8 shadow-2xl space-y-6 my-8">
              {/* Modal Top Actions */}
              <div className="flex items-center justify-between pb-4 border-b border-[#F2E8E0]">
                <div className="flex items-center gap-2">
                  <Printer className="w-5 h-5 text-[#B85B75]" />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#4A3728]">
                      Dispatch Shipping Label & Invoice
                    </h3>
                    <p className="text-xs text-[#7D6B5D]">
                      Print-ready label with complete shipping destination for courier pickup
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.print();
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3D272A] hover:bg-[#5C3A42] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Label</span>
                  </button>
                  <button
                    onClick={() => setSelectedOrderForShippingLabel(null)}
                    className="p-2 rounded-full text-[#7D6B5D] hover:bg-[#FDF9F6]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Physical Shipping Slip Card */}
              <div className="p-6 rounded-2xl bg-[#FFFDF9] border-2 border-dashed border-[#4A3728] space-y-5 text-[#3D272A] font-sans">
                {/* Header / Brand */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#4A3728] pb-4 gap-2">
                  <div>
                    <h2 className="font-serif text-xl font-bold tracking-wide uppercase text-[#3D272A]">
                      Painite Crafts
                    </h2>
                    <p className="text-[11px] font-semibold text-[#7D6B5D]">
                      Handcrafted Polymer Clay Studio & Botanical Keepsakes
                    </p>
                    <p className="text-[10px] text-[#7D6B5D]">
                      Return Studio: 42 Lavender Lane, Creative Hub, Bengaluru 560034 • {storeSettings.phone}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="inline-block px-3 py-1 bg-[#3D272A] text-white font-mono font-bold text-xs rounded-md uppercase tracking-wider">
                      {selectedOrderForShippingLabel.shippingMethod || 'Studio Express'}
                    </div>
                    <p className="text-xs font-bold text-[#3D272A] mt-1 font-mono">
                      #{selectedOrderForShippingLabel.orderNumber}
                    </p>
                    <p className="text-[10px] text-[#7D6B5D]">
                      Date: {selectedOrderForShippingLabel.date}
                    </p>
                  </div>
                </div>

                {/* Simulated Barcode Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-xl border border-[#E8DCCF] gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#7D6B5D] uppercase tracking-wider block">Courier / AWB Tracking:</span>
                    <span className="font-mono text-sm font-bold text-[#4A3728]">
                      {selectedOrderForShippingLabel.courierName || 'Delhivery Express'} — {selectedOrderForShippingLabel.trackingNumber || `AWB-${selectedOrderForShippingLabel.orderNumber}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    {/* Visual Barcode bars */}
                    <div className="flex gap-[2px] h-6 items-center bg-[#FAF7F2] px-2 rounded-sm border border-[#E8DCCF]">
                      {[4, 2, 6, 3, 5, 2, 7, 3, 2, 5, 4, 3, 6, 2, 5, 3, 4].map((h, i) => (
                        <span key={i} className="bg-[#3D272A] w-[2px] inline-block" style={{ height: `${h * 2.5}px` }} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* SHIP TO (RECIPIENT) - PRIMARY FOCUS */}
                <div className="p-4 rounded-xl bg-white border-2 border-[#3D272A] space-y-2">
                  <div className="flex items-center justify-between border-b border-[#E8DCCF] pb-1.5">
                    <span className="text-xs font-black uppercase tracking-widest text-[#B85B75] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#B85B75]" />
                      <span>SHIP TO (DELIVERY ADDRESS)</span>
                    </span>
                    <span className="text-xs font-bold text-[#3D272A] bg-[#FFF5F7] px-2 py-0.5 rounded-sm border border-[#F9D5DF]">
                      📞 {selectedOrderForShippingLabel.customer.phone}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-base text-[#3D272A]">
                      {selectedOrderForShippingLabel.customer.fullName}
                    </p>
                    
                    {selectedOrderForShippingLabel.customer.apartment && (
                      <p className="font-semibold text-[#4A3728]">
                        {selectedOrderForShippingLabel.customer.apartment}
                      </p>
                    )}

                    <p className="text-[#4A3728]">
                      {selectedOrderForShippingLabel.customer.address}
                    </p>

                    {selectedOrderForShippingLabel.customer.landmark && (
                      <p className="font-medium text-[#7D6B5D] bg-[#FAF7F2] p-1.5 rounded-md border border-[#F2E8E0]">
                        <strong>Landmark:</strong> {selectedOrderForShippingLabel.customer.landmark}
                      </p>
                    )}

                    <div className="pt-1 flex flex-wrap items-baseline gap-2">
                      <span className="font-bold text-sm text-[#3D272A]">
                        {selectedOrderForShippingLabel.customer.city}, {selectedOrderForShippingLabel.customer.state}
                      </span>
                      <span className="font-mono text-base font-black px-2 py-0.5 rounded-md bg-[#3D272A] text-white tracking-widest">
                        PIN: {selectedOrderForShippingLabel.customer.pincode}
                      </span>
                    </div>

                    {selectedOrderForShippingLabel.customer.deliveryNotes && (
                      <p className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-md border border-amber-200 mt-2 font-medium italic">
                        <strong>Special Delivery Note:</strong> “{selectedOrderForShippingLabel.customer.deliveryNotes}”
                      </p>
                    )}
                  </div>
                </div>

                {/* Package Items & Payment Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-[#E8DCCF] space-y-1.5">
                    <span className="text-[10px] font-bold text-[#7D6B5D] uppercase tracking-wider block">
                      Package Contents ({selectedOrderForShippingLabel.items.reduce((s, i) => s + i.quantity, 0)} Items):
                    </span>
                    <ul className="space-y-1">
                      {selectedOrderForShippingLabel.items.map((it, idx) => (
                        <li key={idx} className="font-medium text-[#4A3728] truncate flex justify-between">
                          <span>{it.quantity}x {it.product.name}</span>
                          <span className="text-[#7D6B5D] font-mono">₹{it.product.price * it.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#E8DCCF] space-y-1.5 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#7D6B5D] uppercase tracking-wider block">
                        Payment & Collectible Mode:
                      </span>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-black uppercase ${
                          selectedOrderForShippingLabel.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {selectedOrderForShippingLabel.paymentStatus === 'Paid' ? 'PREPAID - DO NOT COLLECT' : 'CASH ON DELIVERY (COD)'}
                        </span>
                        <span className="font-bold font-serif text-base text-[#3D272A]">
                          ₹{selectedOrderForShippingLabel.totalAmount}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#F2E8E0] flex items-center justify-between text-[10px] text-[#7D6B5D]">
                      <span className="font-bold text-[#B85B75] uppercase">⚠️ FRAGILE ARTISAN CLAY</span>
                      <span>Handle With Care</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Close Button */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedOrderForShippingLabel(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#FAF7F2] text-[#4A3728] font-bold hover:bg-[#F2E8E0] transition-colors cursor-pointer text-xs"
                >
                  Done / Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: CONFIRM CATEGORY DELETION */}
        {/* ========================================================================= */}
        {categoryToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A3728]/50 backdrop-blur-xs">
            <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#F2E8E0] p-6 sm:p-7 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2E8E0]">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#4A3728]">
                      Delete Category
                    </h3>
                    <span className="text-[11px] text-[#7D6B5D]">
                      Remove from store catalog
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCategoryToDelete(null)}
                  className="p-1.5 rounded-full text-[#7D6B5D] hover:bg-[#FDF9F6] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FDF9F6] border border-[#E8DCCF] flex items-center gap-3">
                <img
                  src={categoryToDelete.image}
                  alt={categoryToDelete.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#E8DCCF] bg-white shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs text-[#4A3728] truncate">
                    {categoryToDelete.name}
                  </h4>
                  <p className="text-[11px] text-[#7D6B5D] line-clamp-1">
                    /{categoryToDelete.slug} • {products.filter((p) => p?.category?.toLowerCase() === categoryToDelete.name.toLowerCase()).length} Products
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#7D6B5D] leading-relaxed">
                Are you sure you want to delete the <strong>"{categoryToDelete.name}"</strong> category? Products currently assigned to this category will be preserved and reassigned to <em>"General"</em>.
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setCategoryToDelete(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#E8DCCF] bg-[#FAF7F2] hover:bg-[#F2E8E0] text-xs font-bold text-[#4A3728] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteCategory(categoryToDelete.id);
                    setCategoryToDelete(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Category</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: CONFIRM PRODUCT DELETION */}
        {/* ========================================================================= */}
        {productToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A3728]/50 backdrop-blur-xs">
            <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#F2E8E0] p-6 sm:p-7 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2E8E0]">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#4A3728]">
                      Delete Product
                    </h3>
                    <span className="text-[11px] text-[#7D6B5D]">
                      Remove creation from catalog
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setProductToDelete(null)}
                  className="p-1.5 rounded-full text-[#7D6B5D] hover:bg-[#FDF9F6] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FDF9F6] border border-[#E8DCCF] flex items-center gap-3">
                <img
                  src={productToDelete.images?.[0] || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=200&auto=format&fit=crop&q=80'}
                  alt={productToDelete.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#E8DCCF] bg-white shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs text-[#4A3728] truncate">
                    {productToDelete.name}
                  </h4>
                  <p className="text-[11px] text-[#7D6B5D] line-clamp-1">
                    {productToDelete.category} • ₹{productToDelete.price}
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#7D6B5D] leading-relaxed">
                Are you sure you want to permanently remove <strong>"{productToDelete.name}"</strong> from your storefront?
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setProductToDelete(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#E8DCCF] bg-[#FAF7F2] hover:bg-[#F2E8E0] text-xs font-bold text-[#4A3728] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteProduct(productToDelete.id);
                    setProductToDelete(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Product</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: CONFIRM ORDER RECORD DELETION (>1 MONTH PROTECTED) */}
        {/* ========================================================================= */}
        {orderToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A3728]/50 backdrop-blur-xs">
            <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#F2E8E0] p-6 sm:p-7 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2E8E0]">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#4A3728]">
                      Delete Archived Order File
                    </h3>
                    <span className="text-[11px] text-[#7D6B5D]">
                      Eligible: &gt; 1 Month Retention Completed
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOrderToDelete(null)}
                  className="p-1.5 rounded-full text-[#7D6B5D] hover:bg-[#FDF9F6] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FDF9F6] border border-[#E8DCCF] space-y-1.5 text-xs">
                <div className="flex justify-between font-bold text-[#4A3728]">
                  <span>Order #{orderToDelete.orderNumber}</span>
                  <span>₹{orderToDelete.totalAmount}</span>
                </div>
                <p className="text-[#7D6B5D]">
                  Customer: <strong>{orderToDelete.customer.fullName}</strong> ({orderToDelete.customer.phone})
                </p>
                <p className="text-[#7D6B5D]">
                  Placed on: <strong>{orderToDelete.date}</strong> • Age: <strong>{getOrderMetadata(orderToDelete).ageInDays} days old</strong>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p>
                  This order has passed the 30-day customer service & return period. Deleting it will permanently remove the order record and dispatch logs from your database.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setOrderToDelete(null)}
                  disabled={isDeletingOrder}
                  className="px-4 py-2.5 rounded-xl border border-[#E8DCCF] bg-[#FAF7F2] hover:bg-[#F2E8E0] text-xs font-bold text-[#4A3728] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteOrderConfirm}
                  disabled={isDeletingOrder}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isDeletingOrder ? 'Deleting...' : 'Confirm Permanent Delete'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: PURGE ALL EXPIRED ORDERS (> 30 DAYS) */}
        {/* ========================================================================= */}
        {isPurgeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A3728]/50 backdrop-blur-xs">
            <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#F2E8E0] p-6 sm:p-7 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2E8E0]">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#4A3728]">
                      Purge Archived Orders
                    </h3>
                    <span className="text-[11px] text-[#7D6B5D]">
                      Clean up {expiredOrdersCount} orders older than 30 days
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPurgeModalOpen(false)}
                  className="p-1.5 rounded-full text-[#7D6B5D] hover:bg-[#FDF9F6] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-950">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>1-Month Retention Policy Compliance</span>
                </div>
                <p>
                  Found <strong>{expiredOrdersCount} orders</strong> older than 30 days. Only orders placed over 1 month ago will be deleted. Recent orders remain safely protected.
                </p>
              </div>

              <p className="text-xs text-[#7D6B5D] leading-relaxed">
                Are you sure you want to delete all <strong>{expiredOrdersCount}</strong> eligible archived order records from the database? This action is permanent.
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPurgeModalOpen(false)}
                  disabled={isDeletingOrder}
                  className="px-4 py-2.5 rounded-xl border border-[#E8DCCF] bg-[#FAF7F2] hover:bg-[#F2E8E0] text-xs font-bold text-[#4A3728] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePurgeAllExpiredOrders}
                  disabled={isDeletingOrder}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isDeletingOrder ? 'Purging Orders...' : `Purge ${expiredOrdersCount} Expired Records`}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
