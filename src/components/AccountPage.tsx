import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { SavedAddress, Order } from '../types';
import {
  User as UserIcon,
  Package,
  Sparkles,
  MapPin,
  LogOut,
  Palette,
  Truck,
  Calendar,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  Search,
  RotateCcw,
  Clock,
  X,
  FileText,
  HelpCircle,
  Phone,
  Mail,
  Building,
  Navigation,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { CancelOrderModal } from './CancelOrderModal';

export const AccountPage: React.FC = () => {
  const {
    user,
    orders,
    logout,
    setCurrentView,
    setCurrentOrder,
    addSavedAddress,
    updateSavedAddress,
    deleteSavedAddress,
    setDefaultSavedAddress,
    reorderItems,
    showToast,
    storeSettings,
    updateUserProfile
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses'>('orders');

  // Edit Profile State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Address Form State
  const [addrFullName, setAddrFullName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrApartment, setAddrApartment] = useState('');
  const [addrLine, setAddrLine] = useState('');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPincode, setAddrPincode] = useState('');
  const [addrDeliveryNotes, setAddrDeliveryNotes] = useState('');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Orders Filtering and Search State
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState<Order | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [copiedTrackingId, setCopiedTrackingId] = useState<string | null>(null);

  // Strictly isolate orders belonging only to the authenticated user
  const userOrders = React.useMemo(() => {
    if (!user) return [];
    const userEmail = (user.email || '').toLowerCase().trim();
    const customerPhone = (user.phone || '').trim();
    return orders.filter((ord) => {
      const orderCustomerEmail = (ord.customer?.email || '').toLowerCase().trim();
      const orderCustomerPhone = (ord.customer?.phone || '').trim();
      const orderUserId = ord.userId;
      if (userEmail && orderCustomerEmail && userEmail === orderCustomerEmail) return true;
      if (user.id && orderUserId && user.id === orderUserId) return true;
      if (customerPhone && orderCustomerPhone && customerPhone === orderCustomerPhone) return true;
      return false;
    });
  }, [orders, user]);

  const handleOpenEditProfile = () => {
    setEditName(user?.name || '');
    setEditPhone(user?.phone || '');
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('Please provide your name');
      return;
    }
    await updateUserProfile({
      name: editName.trim(),
      phone: editPhone.trim()
    });
    setIsEditProfileOpen(false);
  };

  // Open Add Address Modal
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddrFullName(user?.name || '');
    setAddrPhone(user?.phone || '');
    setAddrApartment('');
    setAddrLine('');
    setAddrLandmark('');
    setAddrCity('Bengaluru');
    setAddrState('Karnataka');
    setAddrPincode('');
    setAddrDeliveryNotes('');
    setAddrIsDefault(!user?.addresses || user.addresses.length === 0);
    setIsAddressModalOpen(true);
  };

  // Open Edit Address Modal
  const handleOpenEditAddress = (addr: SavedAddress) => {
    setEditingAddressId(addr.id);
    setAddrFullName(addr.fullName || '');
    setAddrPhone(addr.phone || '');
    setAddrApartment(addr.apartment || '');
    setAddrLine(addr.addressLine || '');
    setAddrLandmark(addr.landmark || '');
    setAddrCity(addr.city || '');
    setAddrState(addr.state || '');
    setAddrPincode(addr.pincode || '');
    setAddrDeliveryNotes(addr.deliveryNotes || '');
    setAddrIsDefault(addr.isDefault);
    setIsAddressModalOpen(true);
  };

  // Submit Address
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();

    if (!addrApartment.trim() || !addrLine.trim() || !addrCity.trim() || !addrState.trim() || !addrPincode.trim()) {
      showToast('Please fill in all mandatory address fields');
      return;
    }

    if (addrPincode.trim().length !== 6) {
      showToast('Please enter a valid 6-digit Indian PIN code');
      return;
    }

    const payload = {
      fullName: addrFullName.trim() || user?.name || 'Valued Art Collector',
      phone: addrPhone.trim() || user?.phone || '',
      apartment: addrApartment.trim(),
      addressLine: addrLine.trim(),
      landmark: addrLandmark.trim(),
      city: addrCity.trim(),
      state: addrState.trim(),
      pincode: addrPincode.trim(),
      deliveryNotes: addrDeliveryNotes.trim(),
      isDefault: addrIsDefault
    };

    if (editingAddressId) {
      updateSavedAddress(editingAddressId, payload);
    } else {
      addSavedAddress(payload);
    }

    setIsAddressModalOpen(false);
  };

  // Copy tracking number
  const handleCopyTracking = (trackingNum: string) => {
    navigator.clipboard.writeText(trackingNum);
    setCopiedTrackingId(trackingNum);
    showToast('Tracking number copied to clipboard! 📋');
    setTimeout(() => setCopiedTrackingId(null), 2500);
  };

  // Filter user orders only
  const filteredOrders = userOrders.filter((ord) => {
    const query = orderSearchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      ord.orderNumber.toLowerCase().includes(query) ||
      ord.items.some((i) => i.product.name.toLowerCase().includes(query)) ||
      ord.customer.city.toLowerCase().includes(query) ||
      (ord.trackingNumber && ord.trackingNumber.toLowerCase().includes(query));

    if (!matchesQuery) return false;

    if (orderStatusFilter === 'all') return true;
    if (orderStatusFilter === 'active') {
      return ord.status !== 'Delivered' && ord.status !== 'Cancelled';
    }
    if (orderStatusFilter === 'delivered') {
      return ord.status === 'Delivered';
    }
    if (orderStatusFilter === 'cancelled') {
      return ord.status === 'Cancelled';
    }
    return true;
  });

  if (!user) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-full bg-[#FFF5F7] border border-[#F9D5DF] flex items-center justify-center mx-auto mb-4 text-2xl">
          🌸
        </div>
        <h2 className="font-serif-title text-2xl font-bold text-[#3D272A]">
          Please sign in to view your account
        </h2>
        <p className="text-xs text-[#6E5357] mt-2 mb-6">
          Access your past clay orders, track current shipments, and manage saved addresses.
        </p>
        <button
          onClick={() => setCurrentView('shop')}
          className="px-6 py-3 rounded-full bg-[#3D272A] text-white text-xs font-semibold hover:bg-[#5C3A42] cursor-pointer"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 bg-[#FFFDF9] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* User Profile Card */}
        <div className="bg-white rounded-3xl sm:rounded-[36px] border border-[#FCE7EC] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'}
              alt={user.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#FCE7EC] shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="font-serif-title text-2xl font-bold text-[#3D272A]">
                  {user.name}
                </h1>
              </div>
              <p className="text-xs text-[#6E5357] mt-0.5">{user.email}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-[11px] text-[#7D6B5D] flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#F5EFEB]">
                  <Phone className="w-3 h-3 text-[#B85B75]" />
                  <span>{user.phone ? user.phone : <span className="text-amber-700 italic">No phone added</span>}</span>
                </span>
                <button
                  onClick={handleOpenEditProfile}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF5F7] border border-[#F9D5DF] text-[#B85B75] hover:text-[#3D272A] font-semibold transition-colors cursor-pointer"
                >
                  <Edit2 className="w-2.5 h-2.5" />
                  <span>Edit Profile</span>
                </button>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#C5A059] font-medium">
                  Studio Patron ♥
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleOpenEditProfile}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs font-semibold text-[#6E5357] hover:bg-[#FCE7EC] hover:text-[#3D272A] transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-[#B85B75]" />
              <span>Edit Details</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs font-semibold text-[#6E5357] hover:bg-[#FCE7EC] hover:text-[#3D272A] transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-[#FCE7EC] gap-6 overflow-x-auto pb-1">
          <div className="flex gap-6">
            {[
              { id: 'orders', label: `My Orders & History (${userOrders.length})`, icon: Package },
              { id: 'addresses', label: `Saved Addresses (${user.addresses?.length || 0})`, icon: MapPin }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'border-[#B85B75] text-[#3D272A]'
                      : 'border-transparent text-[#6E5357] hover:text-[#3D272A]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#B85B75]' : 'text-[#6E5357]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {activeTab === 'addresses' && (
            <button
              onClick={handleOpenAddAddress}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3D272A] hover:bg-[#5C3A42] text-white text-xs font-bold transition-all shadow-xs cursor-pointer mb-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          )}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ORDERS & SHIPMENT HISTORY */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Search & Status Filters */}
            <div className="bg-white p-4 rounded-2xl border border-[#FCE7EC] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#7D6B5D] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Order #, Item Name, City..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs text-[#3D272A] focus:outline-none focus:border-[#D9829B]"
                />
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {[
                  { id: 'all', label: 'All Orders' },
                  { id: 'active', label: 'In Queue & Crafting' },
                  { id: 'delivered', label: 'Delivered' },
                  { id: 'cancelled', label: 'Cancelled' }
                ].map((flt) => (
                  <button
                    key={flt.id}
                    onClick={() => setOrderStatusFilter(flt.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      orderStatusFilter === flt.id
                        ? 'bg-[#3D272A] text-white'
                        : 'bg-[#FAF7F2] text-[#6E5357] hover:bg-[#FCE7EC]'
                    }`}
                  >
                    {flt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#FCE7EC] p-8 space-y-4 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-[#FFF5F7] border border-[#F9D5DF] flex items-center justify-center mx-auto text-xl">
                  📦
                </div>
                <h3 className="font-serif-title text-lg font-bold text-[#3D272A]">
                  No orders found
                </h3>
                <p className="text-xs text-[#6E5357] max-w-sm mx-auto">
                  {orderSearchQuery
                    ? 'No past orders matched your search query. Try clearing the filter.'
                    : 'Your handcrafted studio creations and keepsakes will be securely preserved here!'}
                </p>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="px-6 py-2.5 rounded-xl bg-[#3D272A] text-white text-xs font-bold hover:bg-[#5C3A42] transition-colors cursor-pointer"
                >
                  Explore Studio Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((ord) => {
                  const isExpanded = expandedOrderId === ord.id;
                  return (
                    <div
                      key={ord.id}
                      className="bg-white rounded-3xl border border-[#FCE7EC] p-6 shadow-xs space-y-5 transition-all hover:border-[#E8DCCF]"
                    >
                      {/* Top Bar: Order Number, Date, Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#FAF7F2] gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif-title font-bold text-base text-[#3D272A]">
                              Order #{ord.orderNumber}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              ord.status === 'Cancelled'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : ord.status === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-[#FFF5F7] text-[#B85B75] border border-[#F9D5DF]'
                            }`}>
                              {ord.status}
                            </span>
                          </div>
                          <p className="text-xs text-[#6E5357] mt-0.5 flex items-center gap-2">
                            <span>Placed on {ord.date}</span>
                            <span>•</span>
                            <span className="font-medium text-[#3D272A]">{ord.shippingMethod}</span>
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => {
                              setCurrentOrder(ord);
                              setCurrentView('tracking');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#3D272A] text-white text-xs font-bold hover:bg-[#5C3A42] transition-colors cursor-pointer shadow-xs"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Live Track</span>
                          </button>

                          <button
                            onClick={() => reorderItems(ord.items)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFF5F7] border border-[#F9D5DF] text-xs font-bold text-[#B85B75] hover:bg-[#FFEBF0] transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Buy Again</span>
                          </button>

                          <button
                            onClick={() => setSelectedOrderForInvoice(ord)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs font-semibold text-[#6E5357] hover:bg-[#F2E8E0] transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Invoice</span>
                          </button>

                          {ord.status !== 'Cancelled' && ord.status !== 'Delivered' && ord.status !== 'Shipped' && (
                            <button
                              onClick={() => setSelectedOrderForCancel(ord)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                              title="Cancel this order"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Cancel</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Cancelled Info Notice */}
                      {ord.status === 'Cancelled' && (
                        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2 text-rose-800">
                            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>
                              <strong>Cancelled {ord.cancelledDate ? `on ${ord.cancelledDate}` : ''}:</strong> {ord.cancellationReason || 'Cancelled by customer'}
                            </span>
                          </div>
                          {ord.paymentStatus === 'Refunded' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
                              ✓ Refunded ₹{ord.totalAmount}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Items Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {ord.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF7F2] border border-[#F5EFEB]">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-14 h-14 rounded-xl object-cover border border-[#E8DCCF]"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-[#3D272A] truncate">
                                {item.product.name}
                              </p>
                              <p className="text-[11px] text-[#6E5357] mt-0.5">
                                {item.quantity}x • ₹{item.product.price} each
                              </p>
                              <p className="text-[10px] text-[#C5A059] font-medium">
                                Handcrafted Clay Keepsake
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Courier Tracking snippet if assigned */}
                      {ord.trackingNumber && (
                        <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DCCF] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-[#B85B75]" />
                            <span className="font-bold text-[#3D272A]">
                              Courier: {ord.courierName || 'Delhivery Express'}
                            </span>
                            <span className="font-mono bg-white px-2 py-0.5 rounded-md border border-[#E8DCCF] text-[#4A3728]">
                              {ord.trackingNumber}
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopyTracking(ord.trackingNumber!)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B85B75] hover:underline cursor-pointer"
                          >
                            {copiedTrackingId === ord.trackingNumber ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-600">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy AWB</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Bottom Summary Bar & Details Toggle */}
                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between border-t border-[#FAF7F2] gap-3 text-xs">
                        <div className="text-[#6E5357] flex flex-wrap items-center gap-2">
                          <span>
                            Payment: <strong>{ord.paymentMethod}</strong> (
                            <span className={ord.paymentStatus === 'Paid' ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                              {ord.paymentStatus}
                            </span>
                            )
                          </span>
                          <span>•</span>
                          <span className="font-bold text-sm text-[#3D272A]">
                            Total: ₹{ord.totalAmount}
                          </span>
                        </div>

                        <button
                          onClick={() => setExpandedOrderId(isExpanded ? null : ord.id)}
                          className="text-[11px] font-bold text-[#B85B75] hover:underline self-start sm:self-auto cursor-pointer"
                        >
                          {isExpanded ? 'Hide Delivery Details ▲' : 'View Full Shipping Address ▼'}
                        </button>
                      </div>

                      {/* Expandable Shipping Destination Snapshot */}
                      {isExpanded && (
                        <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#F2E8E0] space-y-2 text-xs text-[#4A3728] animate-in fade-in-50 duration-200">
                          <span className="text-[11px] font-bold text-[#B85B75] uppercase tracking-wider flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Delivery Destination for this Order</span>
                          </span>
                          <div className="space-y-0.5">
                            <p className="font-bold text-[#3D272A]">{ord.customer.fullName}</p>
                            {ord.customer.apartment && <p>{ord.customer.apartment}</p>}
                            <p>{ord.customer.address}</p>
                            {ord.customer.landmark && (
                              <p className="text-[11px] text-[#7D6B5D]">Landmark: {ord.customer.landmark}</p>
                            )}
                            <p className="font-bold">
                              {ord.customer.city}, {ord.customer.state} - {ord.customer.pincode}
                            </p>
                            <p className="text-[11px] text-[#7D6B5D] pt-1">
                              Contact: {ord.customer.phone} • {ord.customer.email}
                            </p>
                            {ord.customer.deliveryNotes && (
                              <p className="text-[11px] italic bg-amber-50 p-1.5 rounded-md border border-amber-200 mt-1 text-amber-900">
                                Note: “{ord.customer.deliveryNotes}”
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SAVED ADDRESSES BOOK */}
        {/* ========================================================================= */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            {(!user.addresses || user.addresses.length === 0) ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#FCE7EC] p-8 space-y-4 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-[#FFF5F7] border border-[#F9D5DF] flex items-center justify-center mx-auto text-xl">
                  📍
                </div>
                <h3 className="font-serif-title text-lg font-bold text-[#3D272A]">
                  No Saved Addresses Yet
                </h3>
                <p className="text-xs text-[#6E5357] max-w-sm mx-auto">
                  Add your home, studio, or gift delivery addresses here for instant 1-click checkout on all future clay orders.
                </p>
                <button
                  onClick={handleOpenAddAddress}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#3D272A] text-white text-xs font-bold hover:bg-[#5C3A42] transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Your First Address</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`bg-white rounded-3xl border p-6 shadow-xs space-y-4 transition-all flex flex-col justify-between ${
                      addr.isDefault ? 'border-[#B85B75] bg-[#FFFDF9]' : 'border-[#FCE7EC] hover:border-[#E8DCCF]'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Card Header: Recipient Name & Default Badge */}
                      <div className="flex items-center justify-between pb-2 border-b border-[#FAF7F2]">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#3D272A]">
                            {addr.fullName || user.name}
                          </span>
                        </div>
                        {addr.isDefault && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#3D272A] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-[#FCE7EC]" />
                            <span>Default Address</span>
                          </span>
                        )}
                      </div>

                      {/* Full Address Details */}
                      <div className="text-xs text-[#4A3728] space-y-1 leading-relaxed">
                        {addr.apartment && (
                          <p className="font-semibold text-[#3D272A]">{addr.apartment}</p>
                        )}
                        <p>{addr.addressLine}</p>
                        
                        {addr.landmark && (
                          <p className="text-[11px] text-[#7D6B5D] bg-[#FAF7F2] p-1.5 rounded-md border border-[#F2E8E0]">
                            <strong>Landmark:</strong> {addr.landmark}
                          </p>
                        )}

                        <div className="flex flex-wrap items-baseline gap-1.5 pt-0.5">
                          <span className="font-bold text-[#3D272A]">{addr.city}, {addr.state}</span>
                          <span className="font-mono font-bold bg-[#3D272A] text-white px-2 py-0.5 rounded-md text-[11px]">
                            {addr.pincode}
                          </span>
                        </div>

                        {addr.deliveryNotes && (
                          <p className="text-[11px] text-[#7D6B5D] italic pt-1 border-t border-[#FAF7F2]">
                            <strong>Note:</strong> {addr.deliveryNotes}
                          </p>
                        )}

                        {(addr.phone || user.phone) && (
                          <p className="text-xs font-semibold text-[#3D272A] pt-1 flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-[#B85B75]" />
                            <span>{addr.phone || user.phone}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-3 border-t border-[#FAF7F2] flex items-center justify-between gap-2">
                      <div>
                        {!addr.isDefault ? (
                          <button
                            onClick={() => setDefaultSavedAddress(addr.id)}
                            className="text-[11px] font-bold text-[#6E5357] hover:text-[#B85B75] transition-colors cursor-pointer"
                          >
                            Set as Default
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-700">✓ Primary for Dispatch</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditAddress(addr)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F2E8E0] text-xs font-bold text-[#4A3728] transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3 text-[#7D6B5D]" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => deleteSavedAddress(addr.id)}
                          className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-500 transition-colors cursor-pointer"
                          title="Delete address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: ADD / EDIT SAVED ADDRESS */}
        {/* ========================================================================= */}
        {isAddressModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A3728]/60 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#F2E8E0] p-6 sm:p-8 shadow-2xl space-y-5 my-8 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2E8E0]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#B85B75]" />
                  <h3 className="font-serif text-lg font-bold text-[#4A3728]">
                    {editingAddressId ? 'Edit Shipping Address' : 'Add New Shipping Address'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddressModalOpen(false)}
                  className="p-1.5 rounded-full text-[#7D6B5D] hover:bg-[#FDF9F6] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-3.5 text-xs text-[#4A3728]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[11px] mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={addrFullName}
                      onChange={(e) => setAddrFullName(e.target.value)}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs text-[#3D272A] focus:outline-none focus:border-[#D9829B]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[11px] mb-1">
                      Contact Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={addrPhone}
                      onChange={(e) => setAddrPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs text-[#3D272A] focus:outline-none focus:border-[#D9829B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[11px] mb-1">
                    Flat / House No. / Building / Floor *
                  </label>
                  <input
                    type="text"
                    required
                    value={addrApartment}
                    onChange={(e) => setAddrApartment(e.target.value)}
                    placeholder="e.g. Flat 402, 4th Floor, Tower B, Rosewood Blossom"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs text-[#3D272A] focus:outline-none focus:border-[#D9829B]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[11px] mb-1">
                    Street Address / Colony / Area *
                  </label>
                  <input
                    type="text"
                    required
                    value={addrLine}
                    onChange={(e) => setAddrLine(e.target.value)}
                    placeholder="e.g. 100 Feet Road, HAL 2nd Stage, Indiranagar"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs text-[#3D272A] focus:outline-none focus:border-[#D9829B]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[11px] mb-1 flex items-center justify-between">
                    <span>Nearby Landmark</span>
                    <span className="text-[10px] text-[#7D6B5D] normal-case">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={addrLandmark}
                    onChange={(e) => setAddrLandmark(e.target.value)}
                    placeholder="e.g. Near BDA Complex / Starbucks / Metro Pillar 124"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs text-[#3D272A] focus:outline-none focus:border-[#D9829B]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[11px] mb-1">
                      City / Town *
                    </label>
                    <input
                      type="text"
                      required
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      placeholder="Bengaluru"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs text-[#3D272A] focus:outline-none focus:border-[#D9829B]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[11px] mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={addrState}
                      onChange={(e) => setAddrState(e.target.value)}
                      placeholder="Karnataka"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs text-[#3D272A] focus:outline-none focus:border-[#D9829B]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[11px] mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={addrPincode}
                      onChange={(e) => setAddrPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="560038"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs font-mono text-[#3D272A] focus:outline-none focus:border-[#D9829B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[11px] mb-1 flex items-center justify-between">
                    <span>Delivery Instructions / Notes</span>
                    <span className="text-[10px] text-[#7D6B5D] normal-case">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={addrDeliveryNotes}
                    onChange={(e) => setAddrDeliveryNotes(e.target.value)}
                    placeholder="e.g. Ring doorbell, Fragile artisan piece, Leave with security"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs text-[#3D272A] focus:outline-none focus:border-[#D9829B] resize-none"
                  />
                </div>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FFF5F7] border border-[#F9D5DF] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addrIsDefault}
                    onChange={(e) => setAddrIsDefault(e.target.checked)}
                    className="w-4 h-4 rounded-md accent-[#B85B75] cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#3D272A]">
                    Set as my default shipping address
                  </span>
                </label>

                <div className="pt-3 flex justify-end gap-2 border-t border-[#F2E8E0]">
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#FAF7F2] text-[#4A3728] font-semibold hover:bg-[#F2E8E0] transition-colors cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#3D272A] text-white font-bold hover:bg-[#5C3A42] transition-colors cursor-pointer text-xs shadow-xs"
                  >
                    {editingAddressId ? 'Update Address' : 'Save to Address Book'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: CUSTOMER TAX INVOICE & RECEIPT */}
        {/* ========================================================================= */}
        {selectedOrderForInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A3728]/60 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#F2E8E0] p-6 sm:p-8 shadow-2xl space-y-6 my-8">
              {/* Top Modal Controls */}
              <div className="flex items-center justify-between pb-4 border-b border-[#F2E8E0]">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#B85B75]" />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#4A3728]">
                      Tax Invoice & Order Receipt
                    </h3>
                    <p className="text-xs text-[#7D6B5D]">
                      Official studio tax receipt for Order #{selectedOrderForInvoice.orderNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') window.print();
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3D272A] hover:bg-[#5C3A42] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Invoice</span>
                  </button>
                  <button
                    onClick={() => setSelectedOrderForInvoice(null)}
                    className="p-2 rounded-full text-[#7D6B5D] hover:bg-[#FDF9F6] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Invoice Sheet */}
              <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E8DCCF] space-y-5 text-xs text-[#3D272A]">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between border-b border-[#E8DCCF] pb-4 gap-2">
                  <div>
                    <h2 className="font-serif text-xl font-bold uppercase text-[#3D272A]">
                      Painite Crafts Studio
                    </h2>
                    <p className="text-[11px] text-[#7D6B5D]">
                      Handmade Polymer Clay Studio & Botanical Floral Keepsakes
                    </p>
                    <p className="text-[10px] text-[#7D6B5D]">
                      Bengaluru, Karnataka • Contact: {storeSettings.phone} • GSTIN: 29AAACP1234F1Z8
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <span className="font-mono font-bold text-sm block">#{selectedOrderForInvoice.orderNumber}</span>
                    <span className="text-[11px] text-[#7D6B5D] block">Date: {selectedOrderForInvoice.date}</span>
                    <span className="px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase mt-1 inline-block">
                      {selectedOrderForInvoice.paymentStatus === 'Paid' ? 'PAID' : 'COD PENDING'}
                    </span>
                  </div>
                </div>

                {/* Billed & Shipped To */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-[#E8DCCF] pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#7D6B5D] block mb-1">
                      Billed & Shipped To:
                    </span>
                    <p className="font-bold">{selectedOrderForInvoice.customer.fullName}</p>
                    {selectedOrderForInvoice.customer.apartment && (
                      <p>{selectedOrderForInvoice.customer.apartment}</p>
                    )}
                    <p>{selectedOrderForInvoice.customer.address}</p>
                    {selectedOrderForInvoice.customer.landmark && (
                      <p className="text-[11px] text-[#7D6B5D]">Landmark: {selectedOrderForInvoice.customer.landmark}</p>
                    )}
                    <p className="font-bold">
                      {selectedOrderForInvoice.customer.city}, {selectedOrderForInvoice.customer.state} - {selectedOrderForInvoice.customer.pincode}
                    </p>
                    <p className="text-[11px] text-[#7D6B5D] mt-1">
                      Phone: {selectedOrderForInvoice.customer.phone}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#7D6B5D] block mb-1">
                      Shipping & Payment Details:
                    </span>
                    <p><strong>Shipping Mode:</strong> {selectedOrderForInvoice.shippingMethod}</p>
                    <p><strong>Payment Mode:</strong> {selectedOrderForInvoice.paymentMethod}</p>
                    {selectedOrderForInvoice.trackingNumber && (
                      <p>
                        <strong>Courier / AWB:</strong> {selectedOrderForInvoice.courierName || 'Delhivery'} — {selectedOrderForInvoice.trackingNumber}
                      </p>
                    )}
                    <p className="text-[11px] text-[#7D6B5D] mt-2 italic">
                      Thank you for supporting our artisan clay craftsmanship ♥
                    </p>
                  </div>
                </div>

                {/* Itemized Table */}
                <div>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#E8DCCF] text-[10px] font-bold uppercase text-[#7D6B5D]">
                        <th className="pb-2">Craft Item</th>
                        <th className="pb-2 text-center">Qty</th>
                        <th className="pb-2 text-right">Price</th>
                        <th className="pb-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2E8E0]">
                      {selectedOrderForInvoice.items.map((it, idx) => (
                        <tr key={idx} className="py-2">
                          <td className="py-2 font-medium">{it.product.name}</td>
                          <td className="py-2 text-center">{it.quantity}</td>
                          <td className="py-2 text-right font-mono">₹{it.product.price}</td>
                          <td className="py-2 text-right font-mono font-bold">
                            ₹{it.product.price * it.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Subtotal, Discount & Total */}
                <div className="border-t-2 border-[#3D272A] pt-3 flex justify-end">
                  <div className="w-full sm:w-64 space-y-1.5">
                    <div className="flex justify-between text-xs text-[#7D6B5D]">
                      <span>Subtotal:</span>
                      <span className="font-mono">₹{selectedOrderForInvoice.subtotal}</span>
                    </div>
                    {selectedOrderForInvoice.discount > 0 && (
                      <div className="flex justify-between text-xs text-[#B85B75]">
                        <span>Coupon Savings ({selectedOrderForInvoice.couponCode}):</span>
                        <span className="font-mono">-₹{selectedOrderForInvoice.discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs text-[#7D6B5D]">
                      <span>Shipping Fee:</span>
                      <span className="font-mono">
                        {selectedOrderForInvoice.shippingFee === 0 ? 'FREE' : `₹${selectedOrderForInvoice.shippingFee}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-[#3D272A] border-t border-[#E8DCCF] pt-2">
                      <span>Total Amount:</span>
                      <span className="font-serif text-base">₹{selectedOrderForInvoice.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Action */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedOrderForInvoice(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#FAF7F2] text-[#4A3728] font-bold hover:bg-[#F2E8E0] transition-colors cursor-pointer text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Order Modal */}
        <CancelOrderModal
          isOpen={!!selectedOrderForCancel}
          order={selectedOrderForCancel}
          onClose={() => setSelectedOrderForCancel(null)}
        />

        {/* Edit Profile Modal */}
        {isEditProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#FCE7EC] shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#FAF7F2]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#FFF5F7] border border-[#F9D5DF] flex items-center justify-center text-sm">
                    ✨
                  </div>
                  <h3 className="font-serif-title font-bold text-lg text-[#3D272A]">
                    Edit Profile Details
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditProfileOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-[#FCE7EC] flex items-center justify-center text-[#6E5357] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#3D272A] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs text-[#3D272A] focus:outline-none focus:border-[#D9829B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3D272A] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5EFEB]/50 border border-[#F5EFEB] text-xs text-[#7D6B5D] cursor-not-allowed"
                  />
                  <span className="text-[10px] text-[#7D6B5D] mt-1 block">
                    Signed in via Google/Email authentication.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-[#3D272A] mb-1">
                    Phone / Contact Number (for delivery updates)
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs text-[#3D272A] focus:outline-none focus:border-[#D9829B]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-[#6E5357] font-semibold hover:bg-[#F2E8E0] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-[#3D272A] text-white font-bold hover:bg-[#5C3A42] transition-colors cursor-pointer shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
