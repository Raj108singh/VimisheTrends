import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function Profile() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [user, authLoading, toast]);

  // Check URL params for tab
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, []);

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
    retry: false,
    enabled: !!user,
  });

  const { data: wishlistItems = [], isLoading: wishlistLoading } = useQuery({
    queryKey: ["/api/wishlist"],
    retry: false,
    enabled: !!user,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect is handled in useEffect
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8" data-testid="text-profile-title">My Account</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3" data-testid="tabs-profile">
              <TabsTrigger value="profile" data-testid="tab-profile">Profile</TabsTrigger>
              <TabsTrigger value="orders" data-testid="tab-orders">Orders</TabsTrigger>
              <TabsTrigger value="wishlist" data-testid="tab-wishlist">Wishlist</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4" data-testid="text-profile-info-title">Profile Information</h2>
                
                <div className="flex items-center space-x-4 mb-6">
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover"
                      data-testid="img-profile-picture"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-2xl">
                      {user.firstName?.[0] || user.email?.[0] || "U"}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold" data-testid="text-user-name">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-gray-600" data-testid="text-user-email">{user.email}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <div className="p-3 bg-gray-50 rounded-lg" data-testid="text-first-name">
                      {user.firstName || "Not provided"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <div className="p-3 bg-gray-50 rounded-lg" data-testid="text-last-name">
                      {user.lastName || "Not provided"}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="p-3 bg-gray-50 rounded-lg" data-testid="text-email">
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-2">Account Actions</h3>
                  <Button
                    onClick={() => window.location.href = "/api/logout"}
                    variant="outline"
                    data-testid="button-logout-profile"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4" data-testid="text-orders-title">Order History</h2>
                
                {ordersLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <i className="fas fa-shopping-bag text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500 mb-4" data-testid="text-no-orders">You haven't placed any orders yet</p>
                    <Button onClick={() => window.location.href = "/products"} data-testid="button-start-shopping">
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <div key={order.id} className="border rounded-lg p-4" data-testid={`order-${order.id}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold" data-testid={`text-order-id-${order.id}`}>
                              Order #{order.id.slice(-8)}
                            </h3>
                            <p className="text-sm text-gray-600" data-testid={`text-order-date-${order.id}`}>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)} data-testid={`badge-order-status-${order.id}`}>
                              {order.status.toUpperCase()}
                            </Badge>
                            <p className="text-lg font-semibold mt-1" data-testid={`text-order-total-${order.id}`}>
                              ₹{order.totalAmount}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <p data-testid={`text-order-payment-${order.id}`}>
                            Payment: {order.paymentMethod || "Not specified"}
                          </p>
                          {order.shippingAddress && (
                            <p data-testid={`text-order-address-${order.id}`}>
                              Shipping to: {order.shippingAddress.city}, {order.shippingAddress.state}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist" className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4" data-testid="text-wishlist-title">My Wishlist</h2>
                
                {wishlistLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="w-full h-48 bg-gray-200 rounded-lg mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-1"></div>
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                      </div>
                    ))}
                  </div>
                ) : wishlistItems.length === 0 ? (
                  <div className="text-center py-8">
                    <i className="fas fa-heart text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500 mb-4" data-testid="text-no-wishlist-items">Your wishlist is empty</p>
                    <Button onClick={() => window.location.href = "/products"} data-testid="button-browse-products">
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item: any) => (
                      <div key={item.id} className="border rounded-lg overflow-hidden" data-testid={`wishlist-item-${item.id}`}>
                        <img
                          src={item.product?.imageUrl || "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"}
                          alt={item.product?.name}
                          className="w-full h-48 object-cover"
                          data-testid={`img-wishlist-item-${item.id}`}
                        />
                        <div className="p-4">
                          <h3 className="font-semibold mb-2" data-testid={`text-wishlist-item-name-${item.id}`}>
                            {item.product?.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-primary" data-testid={`text-wishlist-item-price-${item.id}`}>
                              ₹{item.product?.salePrice || item.product?.price}
                            </span>
                            <Button
                              size="sm"
                              onClick={() => window.location.href = `/products/${item.product?.slug}`}
                              data-testid={`button-view-wishlist-item-${item.id}`}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}
