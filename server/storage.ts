import {
  users,
  categories,
  products,
  orders,
  orderItems,
  reviews,
  cartItems,
  wishlistItems,
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
}

export const storage = new DatabaseStorage();
