import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  writeBatch,
  getDocs,
  getDoc,
  query,
  where,
  getDocFromServer
} from 'firebase/firestore';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import {
  Product,
  Category,
  Collection,
  CartItem,
  UserProfile,
  SavedAddress,
  Order,
  Coupon,
  ProductReview,
  FAQItem,
  OrderTrackingStatus,
  StoreSettings,
  AdminCredentials,
  RefundRecord
} from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_COLLECTIONS,
  INITIAL_COUPONS,
  INITIAL_FAQS,
  DEFAULT_USER,
  INITIAL_ORDERS
} from '../data/mockData';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  freeShippingThreshold: 999,
  email: 'painitevault45@gmail.com',
  phone: '+91 7207427137',
  whatsappNumber: '+91 7207427137',
  whatsappUrl: 'https://wa.me/917207427137',
  instagramHandle: '@painitecrafts45',
  instagramUrl: 'https://www.instagram.com/painitecrafts45?igsi=dTN1bHNzcnh6bnhu',
  youtubeName: 'Painitecrafts',
  youtubeUrl: 'https://youtube.com/@nithya_45?si=WdNBCgvPf2vxPNqe',
  isStoreActive: true,
  storeInactiveMessage: '🌸 Painite Crafts is currently taking a short creative studio break & restock. Order checkout is temporarily paused.',
  offlineResumingNotice: 'We will be resuming online studio orders very shortly! Follow our craftsmanship on Instagram or WhatsApp us for custom inquiries.',
  announcementText: 'Handcrafted with love. Every piece tells a story.',
  announcementHighlight: 'Free Studio Shipping on orders over ₹999',
  showAnnouncementBar: true
};

export const DEFAULT_ADMIN_CREDENTIALS: AdminCredentials = {
  adminId: 'nithya4jn@gmail.com',
  password: 'Extrafizz@2000'
};

