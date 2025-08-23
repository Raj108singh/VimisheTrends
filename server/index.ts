import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";

function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add CORS for Next.js development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Serve the Next.js frontend statically
  app.use(express.static("public"));
  
  // Catch-all route to serve the Next.js app
  app.get("*", (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith("/api")) {
      return next();
    }
    
    // Serve the Next.js homepage
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vimishe Fashion Trends - Premium Children's Fashion</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <style>
    .mobile-menu { transform: translateX(-100%); transition: transform 0.3s ease; }
    .mobile-menu.open { transform: translateX(0); }
  </style>
</head>
<body class="bg-white min-h-screen">
  <!-- Header -->
  <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between py-4">
        <!-- Logo -->
        <a href="/" class="flex items-center space-x-3">
          <img 
            src="https://vimishefashiontrends.com/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-02-at-01.02.48_f7a00154.jpg" 
            alt="Vimishe Fashion Trends" 
            class="h-12 w-auto object-contain"
          />
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center space-x-8">
          <a href="/" class="text-gray-800 hover:text-black font-semibold transition-colors uppercase text-sm tracking-wide">MEN</a>
          <a href="/products" class="text-gray-800 hover:text-black font-semibold transition-colors uppercase text-sm tracking-wide">WOMEN</a>
          <a href="/products" class="text-gray-800 hover:text-black font-semibold transition-colors uppercase text-sm tracking-wide">MOBILE COVERS</a>
        </nav>

        <!-- Header Actions -->
        <div class="flex items-center space-x-4">
          <input type="text" placeholder="Search by products" class="hidden lg:block pl-4 pr-10 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none w-72 text-sm bg-gray-50" />
          <button class="text-sm font-semibold text-gray-800 hover:text-black uppercase tracking-wide">LOGIN</button>
          <button class="hover:text-black transition-colors"><i class="far fa-heart text-gray-700 text-xl"></i></button>
          <button class="hover:text-black transition-colors relative"><i class="fas fa-shopping-bag text-gray-700 text-xl"></i></button>
        </div>
      </div>
    </div>
    
    <!-- Secondary Navigation -->
    <div class="bg-gray-50 border-b border-gray-200">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-center space-x-8 py-3">
          <a href="/products" class="text-sm font-medium text-gray-700 hover:text-black transition-colors">SHOP NOW</a>
          <a href="/live" class="text-sm font-medium text-gray-700 hover:text-black transition-colors">LIVE NOW</a>
          <a href="/plus-size" class="text-sm font-medium text-gray-700 hover:text-black transition-colors">PLUS SIZE</a>
          <a href="/ai" class="text-sm font-medium text-gray-700 hover:text-black transition-colors">BWKF X GOOGLE AI</a>
          <a href="/accessories" class="text-sm font-medium text-gray-700 hover:text-black transition-colors">ACCESSORIES</a>
          <a href="/merch" class="text-sm font-medium text-gray-700 hover:text-black transition-colors">OFFICIAL MERCH</a>
          <a href="/sneakers" class="text-sm font-medium text-gray-700 hover:text-black transition-colors">SNEAKERS</a>
        </div>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="relative w-full h-[400px] md:h-[500px]">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 h-full">
      <!-- Hero Slide 1 -->
      <div class="relative w-full h-full cursor-pointer group bg-gray-900" style="background-image: url('https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500'); background-size: cover; background-position: center;">
        <div class="absolute inset-0 bg-gray-900 bg-opacity-80 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center">
          <div class="text-center text-white px-4">
            <h2 class="text-xl md:text-2xl font-bold mb-2">NEW COLLECTION</h2>
            <p class="text-sm md:text-base mb-4">Discover latest trends</p>
            <button class="border-white text-white hover:bg-white hover:text-gray-900 px-6 py-2 border rounded transition-all">Shop Now</button>
          </div>
        </div>
      </div>
      
      <!-- Hero Slide 2 -->
      <div class="relative w-full h-full cursor-pointer group bg-orange-500">
        <div class="absolute inset-0 bg-orange-500 bg-opacity-80 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center">
          <div class="text-center text-white px-4">
            <h2 class="text-2xl md:text-3xl font-bold mb-2">BUY 2</h2>
            <h3 class="text-3xl md:text-4xl font-bold mb-2">OVERSIZED T-SHIRTS</h3>
            <p class="text-xl md:text-2xl font-semibold mb-4">AT ₹999</p>
            <button class="bg-white text-orange-500 hover:bg-gray-100 px-6 py-2 rounded transition-all">Shop Now</button>
          </div>
        </div>
      </div>
      
      <!-- Hero Slide 3 -->
      <div class="relative w-full h-full cursor-pointer group bg-gray-800" style="background-image: url('https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500'); background-size: cover; background-position: center;">
        <div class="absolute inset-0 bg-gray-800 bg-opacity-80 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center">
          <div class="text-center text-white px-4">
            <h2 class="text-xl md:text-2xl font-bold mb-2">PREMIUM QUALITY</h2>
            <p class="text-sm md:text-base mb-4">Best materials</p>
            <button class="border-white text-white hover:bg-white hover:text-gray-900 px-6 py-2 border rounded transition-all">Explore</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Promotional Banner -->
  <section class="py-4 px-4 bg-white">
    <div class="container mx-auto">
      <div class="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <span class="text-2xl">🎉</span>
            <div>
              <h2 class="text-xl font-bold text-white">GET 10% CASHBACK</h2>
              <p class="text-white opacity-90 text-sm">ON ALL ORDERS</p>
            </div>
          </div>
          <div class="bg-yellow-400 px-4 py-2 rounded-full">
            <span class="font-bold text-gray-800 text-sm">USE CODE GETCASH10</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Banner Grid -->
  <section class="py-8 px-4 bg-white">
    <div class="container mx-auto">
      <div class="grid md:grid-cols-3 gap-6">
        <!-- Main Banner -->
        <div class="md:col-span-2 relative bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl overflow-hidden h-64">
          <div class="absolute inset-0 flex items-center justify-between p-8">
            <div class="text-white">
              <h3 class="text-2xl font-bold mb-2">BUY 2</h3>
              <p class="text-4xl font-extrabold mb-2">OVERSIZED T-SHIRTS</p>
              <p class="text-2xl font-bold mb-4">AT ₹999</p>
              <button class="bg-white text-purple-600 px-6 py-2 rounded-full font-bold hover:shadow-lg transition-all">Shop Now</button>
            </div>
            <div class="hidden md:block">
              <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200" alt="T-shirts" class="rounded-lg" />
            </div>
          </div>
        </div>
        
        <!-- Side Banner -->
        <div class="relative bg-gradient-to-b from-blue-400 to-cyan-400 rounded-2xl overflow-hidden h-64">
          <div class="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
            <h3 class="text-2xl font-bold mb-2">BUY 3</h3>
            <p class="text-xl font-bold mb-2">CLASSIC FIT T-SHIRTS</p>
            <p class="text-2xl font-bold mb-4">AT ₹999</p>
            <button class="bg-white text-blue-600 px-6 py-2 rounded-full font-bold hover:shadow-lg transition-all">Explore</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- New Arrivals Section -->
  <section class="py-8 px-4 bg-gray-50">
    <div class="container mx-auto">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">NEW ARRIVALS</h2>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        ${Array.from({ length: 5 }).map((_, i) => `
          <div class="bg-white rounded-lg overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
            <div class="relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-150345453719${5 + i}?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400" 
                alt="Fashion Item" 
                class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute top-2 left-2">
                <span class="bg-yellow-400 text-xs font-bold px-2 py-1 rounded">4.5 ★</span>
              </div>
            </div>
            <div class="p-3">
              <h3 class="font-medium text-gray-800 text-sm mb-1">Fashion Item ${i + 1}</h3>
              <p class="text-gray-500 text-xs">Starting from ₹999</p>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="text-center mt-8">
        <button class="text-primary font-bold hover:underline">Explore All</button>
      </div>
    </div>
  </section>

  <!-- Trending Categories -->
  <section class="py-8 px-4 bg-white">
    <div class="container mx-auto">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">TRENDING CATEGORIES</h2>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
        ${Array.from({ length: 6 }).map((_, i) => `
          <div class="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-150345453719${5 + i}?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300" 
              alt="Category" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div class="absolute inset-0 bg-black bg-opacity-30 flex items-end p-4">
              <h3 class="text-white font-bold text-sm">Fashion Category</h3>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Featured Products -->
  <section class="py-16 px-4 bg-white">
    <div class="container mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-800 mb-4">Featured Products</h2>
        <p class="text-gray-600">Hand-picked favorites for your little ones</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        ${Array.from({ length: 4 }).map((_, i) => `
          <div class="bg-white rounded-xl shadow-md overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
            <div class="relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-150345453719${5 + i}?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300" 
                alt="Product" 
                class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-gray-800 mb-2">Premium Product ${i + 1}</h3>
              <p class="text-gray-600 text-sm mb-3">High quality fashion item</p>
              <div class="flex items-center justify-between">
                <span class="text-xl font-bold text-gray-900">₹${999 + i * 100}</span>
                <button class="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors">Add to Cart</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section class="py-16 px-4 bg-gray-100">
    <div class="container mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12">Happy Parents, Happy Kids</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white p-6 rounded-xl shadow-md">
          <div class="star-rating mb-4 text-yellow-400">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
          </div>
          <p class="text-gray-600 mb-4">"Amazing quality and my daughter loves her new outfits! The fabric is so soft and comfortable."</p>
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">P</div>
            <div class="ml-3">
              <h4 class="font-semibold">Priya Sharma</h4>
              <p class="text-gray-500 text-sm">Verified Buyer</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-xl shadow-md">
          <div class="star-rating mb-4 text-yellow-400">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
          </div>
          <p class="text-gray-600 mb-4">"Fast delivery and excellent customer service. The sizes are accurate and the colors are vibrant."</p>
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">R</div>
            <div class="ml-3">
              <h4 class="font-semibold">Rajesh Kumar</h4>
              <p class="text-gray-500 text-sm">Verified Buyer</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-xl shadow-md">
          <div class="star-rating mb-4 text-yellow-400">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
          </div>
          <p class="text-gray-600 mb-4">"Bought multiple items for my twin boys. Great value for money and they look adorable!"</p>
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
            <div class="ml-3">
              <h4 class="font-semibold">Anita Patel</h4>
              <p class="text-gray-500 text-sm">Verified Buyer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-gray-800 text-white py-12 px-4">
    <div class="container mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand Info -->
        <div>
          <div class="flex items-center space-x-2 mb-6">
            <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span class="text-white font-bold text-lg">V</span>
            </div>
            <h3 class="text-xl font-bold">Vimishe Fashion Trends</h3>
          </div>
          <p class="text-gray-300 mb-4">Premium children's clothing with comfort, style, and quality you can trust.</p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-300 hover:text-purple-400"><i class="fab fa-facebook"></i></a>
            <a href="#" class="text-gray-300 hover:text-purple-400"><i class="fab fa-instagram"></i></a>
            <a href="#" class="text-gray-300 hover:text-purple-400"><i class="fab fa-twitter"></i></a>
            <a href="#" class="text-gray-300 hover:text-purple-400"><i class="fab fa-pinterest"></i></a>
          </div>
        </div>
        
        <!-- Shop Links -->
        <div>
          <h4 class="font-semibold text-lg mb-4">Shop</h4>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-300 hover:text-white">Casual Wear</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white">Formal Wear</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white">Baby Collection</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white">Accessories</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white">Sale Items</a></li>
          </ul>
        </div>
        
        <!-- Customer Care -->
        <div>
          <h4 class="font-semibold text-lg mb-4">Customer Care</h4>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-300 hover:text-white">Contact Us</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white">Size Guide</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white">Shipping Info</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white">Returns</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white">FAQ</a></li>
          </ul>
        </div>
        
        <!-- Newsletter -->
        <div>
          <h4 class="font-semibold text-lg mb-4">Newsletter</h4>
          <p class="text-gray-300 mb-4">Subscribe for updates and exclusive offers</p>
          <div class="flex">
            <input type="email" placeholder="Your email" class="flex-1 px-4 py-2 rounded-l-full text-gray-800" />
            <button class="bg-purple-600 px-6 py-2 rounded-r-full hover:bg-purple-700">Subscribe</button>
          </div>
        </div>
      </div>
      
      <div class="border-t border-gray-700 mt-8 pt-8 text-center">
        <p class="text-gray-300">&copy; 2024 Vimishe Fashion Trends. All rights reserved.</p>
      </div>
    </div>
  </footer>
</body>
</html>
    `);
  });

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // This now serves the full-stack application with frontend and API
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`Full-stack application serving on port ${port}`);
    log(`Frontend: http://localhost:${port}`);
    log(`API: http://localhost:${port}/api`);
  });
})();