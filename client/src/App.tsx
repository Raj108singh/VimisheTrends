import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import Profile from "@/pages/profile";
import Admin from "@/pages/admin";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import Login from "@/pages/login";
import Register from "@/pages/register";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes - no authentication required */}
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/products/:slug" component={ProductDetail} />
      <Route path="/auth" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/admin/login" component={AdminLogin} />
      
      {/* Protected routes - authentication required */}
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/profile" component={Profile} />
      <Route path="/admin" component={Admin} />
      
      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="pb-16 lg:pb-0">
          <Router />
        </div>
        <MobileBottomNav />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
