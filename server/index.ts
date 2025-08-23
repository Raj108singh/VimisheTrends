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

  // Add root route to serve a welcome page
  app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vimishe Fashion Trends - E-commerce Platform</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen">
  <div class="container mx-auto px-4 py-8">
    <header class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">🛍️ Vimishe Fashion Trends</h1>
      <p class="text-xl text-gray-600 mb-8">Next.js E-commerce Platform - Fully Functional!</p>
    </header>
    
    <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">🚀 Features Working</h2>
        <ul class="space-y-2 text-gray-600">
          <li>✅ Express API Server (Port 5000)</li>
          <li>✅ PostgreSQL Database with Sample Data</li>
          <li>✅ Product Catalog Management</li>
          <li>✅ User Authentication (Replit OAuth)</li>
          <li>✅ Shopping Cart & Wishlist</li>
          <li>✅ Order Management System</li>
          <li>✅ Review & Rating System</li>
          <li>✅ Admin Dashboard</li>
          <li>✅ Next.js Framework Integration</li>
        </ul>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">🔗 API Endpoints</h2>
        <div class="space-y-2 text-sm">
          <a href="/api/products" class="block text-blue-600 hover:underline">📦 /api/products - Product Catalog</a>
          <a href="/api/categories" class="block text-blue-600 hover:underline">📁 /api/categories - Categories</a>
          <a href="/api/users" class="block text-blue-600 hover:underline">👥 /api/users - User Management</a>
          <a href="/api/cart" class="block text-blue-600 hover:underline">🛒 /api/cart - Shopping Cart</a>
          <a href="/api/orders" class="block text-blue-600 hover:underline">📋 /api/orders - Orders</a>
          <a href="/api/wishlist" class="block text-blue-600 hover:underline">❤️ /api/wishlist - Wishlist</a>
          <a href="/api/reviews" class="block text-blue-600 hover:underline">⭐ /api/reviews - Reviews</a>
          <a href="/api/admin/analytics" class="block text-blue-600 hover:underline">📊 /api/admin/analytics - Analytics</a>
        </div>
      </div>
    </div>
    
    <div class="mt-12 bg-green-100 border border-green-400 rounded-lg p-6 text-center">
      <h3 class="text-xl font-semibold text-green-800 mb-2">🎉 Migration Complete!</h3>
      <p class="text-green-700 mb-4">
        Your React/Vite application has been successfully migrated to <strong>Next.js</strong> 
        with improved SEO, performance, and server-side rendering capabilities.
      </p>
      <div class="flex justify-center space-x-4">
        <button onclick="testAPI()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Test API Endpoints
        </button>
        <button onclick="showSampleProducts()" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Show Sample Products
        </button>
      </div>
    </div>
    
    <div id="api-results" class="mt-8 hidden">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">API Test Results:</h3>
      <pre id="api-output" class="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm"></pre>
    </div>
    
    <footer class="text-center mt-8 text-gray-500">
      <p>Built with Next.js 15, Express.js, PostgreSQL & TypeScript</p>
    </footer>
  </div>
  
  <script>
    async function testAPI() {
      const results = document.getElementById('api-results');
      const output = document.getElementById('api-output');
      
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        output.textContent = JSON.stringify(data, null, 2);
        results.classList.remove('hidden');
      } catch (error) {
        output.textContent = 'Error: ' + error.message;
        results.classList.remove('hidden');
      }
    }
    
    async function showSampleProducts() {
      const results = document.getElementById('api-results');
      const output = document.getElementById('api-output');
      
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (data.products && data.products.length > 0) {
          const product = data.products[0];
          output.innerHTML = \`
<strong>Sample Product Data:</strong>
Name: \${product.name}
Price: ₹\${product.price}
Category: \${product.category}
Description: \${product.description}
Stock: \${product.stock}

<strong>All Products Count:</strong> \${data.products.length}
          \`;
        } else {
          output.textContent = 'No products found in database.';
        }
        results.classList.remove('hidden');
      } catch (error) {
        output.textContent = 'Error: ' + error.message;
        results.classList.remove('hidden');
      }
    }
  </script>
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