import { Product, Category, Collection, Coupon, FAQItem, Order, UserProfile } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-keychains',
    name: 'Keychains',
    slug: 'keychains',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    description: 'Charming handcrafted clay keychains with sturdy clasps & cute mini figures.',
    itemCount: 1,
    accentColor: '#FCE7EC'
  },
  {
    id: 'cat-charms',
    name: 'Charms',
    slug: 'charms',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
    description: 'Delicate phone, bag, and jewelry clay charms with lustrous glaze.',
    itemCount: 3,
    accentColor: '#F9D5DF'
  },
  {
    id: 'cat-mini-figures',
    name: 'Mini Figures',
    slug: 'mini-figures',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    description: 'Tiny sculpted characters and whimsical desk buddies full of personality.',
    itemCount: 3,
    accentColor: '#FAF7F2'
  },
  {
    id: 'cat-magnets',
    name: 'Magnets',
    slug: 'magnets',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    description: 'Strong neodymium magnets embedded in joyful clay sculptures.',
    itemCount: 2,
    accentColor: '#FDF2F4'
  },
  {
    id: 'cat-home-decor',
    name: 'Home Décor',
    slug: 'home-decor',
    image: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=600&q=80',
    description: 'Handmade clay trinket dishes, mini planters, and cottage shelf art.',
    itemCount: 1,
    accentColor: '#F5EFEB'
  },
  {
    id: 'cat-gift-sets',
    name: 'Gift Sets',
    slug: 'gift-sets',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    description: 'Curated gift boxes with ribbon, handwritten cards & matching clay pieces.',
    itemCount: 2,
    accentColor: '#FCE7EC'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-cute-bear',
    name: 'Cute Honey Bear Keychain',
    slug: 'cute-honey-bear-keychain',
    category: 'Keychains',
    price: 299,
    originalPrice: 349,
    rating: 4.9,
    reviewsCount: 48,
    inStock: true,
    stockCount: 14,
    isFeatured: true,
    isBestSeller: true,
    badge: 'Best Seller',
    shortDescription: 'Sweet hand-sculpted caramel clay bear holding a tiny jar of golden honey with a blush tint.',
    fullDescription: 'Every Cute Honey Bear is molded entirely by hand using premium non-toxic artisan clay. Through our meticulous handmade crafting process, facial details are painted with ultra-fine acrylic brushes and coated with a water-resistant gloss finish. Attached to a secure rose gold swivel clasp that won’t tarnish.',
    materials: ['Premium Artisan Clay', 'High-grade Acrylic Details', 'Gloss Glaze Sealant', 'Rose Gold Alloy Clasp'],
    dimensions: '3.2 cm height × 2.6 cm width (Weight: 14g)',
    handmadeDetails: 'Hand-sculpted through our handmade crafting process for optimal durability, hand-painted blush cheeks & glazed by artist.',
    careInstructions: 'Keep away from excessive heat and direct immersion in water. Clean gently with a soft dry cloth.',
    shippingInfo: 'Dispatched within 24-48 hours. Carefully bubble-wrapped in our signature pink keepsake box.',
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'
    ],
    reviews: [
      {
        id: 'rev-1',
        userName: 'Aanya Sharma',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '3 days ago',
        comment: 'Absolutely in love with this little bear! The details are so tiny and precise. You can really feel the love that went into making it.',
        verifiedPurchase: true
      },
      {
        id: 'rev-2',
        userName: 'Priya Mehra',
        userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '1 week ago',
        comment: 'Ordered for my sister and she cried happy tears. The packaging smelled amazing and came with cute clay stickers!',
        verifiedPurchase: true
      }
    ],
    collectionId: 'tiny-friends'
  },
  {
    id: 'prod-fluffy-puppy',
    name: 'Fluffy Puppy Bag Charm',
    slug: 'fluffy-puppy-bag-charm',
    category: 'Charms',
    price: 249,
    originalPrice: 299,
    rating: 4.8,
    reviewsCount: 36,
    inStock: true,
    stockCount: 19,
    isFeatured: true,
    isNew: true,
    badge: 'New Drop',
    shortDescription: 'Chubby white puppy charm with floppy ear details and a tiny pink heart collar.',
    fullDescription: 'Sculpted with soft pastel ivory clay and textured with delicate fur indentations. This delightful puppy charm brings warmth and joy to your backpack, handbag, or pouch.',
    materials: ['Handmade Artisan Clay', 'Reinforced Stainless Eyelet', 'Pastel Pink Satin Cord', 'UV Resin Seal'],
    dimensions: '2.8 cm × 2.5 cm (Weight: 11g)',
    handmadeDetails: 'Each floppy ear is sculpted individually; collar is hand-beaded with micro glass pearls.',
    careInstructions: 'Avoid pulling violently on small extremities. Water-resistant but not submersible.',
    shippingInfo: 'Ships in 1-2 business days with protective cotton pouch.',
    images: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
    ],
    reviews: [
      {
        id: 'rev-3',
        userName: 'Rhea Sen',
        rating: 5,
        date: '2 weeks ago',
        comment: 'So lightweight yet sturdy! Clips perfectly on my tote bag.',
        verifiedPurchase: true
      }
    ],
    collectionId: 'everyday-charms'
  },
  {
    id: 'prod-girl-flowers',
    name: 'Little Girl with Flower Crown Figurine',
    slug: 'little-girl-with-flower-crown-figurine',
    category: 'Mini Figures',
    price: 399,
    originalPrice: 450,
    rating: 5.0,
    reviewsCount: 62,
    inStock: true,
    stockCount: 8,
    isFeatured: true,
    isBestSeller: true,
    badge: 'Artisan Favorite',
    shortDescription: 'A heartwarming decorative figurine of a dreamy character wearing a handmade petal crown.',
    fullDescription: 'A centerpiece mini sculpture for your bedside table, workstation desk, or bookshelf. Contains over 18 micro-sculpted flower petals in shades of rose, cream, and lavender.',
    materials: ['Sculpey Premo & Fimo Clay', 'Pastel Pigments', 'Matte Ceramic Sealer', 'Wooden Stand Base'],
    dimensions: '5.2 cm height × 3.4 cm base diameter (Weight: 28g)',
    handmadeDetails: 'Takes approximately 3.5 hours of dedicated handwork and handmade crafting process.',
    careInstructions: 'Dust with a soft makeup brush. Do not drop on hard tile surfaces.',
    shippingInfo: 'Double-boxed with custom high-density foam padding for zero shipping damage.',
    images: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=800&q=80'
    ],
    reviews: [
      {
        id: 'rev-4',
        userName: 'Tanvi Nair',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '5 days ago',
        comment: 'The craftsmanship on the flower crown is surreal. I keep it right under my monitor and it makes me smile everyday!',
        verifiedPurchase: true
      }
    ],
    collectionId: 'little-homes'
  },
  {
    id: 'prod-succulent-pot',
    name: 'Smiley Succulent Desk Buddy',
    slug: 'smiley-succulent-desk-buddy',
    category: 'Home Décor',
    price: 349,
    originalPrice: 399,
    rating: 4.9,
    reviewsCount: 29,
    inStock: true,
    stockCount: 11,
    isFeatured: true,
    badge: 'Popular',
    shortDescription: 'Cheery clay planter with layered rosette succulent leaves and happy closed eyes.',
    fullDescription: 'Hand-blended sage green and mint clay petals arranged in a textured terracotta-toned miniature pot with cute blushing cheeks.',
    materials: ['Sculpted Studio Clay', 'Natural Stone Sand Base', 'Matte Water-Resistant Finish'],
    dimensions: '4.0 cm × 4.0 cm × 4.2 cm (Weight: 32g)',
    handmadeDetails: '14 separate rosette petals sculpted and gradient-shaded with soft pastels.',
    careInstructions: 'Wipe with damp cloth. Decorative item — does not need watering!',
    shippingInfo: 'Ships safely within 48 hours.',
    images: [
      'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'
    ],
    reviews: [
      {
        id: 'rev-5',
        userName: 'Kavita Rao',
        rating: 5,
        date: '3 weeks ago',
        comment: 'So so pretty! Looks even better in person than the photos.',
        verifiedPurchase: true
      }
    ],
    collectionId: 'little-homes'
  },
  {
    id: 'prod-enough-magnet',
    name: '“You Are Enough” Clay Magnet',
    slug: 'you-are-enough-clay-magnet',
    category: 'Magnets',
    price: 199,
    originalPrice: 249,
    rating: 4.8,
    reviewsCount: 54,
    inStock: true,
    stockCount: 25,
    isFeatured: true,
    isBestSeller: true,
    badge: 'Mindful Pick',
    shortDescription: 'Gentle reminder magnet with soft floral clay petals and hand-stamped positive mantra.',
    fullDescription: 'A daily dose of kindness for your refrigerator or magnetic board. Hand-rolled blush clay tablet with delicate buttercup flowers and gold-leaf speckled rim.',
    materials: ['Sculpted Clay', 'Neodymium N52 Magnet', '24k Muted Gold Leaf Foil', 'Triple Resin Coat'],
    dimensions: '3.8 cm diameter × 0.6 cm thickness',
    handmadeDetails: 'Each letter is hand-stamped; floral buds applied petal by petal.',
    careInstructions: 'Strong magnet will hold 4-5 sheets of paper easily.',
    shippingInfo: 'Packed in eco-friendly glassine pouch with handwritten thank-you card.',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
    ],
    reviews: [
      {
        id: 'rev-6',
        userName: 'Sanya Kapoor',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '4 days ago',
        comment: 'Bought 3 of these to gift my colleagues. They are obsessed! The magnet is super strong.',
        verifiedPurchase: true
      }
    ],
    collectionId: 'gifts-heart'
  },
  {
    id: 'prod-pastel-cloud-charm',
    name: 'Pastel Cloud & Star Phone Charm',
    slug: 'pastel-cloud-star-phone-charm',
    category: 'Charms',
    price: 279,
    originalPrice: 320,
    rating: 4.9,
    reviewsCount: 31,
    inStock: true,
    stockCount: 16,
    isFeatured: false,
    isNew: true,
    badge: 'Trending',
    shortDescription: 'Fluffy dreamy cloud with hanging iridescent clay starlets on braided blush string.',
    fullDescription: 'Add magical charm to your smartphone or camera lanyard. Features a smiling cloud charm with shimmering pastel dust and tiny swinging clay stars.',
    materials: ['Sparkle Craft Clay', 'Strong Nylon Cord', 'Mini Glass Beads', 'Protective Glaze'],
    dimensions: 'Total length 14 cm (Cloud is 2.5 cm wide)',
    handmadeDetails: 'Hand-blended with fine cosmetic mica for a subtle pearlescent shimmer under sunlight.',
    careInstructions: 'Loop securely through your phone case speaker or lanyard cutouts.',
    shippingInfo: 'Shipped in sturdy postal box.',
    images: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
    ],
    reviews: [],
    collectionId: 'everyday-charms'
  },
  {
    id: 'prod-sleeping-kitty',
    name: 'Sleeping Calico Kitty Figurine',
    slug: 'sleeping-calico-kitty-figurine',
    category: 'Mini Figures',
    price: 369,
    originalPrice: 420,
    rating: 5.0,
    reviewsCount: 42,
    inStock: true,
    stockCount: 7,
    isFeatured: false,
    badge: 'Limited Edition',
    shortDescription: 'Curled up sleeping calico cat resting on a miniature sculpted clay cushion.',
    fullDescription: 'Inspired by lazy afternoon naps. Every patch of ginger, black, and white is sculpted separately, not painted, giving deep texture and charm.',
    materials: ['Artisan Clay', 'Velvet-finish Sculpted Bed', 'Matte Varnish'],
    dimensions: '4.5 cm × 3.8 cm (Weight: 24g)',
    handmadeDetails: 'Over 40 minutes of intricate patch blending per kitten.',
    careInstructions: 'Clean with dry microfiber brush.',
    shippingInfo: 'Ships in 1-2 business days with special cat-themed box tape.',
    images: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'
    ],
    reviews: [
      {
        id: 'rev-7',
        userName: 'Meera Deshmukh',
        rating: 5,
        date: '1 week ago',
        comment: 'Looks just like my rescue cat Oliver! I cried when I opened it. Thank you Painite Crafts!',
        verifiedPurchase: true
      }
    ],
    collectionId: 'tiny-friends'
  },
  {
    id: 'prod-strawberry-bag-charm',
    name: 'Strawberry Shortcake Bag Charm',
    slug: 'strawberry-shortcake-bag-charm',
    category: 'Charms',
    price: 289,
    originalPrice: 340,
    rating: 4.9,
    reviewsCount: 22,
    inStock: true,
    stockCount: 13,
    isFeatured: false,
    badge: 'Sweet Treats',
    shortDescription: 'Realistic miniature slice of cake with whipped clay cream and fresh berry toppings.',
    fullDescription: 'Looks delicious enough to eat! Hand-textured sponge cake layers, glossy strawberry syrup drizzle, and a micro strawberry slice on top.',
    materials: ['Liquid Clay Frosting', 'Firm Clay Sponge', 'UV High-Gloss Drizzle', 'Gold Heart Swivel Clasp'],
    dimensions: '2.9 cm × 2.4 cm (Weight: 15g)',
    handmadeDetails: 'Sponge cake texture needle-pricked by hand for realistic baked pastry effect.',
    careInstructions: 'Non-edible decorative charm. Do not consume.',
    shippingInfo: 'Ships in branded cute pink packaging.',
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80'
    ],
    reviews: [],
    collectionId: 'everyday-charms'
  },
  {
    id: 'prod-besties-avocado',
    name: 'Matching Besties Avocado Charm Set (Pack of 2)',
    slug: 'matching-besties-avocado-charm-set',
    category: 'Gift Sets',
    price: 499,
    originalPrice: 599,
    rating: 5.0,
    reviewsCount: 39,
    inStock: true,
    stockCount: 10,
    isFeatured: true,
    badge: 'Friendship Special',
    shortDescription: 'Two halves of an avocado charm — one with the seed, one with the hollow — that fit together.',
    fullDescription: 'The ultimate friendship or couple charm. Keep one half and give the other half to your favorite person in the whole world.',
    materials: ['Two-tone Green Clay', 'Caramel Seed Clay', 'Dual Gold Chains', 'Gloss Protective Finish'],
    dimensions: '2.6 cm each half',
    handmadeDetails: 'Designed to magnetically connect with hidden micro magnets.',
    careInstructions: 'Keep dry and store in the twin cotton pouch provided.',
    shippingInfo: 'Includes 2 gift cards with sweet friendship quotes.',
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
    ],
    reviews: [
      {
        id: 'rev-8',
        userName: 'Divya & Sneha',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Me and my best friend wear these on our college bags everyday. Super high quality!',
        verifiedPurchase: true
      }
    ],
    collectionId: 'gifts-heart'
  },
  {
    id: 'prod-mushroom-couple',
    name: 'Whimsical Toadstool Mushroom Couple',
    slug: 'whimsical-toadstool-mushroom-couple',
    category: 'Mini Figures',
    price: 379,
    originalPrice: 420,
    rating: 4.8,
    reviewsCount: 18,
    inStock: true,
    stockCount: 12,
    isFeatured: false,
    badge: 'Cottagecore',
    shortDescription: 'Two friendly polka-dot mushrooms leaning in for a sweet clay cuddle with moss accents.',
    fullDescription: 'Brings an enchanted forest vibe straight to your vanity. Features hand-placed white clay polka dots on dusty rose mushroom caps with preserved preserved moss base.',
    materials: ['Artisan Clay', 'Preserved Faux Moss', 'Protective Satin Finish'],
    dimensions: '4.8 cm height × 3.5 cm width',
    handmadeDetails: 'Mushroom stalks detailed with lifelike organic clay ridges.',
    careInstructions: 'Handle by the wooden base plate.',
    shippingInfo: 'Ships within 48 hours in cushioned packaging.',
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'
    ],
    reviews: [],
    collectionId: 'limited-drops'
  },
  {
    id: 'prod-custom-initial-magnet',
    name: 'Pastel Rose Floral Initial Magnet',
    slug: 'pastel-rose-floral-initial-magnet',
    category: 'Magnets',
    price: 249,
    originalPrice: 299,
    rating: 4.9,
    reviewsCount: 45,
    inStock: true,
    stockCount: 30,
    isFeatured: false,
    badge: 'Floral Studio',
    shortDescription: 'Floral initial magnet hand-sculpted in pastel blush with micro garden roses.',
    fullDescription: 'A delicate clay piece with soft petal texture, pastel color accents, and miniature rose buds.',
    materials: ['Sculpted Clay', 'Micro Flower Appliques', 'N52 Heavy Duty Magnet', 'Gloss Seal'],
    dimensions: '4.0 cm × 3.2 cm approx',
    handmadeDetails: 'Handcrafted with intricate floral details and glazed for durability.',
    careInstructions: 'Wipe clean gently.',
    shippingInfo: 'Ready-to-ship: dispatched within 24-48 business hours.',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=800&q=80'
    ],
    reviews: [],
    collectionId: 'gifts-heart'
  },
  {
    id: 'prod-clay-starter-gift-box',
    name: 'The Painite Crafts Joy Gift Box',
    slug: 'painite-crafts-joy-gift-box',
    category: 'Gift Sets',
    price: 799,
    originalPrice: 999,
    rating: 5.0,
    reviewsCount: 27,
    inStock: true,
    stockCount: 6,
    isFeatured: true,
    badge: 'Luxury Gift Set',
    shortDescription: 'Ultimate gift set containing 1 Honey Bear keychain, 1 floral magnet, 1 mystery charm, stickers & card.',
    fullDescription: 'The most delightful gift for birthdays, anniversaries, or self-care. Wrapped in signature blush paper with silk bow ribbon, wax seal, and handwritten greeting card.',
    materials: ['4x Handcrafted Clay Creations', 'Keepsake Rigid Pink Box', 'Silk Ribbon', 'Foil Greeting Card'],
    dimensions: 'Box: 16 cm × 12 cm × 6 cm',
    handmadeDetails: 'Curated and boxed by our lead studio artist with bespoke gift wrapping.',
    careInstructions: 'A complete heirloom gift ready to present.',
    shippingInfo: 'Express Studio Shipping included with gift tags.',
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
    ],
    reviews: [
      {
        id: 'rev-9',
        userName: 'Karan Joshi',
        rating: 5,
        date: '1 week ago',
        comment: 'Sent this to my long-distance girlfriend. She couldn’t stop showing it off on Instagram! Incredible presentation.',
        verifiedPurchase: true
      }
    ],
    collectionId: 'gifts-heart'
  }
];

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'tiny-friends',
    title: 'Tiny Friends',
    subtitle: 'Cute animal clay characters',
    slug: 'tiny-friends',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=700&q=80',
    description: 'Miniature bears, kittens, puppies, and whimsical creatures to keep you company.',
    tag: 'Fan Favorite',
    productIds: ['prod-cute-bear', 'prod-fluffy-puppy', 'prod-sleeping-kitty'],
    featuredColor: '#FCE7EC'
  },
  {
    id: 'everyday-charms',
    title: 'Everyday Charms',
    subtitle: 'Keychains, phone charms & bag charms',
    slug: 'everyday-charms',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=700&q=80',
    description: 'Add a touch of handcrafted sweetness to your daily keys, bags, and phone cases.',
    tag: 'Daily Joy',
    productIds: ['prod-cute-bear', 'prod-pastel-cloud-charm', 'prod-strawberry-bag-charm'],
    featuredColor: '#F9D5DF'
  },
  {
    id: 'little-homes',
    title: 'Little Homes',
    subtitle: 'Miniature clay home décor',
    slug: 'little-homes',
    image: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=700&q=80',
    description: 'Desk sculptures, ceramic-feel succulent buddies, and miniature cottage shelf art.',
    tag: 'Aesthetic Decor',
    productIds: ['prod-girl-flowers', 'prod-succulent-pot', 'prod-mushroom-couple'],
    featuredColor: '#FAF7F2'
  },
  {
    id: 'gifts-heart',
    title: 'Gifts From the Heart',
    subtitle: 'Thoughtful gift sets & bundles',
    slug: 'gifts-heart',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=700&q=80',
    description: 'Carefully wrapped bundles with ribbons, cards, and matching handmade pieces.',
    tag: 'Gift Ready',
    productIds: ['prod-besties-avocado', 'prod-clay-starter-gift-box', 'prod-enough-magnet', 'prod-custom-initial-magnet'],
    featuredColor: '#FCE7EC'
  },
  {
    id: 'limited-drops',
    title: 'Limited Clay Drops',
    subtitle: 'Seasonal & single-batch editions',
    slug: 'limited-drops',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=700&q=80',
    description: 'Rare handcrafted batches sculpted in small studio runs. Once gone, they are retired.',
    tag: 'Rare Batch',
    productIds: ['prod-mushroom-couple', 'prod-girl-flowers'],
    featuredColor: '#F5EFEB'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'CLAYLOVE10',
    discountPercent: 10,
    minOrderValue: 400,
    expiresAt: '2026-12-31',
    description: 'Get 10% off on all handcrafted clay items above ₹400',
    isActive: true
  },
  {
    code: 'WELCOMEPAINITE',
    discountAmount: 50,
    minOrderValue: 299,
    expiresAt: '2026-12-31',
    description: 'Flat ₹50 off on your first studio order',
    isActive: true
  },
  {
    code: 'PAINITE15',
    discountPercent: 15,
    minOrderValue: 799,
    expiresAt: '2026-12-31',
    description: '15% discount on orders above ₹799',
    isActive: true
  }
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Orders',
    question: 'How long does it take to prepare and ship my clay creation?',
    answer: 'All items in our retail collection are ready-to-ship and carefully packaged within 24 to 48 hours. Orders typically arrive within 3 to 5 business days depending on your delivery location.'
  },
  {
    id: 'faq-2',
    category: 'Orders',
    question: 'Are all pieces in the store unique and handmade?',
    answer: 'Yes! Every item is sculpted, hand-painted, finished through our handmade crafting process, and sealed by our studio artisans. Because each piece is handmade, slight delightful variations in color and tiny details make each clay treasure one-of-a-kind.'
  },
  {
    id: 'faq-3',
    category: 'Care & Materials',
    question: 'Are the clay pieces waterproof and durable?',
    answer: 'We use premium professional-grade handcrafted clay (sculpted for high flexibility and impact resistance) and seal every piece with water-resistant UV resin or matte polyurethane. While water splashes and light rain are completely fine, we recommend avoiding prolonged swimming or soaking to preserve delicate hardware.'
  },
  {
    id: 'faq-4',
    category: 'Shipping',
    question: 'Do you ship all across India and how is it packaged?',
    answer: 'Yes, we ship to all PIN codes in India via express courier partners (Delhivery, BlueDart, Bluedart, IndiaPost). Every order is bubble-wrapped and nestled in soft pink tissue paper inside a rigid keepsake gift box with fragile labels.'
  },
  {
    id: 'faq-5',
    category: 'Payments',
    question: 'What payment methods do you accept?',
    answer: 'We support all major Indian payment methods including UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking across 50+ banks, and Cash on Delivery (COD) for eligible pincodes.'
  },
  {
    id: 'faq-6',
    category: 'Care & Materials',
    question: 'How do I clean and care for my clay trinkets?',
    answer: 'Simply wipe gently with a dry microfiber cloth or a slightly damp cotton swab. Keep away from harsh alcohol, acetone, or excessive direct sunlight for prolonged durations.'
  },
  {
    id: 'faq-7',
    category: 'Returns & Refunds',
    question: 'What is your Return & Refund Policy?',
    answer: 'Returns and refunds are accepted ONLY for damaged, defective, or incorrect items. A continuous, unedited unboxing video recorded from before opening the parcel throughout the unpacking process is mandatory. Without an unboxing video, no return or refund can be processed. Please contact us within 48 hours of delivery with your video and photos.'
  },
  {
    id: 'faq-8',
    category: 'Returns & Refunds',
    question: 'Why is a continuous unboxing video mandatory?',
    answer: 'Because our creations are fragile handcrafted clay art, a continuous unedited video (starting prior to breaking the outer seal and showing the full inspection) is the only proof accepted by our studio & courier insurance to verify transit breakage or packed errors. No unboxing video = no return or refund.'
  },
  {
    id: 'faq-9',
    category: 'Returns & Refunds',
    question: 'Can I return an item if I change my mind or dislike the handmade variations?',
    answer: 'Returns are not accepted for change of mind, wrong color/design choice, or minor handmade variations. Subtle variations in texture and shade are natural in handmade clay art. Custom and personalized creations are strictly non-refundable unless they arrive damaged or incorrect.'
  },
  {
    id: 'faq-10',
    category: 'Returns & Refunds',
    question: 'How and when are approved refunds issued?',
    answer: 'Once your unboxing video and claim are approved by our artisan desk, refunds are processed back directly to your original payment method (Razorpay / UPI / Card / Bank account) within 3 to 5 business days.'
  }
];

