import { Pool } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedData() {
  const client = await pool.connect();
  
  try {
    console.log("🌱 Starting to seed database...");

    // Clear existing data
    await client.query("DELETE FROM order_items");
    await client.query("DELETE FROM orders");
    await client.query("DELETE FROM cart_items");
    await client.query("DELETE FROM wishlist_items");
    await client.query("DELETE FROM reviews");
    await client.query("DELETE FROM products");
    await client.query("DELETE FROM categories");
    await client.query("DELETE FROM sliders");
    await client.query("DELETE FROM users WHERE auth_provider = 'email'");

    // Create sample categories
    const categories = [
      {
        name: "Boys",
        slug: "boys",
        description: "Trendy clothes for boys",
        imageUrl: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      },
      {
        name: "Girls", 
        slug: "girls",
        description: "Beautiful clothes for girls",
        imageUrl: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      },
      {
        name: "T-Shirts",
        slug: "t-shirts", 
        description: "Comfortable t-shirts for kids",
        imageUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      },
      {
        name: "Dresses",
        slug: "dresses",
        description: "Pretty dresses for special occasions",
        imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      },
      {
        name: "Jeans",
        slug: "jeans",
        description: "Durable jeans for everyday wear",
        imageUrl: "https://images.unsplash.com/photo-1541840031508-326b77c9a17e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      },
    ];

    console.log("📂 Creating categories...");
    const insertedCategories = [];
    for (const category of categories) {
      const result = await client.query(
        `INSERT INTO categories (name, slug, description, image_url, is_active) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [category.name, category.slug, category.description, category.imageUrl, true]
      );
      insertedCategories.push(result.rows[0]);
      console.log(`✅ Created category: ${category.name}`);
    }

    // Create sample products
    const products = [
      {
        name: "Rainbow Unicorn T-Shirt",
        slug: "rainbow-unicorn-t-shirt",
        description: "Magical unicorn design with rainbow colors. Perfect for little dreamers who love fantasy and bright colors.",
        shortDescription: "Magical unicorn design with rainbow colors",
        price: "599.00",
        salePrice: "499.00",
        categoryId: insertedCategories[0].id, // Boys
        imageUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500",
        images: ["https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3", "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3"],
        sizes: ["2T", "3T", "4T", "5T"],
        colors: ["Rainbow", "Pink", "Blue"],
        isFeatured: true,
        isOnSale: true,
        stock: 50
      },
      {
        name: "Princess Sparkle Dress",
        slug: "princess-sparkle-dress",
        description: "Beautiful princess dress with sparkly details. Perfect for parties and special occasions.",
        shortDescription: "Beautiful princess dress with sparkly details",
        price: "899.00",
        salePrice: "749.00",
        categoryId: insertedCategories[1].id, // Girls
        imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500",
        images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3", "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?ixlib=rb-4.0.3"],
        sizes: ["2T", "3T", "4T", "5T", "6T"],
        colors: ["Pink", "Purple", "Blue"],
        isFeatured: true,
        isOnSale: true,
        stock: 30
      },
      {
        name: "Superhero Action T-Shirt",
        slug: "superhero-action-t-shirt",
        description: "Cool superhero design for little heroes. Made with soft cotton for all-day comfort.",
        shortDescription: "Cool superhero design for little heroes",
        price: "549.00",
        categoryId: insertedCategories[2].id, // T-Shirts
        imageUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500",
        images: ["https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3"],
        sizes: ["2T", "3T", "4T", "5T", "6T"],
        colors: ["Red", "Blue", "Black"],
        isFeatured: true,
        isOnSale: false,
        stock: 75
      },
      {
        name: "Flower Garden Dress",
        slug: "flower-garden-dress",
        description: "Pretty floral dress perfect for spring and summer. Lightweight and comfortable for active kids.",
        shortDescription: "Pretty floral dress perfect for spring",
        price: "699.00",
        categoryId: insertedCategories[3].id, // Dresses
        imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500",
        images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3"],
        sizes: ["2T", "3T", "4T", "5T"],
        colors: ["Floral", "Yellow", "Green"],
        isFeatured: false,
        isOnSale: false,
        stock: 40
      },
      {
        name: "Adventure Denim Jeans",
        slug: "adventure-denim-jeans",
        description: "Durable denim jeans for active kids. Features reinforced knees and adjustable waist.",
        shortDescription: "Durable denim jeans for active kids",
        price: "799.00",
        salePrice: "659.00",
        categoryId: insertedCategories[4].id, // Jeans
        imageUrl: "https://images.unsplash.com/photo-1541840031508-326b77c9a17e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500",
        images: ["https://images.unsplash.com/photo-1541840031508-326b77c9a17e?ixlib=rb-4.0.3"],
        sizes: ["2T", "3T", "4T", "5T", "6T"],
        colors: ["Blue", "Dark Blue", "Black"],
        isFeatured: true,
        isOnSale: true,
        stock: 60
      },
      {
        name: "Cotton Comfort T-Shirt",
        slug: "cotton-comfort-t-shirt",
        description: "Basic cotton t-shirt in multiple colors. Perfect for everyday wear and layering.",
        shortDescription: "Basic cotton t-shirt in multiple colors",
        price: "399.00",
        categoryId: insertedCategories[2].id, // T-Shirts
        imageUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500",
        images: ["https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3"],
        sizes: ["2T", "3T", "4T", "5T", "6T"],
        colors: ["White", "Red", "Blue", "Green", "Yellow"],
        isFeatured: false,
        isOnSale: false,
        stock: 100
      },
      {
        name: "Birthday Princess Dress",
        slug: "birthday-princess-dress",
        description: "Special occasion dress perfect for birthdays and celebrations. Features tulle skirt and sequin details.",
        shortDescription: "Special occasion dress for birthdays",
        price: "999.00",
        categoryId: insertedCategories[3].id, // Dresses
        imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500",
        images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3"],
        sizes: ["2T", "3T", "4T", "5T"],
        colors: ["Pink", "Purple", "Gold"],
        isFeatured: true,
        isOnSale: false,
        stock: 25
      },
      {
        name: "Dinosaur Explorer T-Shirt",
        slug: "dinosaur-explorer-t-shirt",
        description: "Fun dinosaur design for little paleontologists. Educational and stylish for dino lovers.",
        shortDescription: "Fun dinosaur design for little paleontologists",
        price: "549.00",
        salePrice: "449.00",
        categoryId: insertedCategories[2].id, // T-Shirts
        imageUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500",
        images: ["https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3"],
        sizes: ["2T", "3T", "4T", "5T", "6T"],
        colors: ["Green", "Brown", "Blue"],
        isFeatured: false,
        isOnSale: true,
        stock: 45
      }
    ];

    console.log("👕 Creating products...");
    for (const product of products) {
      await client.query(
        `INSERT INTO products (name, slug, description, short_description, price, sale_price, category_id, image_url, images, sizes, colors, is_featured, is_on_sale, is_active, stock) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          product.name, product.slug, product.description, product.shortDescription,
          product.price, product.salePrice, product.categoryId, product.imageUrl,
          product.images, product.sizes, product.colors, product.isFeatured,
          product.isOnSale, true, product.stock
        ]
      );
      console.log(`✅ Created product: ${product.name}`);
    }

    // Create sample sliders
    const sliders = [
      {
        title: "Summer Collection",
        description: "Bright and colorful outfits for sunny days",
        imageUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        linkUrl: "/products?category=t-shirts",
        buttonText: "Shop Now",
        position: 0,
        type: "slider",
        placement: "home",
        isActive: true
      },
      {
        title: "BUY 2",
        description: "Get amazing deals on kids fashion",
        imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        linkUrl: "/products?sale=true",
        buttonText: "Shop Sale",
        position: 1,
        type: "slider",
        placement: "home",
        isActive: true
      },
      {
        title: "New Arrivals",
        description: "Fresh styles for the new season",
        imageUrl: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        linkUrl: "/products?featured=true",
        buttonText: "Explore",
        position: 2,
        type: "slider",
        placement: "home",
        isActive: true
      }
    ];

    console.log("🎠 Creating sliders...");
    for (const slider of sliders) {
      await client.query(
        `INSERT INTO sliders (title, description, image_url, link_url, button_text, position, type, placement, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          slider.title, slider.description, slider.imageUrl, slider.linkUrl,
          slider.buttonText, slider.position, slider.type, slider.placement, slider.isActive
        ]
      );
      console.log(`✅ Created slider: ${slider.title}`);
    }

    // Create an admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);
    
    await client.query(
      `INSERT INTO users (email, password, first_name, last_name, is_admin, auth_provider)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO UPDATE SET
       password = EXCLUDED.password,
       is_admin = EXCLUDED.is_admin`,
      ["admin@vimishe.com", hashedPassword, "Admin", "User", true, "email"]
    );
    console.log("✅ Created admin user: admin@vimishe.com / admin123");

    console.log("🎉 Database seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the seeding
seedData().catch(console.error);