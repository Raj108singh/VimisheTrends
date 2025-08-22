import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertProductSchema,
  insertCategorySchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertReviewSchema,
  insertCartItemSchema,
  insertWishlistItemSchema,
  insertSiteSettingSchema,
  insertSliderSchema,
  insertCouponSchema,
  insertPaymentSettingSchema,
  insertAnalyticsEventSchema,
} from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import passport from "passport";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Email/Password Authentication Routes
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        authProvider: "email",
      });

      // Set session
      req.login({ id: user.id, email: user.email }, (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.status(500).json({ message: "Failed to login after registration" });
        }
        res.status(201).json({ message: "User registered successfully", user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, isAdmin: user.isAdmin } });
      });
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      // Get user by email
      const user = await storage.getUserByEmail(email);
      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Set session
      req.login({ id: user.id, email: user.email }, (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.status(500).json({ message: "Failed to login" });
        }
        res.json({ message: "Login successful", user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, isAdmin: user.isAdmin } });
      });
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to login" });
    }
  });

  app.post("/api/auth/admin-login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      // Get user by email
      const user = await storage.getUserByEmail(email);
      if (!user || !user.password || !user.isAdmin) {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }

      // Set session
      req.login({ id: user.id, email: user.email, isAdmin: true }, (err) => {
        if (err) {
          console.error("Admin login error:", err);
          return res.status(500).json({ message: "Failed to login" });
        }
        res.json({ message: "Admin login successful", user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, isAdmin: user.isAdmin } });
      });
    } catch (error) {
      console.error("Admin login error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to login" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Modified auth user route to work with both OAuth and email/password
  app.get("/api/auth/user", async (req: any, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      let userId;
      if (req.user.claims) {
        // OAuth user
        userId = req.user.claims.sub;
      } else {
        // Email/password user
        userId = req.user.id;
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  app.post("/api/categories", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const {
        categoryId,
        search,
        minPrice,
        maxPrice,
        isOnSale,
        isFeatured,
        limit = "20",
        page = "1",
      } = req.query;

      const limitNum = parseInt(limit as string);
      const pageNum = parseInt(page as string);
      const offset = (pageNum - 1) * limitNum;

      const filters = {
        categoryId: categoryId as string,
        search: search as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        isOnSale: isOnSale === "true",
        isFeatured: isFeatured === "true",
        limit: limitNum,
        offset,
      };

      const result = await storage.getAllProducts(filters);
      res.json({
        products: result.products,
        total: result.total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(result.total / limitNum),
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 8;
      const products = await storage.getFeaturedProducts(limit);
      res.json(products);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/sale", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 8;
      const products = await storage.getSaleProducts(limit);
      res.json(products);
    } catch (error) {
      console.error("Error fetching sale products:", error);
      res.status(500).json({ message: "Failed to fetch sale products" });
    }
  });

  app.get("/api/products/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, productData);
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  // Simple authentication middleware for cart operations
  const requireAuth = async (req: any, res: any, next: any) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      next();
    } catch (error) {
      console.error("Auth check error:", error);
      res.status(401).json({ message: "Unauthorized" });
    }
  };

  // Cart routes
  app.get("/api/cart", requireAuth, async (req: any, res) => {
    try {
      // Handle both OAuth and email/password users
      const userId = req.user.claims ? req.user.claims.sub : req.user.id;
      const cartItems = await storage.getCartItems(userId);
      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims ? req.user.claims.sub : req.user.id;
      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        userId,
      });
      const cartItem = await storage.addToCart(cartItemData);
      res.status(201).json(cartItem);
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.put("/api/cart/:id", requireAuth, async (req: any, res) => {
    try {
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItem(req.params.id, quantity);
      res.json(cartItem);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", requireAuth, async (req: any, res) => {
    try {
      await storage.removeFromCart(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  app.delete("/api/cart", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims ? req.user.claims.sub : req.user.id;
      await storage.clearCart(userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Wishlist routes
  app.get("/api/wishlist", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims ? req.user.claims.sub : req.user.id;
      const wishlistItems = await storage.getWishlistItems(userId);
      res.json(wishlistItems);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      res.status(500).json({ message: "Failed to fetch wishlist" });
    }
  });

  app.post("/api/wishlist", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims ? req.user.claims.sub : req.user.id;
      const wishlistItemData = insertWishlistItemSchema.parse({
        ...req.body,
        userId,
      });
      const wishlistItem = await storage.addToWishlist(wishlistItemData);
      res.status(201).json(wishlistItem);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      res.status(500).json({ message: "Failed to add to wishlist" });
    }
  });

  app.delete("/api/wishlist/:id", requireAuth, async (req: any, res) => {
    try {
      await storage.removeFromWishlist(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      res.status(500).json({ message: "Failed to remove from wishlist" });
    }
  });

  // Orders routes
  app.get("/api/orders", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims ? req.user.claims.sub : req.user.id;
      
      // If admin, get all orders; otherwise get user's orders
      let orders;
      if (req.user.isAdmin) {
        orders = await storage.getAllOrders();
      } else {
        orders = await storage.getOrdersByUserId(userId);
      }
      
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", isAuthenticated, async (req: any, res) => {
    try {
      const order = await storage.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const orderItems = await storage.getOrderItems(order.id);
      res.json({ ...order, items: orderItems });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims ? req.user.claims.sub : req.user.id;
      const { items, ...orderData } = req.body;

      const order = await storage.createOrder({
        ...orderData,
        userId,
      });

      // Create order items
      for (const item of items) {
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.price,
        });
      }

      // Clear cart after successful order
      await storage.clearCart(userId);

      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Reviews routes
  app.get("/api/products/:productId/reviews", async (req, res) => {
    try {
      const reviews = await storage.getProductReviews(req.params.productId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/products/:productId/reviews", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims ? req.user.claims.sub : req.user.id;
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        userId,
        productId: req.params.productId,
      });
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Admin middleware - require admin authentication
  const isAdmin = async (req: any, res: any, next: any) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const userId = req.user.claims ? req.user.claims.sub : req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      next();
    } catch (error) {
      console.error("Admin authorization error:", error);
      res.status(500).json({ message: "Authorization check failed" });
    }
  };

  // ADMIN ROUTES
  
  // Site Settings Management
  app.get("/api/admin/site-settings", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { category } = req.query;
      const settings = await storage.getSiteSettings(category as string);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching site settings:", error);
      res.status(500).json({ message: "Failed to fetch site settings" });
    }
  });

  app.get("/api/admin/site-settings/:key", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const setting = await storage.getSiteSetting(req.params.key);
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      res.json(setting);
    } catch (error) {
      console.error("Error fetching site setting:", error);
      res.status(500).json({ message: "Failed to fetch site setting" });
    }
  });

  app.post("/api/admin/site-settings", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const settingData = insertSiteSettingSchema.parse(req.body);
      const setting = await storage.upsertSiteSetting(settingData);
      res.status(201).json(setting);
    } catch (error) {
      console.error("Error creating/updating site setting:", error);
      res.status(500).json({ message: "Failed to save site setting" });
    }
  });

  app.delete("/api/admin/site-settings/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteSiteSetting(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting site setting:", error);
      res.status(500).json({ message: "Failed to delete site setting" });
    }
  });

  // Slider/Banner Management
  app.get("/api/admin/sliders", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { type, placement } = req.query;
      const sliders = await storage.getAllSliders(type as string, placement as string);
      res.json(sliders);
    } catch (error) {
      console.error("Error fetching sliders:", error);
      res.status(500).json({ message: "Failed to fetch sliders" });
    }
  });

  app.get("/api/admin/sliders/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const slider = await storage.getSliderById(req.params.id);
      if (!slider) {
        return res.status(404).json({ message: "Slider not found" });
      }
      res.json(slider);
    } catch (error) {
      console.error("Error fetching slider:", error);
      res.status(500).json({ message: "Failed to fetch slider" });
    }
  });

  app.post("/api/admin/sliders", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const sliderData = insertSliderSchema.parse(req.body);
      const slider = await storage.createSlider(sliderData);
      res.status(201).json(slider);
    } catch (error) {
      console.error("Error creating slider:", error);
      res.status(500).json({ message: "Failed to create slider" });
    }
  });

  app.put("/api/admin/sliders/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const sliderData = insertSliderSchema.partial().parse(req.body);
      const slider = await storage.updateSlider(req.params.id, sliderData);
      res.json(slider);
    } catch (error) {
      console.error("Error updating slider:", error);
      res.status(500).json({ message: "Failed to update slider" });
    }
  });

  app.delete("/api/admin/sliders/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteSlider(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting slider:", error);
      res.status(500).json({ message: "Failed to delete slider" });
    }
  });

  // Public slider endpoint for frontend
  app.get("/api/sliders", async (req, res) => {
    try {
      const { placement } = req.query;
      const sliders = await storage.getActiveSliders(placement as string);
      res.json(sliders);
    } catch (error) {
      console.error("Error fetching active sliders:", error);
      res.status(500).json({ message: "Failed to fetch sliders" });
    }
  });

  // Public site settings endpoint for frontend
  app.get("/api/site-settings", async (req, res) => {
    try {
      const { category } = req.query;
      const settings = await storage.getSiteSettings(category as string);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching site settings:", error);
      res.status(500).json({ message: "Failed to fetch site settings" });
    }
  });

  // Coupon Management
  app.get("/api/admin/coupons", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const coupons = await storage.getAllCoupons();
      res.json(coupons);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      res.status(500).json({ message: "Failed to fetch coupons" });
    }
  });

  app.get("/api/admin/coupons/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const coupon = await storage.getCouponById(req.params.id);
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      res.json(coupon);
    } catch (error) {
      console.error("Error fetching coupon:", error);
      res.status(500).json({ message: "Failed to fetch coupon" });
    }
  });

  app.post("/api/admin/coupons", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const couponData = insertCouponSchema.parse(req.body);
      const coupon = await storage.createCoupon(couponData);
      res.status(201).json(coupon);
    } catch (error) {
      console.error("Error creating coupon:", error);
      res.status(500).json({ message: "Failed to create coupon" });
    }
  });

  app.put("/api/admin/coupons/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const couponData = insertCouponSchema.partial().parse(req.body);
      const coupon = await storage.updateCoupon(req.params.id, couponData);
      res.json(coupon);
    } catch (error) {
      console.error("Error updating coupon:", error);
      res.status(500).json({ message: "Failed to update coupon" });
    }
  });

  app.delete("/api/admin/coupons/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteCoupon(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting coupon:", error);
      res.status(500).json({ message: "Failed to delete coupon" });
    }
  });

  // Coupon validation for frontend
  app.post("/api/coupons/validate", isAuthenticated, async (req: any, res) => {
    try {
      const { code, orderAmount } = req.body;
      const userId = req.user.claims ? req.user.claims.sub : req.user.id;
      const validation = await storage.validateCoupon(code, userId, orderAmount);
      res.json(validation);
    } catch (error) {
      console.error("Error validating coupon:", error);
      res.status(500).json({ message: "Failed to validate coupon" });
    }
  });

  // Payment Settings Management
  app.get("/api/admin/payment-settings", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const settings = await storage.getAllPaymentSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching payment settings:", error);
      res.status(500).json({ message: "Failed to fetch payment settings" });
    }
  });

  app.get("/api/admin/payment-settings/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const setting = await storage.getPaymentSettingById(req.params.id);
      if (!setting) {
        return res.status(404).json({ message: "Payment setting not found" });
      }
      res.json(setting);
    } catch (error) {
      console.error("Error fetching payment setting:", error);
      res.status(500).json({ message: "Failed to fetch payment setting" });
    }
  });

  app.post("/api/admin/payment-settings", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const settingData = insertPaymentSettingSchema.parse(req.body);
      const setting = await storage.createPaymentSetting(settingData);
      res.status(201).json(setting);
    } catch (error) {
      console.error("Error creating payment setting:", error);
      res.status(500).json({ message: "Failed to create payment setting" });
    }
  });

  app.put("/api/admin/payment-settings/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const settingData = insertPaymentSettingSchema.partial().parse(req.body);
      const setting = await storage.updatePaymentSetting(req.params.id, settingData);
      res.json(setting);
    } catch (error) {
      console.error("Error updating payment setting:", error);
      res.status(500).json({ message: "Failed to update payment setting" });
    }
  });

  app.delete("/api/admin/payment-settings/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deletePaymentSetting(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting payment setting:", error);
      res.status(500).json({ message: "Failed to delete payment setting" });
    }
  });

  // Public active payment settings for frontend
  app.get("/api/payment-settings", async (req, res) => {
    try {
      const settings = await storage.getActivePaymentSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching active payment settings:", error);
      res.status(500).json({ message: "Failed to fetch payment settings" });
    }
  });

  // Analytics Management
  app.post("/api/analytics/event", async (req, res) => {
    try {
      const eventData = insertAnalyticsEventSchema.parse(req.body);
      const event = await storage.recordAnalyticsEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error recording analytics event:", error);
      res.status(500).json({ message: "Failed to record analytics event" });
    }
  });

  app.get("/api/admin/analytics/events", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { eventType, userId, productId, startDate, endDate, limit, offset } = req.query;
      const filters = {
        eventType: eventType as string,
        userId: userId as string,
        productId: productId as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      };
      const events = await storage.getAnalyticsEvents(filters);
      res.json(events);
    } catch (error) {
      console.error("Error fetching analytics events:", error);
      res.status(500).json({ message: "Failed to fetch analytics events" });
    }
  });

  app.get("/api/admin/analytics/summary", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const summary = await storage.getAnalyticsSummary(
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.json(summary);
    } catch (error) {
      console.error("Error fetching analytics summary:", error);
      res.status(500).json({ message: "Failed to fetch analytics summary" });
    }
  });

  // Customer Management
  app.get("/api/admin/customers", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { search, limit, offset } = req.query;
      const filters = {
        search: search as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      };
      const result = await storage.getAllCustomers(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.get("/api/admin/customers/:id/analytics", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const analytics = await storage.getCustomerAnalytics(req.params.id);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching customer analytics:", error);
      res.status(500).json({ message: "Failed to fetch customer analytics" });
    }
  });

  // Admin Product Management (enhanced with admin checks)
  app.post("/api/admin/products", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/admin/products/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, productData);
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Admin Category Management
  app.post("/api/admin/categories", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put("/api/admin/categories/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(req.params.id, categoryData);
      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteCategory(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Admin Order Management
  app.get("/api/admin/orders", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.put("/api/admin/orders/:id/status", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(req.params.id, status);
      res.json(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