export const DEFAULT_USER: UserProfile = {
  id: 'usr-101',
  name: 'Ananya Sharma',
  email: 'ananya.claylover@example.com',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  phone: '+91 98765 43210',
  isAdmin: true,
  createdAt: '2026-01-15',
  addresses: [
    {
      id: 'addr-1',
      fullName: 'Ananya Sharma',
      phone: '+91 98765 43210',
      addressLine: '100 Feet Road, HAL 2nd Stage, Indiranagar',
      apartment: 'Flat 402, 4th Floor, Tower B, Rosewood Blossom Apartments',
      landmark: 'Near BDA Complex & Starbucks',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      deliveryNotes: 'Please ring the doorbell. Fragile clay gift pack.',
      isDefault: true
    }
  ]
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-8495',
    orderNumber: 'PC-2026-8495',
    date: '2026-08-29',
    time: '11:45 AM',
    createdAt: '2026-08-29T11:45:00.000Z',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1
      },
      {
        product: INITIAL_PRODUCTS[2],
        quantity: 1
      }
    ],
    subtotal: 548,
    discount: 50,
    couponCode: 'CLAYLOVE10',
    shippingFee: 0,
    totalAmount: 498,
    customer: {
      fullName: 'Pooja Hegde',
      email: 'pooja.hegde@example.com',
      phone: '+91 97412 88391',
      apartment: 'Villa 12, Whispering Palms',
      address: 'Sarjapur Main Road',
      landmark: 'Near Wipro Corporate Office',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560035',
      deliveryNotes: 'Please ring bell upon arrival.'
    },
    shippingMethod: 'Express Studio Delivery',
    courierName: 'Delhivery Air Express',
    trackingNumber: 'DLH982349910IN',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    razorpayOrderId: 'order_Owe9284j1la8',
    razorpayPaymentId: 'pay_P92837482910',
    status: 'Order Placed',
    trackingSteps: [
      { title: 'Order Placed', description: 'Received in studio queue', date: 'Aug 29, 11:45 AM', completed: true, current: true },
      { title: 'Order Confirmed', description: 'Artisan assigned & materials prepped', completed: false, current: false },
      { title: 'Crafting Your Piece', description: 'Sculpting at studio workbench', completed: false, current: false },
      { title: 'Quality Check', description: 'Handmade detailing & strength testing', completed: false, current: false },
      { title: 'Packed with Love', description: 'Pink gift wrapping & ribbon sealed', completed: false, current: false },
      { title: 'Shipped', description: 'Dispatched with tracking ID', completed: false, current: false },
      { title: 'Delivered', description: 'Delivered to your doorstep', completed: false, current: false }
    ]
  },
  {
    id: 'ord-8492',
    orderNumber: 'PC-2026-8492',
    date: '2026-08-25',
    time: '09:30 AM',
    createdAt: '2026-08-25T09:30:00.000Z',
    items: [
      {
        product: INITIAL_PRODUCTS[1],
        quantity: 2
      },
      {
        product: INITIAL_PRODUCTS[2],
        quantity: 1
      }
    ],
    subtotal: 797,
    discount: 0,
    shippingFee: 0,
    totalAmount: 797,
    customer: {
      fullName: 'Rhea Sengupta',
      email: 'rhea.sengupta@gmail.com',
      phone: '+91 98301 22456',
      apartment: 'House No. 14/B, 2nd Floor, Magnolia Enclave',
      address: 'Lane 4, Gariahat Road, Ballygunge',
      landmark: 'Opposite South Point High School',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700019',
      deliveryNotes: 'Call before delivery. Birthday gift for bestie.'
    },
    shippingMethod: 'Express Studio Delivery',
    courierName: 'Blue Dart Air Express',
    trackingNumber: 'BLUD77281920IN',
    paymentMethod: 'Credit/Debit Card',
    paymentStatus: 'Paid',
    razorpayOrderId: 'order_Kla983419082',
    razorpayPaymentId: 'pay_M82710394819',
    status: 'Packed with Love',
    trackingSteps: [
      { title: 'Order Placed', description: 'Received in studio queue', date: 'Aug 25, 09:30 AM', completed: true, current: false },
      { title: 'Order Confirmed', description: 'Artisan assigned & materials prepped', date: 'Aug 25, 10:15 AM', completed: true, current: false },
      { title: 'Crafting Your Piece', description: 'Sculpted with pastel pigments', date: 'Aug 26, 01:00 PM', completed: true, current: false },
      { title: 'Quality Check', description: 'Handmade detailing & resin seal inspected', date: 'Aug 26, 04:30 PM', completed: true, current: false },
      { title: 'Packed with Love', description: 'Double boxed with pink tissue & ribbon', date: 'Aug 27, 09:00 AM', completed: false, current: true },
      { title: 'Shipped', description: 'Dispatched with tracking ID', completed: false, current: false },
      { title: 'Delivered', description: 'Delivered to your doorstep', completed: false, current: false }
    ]
  },
  {
    id: 'ord-8491',
    orderNumber: 'PC-2026-8491',
    date: '2026-08-20',
    time: '10:15 AM',
    createdAt: '2026-08-20T10:15:00.000Z',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1
      },
      {
        product: INITIAL_PRODUCTS[4],
        quantity: 1
      }
    ],
    subtotal: 498,
    discount: 50,
    couponCode: 'WELCOMEPAINITE',
    shippingFee: 0,
    totalAmount: 448,
    customer: {
      fullName: 'Ananya Sharma',
      email: 'ananya.claylover@example.com',
      phone: '+91 98765 43210',
      apartment: 'Flat 402, 4th Floor, Tower B, Rosewood Blossom Apartments',
      address: '100 Feet Road, HAL 2nd Stage, Indiranagar',
      landmark: 'Near BDA Complex & Starbucks',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      deliveryNotes: 'Please handle with care. Fragile handcrafted piece ♥'
    },
    shippingMethod: 'Standard Craft Shipping',
    courierName: 'Delhivery Surface Express',
    trackingNumber: 'DLH982341209IN',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    razorpayOrderId: 'order_Owe9284j1la8',
    razorpayPaymentId: 'pay_P92837482910',
    status: 'Crafting Your Piece',
    trackingSteps: [
      { title: 'Order Placed', description: 'Received in studio queue', date: 'Aug 20, 10:15 AM', completed: true, current: false },
      { title: 'Order Confirmed', description: 'Artisan assigned & materials prepped', date: 'Aug 20, 11:30 AM', completed: true, current: false },
      { title: 'Crafting Your Piece', description: 'Sculpting in progress at workbench', date: 'Aug 21, 02:00 PM', completed: false, current: true },
      { title: 'Quality Check', description: 'Handmade detailing & strength testing', completed: false, current: false },
      { title: 'Packed with Love', description: 'Pink gift wrapping & ribbon sealed', completed: false, current: false },
      { title: 'Shipped', description: 'Dispatched with tracking ID', completed: false, current: false },
      { title: 'Delivered', description: 'Delivered to your doorstep', completed: false, current: false }
    ]
  },
  {
    id: 'ord-8400',
    orderNumber: 'PC-2026-8400',
    date: '2026-07-15',
    time: '04:15 PM',
    createdAt: '2026-07-15T16:15:00.000Z',
    items: [
      {
        product: INITIAL_PRODUCTS[3],
        quantity: 1
      }
    ],
    subtotal: 399,
    discount: 0,
    shippingFee: 0,
    totalAmount: 399,
    customer: {
      fullName: 'Kavita Nair',
      email: 'kavita.nair@example.com',
      phone: '+91 98450 11928',
      apartment: 'Apt 104, Palm Meadows',
      address: 'Airport Road',
      landmark: 'Near Leela Palace',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560008',
      deliveryNotes: 'Delivered successfully.'
    },
    shippingMethod: 'Standard Craft Shipping',
    courierName: 'Delhivery Surface Express',
    trackingNumber: 'DLH771290382IN',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Delivered',
    trackingSteps: [
      { title: 'Order Placed', description: 'Received in studio queue', date: 'Jul 15, 04:15 PM', completed: true, current: false },
      { title: 'Order Confirmed', description: 'Artisan assigned & materials prepped', date: 'Jul 15, 05:00 PM', completed: true, current: false },
      { title: 'Crafting Your Piece', description: 'Sculpted at studio workbench', date: 'Jul 16, 11:00 AM', completed: true, current: false },
      { title: 'Quality Check', description: 'Handmade quality inspection passed', date: 'Jul 16, 03:30 PM', completed: true, current: false },
      { title: 'Packed with Love', description: 'Gift boxed', date: 'Jul 17, 10:00 AM', completed: true, current: false },
      { title: 'Shipped', description: 'Dispatched with tracking ID', date: 'Jul 17, 02:00 PM', completed: true, current: false },
      { title: 'Delivered', description: 'Delivered to doorstep', date: 'Jul 19, 11:30 AM', completed: true, current: false }
    ]
  }
];