interface StoreContextType {
  // Navigation & View
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;
  selectedCollectionSlug: string | null;
  setSelectedCollectionSlug: (slug: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Products & Categories
  products: Product[];
  categories: Category[];
  collections: Collection[];
  addProduct: (product: Omit<Product, 'id' | 'reviews'>) => void;
  addNewProduct: (product: Omit<Product, 'id' | 'reviews'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addProductReview: (productId: string, review: Omit<ProductReview, 'id' | 'date'>) => void;

  // Category Management
  addCategory: (categoryData: { name: string; description?: string; image?: string; accentColor?: string }) => Category;
  updateCategory: (id: string, updated: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartSubtotal: number;
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartCount: number;

  // Store Settings & Status
  storeSettings: StoreSettings;
  updateStoreSettings: (newSettings: Partial<StoreSettings>) => void;
  freeShippingThreshold: number;
  isStoreActive: boolean;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // User & Auth
  user: UserProfile | null;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  login: (email: string, password?: string, name?: string) => Promise<{ success: boolean; message?: string; code?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message?: string; code?: string }>;
  loginWithEmail: (email: string, name?: string) => Promise<{ success: boolean; message?: string; code?: string }>;
  logout: () => Promise<void>;
  toggleAdminMode: () => void;
  addSavedAddress: (address: Omit<SavedAddress, 'id'>) => SavedAddress;
  updateSavedAddress: (addressId: string, address: Partial<SavedAddress>) => void;
  deleteSavedAddress: (addressId: string) => void;
  setDefaultSavedAddress: (addressId: string) => void;
  reorderItems: (items: CartItem[]) => void;

  // Admin Auth & ID/Password Security
  adminCredentials: AdminCredentials;
  isAdminAuthenticated: boolean;
  loginAdmin: (adminId: string, password: string) => { success: boolean; message: string };
  logoutAdmin: () => void;
  updateAdminCredentials: (newCreds: AdminCredentials) => void;
  resetAdminCredentials: () => void;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (open: boolean) => void;
  openAdminPortal: () => void;

  // Orders & Refunds
  orders: Order[];
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status' | 'trackingSteps'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderTrackingStatus) => void;
  updateOrderCourier: (orderId: string, courierName: string, trackingNumber: string) => void;
  issueRefund: (orderId: string, refundData: { amount: number; reason: string; txnId?: string; notes?: string }) => boolean;
  requestRefund: (orderId: string, reason: string) => void;
  cancelOrder: (orderId: string, reason?: string, cancelledBy?: 'Customer' | 'Admin') => boolean;
  deleteOrder: (orderId: string) => Promise<boolean>;
  purgeExpiredOrders: (olderThanDays?: number) => Promise<{ count: number; success: boolean }>;
  refreshOrders: () => Promise<void>;

  // Coupons Admin
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;

  // FAQs
  faqs: FAQItem[];

  // Quick Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Quick Action Modals
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const cleanCraftDetails = (text?: string): string => {
  if (!text) return 'Individually sculpted at studio workbench.';
  return text
    .replace(/\s*and\s+oven[- ]?cured/gi, '')
    .replace(/\s*oven[- ]?cured\s*and/gi, '')
    .replace(/\s*oven[- ]?cured/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

const sanitizeLoadedProduct = (p: Product): Product => {
  if (!p) return p;
  let changed = false;
  let handmadeDetails = p.handmadeDetails;
  if (handmadeDetails && /oven[- ]?cured/i.test(handmadeDetails)) {
    handmadeDetails = cleanCraftDetails(handmadeDetails);
    changed = true;
  }
  let fullDescription = p.fullDescription;
  if (fullDescription && /oven[- ]?cured/i.test(fullDescription)) {
    fullDescription = cleanCraftDetails(fullDescription);
    changed = true;
  }
  return changed ? { ...p, handmadeDetails, fullDescription } : p;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage persistent states with mock defaults
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [selectedCollectionSlug, setSelectedCollectionSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('pv_products');
    const raw = saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    return Array.isArray(raw) ? raw.map(sanitizeLoadedProduct) : INITIAL_PRODUCTS.map(sanitizeLoadedProduct);
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('pv_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback on parse error
    }
    return INITIAL_CATEGORIES;
  });

  const [collections] = useState<Collection[]>(INITIAL_COLLECTIONS);
  const [faqs] = useState<FAQItem[]>(INITIAL_FAQS);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('pv_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('pv_wishlist');
    return saved ? JSON.parse(saved) : ['prod-cute-bear', 'prod-enough-magnet'];
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('pv_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.id !== 'usr-101' && parsed.email !== 'pooja.iyer@gmail.com' && parsed.email !== 'ananya.claylover@example.com') {
          return parsed;
        }
      } catch {}
    }
    return null;
  });

  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>(() => {
    const saved = localStorage.getItem('pv_admin_credentials');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Force migration to nithya4jn@gmail.com and Extrafizz@2000
        if (parsed.adminId !== 'nithya4jn@gmail.com' || parsed.password === 'painite@2026' || parsed.password === 'admin') {
          const updated: AdminCredentials = { adminId: 'nithya4jn@gmail.com', password: 'Extrafizz@2000' };
          localStorage.setItem('pv_admin_credentials', JSON.stringify(updated));
          return updated;
        }
        return { adminId: 'nithya4jn@gmail.com', password: parsed.password || 'Extrafizz@2000' };
      } catch {
        return DEFAULT_ADMIN_CREDENTIALS;
      }
    }
    return DEFAULT_ADMIN_CREDENTIALS;
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('pv_admin_auth');
    return saved === 'true';
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('pv_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('pv_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('pv_settings');
    return saved ? { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(saved) } : DEFAULT_STORE_SETTINGS;
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Validate Connection to Firestore on startup
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error: any) {
        if (
          error?.code === 'unavailable' ||
          (error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('unavailable')))
        ) {
          console.info('Firestore client initialized with seamless offline-first persistence.');
        } else {
          console.warn('Firestore initial connection check status:', error?.message || error);
        }
      }
    }
    testConnection();
  }, []);

  // Firebase Auth Real-Time State Observer & Scoped User Profile Fetching
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          let savedAddresses: SavedAddress[] = [];
          let storedPhone = fbUser.phoneNumber || '';
          
          try {
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const data = userDocSnap.data() as Partial<UserProfile>;
              if (data.addresses && Array.isArray(data.addresses)) {
                savedAddresses = data.addresses;
              }
              if (data.phone) {
                storedPhone = data.phone;
              }
            }
          } catch (fetchErr) {
            handleFirestoreError(fetchErr, OperationType.GET, `users/${fbUser.uid}`);
          }

          const isAuthorizedAdmin = 
            isAdminAuthenticated || 
            fbUser.email === 'nithya4jn@gmail.com' || 
            fbUser.email === 'yuvarajyove@gmail.com';

          const profile: UserProfile = {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Studio Patron',
            email: fbUser.email || '',
            avatar: fbUser.photoURL || undefined,
            phone: storedPhone,
            isAdmin: isAuthorizedAdmin,
            createdAt: fbUser.metadata?.creationTime || new Date().toISOString(),
            addresses: savedAddresses
          };

          setUser(profile);
          localStorage.setItem('pv_user', JSON.stringify(profile));

          // Ensure profile is securely saved in Firestore for this specific UID
          try {
            await setDoc(userDocRef, profile, { merge: true });
          } catch (writeErr) {
            handleFirestoreError(writeErr, OperationType.WRITE, `users/${fbUser.uid}`);
          }
        } catch (err) {
          console.warn('Error reading user profile from Firestore:', err);
          const isAuthorizedAdmin = 
            isAdminAuthenticated || 
            fbUser.email === 'nithya4jn@gmail.com' || 
            fbUser.email === 'yuvarajyove@gmail.com';

          const fallbackProfile: UserProfile = {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Studio Patron',
            email: fbUser.email || '',
            avatar: fbUser.photoURL || undefined,
            phone: fbUser.phoneNumber || '',
            isAdmin: isAuthorizedAdmin,
            createdAt: new Date().toISOString(),
            addresses: []
          };
          setUser(fallbackProfile);
          localStorage.setItem('pv_user', JSON.stringify(fallbackProfile));
        }
      } else {
        // User logged out or unauthenticated in Firebase
        const saved = localStorage.getItem('pv_user');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed?.id === 'usr-101' || parsed?.email === 'pooja.iyer@gmail.com' || parsed?.email === 'ananya.claylover@example.com') {
              setUser(null);
              localStorage.removeItem('pv_user');
            }
          } catch {}
        }
      }
    });

    return () => unsubscribeAuth();
  }, [isAdminAuthenticated]);

  // Sync with Local Storage
  useEffect(() => {
    localStorage.setItem('pv_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('pv_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('pv_cart', JSON.stringify(cart));
  }, [cart]);

  // Firestore Real-Time Synchronizer for Public Catalog (Products, Categories, Settings)
  useEffect(() => {
    let unsubProducts: (() => void) | null = null;
    let unsubCategories: (() => void) | null = null;
    let unsubSettings: (() => void) | null = null;

    try {
      // 1. Sync Store Settings from Firestore
      const settingsDocRef = doc(db, 'store_settings', 'main');
      unsubSettings = onSnapshot(settingsDocRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data() as StoreSettings;
          setStoreSettings((prev) => ({ ...prev, ...data }));
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, 'store_settings/main');
      });

      // 2. Sync Products from Firestore
      const productsColRef = collection(db, 'products');
      unsubProducts = onSnapshot(productsColRef, (snap) => {
        if (!snap.empty) {
          const fetchedProducts: Product[] = [];
          snap.forEach((d) => {
            fetchedProducts.push(sanitizeLoadedProduct(d.data() as Product));
          });
          if (fetchedProducts.length > 0) {
            setProducts(fetchedProducts);
          }
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'products');
      });

      // 3. Sync Categories from Firestore
      const categoriesColRef = collection(db, 'categories');
      unsubCategories = onSnapshot(categoriesColRef, (snap) => {
        if (!snap.empty) {
          const fetchedCategories: Category[] = [];
          snap.forEach((d) => {
            fetchedCategories.push(d.data() as Category);
          });
          if (fetchedCategories.length > 0) {
            setCategories(fetchedCategories);
          }
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'categories');
      });
    } catch (e) {
      console.warn('Firestore real-time subscription initialized with local cache fallback.');
    }

    return () => {
      if (unsubProducts) unsubProducts();
      if (unsubCategories) unsubCategories();
      if (unsubSettings) unsubSettings();
    };
  }, []);

  // Firestore Real-Time Scoped Orders Synchronizer
  // Strictly scoped to the authenticated user's UID or admin
  useEffect(() => {
    let unsubOrders: (() => void) | null = null;

    try {
      const fbUser = auth.currentUser;
      
      // Only attach Firestore listeners if Firebase user is authenticated
      if (fbUser) {
        const isAdminEmail = fbUser.email === 'nithya4jn@gmail.com' || fbUser.email === 'yuvarajyove@gmail.com';
        const isAuthorizedAdmin = (isAdminAuthenticated || user?.isAdmin) && isAdminEmail;

        if (isAuthorizedAdmin) {
          // Admin: listen to all orders
          const ordersColRef = collection(db, 'orders');
          unsubOrders = onSnapshot(ordersColRef, (snap) => {
            const fetchedOrders: Order[] = [];
            snap.forEach((d) => {
              fetchedOrders.push(d.data() as Order);
            });
            fetchedOrders.sort((a, b) => new Date(b.createdAt || b.date || 0).getTime() - new Date(a.createdAt || a.date || 0).getTime());
            setOrders(fetchedOrders);
            localStorage.setItem('pv_orders', JSON.stringify(fetchedOrders));
          }, (err) => {
            handleFirestoreError(err, OperationType.LIST, 'orders');
          });
        } else if (fbUser.uid) {
          // Regular user: strictly query orders matching their authenticated UID only
          const userOrdersQuery = query(collection(db, 'orders'), where('userId', '==', fbUser.uid));
          unsubOrders = onSnapshot(userOrdersQuery, (snap) => {
            const fetchedOrders: Order[] = [];
            snap.forEach((d) => {
              fetchedOrders.push(d.data() as Order);
            });
            fetchedOrders.sort((a, b) => new Date(b.createdAt || b.date || 0).getTime() - new Date(a.createdAt || a.date || 0).getTime());
            setOrders(fetchedOrders);
            localStorage.setItem('pv_orders', JSON.stringify(fetchedOrders));
          }, (err) => {
            handleFirestoreError(err, OperationType.LIST, `orders?userId=${fbUser.uid}`);
          });
        }
      } else {
        // Unauthenticated guest or offline admin:
        // Load locally cached orders from storage without unauthenticated Firestore queries
        const saved = localStorage.getItem('pv_orders');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              setOrders(parsed);
            }
          } catch {}
        }
      }
    } catch (e) {
      console.warn('Firestore real-time orders subscription note:', e);
    }

    return () => {
      if (unsubOrders) unsubOrders();
    };
  }, [user?.id, user?.isAdmin, user?.email, isAdminAuthenticated, auth.currentUser]);

  // Real-time synchronization across browser tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        if (e.key === 'pv_products') {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setProducts(parsed);
          }
        } else if (e.key === 'pv_categories') {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setCategories(parsed);
          }
        } else if (e.key === 'pv_cart') {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setCart(parsed);
          }
        } else if (e.key === 'pv_settings') {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === 'object') {
            setStoreSettings(parsed);
          }
        }
      } catch {
        // Safe fallback
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('pv_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('pv_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('pv_admin_credentials', JSON.stringify(adminCredentials));
  }, [adminCredentials]);

  useEffect(() => {
    localStorage.setItem('pv_admin_auth', String(isAdminAuthenticated));
  }, [isAdminAuthenticated]);

  useEffect(() => {
    localStorage.setItem('pv_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('pv_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('pv_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setStoreSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        setDoc(doc(db, 'store_settings', 'main'), updated, { merge: true }).catch((e) =>
          console.warn('Firestore settings write note:', e.message)
        );
      } catch (err) {
        // Fallback
      }
      return updated;
    });
    showToast('Store settings updated successfully! ✨');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Protected view navigation: Block unauthorized attempts to access admin dashboard
  const setCurrentViewSafe = (view: string) => {
    if (view === 'admin' && !isAdminAuthenticated) {
      showToast('🔒 Access Denied: Admin Dashboard requires authorized administrator access.');
      setIsAdminLoginModalOpen(true);
      return;
    }
    setCurrentView(view);
  };

  // Admin Auth Methods - Restricted to nithya4jn@gmail.com & yuvarajyove@gmail.com
  const loginAdmin = (inputAdminId: string, inputPassword: string): { success: boolean; message: string } => {
    const cleanInputId = inputAdminId.trim().toLowerCase();
    const authorizedAdminEmails = ['nithya4jn@gmail.com', 'yuvarajyove@gmail.com'];
    const cleanInputPass = inputPassword.trim();
    const cleanStoredPass = (adminCredentials.password || 'Extrafizz@2000').trim();

    // Strict validation: Block any unauthorized user or email
    if (!authorizedAdminEmails.includes(cleanInputId)) {
      return {
        success: false,
        message: 'Access Denied: Invalid admin credentials. Access is strictly restricted to authorized studio administrators.'
      };
    }

    // Password validation against current stored password or Extrafizz@2000
    const isPasswordValid = 
      cleanInputPass === cleanStoredPass ||
      cleanInputPass === 'Extrafizz@2000';

    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Incorrect Admin Password. Access restricted.'
      };
    }

    setIsAdminAuthenticated(true);
    setIsAdminLoginModalOpen(false);
    // Sync user profile admin flag
    if (user) {
      setUser({ ...user, isAdmin: true });
    }
    setCurrentView('admin');
    const adminName = cleanInputId.includes('yuvaraj') ? 'Yuvaraj' : 'Nithya';
    showToast(`Authorized: Welcome ${adminName} to Painite Crafts Studio Admin 🛠️`);
    return { success: true, message: 'Admin login successful!' };
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    if (user) {
      setUser({ ...user, isAdmin: false });
    }
    if (currentView === 'admin') {
      setCurrentView('home');
    }
    showToast('Admin session logged out safely.');
  };

  const updateAdminCredentials = (newCreds: AdminCredentials) => {
    if (!newCreds.password || !newCreds.password.trim()) {
      showToast('Admin password cannot be empty.');
      return;
    }
    const sanitizedCreds: AdminCredentials = {
      adminId: 'nithya4jn@gmail.com',
      password: newCreds.password.trim()
    };
    setAdminCredentials(sanitizedCreds);
    localStorage.setItem('pv_admin_credentials', JSON.stringify(sanitizedCreds));
    showToast('Admin password updated successfully! 🔐');
  };

  const resetAdminCredentials = () => {
    const defaultCreds: AdminCredentials = {
      adminId: 'nithya4jn@gmail.com',
      password: 'Extrafizz@2000'
    };
    setAdminCredentials(defaultCreds);
    localStorage.setItem('pv_admin_credentials', JSON.stringify(defaultCreds));
    showToast('Admin credentials reset to default (Extrafizz@2000) 🔄');
  };

  const openAdminPortal = () => {
    if (isAdminAuthenticated) {
      setCurrentView('admin');
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  // Category Management Methods
  const addCategory = (categoryData: { name: string; description?: string; image?: string; accentColor?: string }): Category => {
    const slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: categoryData.name.trim(),
      slug: slug || `category-${Date.now()}`,
      description: categoryData.description?.trim() || `Handcrafted ${categoryData.name.trim()} collection.`,
      image: categoryData.image?.trim() || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
      itemCount: 0,
      accentColor: categoryData.accentColor || '#FCE7EC'
    };

    setCategories((prev) => [...prev, newCat]);
    try {
      setDoc(doc(db, 'categories', newCat.id), newCat).catch((e) =>
        console.warn('Firestore category write note:', e.message)
      );
    } catch {
      // Fallback
    }
    showToast(`New category "${newCat.name}" added to store! 📂`);
    return newCat;
  };

  const updateCategory = (id: string, updated: Partial<Category>) => {
    const oldCat = categories.find((c) => c.id === id);
    const updatedCat = oldCat ? { ...oldCat, ...updated } : null;

    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );

    if (updatedCat) {
      try {
        setDoc(doc(db, 'categories', id), updatedCat, { merge: true }).catch((e) =>
          console.warn('Firestore category update note:', e.message)
        );
      } catch {
        // Fallback
      }
    }

    // If the category name was changed, keep existing products in sync
    if (oldCat && updated.name && oldCat.name.toLowerCase() !== updated.name.toLowerCase()) {
      const newName = updated.name.trim();
      setProducts((prev) =>
        prev.map((p) => {
          if (p?.category && p.category.toLowerCase() === oldCat.name.toLowerCase()) {
            const upProd = { ...p, category: newName };
            try {
              setDoc(doc(db, 'products', p.id), upProd, { merge: true }).catch(console.warn);
            } catch {}
            return upProd;
          }
          return p;
        })
      );
    }

    showToast('Category updated successfully');
  };

  const deleteCategory = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;

    // Filter out the category
    setCategories((prev) => prev.filter((c) => c.id !== id));
    try {
      deleteDoc(doc(db, 'categories', id)).catch((e) =>
        console.warn('Firestore category delete note:', e.message)
      );
    } catch {}

    // Reassign products previously under this category to "General" to prevent broken filters or empty states
    setProducts((prev) =>
      prev.map((p) => {
        if (p?.category && p.category.toLowerCase() === cat.name.toLowerCase()) {
          const upProd = { ...p, category: 'General' };
          try {
            setDoc(doc(db, 'products', p.id), upProd, { merge: true }).catch(console.warn);
          } catch {}
          return upProd;
        }
        return p;
      })
    );

    // Reset customer view filter if currently filtered by this category
    setSelectedCategorySlug((prev) => {
      if (!prev) return null;
      if (prev.toLowerCase() === cat.name.toLowerCase() || prev === cat.slug) {
        return null;
      }
      return prev;
    });

    showToast(`Category "${cat.name}" removed from store 📂`);
  };

  // Dynamic Category Item Counts with complete null safety
  const categoriesWithCounts = (categories || []).filter(Boolean).map((cat) => ({
    ...cat,
    name: cat.name || 'Untitled Category',
    slug: cat.slug || `category-${cat.id}`,
    image: cat.image || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    description: cat.description || '',
    itemCount: (products || []).filter(
      (p) => p?.category && cat?.name && p.category.toLowerCase() === cat.name.toLowerCase()
    ).length
  }));

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let couponDiscount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrderValue) {
    if (appliedCoupon.discountPercent) {
      couponDiscount = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountAmount) {
      couponDiscount = appliedCoupon.discountAmount;
    }
  }

  const freeShippingThreshold = storeSettings.freeShippingThreshold || 999;
  const isStoreActive = storeSettings.isStoreActive !== false;
  const shippingFee = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : 49;
  const cartTotal = Math.max(0, cartSubtotal - couponDiscount + shippingFee);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity }];
      }
    });

    showToast(`Added "${product.name}" to your basket ♥`);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from basket');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === clean && c.isActive);
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    if (cartSubtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Add items worth ₹${found.minOrderValue - cartSubtotal} more to use this coupon.`
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon "${found.code}" applied successfully! 🎉` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from your wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        const prod = products.find((p) => p.id === productId);
        showToast(`Added "${prod?.name || 'Item'}" to your wishlist ♥`);
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // User Auth - Real Firebase Authentication with Google and Email
  const loginWithGoogle = async (): Promise<{ success: boolean; message?: string; code?: string }> => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      const isAuthorizedAdmin =
        isAdminAuthenticated ||
        fbUser.email === 'nithya4jn@gmail.com' ||
        fbUser.email === 'yuvarajyove@gmail.com';

      // Construct profile directly from authenticated Google credential
      let userProfile: UserProfile = {
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Studio Patron',
        email: fbUser.email || '',
        avatar: fbUser.photoURL || undefined,
        phone: fbUser.phoneNumber || '',
        isAdmin: isAuthorizedAdmin,
        createdAt: fbUser.metadata?.creationTime || new Date().toISOString(),
        addresses: []
      };

      // Set user immediately and close modal so UX is instantaneous
      setUser(userProfile);
      localStorage.setItem('pv_user', JSON.stringify(userProfile));
      setIsAuthModalOpen(false);
      showToast(`Welcome ${userProfile.name}! ✨ Signed in with Google`);

      // Asynchronously fetch extra data or sync to Firestore without blocking sign-in
      try {
        const userDocRef = doc(db, 'users', fbUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const existingData = userDocSnap.data() as Partial<UserProfile>;
          userProfile = {
            ...userProfile,
            addresses: existingData.addresses && Array.isArray(existingData.addresses) ? existingData.addresses : userProfile.addresses,
            phone: existingData.phone || userProfile.phone
          };
          setUser(userProfile);
          localStorage.setItem('pv_user', JSON.stringify(userProfile));
        } else {
          setDoc(userDocRef, userProfile, { merge: true }).catch((e) =>
            handleFirestoreError(e, OperationType.WRITE, `users/${fbUser.uid}`)
          );
        }
      } catch (firestoreErr: any) {
        handleFirestoreError(firestoreErr, OperationType.GET, `users/${fbUser.uid}`);
      }

      return { success: true };
    } catch (err: any) {
      console.error('Google Sign-in Error:', err);
      let errMsg = 'Failed to sign in with Google. Please try again.';
      const isUnauthorizedDomain = err.code === 'auth/unauthorized-domain' || err.message?.includes('unauthorized-domain');
      
      if (isUnauthorizedDomain) {
        const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'your current domain';
        errMsg = `auth/unauthorized-domain: "${currentHost}" is not added in your Firebase Console Authorized Domains yet.`;
        showToast('Domain not authorized in Firebase Console yet.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        errMsg = 'Sign-in popup was closed before completing.';
        showToast(errMsg);
      } else if (err.code === 'auth/cancelled-popup-request') {
        errMsg = 'Another sign-in request is in progress.';
        showToast(errMsg);
      } else if (err.code === 'auth/network-request-failed') {
        errMsg = 'Network connection issue. Please check your internet.';
        showToast(errMsg);
      } else if (err.message) {
        errMsg = err.message;
        showToast(errMsg);
      }
      return { success: false, message: errMsg, code: err.code };
    }
  };

  const login = async (emailInput: string, passwordInput?: string, nameInput?: string): Promise<{ success: boolean; message?: string; code?: string }> => {
    const email = emailInput.trim();
    const password = (passwordInput || '').trim();

    if (!email) {
      showToast('Please enter a valid email address');
      return { success: false, message: 'Email required' };
    }

    if (!password) {
      return loginWithEmail(email, nameInput);
    }

    try {
      let fbUser: FirebaseUser;
      if (nameInput) {
        // Sign Up with new credentials
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        fbUser = cred.user;
        if (nameInput) {
          await updateProfile(fbUser, { displayName: nameInput }).catch(console.warn);
        }
      } else {
        // Sign In with existing credentials
        const cred = await signInWithEmailAndPassword(auth, email, password);
        fbUser = cred.user;
      }

      const isAuthorizedAdmin =
        isAdminAuthenticated ||
        email === 'nithya4jn@gmail.com' ||
        email === 'yuvarajyove@gmail.com';

      let userProfile: UserProfile = {
        id: fbUser.uid,
        name: nameInput || fbUser.displayName || email.split('@')[0],
        email: fbUser.email || email,
        avatar: fbUser.photoURL || undefined,
        phone: fbUser.phoneNumber || '',
        isAdmin: isAuthorizedAdmin,
        createdAt: fbUser.metadata?.creationTime || new Date().toISOString(),
        addresses: []
      };

      setUser(userProfile);
      localStorage.setItem('pv_user', JSON.stringify(userProfile));
      setIsAuthModalOpen(false);
      showToast(`Welcome back, ${userProfile.name}! ✨`);

      // Asynchronously fetch extra data or sync to Firestore
      try {
        const userDocRef = doc(db, 'users', fbUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const existingData = userDocSnap.data() as Partial<UserProfile>;
          userProfile = {
            ...userProfile,
            addresses: existingData.addresses && Array.isArray(existingData.addresses) ? existingData.addresses : userProfile.addresses,
            phone: existingData.phone || userProfile.phone
          };
          setUser(userProfile);
          localStorage.setItem('pv_user', JSON.stringify(userProfile));
        } else {
          setDoc(userDocRef, userProfile, { merge: true }).catch((e) =>
            console.warn('Firestore user profile sync note:', e.message)
          );
        }
      } catch (firestoreErr: any) {
        console.warn('Firestore profile lookup note:', firestoreErr?.message);
      }

      return { success: true };
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      let errMsg = err.message || 'Authentication error';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errMsg = 'Invalid email or password. Please verify your credentials.';
      } else if (err.code === 'auth/email-already-in-use') {
        // If account exists, try logging in
        try {
          const cred = await signInWithEmailAndPassword(auth, email, password);
          const fbUser = cred.user;
          const isAuthorizedAdmin =
            isAdminAuthenticated ||
            email === 'nithya4jn@gmail.com' ||
            email === 'yuvarajyove@gmail.com';

          const profile: UserProfile = {
            id: fbUser.uid,
            name: fbUser.displayName || email.split('@')[0],
            email: fbUser.email || email,
            avatar: fbUser.photoURL || undefined,
            phone: fbUser.phoneNumber || '',
            isAdmin: isAuthorizedAdmin,
            createdAt: fbUser.metadata?.creationTime || new Date().toISOString(),
            addresses: []
          };
          setUser(profile);
          localStorage.setItem('pv_user', JSON.stringify(profile));
          setIsAuthModalOpen(false);
          showToast(`Welcome back, ${profile.name}! ✨`);

          try {
            const userDocRef = doc(db, 'users', fbUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const d = userDocSnap.data() as Partial<UserProfile>;
              const updated = {
                ...profile,
                addresses: d.addresses && Array.isArray(d.addresses) ? d.addresses : profile.addresses,
                phone: d.phone || profile.phone
              };
              setUser(updated);
              localStorage.setItem('pv_user', JSON.stringify(updated));
            }
          } catch {}

          return { success: true };
        } catch {
          errMsg = 'Account already exists. Please use your password to sign in.';
        }
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'Password must be at least 6 characters.';
      }
      showToast(errMsg);
      return { success: false, message: errMsg };
    }
  };

  const loginWithEmail = async (email: string, name?: string): Promise<{ success: boolean; message?: string }> => {
    const formattedEmail = email.trim();
    const isAuthorizedAdmin =
      isAdminAuthenticated ||
      formattedEmail === 'nithya4jn@gmail.com' ||
      formattedEmail === 'yuvarajyove@gmail.com';

    const fallbackUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || formattedEmail.split('@')[0],
      email: formattedEmail,
      phone: '',
      isAdmin: isAuthorizedAdmin,
      createdAt: new Date().toISOString(),
      addresses: []
    };

    setUser(fallbackUser);
    localStorage.setItem('pv_user', JSON.stringify(fallbackUser));
    setIsAuthModalOpen(false);
    showToast(`Welcome to Painite Crafts, ${fallbackUser.name}! ♥`);
    return { success: true };
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e: any) {
      console.warn('Firebase signout note:', e?.message);
    }
    setUser(null);
    setOrders([]);
    localStorage.removeItem('pv_user');
    localStorage.removeItem('pv_orders');
    showToast('Logged out successfully');
  };

  const toggleAdminMode = () => {
    if (!isAdminAuthenticated) {
      setIsAdminLoginModalOpen(true);
    } else {
      setUser((prev) => {
        if (!prev) return null;
        const updated = { ...prev, isAdmin: !prev.isAdmin };
        showToast(updated.isAdmin ? 'Admin Mode Activated 🛠️' : 'Switched to Customer View 🛍️');
        return updated;
      });
    }
  };

  const addSavedAddress = (address: Omit<SavedAddress, 'id'>): SavedAddress => {
    const newId = `addr-${Date.now()}`;
    const currentUser = user;
    const isFirst = !currentUser?.addresses || currentUser.addresses.length === 0;
    const shouldBeDefault = address.isDefault !== undefined ? address.isDefault : isFirst;
    const targetUid = auth.currentUser?.uid || user?.id;

    const newAddr: SavedAddress = {
      ...address,
      id: newId,
      isDefault: shouldBeDefault
    };

    setUser((prev) => {
      if (!prev) return prev;
      const currentList = prev.addresses || [];
      const updatedList = shouldBeDefault
        ? currentList.map((a) => ({ ...a, isDefault: false }))
        : currentList;

      const updatedUser: UserProfile = {
        ...prev,
        id: targetUid || prev.id,
        addresses: [newAddr, ...updatedList]
      };
      localStorage.setItem('pv_user', JSON.stringify(updatedUser));

      if (targetUid) {
        try {
          setDoc(doc(db, 'users', targetUid), updatedUser, { merge: true }).catch((err) => {
            handleFirestoreError(err, OperationType.WRITE, `users/${targetUid}`);
          });
        } catch {}
      }

      return updatedUser;
    });

    showToast('Address added to your address book ♥');
    return newAddr;
  };

  const updateSavedAddress = (addressId: string, updated: Partial<SavedAddress>) => {
    const targetUid = auth.currentUser?.uid || user?.id;

    setUser((prev) => {
      if (!prev) return prev;
      const currentList = prev.addresses || [];
      const isSettingDefault = updated.isDefault === true;

      const newAddresses = currentList.map((a) => {
        if (a.id === addressId) {
          return { ...a, ...updated };
        }
        if (isSettingDefault) {
          return { ...a, isDefault: false };
        }
        return a;
      });

      const updatedUser: UserProfile = {
        ...prev,
        id: targetUid || prev.id,
        addresses: newAddresses
      };
      localStorage.setItem('pv_user', JSON.stringify(updatedUser));

      if (targetUid) {
        try {
          setDoc(doc(db, 'users', targetUid), updatedUser, { merge: true }).catch((err) => {
            handleFirestoreError(err, OperationType.WRITE, `users/${targetUid}`);
          });
        } catch {}
      }

      return updatedUser;
    });
    showToast('Address updated successfully ✨');
  };

  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return;
    const currentUid = auth.currentUser?.uid || user.id;
    const updatedUser: UserProfile = {
      ...user,
      id: currentUid,
      ...profileData
    };
    setUser(updatedUser);
    localStorage.setItem('pv_user', JSON.stringify(updatedUser));
    try {
      await setDoc(doc(db, 'users', currentUid), updatedUser, { merge: true });
    } catch (e: any) {
      handleFirestoreError(e, OperationType.WRITE, `users/${currentUid}`);
    }
    showToast('Profile updated successfully! ✨');
  };

  const deleteSavedAddress = (addressId: string) => {
    const targetUid = auth.currentUser?.uid || user?.id;

    setUser((prev) => {
      if (!prev) return prev;
      const currentList = prev.addresses || [];
      const target = currentList.find((a) => a.id === addressId);
      let remaining = currentList.filter((a) => a.id !== addressId);

      if (target?.isDefault && remaining.length > 0) {
        remaining = remaining.map((addr, idx) => (idx === 0 ? { ...addr, isDefault: true } : addr));
      }

      const updatedUser: UserProfile = {
        ...prev,
        id: targetUid || prev.id,
        addresses: remaining
      };
      localStorage.setItem('pv_user', JSON.stringify(updatedUser));

      if (targetUid) {
        try {
          setDoc(doc(db, 'users', targetUid), updatedUser, { merge: true }).catch((err) => {
            handleFirestoreError(err, OperationType.WRITE, `users/${targetUid}`);
          });
        } catch {}
      }

      return updatedUser;
    });
    showToast('Address removed from address book');
  };

  const setDefaultSavedAddress = (addressId: string) => {
    const targetUid = auth.currentUser?.uid || user?.id;

    setUser((prev) => {
      if (!prev) return prev;
      const currentList = prev.addresses || [];
      const updated = currentList.map((a) => ({
        ...a,
        isDefault: a.id === addressId
      }));

      const updatedUser: UserProfile = {
        ...prev,
        id: targetUid || prev.id,
        addresses: updated
      };
      localStorage.setItem('pv_user', JSON.stringify(updatedUser));

      if (targetUid) {
        try {
          setDoc(doc(db, 'users', targetUid), updatedUser, { merge: true }).catch((err) => {
            handleFirestoreError(err, OperationType.WRITE, `users/${targetUid}`);
          });
        } catch {}
      }

      return updatedUser;
    });
    showToast('Default shipping address updated ♥');
  };

  const reorderItems = (items: CartItem[]) => {
    setCart((prev) => {
      const updated = [...prev];
      items.forEach((item) => {
        const existingIdx = updated.findIndex((ci) => ci.product.id === item.product.id);
        if (existingIdx > -1) {
          updated[existingIdx].quantity += item.quantity;
        } else {
          updated.push({ product: item.product, quantity: item.quantity });
        }
      });
      return updated;
    });
    setIsCartOpen(true);
    showToast(`${items.length} items added to basket from your previous order! 🛍️`);
  };

  // Products CRUD
  const addProduct = (newProd: Omit<Product, 'id' | 'reviews'>) => {
    const id = `prod-${Date.now()}`;
    const slug = newProd.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const fullProduct: Product = sanitizeLoadedProduct({
      ...newProd,
      id,
      slug,
      rating: 5.0,
      reviewsCount: 0,
      reviews: []
    });
    setProducts((prev) => [fullProduct, ...prev]);
    try {
      setDoc(doc(db, 'products', id), fullProduct).catch((e) =>
        console.warn('Firestore product write note:', e.message)
      );
    } catch {}
    showToast(`New craft creation "${newProd.name}" added to catalog! ✨`);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    const sanitizedUpdated = { ...updated };
    if (sanitizedUpdated.price !== undefined) {
      const parsedPrice = Number(sanitizedUpdated.price);
      sanitizedUpdated.price = isNaN(parsedPrice) || parsedPrice < 0 ? 0 : parsedPrice;
    }
    if (sanitizedUpdated.originalPrice !== undefined) {
      const parsedOrigPrice = Number(sanitizedUpdated.originalPrice);
      sanitizedUpdated.originalPrice = isNaN(parsedOrigPrice) || parsedOrigPrice < 0 ? undefined : parsedOrigPrice;
    }
    if (sanitizedUpdated.handmadeDetails !== undefined) {
      sanitizedUpdated.handmadeDetails = cleanCraftDetails(sanitizedUpdated.handmadeDetails);
    }
    if (sanitizedUpdated.fullDescription !== undefined) {
      sanitizedUpdated.fullDescription = cleanCraftDetails(sanitizedUpdated.fullDescription);
    }

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const up = { ...p, ...sanitizedUpdated };
          try {
            setDoc(doc(db, 'products', id), up, { merge: true }).catch((e) =>
              console.warn('Firestore product update note:', e.message)
            );
          } catch {}
          return up;
        }
        return p;
      })
    );

    // Sync cart with updated product details/pricing in real-time
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id === id) {
          return {
            ...item,
            product: {
              ...item.product,
              ...sanitizedUpdated
            }
          };
        }
        return item;
      })
    );

    showToast('Product details & pricing updated successfully! ✨');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      deleteDoc(doc(db, 'products', id)).catch((e) =>
        console.warn('Firestore product delete note:', e.message)
      );
    } catch {}
    showToast('Product removed from store');
  };

  const addProductReview = (productId: string, reviewData: Omit<ProductReview, 'id' | 'date'>) => {
    const newRev: ProductReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now'
    };
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [newRev, ...p.reviews];
          const newAvgRating = +(
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length
          ).toFixed(1);
          const up = {
            ...p,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: newAvgRating
          };
          try {
            setDoc(doc(db, 'products', productId), up, { merge: true }).catch((e) =>
              console.warn('Firestore review write note:', e.message)
            );
          } catch {}
          return up;
        }
        return p;
      })
    );
    showToast('Thank you! Your review has been published ♥');
  };

  // Orders & Refunds
  const placeOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status' | 'trackingSteps'>): Order => {
    const orderNum = `PC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const currentUid = auth.currentUser?.uid || user?.id;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const dateStr = now.toISOString().split('T')[0];

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      userId: currentUid,
      date: dateStr,
      time: timeStr,
      createdAt: now.toISOString(),
      status: 'Order Placed',
      refundStatus: 'None',
      trackingSteps: [
        { title: 'Order Placed', description: 'Received in studio queue', date: `Today, ${timeStr}`, completed: true, current: true },
        { title: 'Order Confirmed', description: 'Artisan assigned & materials prepped', completed: false, current: false },
        { title: 'Crafting Your Piece', description: 'Sculpting at studio workbench', completed: false, current: false },
        { title: 'Quality Check', description: 'Handmade detailing & strength testing', completed: false, current: false },
        { title: 'Packed with Love', description: 'Pink gift wrapping & ribbon sealed', completed: false, current: false },
        { title: 'Shipped', description: 'Dispatched with tracking ID', completed: false, current: false },
        { title: 'Delivered', description: 'Delivered to your doorstep', completed: false, current: false }
      ]
    };

    // If customer provided a phone during order and user account has no phone, automatically update profile
    if (user && !user.phone && orderData.customer?.phone) {
      updateUserProfile({ phone: orderData.customer.phone }).catch(console.warn);
    }

    setOrders((prev) => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    clearCart();
    try {
      setDoc(doc(db, 'orders', newOrder.id), newOrder).catch((e) => {
        handleFirestoreError(e, OperationType.CREATE, `orders/${newOrder.id}`);
      });
    } catch {}
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderTrackingStatus) => {
    const allStatuses: OrderTrackingStatus[] = [
      'Order Placed',
      'Order Confirmed',
      'Crafting Your Piece',
      'Quality Check',
      'Packed with Love',
      'Shipped',
      'Delivered'
    ];

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          let updated: Order;
          if (status === 'Cancelled') {
            const updatedSteps = ord.trackingSteps.map((step) => ({
              ...step,
              current: false
            }));
            updated = {
              ...ord,
              status: 'Cancelled',
              trackingSteps: updatedSteps
            };
          } else {
            const statusIndex = allStatuses.indexOf(status);
            const updatedSteps = ord.trackingSteps.map((step, idx) => ({
              ...step,
              completed: idx < statusIndex,
              current: idx === statusIndex,
              date: idx <= statusIndex ? step.date || 'Updated recently' : undefined
            }));
            updated = {
              ...ord,
              status,
              trackingSteps: updatedSteps
            };
          }
          try {
            setDoc(doc(db, 'orders', orderId), updated, { merge: true }).catch((e) => {
              handleFirestoreError(e, OperationType.UPDATE, `orders/${orderId}`);
            });
          } catch {}
          return updated;
        }
        return ord;
      })
    );
    showToast(`Order status updated to "${status}"`);
  };

  const updateOrderCourier = (orderId: string, courierName: string, trackingNumber: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = {
            ...ord,
            courierName: courierName.trim(),
            trackingNumber: trackingNumber.trim()
          };
          try {
            setDoc(doc(db, 'orders', orderId), updated, { merge: true }).catch((e) => {
              handleFirestoreError(e, OperationType.UPDATE, `orders/${orderId}`);
            });
          } catch {}
          return updated;
        }
        return ord;
      })
    );
    showToast('Courier & tracking details updated ♥');
  };

  const issueRefund = (orderId: string, refundData: { amount: number; reason: string; txnId?: string; notes?: string }): boolean => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) {
      showToast('Order not found.');
      return false;
    }

    const refundAmount = Number(refundData.amount);
    const isFullRefund = refundAmount >= targetOrder.totalAmount;
    const newStatus = isFullRefund ? 'Refunded' : 'Partially Refunded';

    const newRecord: RefundRecord = {
      id: `ref-${Date.now()}`,
      amount: refundAmount,
      reason: refundData.reason,
      date: new Date().toISOString().split('T')[0],
      refundTxnId: refundData.txnId || `RFND-${Date.now().toString().slice(-6)}`,
      notes: refundData.notes
    };

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const existingRecords = ord.refundRecords || [];
          const updated = {
            ...ord,
            paymentStatus: newStatus as any,
            refundStatus: newStatus as any,
            refundAmount: (ord.refundAmount || 0) + refundAmount,
            refundReason: refundData.reason,
            refundDate: new Date().toISOString().split('T')[0],
            refundTxnId: newRecord.refundTxnId,
            refundRecords: [...existingRecords, newRecord]
          };
          try {
            setDoc(doc(db, 'orders', orderId), updated, { merge: true }).catch((e) => {
              handleFirestoreError(e, OperationType.UPDATE, `orders/${orderId}`);
            });
          } catch {}
          return updated;
        }
        return ord;
      })
    );

    showToast(`Refund of ₹${refundAmount} processed for Order #${targetOrder.orderNumber} 💳`);
    return true;
  };

  const requestRefund = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = {
            ...ord,
            refundStatus: 'Requested' as const,
            refundReason: reason
          };
          try {
            setDoc(doc(db, 'orders', orderId), updated, { merge: true }).catch((e) => {
              handleFirestoreError(e, OperationType.UPDATE, `orders/${orderId}`);
            });
          } catch {}
          return updated;
        }
        return ord;
      })
    );
    showToast('Refund request submitted to studio team for review.');
  };

  const cancelOrder = (
    orderId: string,
    reason: string = 'Cancelled by customer',
    cancelledBy: 'Customer' | 'Admin' = 'Customer'
  ): boolean => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) {
      showToast('Order not found.');
      return false;
    }

    if (targetOrder.status === 'Delivered') {
      showToast('Cannot cancel an order that has already been delivered.');
      return false;
    }

    if (targetOrder.status === 'Cancelled') {
      showToast('This order has already been cancelled.');
      return false;
    }

    const isPrepaid = targetOrder.paymentStatus === 'Paid' || targetOrder.paymentMethod !== 'Cash on Delivery';
    const refundTxn = `RFND-CAN-${Date.now().toString().slice(-6)}`;
    const cancelDate = new Date().toISOString().split('T')[0];

    const newRecord: RefundRecord | null = isPrepaid
      ? {
          id: `ref-cancel-${Date.now()}`,
          amount: targetOrder.totalAmount,
          reason: `Order Cancellation (${reason})`,
          date: cancelDate,
          refundTxnId: refundTxn,
          notes: `Automatic full refund initiated for ${cancelledBy} cancellation.`
        }
      : null;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedSteps = ord.trackingSteps.map((step) => ({
            ...step,
            current: false
          }));

          const existingRecords = ord.refundRecords || [];

          const updated = {
            ...ord,
            status: 'Cancelled' as OrderTrackingStatus,
            cancellationReason: reason,
            cancelledBy: cancelledBy,
            cancelledDate: cancelDate,
            paymentStatus: isPrepaid ? ('Refunded' as const) : ord.paymentStatus,
            refundStatus: isPrepaid ? ('Refunded' as const) : ord.refundStatus,
            refundAmount: isPrepaid ? targetOrder.totalAmount : ord.refundAmount,
            refundReason: isPrepaid ? `Order Cancellation: ${reason}` : ord.refundReason,
            refundDate: isPrepaid ? cancelDate : ord.refundDate,
            refundTxnId: isPrepaid ? refundTxn : ord.refundTxnId,
            refundRecords: newRecord ? [...existingRecords, newRecord] : existingRecords,
            trackingSteps: updatedSteps
          };

          try {
            setDoc(doc(db, 'orders', orderId), updated, { merge: true }).catch((e) => {
              handleFirestoreError(e, OperationType.UPDATE, `orders/${orderId}`);
            });
          } catch {}
          return updated;
        }
        return ord;
      })
    );

    setCurrentOrder((prev) => {
      if (prev && prev.id === orderId) {
        const updatedSteps = prev.trackingSteps.map((step) => ({
          ...step,
          current: false
        }));
        const existingRecords = prev.refundRecords || [];
        return {
          ...prev,
          status: 'Cancelled' as OrderTrackingStatus,
          cancellationReason: reason,
          cancelledBy: cancelledBy,
          cancelledDate: cancelDate,
          paymentStatus: isPrepaid ? ('Refunded' as const) : prev.paymentStatus,
          refundStatus: isPrepaid ? ('Refunded' as const) : prev.refundStatus,
          refundAmount: isPrepaid ? targetOrder.totalAmount : prev.refundAmount,
          refundReason: isPrepaid ? `Order Cancellation: ${reason}` : prev.refundReason,
          refundDate: isPrepaid ? cancelDate : prev.refundDate,
          refundTxnId: isPrepaid ? refundTxn : prev.refundTxnId,
          refundRecords: newRecord ? [...existingRecords, newRecord] : existingRecords,
          trackingSteps: updatedSteps
        };
      }
      return prev;
    });

    if (isPrepaid) {
      showToast(`Order #${targetOrder.orderNumber} cancelled. Full refund of ₹${targetOrder.totalAmount} processed! 💳`);
    } else {
      showToast(`Order #${targetOrder.orderNumber} has been successfully cancelled.`);
    }

    return true;
  };

  // Delete Order (Accessible ONLY after 1 month / 30 days retention period)
  const deleteOrder = async (orderId: string): Promise<boolean> => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) {
      showToast('Order record not found.');
      return false;
    }

    const orderDate = new Date(targetOrder.createdAt || targetOrder.date);
    const ageInMs = Date.now() - orderDate.getTime();
    const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));

    if (ageInDays < 30) {
      showToast(`⚠️ Protected: Orders can only be permanently deleted after 1 month (30 days retention policy). Eligible in ${30 - ageInDays} days.`);
      return false;
    }

    // Remove from local state and storage immediately
    setOrders((prev) => {
      const remaining = prev.filter((o) => o.id !== orderId);
      localStorage.setItem('pv_orders', JSON.stringify(remaining));
      return remaining;
    });

    setCurrentOrder((prev) => (prev?.id === orderId ? null : prev));

    // Delete permanently from Firestore
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (e: any) {
      handleFirestoreError(e, OperationType.DELETE, `orders/${orderId}`);
    }

    showToast(`Order #${targetOrder.orderNumber} deleted permanently from database 🗑️`);
    return true;
  };

  // Bulk Purge Expired Orders (> 30 days old)
  const purgeExpiredOrders = async (olderThanDays: number = 30): Promise<{ count: number; success: boolean }> => {
    const expired = orders.filter((o) => {
      const orderDate = new Date(o.createdAt || o.date);
      const ageInDays = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      return ageInDays >= olderThanDays;
    });

    if (expired.length === 0) {
      showToast('No archived orders older than 1 month (30 days) found to delete.');
      return { count: 0, success: true };
    }

    const expiredIds = new Set(expired.map((o) => o.id));
    setOrders((prev) => {
      const remaining = prev.filter((o) => !expiredIds.has(o.id));
      localStorage.setItem('pv_orders', JSON.stringify(remaining));
      return remaining;
    });

    setCurrentOrder((prev) => (prev && expiredIds.has(prev.id) ? null : prev));

    try {
      const batch = writeBatch(db);
      expired.forEach((ord) => {
        batch.delete(doc(db, 'orders', ord.id));
      });
      await batch.commit();
    } catch (e: any) {
      handleFirestoreError(e, OperationType.DELETE, `orders (batch purge: ${expired.length})`);
    }

    showToast(`Purged ${expired.length} archived orders older than 1 month! 🗑️`);
    return { count: expired.length, success: true };
  };

  // Refresh Orders Queue from live database
  const refreshOrders = async () => {
    try {
      const fbUser = auth.currentUser;
      const isAdminEmail = fbUser?.email === 'nithya4jn@gmail.com' || fbUser?.email === 'yuvarajyove@gmail.com';
      const isAuthorizedAdmin = (isAdminAuthenticated || user?.isAdmin) && isAdminEmail;

      if (fbUser && isAuthorizedAdmin) {
        const snap = await getDocs(collection(db, 'orders'));
        const fetched: Order[] = [];
        snap.forEach((d) => fetched.push(d.data() as Order));
        if (fetched.length > 0) {
          fetched.sort((a, b) => new Date(b.createdAt || b.date || 0).getTime() - new Date(a.createdAt || a.date || 0).getTime());
          setOrders(fetched);
          localStorage.setItem('pv_orders', JSON.stringify(fetched));
        }
        showToast('Orders queue refreshed with live database! ✨');
      } else if (fbUser && fbUser.uid) {
        const userOrdersQuery = query(collection(db, 'orders'), where('userId', '==', fbUser.uid));
        const snap = await getDocs(userOrdersQuery);
        const fetched: Order[] = [];
        snap.forEach((d) => fetched.push(d.data() as Order));
        fetched.sort((a, b) => new Date(b.createdAt || b.date || 0).getTime() - new Date(a.createdAt || a.date || 0).getTime());
        setOrders(fetched);
        localStorage.setItem('pv_orders', JSON.stringify(fetched));
        showToast('Your orders refreshed! ✨');
      } else {
        const saved = localStorage.getItem('pv_orders');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) setOrders(parsed);
          } catch {}
        }
        showToast('Orders queue reloaded from local storage! ✨');
      }
    } catch (err: any) {
      handleFirestoreError(err, OperationType.LIST, 'orders');
      showToast('Orders queue refreshed! ✨');
    }
  };

  // Coupons
  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [...prev, coupon]);
    showToast(`Coupon ${coupon.code} created!`);
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    showToast(`Coupon ${code} removed`);
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView: setCurrentViewSafe,
        selectedProductId,
        setSelectedProductId,
        selectedCategorySlug,
        setSelectedCategorySlug,
        selectedCollectionSlug,
        setSelectedCollectionSlug,
        searchQuery,
        setSearchQuery,
        products,
        categories: categoriesWithCounts,
        collections,
        addProduct,
        addNewProduct: addProduct,
        updateProduct,
        deleteProduct,
        addProductReview,
        addCategory,
        updateCategory,
        deleteCategory,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartSubtotal,
        appliedCoupon,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        cartCount,
        storeSettings,
        updateStoreSettings,
        freeShippingThreshold,
        isStoreActive,
        wishlist,
        toggleWishlist,
        isInWishlist,
        user,
        updateUserProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        login,
        loginWithGoogle,
        loginWithEmail,
        logout,
        toggleAdminMode,
        addSavedAddress,
        updateSavedAddress,
        deleteSavedAddress,
        setDefaultSavedAddress,
        reorderItems,
        adminCredentials,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        updateAdminCredentials,
        resetAdminCredentials,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        openAdminPortal,
        orders,
        currentOrder,
        setCurrentOrder,
        placeOrder,
        updateOrderStatus,
        updateOrderCourier,
        issueRefund,
        requestRefund,
        cancelOrder,
        deleteOrder,
        purgeExpiredOrders,
        refreshOrders,
        coupons,
        addCoupon,
        deleteCoupon,
        faqs,
        toastMessage,
        showToast,
        isSearchModalOpen,
        setIsSearchModalOpen
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

