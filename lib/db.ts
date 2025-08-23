import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pgTable, text, integer, timestamp, boolean, json } from 'drizzle-orm/pg-core';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client);

// Product schema
export const products = pgTable('products', {
  id: integer('id').primaryKey().notNull(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  price: integer('price').notNull(),
  originalPrice: integer('original_price'),
  discount: integer('discount'),
  packInfo: text('pack_info'),
  description: text('description'),
  features: json('features').$type<string[]>(),
  images: json('images').$type<string[]>(),
  ageGroup: text('age_group'),
  sizes: json('sizes').$type<string[]>(),
  fabric: text('fabric'),
  colors: json('colors').$type<string[]>(),
  rating: integer('rating'),
  reviews: integer('reviews'),
  tags: json('tags').$type<string[]>(),
  inStock: boolean('in_stock').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Cart schema
export const cart = pgTable('cart', {
  id: integer('id').primaryKey().notNull(),
  sessionId: text('session_id').notNull(),
  productId: integer('product_id').references(() => products.id),
  quantity: integer('quantity').default(1),
  size: text('size'),
  color: text('color'),
  createdAt: timestamp('created_at').defaultNow()
});

// Admin users schema
export const adminUsers = pgTable('admin_users', {
  id: integer('id').primaryKey().notNull(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').default('admin'),
  createdAt: timestamp('created_at').defaultNow()
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type CartItem = typeof cart.$inferSelect;
export type NewCartItem = typeof cart.$inferInsert;