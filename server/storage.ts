import {
  users,
  categories,
  products,
  orders,
  orderItems,
  reviews,
  cartItems,
  wishlistItems,
  siteSettings,
  sliders,
  coupons,
  couponUsage,
  paymentSettings,
  analyticsEvents,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Review,
  type InsertReview,
  type CartItem,
  type InsertCartItem,
  type WishlistItem,
  type InsertWishlistItem,
  type SiteSetting,
  type InsertSiteSetting,
  type Slider,
  type InsertSlider,
  type Coupon,
  type InsertCoupon,
  type CouponUsage,
  type InsertCouponUsage,
  type PaymentSetting,
  type InsertPaymentSetting,
  type AnalyticsEvent,
  type InsertAnalyticsEvent,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, like, and, or, sql, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: Partial<UpsertUser>): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;

  // Product operations
  getAllProducts(filters?: {
    categoryId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    isOnSale?: boolean;
    isFeatured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ products: Product[]; total: number }>;
  getProductById(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  getSaleProducts(limit?: number): Promise<Product[]>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: string): Promise<Order | undefined>;
  getOrdersByUserId(userId: string): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  updateOrderStatus(id: string, status: string): Promise<Order>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;

  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getProductReviews(productId: string): Promise<Review[]>;
  updateProductRating(productId: string): Promise<void>;

  // Cart operations
  getCartItems(userId: string): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem>;
  removeFromCart(id: string): Promise<void>;
  clearCart(userId: string): Promise<void>;

  // Wishlist operations
  getWishlistItems(userId: string): Promise<WishlistItem[]>;
  addToWishlist(wishlistItem: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(id: string): Promise<void>;

  // Admin: Site Settings operations
  getSiteSettings(category?: string): Promise<SiteSetting[]>;
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  upsertSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting>;
  deleteSiteSetting(id: string): Promise<void>;

  // Admin: Slider/Banner operations
  getAllSliders(type?: string, placement?: string): Promise<Slider[]>;
  getSliderById(id: string): Promise<Slider | undefined>;
  createSlider(slider: InsertSlider): Promise<Slider>;
  updateSlider(id: string, slider: Partial<InsertSlider>): Promise<Slider>;
  deleteSlider(id: string): Promise<void>;
  getActiveSliders(placement?: string): Promise<Slider[]>;

  // Admin: Coupon operations
  getAllCoupons(): Promise<Coupon[]>;
  getCouponById(id: string): Promise<Coupon | undefined>;
  getCouponByCode(code: string): Promise<Coupon | undefined>;
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  updateCoupon(id: string, coupon: Partial<InsertCoupon>): Promise<Coupon>;
  deleteCoupon(id: string): Promise<void>;
  validateCoupon(code: string, userId?: string, orderAmount?: number): Promise<{ valid: boolean; coupon?: Coupon; message?: string }>;
  applyCoupon(couponId: string, userId: string, orderId: string, discountAmount: number): Promise<CouponUsage>;

  // Admin: Payment Settings operations
  getAllPaymentSettings(): Promise<PaymentSetting[]>;
  getPaymentSettingById(id: string): Promise<PaymentSetting | undefined>;
  getActivePaymentSettings(): Promise<PaymentSetting[]>;
  createPaymentSetting(setting: InsertPaymentSetting): Promise<PaymentSetting>;
  updatePaymentSetting(id: string, setting: Partial<InsertPaymentSetting>): Promise<PaymentSetting>;
  deletePaymentSetting(id: string): Promise<void>;

  // Admin: Analytics operations
  recordAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
  getAnalyticsEvents(filters?: {
    eventType?: string;
    userId?: string;
    productId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<AnalyticsEvent[]>;
  getAnalyticsSummary(startDate?: Date, endDate?: Date): Promise<{
    totalPageViews: number;
    totalProductViews: number;
    totalPurchases: number;
    totalRevenue: number;
    topProducts: Array<{ productId: string; views: number; purchases: number }>;
    topPages: Array<{ page: string; views: number }>;
  }>;

  // Admin: Customer management
  getAllCustomers(filters?: {
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ customers: User[]; total: number }>;
  getCustomerAnalytics(userId: string): Promise<{
    totalOrders: number;
    totalSpent: number;
    lastOrderDate?: Date;
    favoriteCategories: Array<{ categoryId: string; orderCount: number }>;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData as UpsertUser)
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(asc(categories.name));
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db
      .select()
      .from(categories)
      .where(and(eq(categories.slug, slug), eq(categories.isActive, true)));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category> {
    const [updatedCategory] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<void> {
    await db.update(categories).set({ isActive: false }).where(eq(categories.id, id));
  }

  // Product operations
  async getAllProducts(filters?: {
    categoryId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    isOnSale?: boolean;
    isFeatured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ products: Product[]; total: number }> {
    const conditions = [eq(products.isActive, true)];

    if (filters?.categoryId) {
      conditions.push(eq(products.categoryId, filters.categoryId));
    }

    if (filters?.search) {
      conditions.push(
        or(
          like(products.name, `%${filters.search}%`),
          like(products.description, `%${filters.search}%`)
        )!
      );
    }

    if (filters?.minPrice !== undefined) {
      conditions.push(sql`${products.price} >= ${filters.minPrice}`);
    }

    if (filters?.maxPrice !== undefined) {
      conditions.push(sql`${products.price} <= ${filters.maxPrice}`);
    }

    if (filters?.isOnSale) {
      conditions.push(eq(products.isOnSale, true));
    }

    if (filters?.isFeatured) {
      conditions.push(eq(products.isFeatured, true));
    }

    const whereClause = and(...conditions);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(whereClause);

    const productList = await db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(desc(products.createdAt))
      .limit(filters?.limit || 20)
      .offset(filters?.offset || 0);

    return {
      products: productList,
      total: count,
    };
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const [product] = await db
      .select()
      .from(products)
      .where(and(eq(products.id, id), eq(products.isActive, true)));
    return product;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db
      .select()
      .from(products)
      .where(and(eq(products.slug, slug), eq(products.isActive, true)));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.update(products).set({ isActive: false }).where(eq(products.id, id));
  }

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(and(eq(products.isFeatured, true), eq(products.isActive, true)))
      .orderBy(desc(products.createdAt))
      .limit(limit);
  }

  async getSaleProducts(limit = 8): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(and(eq(products.isOnSale, true), eq(products.isActive, true)))
      .orderBy(desc(products.createdAt))
      .limit(limit);
  }

  // Order operations
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async getAllOrders(): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const [newOrderItem] = await db.insert(orderItems).values(orderItem).returning();
    return newOrderItem;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));
  }

  // Review operations
  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    await this.updateProductRating(review.productId);
    return newReview;
  }

  async getProductReviews(productId: string): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt));
  }

  async updateProductRating(productId: string): Promise<void> {
    const reviewStats = await db
      .select({
        avgRating: sql<number>`avg(${reviews.rating})`,
        count: sql<number>`count(*)`,
      })
      .from(reviews)
      .where(eq(reviews.productId, productId));

    const { avgRating, count } = reviewStats[0];

    await db
      .update(products)
      .set({
        rating: avgRating?.toString() || "0",
        reviewCount: count,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));
  }

  // Cart operations
  async getCartItems(userId: string): Promise<CartItem[]> {
    return await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.userId, userId))
      .orderBy(desc(cartItems.createdAt));
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists with same product, size, color
    const [existingItem] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, cartItem.userId),
          eq(cartItems.productId, cartItem.productId),
          cartItem.size ? eq(cartItems.size, cartItem.size) : sql`${cartItems.size} IS NULL`,
          cartItem.color ? eq(cartItems.color, cartItem.color) : sql`${cartItems.color} IS NULL`
        )
      );

    if (existingItem) {
      // Update quantity
      const [updatedItem] = await db
        .update(cartItems)
        .set({
          quantity: existingItem.quantity + cartItem.quantity,
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updatedItem;
    }

    // Create new cart item
    const [newCartItem] = await db.insert(cartItems).values(cartItem).returning();
    return newCartItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem> {
    const [updatedItem] = await db
      .update(cartItems)
      .set({ quantity, updatedAt: new Date() })
      .where(eq(cartItems.id, id))
      .returning();
    return updatedItem;
  }

  async removeFromCart(id: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(userId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  // Wishlist operations
  async getWishlistItems(userId: string): Promise<WishlistItem[]> {
    return await db
      .select()
      .from(wishlistItems)
      .where(eq(wishlistItems.userId, userId))
      .orderBy(desc(wishlistItems.createdAt));
  }

  async addToWishlist(wishlistItem: InsertWishlistItem): Promise<WishlistItem> {
    const [newWishlistItem] = await db
      .insert(wishlistItems)
      .values(wishlistItem)
      .returning();
    return newWishlistItem;
  }

  async removeFromWishlist(id: string): Promise<void> {
    await db.delete(wishlistItems).where(eq(wishlistItems.id, id));
  }

  // Admin: Site Settings operations
  async getSiteSettings(category?: string): Promise<SiteSetting[]> {
    const conditions = [eq(siteSettings.isActive, true)];
    if (category) {
      conditions.push(eq(siteSettings.category, category));
    }
    return await db
      .select()
      .from(siteSettings)
      .where(and(...conditions))
      .orderBy(asc(siteSettings.key));
  }

  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db
      .select()
      .from(siteSettings)
      .where(and(eq(siteSettings.key, key), eq(siteSettings.isActive, true)));
    return setting;
  }

  async upsertSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    const [upsertedSetting] = await db
      .insert(siteSettings)
      .values(setting)
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: {
          ...setting,
          updatedAt: new Date(),
        },
      })
      .returning();
    return upsertedSetting;
  }

  async deleteSiteSetting(id: string): Promise<void> {
    await db.delete(siteSettings).where(eq(siteSettings.id, id));
  }

  // Admin: Slider/Banner operations
  async getAllSliders(type?: string, placement?: string): Promise<Slider[]> {
    const conditions = [];
    if (type) conditions.push(eq(sliders.type, type));
    if (placement) conditions.push(eq(sliders.placement, placement));
    
    if (conditions.length > 0) {
      return await db
        .select()
        .from(sliders)
        .where(and(...conditions))
        .orderBy(asc(sliders.position), desc(sliders.createdAt));
    }
    return await db
      .select()
      .from(sliders)
      .orderBy(asc(sliders.position), desc(sliders.createdAt));
  }

  async getSliderById(id: string): Promise<Slider | undefined> {
    const [slider] = await db.select().from(sliders).where(eq(sliders.id, id));
    return slider;
  }

  async createSlider(slider: InsertSlider): Promise<Slider> {
    const [newSlider] = await db.insert(sliders).values(slider).returning();
    return newSlider;
  }

  async updateSlider(id: string, slider: Partial<InsertSlider>): Promise<Slider> {
    const [updatedSlider] = await db
      .update(sliders)
      .set({ ...slider, updatedAt: new Date() })
      .where(eq(sliders.id, id))
      .returning();
    return updatedSlider;
  }

  async deleteSlider(id: string): Promise<void> {
    await db.delete(sliders).where(eq(sliders.id, id));
  }

  async getActiveSliders(placement?: string): Promise<Slider[]> {
    const now = new Date().toISOString();
    const conditions = [
      eq(sliders.isActive, true),
      or(sql`${sliders.startDate} IS NULL`, sql`${sliders.startDate} <= ${now}`),
      or(sql`${sliders.endDate} IS NULL`, sql`${sliders.endDate} >= ${now}`)
    ];
    if (placement) {
      conditions.push(eq(sliders.placement, placement));
    }
    return await db
      .select()
      .from(sliders)
      .where(and(...conditions))
      .orderBy(asc(sliders.position));
  }

  // Admin: Coupon operations
  async getAllCoupons(): Promise<Coupon[]> {
    return await db
      .select()
      .from(coupons)
      .orderBy(desc(coupons.createdAt));
  }

  async getCouponById(id: string): Promise<Coupon | undefined> {
    const [coupon] = await db.select().from(coupons).where(eq(coupons.id, id));
    return coupon;
  }

  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    const [coupon] = await db
      .select()
      .from(coupons)
      .where(and(eq(coupons.code, code), eq(coupons.isActive, true)));
    return coupon;
  }

  async createCoupon(coupon: InsertCoupon): Promise<Coupon> {
    const [newCoupon] = await db.insert(coupons).values(coupon).returning();
    return newCoupon;
  }

  async updateCoupon(id: string, coupon: Partial<InsertCoupon>): Promise<Coupon> {
    const [updatedCoupon] = await db
      .update(coupons)
      .set({ ...coupon, updatedAt: new Date() })
      .where(eq(coupons.id, id))
      .returning();
    return updatedCoupon;
  }

  async deleteCoupon(id: string): Promise<void> {
    await db.delete(coupons).where(eq(coupons.id, id));
  }

  async validateCoupon(code: string, userId?: string, orderAmount?: number): Promise<{ valid: boolean; coupon?: Coupon; message?: string }> {
    const coupon = await this.getCouponByCode(code);
    
    if (!coupon) {
      return { valid: false, message: "Coupon code not found" };
    }

    const now = new Date();
    
    // Check if coupon is active
    if (!coupon.isActive) {
      return { valid: false, message: "Coupon is no longer active" };
    }

    // Check date validity
    if (coupon.startDate && coupon.startDate > now) {
      return { valid: false, message: "Coupon is not yet valid" };
    }
    
    if (coupon.endDate && coupon.endDate < now) {
      return { valid: false, message: "Coupon has expired" };
    }

    // Check usage limits
    if (coupon.usageLimit && (coupon.usageCount || 0) >= coupon.usageLimit) {
      return { valid: false, message: "Coupon usage limit exceeded" };
    }

    // Check minimum amount
    if (coupon.minimumAmount && orderAmount && orderAmount < Number(coupon.minimumAmount)) {
      return { valid: false, message: `Minimum order amount of $${coupon.minimumAmount} required` };
    }

    // Check user usage limit
    if (userId && coupon.userLimit) {
      const userUsageCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(couponUsage)
        .where(and(eq(couponUsage.couponId, coupon.id), eq(couponUsage.userId, userId)));
      
      if (userUsageCount[0].count >= coupon.userLimit) {
        return { valid: false, message: "You have already used this coupon" };
      }
    }

    return { valid: true, coupon };
  }

  async applyCoupon(couponId: string, userId: string, orderId: string, discountAmount: number): Promise<CouponUsage> {
    // Create usage record
    const [usage] = await db
      .insert(couponUsage)
      .values({
        couponId,
        userId,
        orderId,
        discountAmount: discountAmount.toString(),
      })
      .returning();

    // Update coupon usage count
    await db
      .update(coupons)
      .set({
        usageCount: sql`${coupons.usageCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(coupons.id, couponId));

    return usage;
  }

  // Admin: Payment Settings operations
  async getAllPaymentSettings(): Promise<PaymentSetting[]> {
    return await db
      .select()
      .from(paymentSettings)
      .orderBy(asc(paymentSettings.displayName));
  }

  async getPaymentSettingById(id: string): Promise<PaymentSetting | undefined> {
    const [setting] = await db
      .select()
      .from(paymentSettings)
      .where(eq(paymentSettings.id, id));
    return setting;
  }

  async getActivePaymentSettings(): Promise<PaymentSetting[]> {
    return await db
      .select()
      .from(paymentSettings)
      .where(eq(paymentSettings.isActive, true))
      .orderBy(asc(paymentSettings.displayName));
  }

  async createPaymentSetting(setting: InsertPaymentSetting): Promise<PaymentSetting> {
    const [newSetting] = await db
      .insert(paymentSettings)
      .values(setting)
      .returning();
    return newSetting;
  }

  async updatePaymentSetting(id: string, setting: Partial<InsertPaymentSetting>): Promise<PaymentSetting> {
    const [updatedSetting] = await db
      .update(paymentSettings)
      .set({ ...setting, updatedAt: new Date() })
      .where(eq(paymentSettings.id, id))
      .returning();
    return updatedSetting;
  }

  async deletePaymentSetting(id: string): Promise<void> {
    await db.delete(paymentSettings).where(eq(paymentSettings.id, id));
  }

  // Admin: Analytics operations
  async recordAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const [newEvent] = await db
      .insert(analyticsEvents)
      .values(event)
      .returning();
    return newEvent;
  }

  async getAnalyticsEvents(filters?: {
    eventType?: string;
    userId?: string;
    productId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<AnalyticsEvent[]> {
    const conditions = [];

    if (filters?.eventType) conditions.push(eq(analyticsEvents.eventType, filters.eventType));
    if (filters?.userId) conditions.push(eq(analyticsEvents.userId, filters.userId));
    if (filters?.productId) conditions.push(eq(analyticsEvents.productId, filters.productId));
    if (filters?.startDate) conditions.push(sql`${analyticsEvents.createdAt} >= ${filters.startDate}`);
    if (filters?.endDate) conditions.push(sql`${analyticsEvents.createdAt} <= ${filters.endDate}`);

    if (conditions.length > 0) {
      let query = db.select().from(analyticsEvents).where(and(...conditions));
      query = query.orderBy(desc(analyticsEvents.createdAt));
      if (filters?.limit) query = query.limit(filters.limit);
      if (filters?.offset) query = query.offset(filters.offset);
      return await query;
    } else {
      let query = db.select().from(analyticsEvents);
      query = query.orderBy(desc(analyticsEvents.createdAt));
      if (filters?.limit) query = query.limit(filters.limit);
      if (filters?.offset) query = query.offset(filters.offset);
      return await query;
    }
  }

  async getAnalyticsSummary(startDate?: Date, endDate?: Date): Promise<{
    totalPageViews: number;
    totalProductViews: number;
    totalPurchases: number;
    totalRevenue: number;
    topProducts: Array<{ productId: string; views: number; purchases: number }>;
    topPages: Array<{ page: string; views: number }>;
  }> {
    const conditions = [];
    if (startDate) conditions.push(sql`${analyticsEvents.createdAt} >= ${startDate}`);
    if (endDate) conditions.push(sql`${analyticsEvents.createdAt} <= ${endDate}`);

    const baseCondition = conditions.length > 0 ? and(...conditions) : sql`1=1`;

    // Get basic counts
    const [pageViews] = await db
      .select({ count: sql<number>`count(*)` })
      .from(analyticsEvents)
      .where(baseCondition ? and(eq(analyticsEvents.eventType, 'page_view'), baseCondition) : eq(analyticsEvents.eventType, 'page_view'));

    const [productViews] = await db
      .select({ count: sql<number>`count(*)` })
      .from(analyticsEvents)
      .where(baseCondition ? and(eq(analyticsEvents.eventType, 'product_view'), baseCondition) : eq(analyticsEvents.eventType, 'product_view'));

    const [purchases] = await db
      .select({ count: sql<number>`count(*)`, revenue: sql<number>`sum(${analyticsEvents.value})` })
      .from(analyticsEvents)
      .where(baseCondition ? and(eq(analyticsEvents.eventType, 'purchase'), baseCondition) : eq(analyticsEvents.eventType, 'purchase'));

    // Get top products
    const topProducts = await db
      .select({
        productId: analyticsEvents.productId,
        views: sql<number>`count(case when ${analyticsEvents.eventType} = 'product_view' then 1 end)`,
        purchases: sql<number>`count(case when ${analyticsEvents.eventType} = 'purchase' then 1 end)`,
      })
      .from(analyticsEvents)
      .where(baseCondition ? and(sql`${analyticsEvents.productId} IS NOT NULL`, baseCondition) : sql`${analyticsEvents.productId} IS NOT NULL`)
      .groupBy(analyticsEvents.productId)
      .orderBy(desc(sql`count(case when ${analyticsEvents.eventType} = 'product_view' then 1 end)`))
      .limit(10);

    // Get top pages (simplified - would need metadata parsing in real implementation)
    const topPages = await db
      .select({
        page: sql<string>`coalesce((${analyticsEvents.metadata}->>'page'), 'unknown')`,
        views: sql<number>`count(*)`,
      })
      .from(analyticsEvents)
      .where(baseCondition ? and(eq(analyticsEvents.eventType, 'page_view'), baseCondition) : eq(analyticsEvents.eventType, 'page_view'))
      .groupBy(sql`coalesce((${analyticsEvents.metadata}->>'page'), 'unknown')`)
      .orderBy(desc(sql`count(*)`))
      .limit(10);

    return {
      totalPageViews: pageViews.count,
      totalProductViews: productViews.count,
      totalPurchases: purchases.count,
      totalRevenue: purchases.revenue || 0,
      topProducts: topProducts.filter(p => p.productId) as Array<{ productId: string; views: number; purchases: number }>,
      topPages,
    };
  }

  // Admin: Customer management
  async getAllCustomers(filters?: {
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ customers: User[]; total: number }> {
    const conditions = [eq(users.isAdmin, false)];
    
    if (filters?.search) {
      conditions.push(
        or(
          like(users.email, `%${filters.search}%`),
          like(users.firstName, `%${filters.search}%`),
          like(users.lastName, `%${filters.search}%`)
        )
      );
    }

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(and(...conditions));
    
    let query = db.select().from(users).where(and(...conditions)).orderBy(desc(users.createdAt));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }

    const customers = await query;

    return { customers, total: count };
  }

  async getCustomerAnalytics(userId: string): Promise<{
    totalOrders: number;
    totalSpent: number;
    lastOrderDate?: Date;
    favoriteCategories: Array<{ categoryId: string; orderCount: number }>;
  }> {
    // Get order statistics
    const [orderStats] = await db
      .select({
        totalOrders: sql<number>`count(*)`,
        totalSpent: sql<number>`sum(${orders.totalAmount})`,
        lastOrderDate: sql<Date>`max(${orders.createdAt})`,
      })
      .from(orders)
      .where(eq(orders.userId, userId));

    // Get favorite categories
    const favoriteCategories = await db
      .select({
        categoryId: products.categoryId,
        orderCount: sql<number>`count(distinct ${orders.id})`,
      })
      .from(orders)
      .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orders.userId, userId))
      .groupBy(products.categoryId)
      .orderBy(desc(sql`count(distinct ${orders.id})`))
      .limit(5);

    return {
      totalOrders: orderStats.totalOrders || 0,
      totalSpent: orderStats.totalSpent || 0,
      lastOrderDate: orderStats.lastOrderDate || undefined,
      favoriteCategories,
    };
  }
}

export const storage = new DatabaseStorage();
