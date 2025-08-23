import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Cart() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["/api/cart"],
    retry: false,
    enabled: !!user,
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      await apiRequest("PUT", `/api/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to update cart item",
        variant: "destructive",
      });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Removed",
        description: "Item removed from cart",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/cart");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Cart Cleared",
        description: "All items removed from cart",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
    },
  });

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    updateCartMutation.mutate({ id, quantity });
  };

  const handleRemoveItem = (id: string) => {
    removeFromCartMutation.mutate(id);
  };

  const handleClearCart = () => {
    clearCartMutation.mutate();
  };

  const handleCheckout = () => {
    setLocation("/checkout");
  };

  const subtotal = cartItems.reduce((total: number, item: any) => {
    return total + (parseFloat(item.product?.salePrice || item.product?.price || "0") * item.quantity);
  }, 0);

  const shippingThreshold = 1000;
  const isEligibleForFreeShipping = subtotal >= shippingThreshold;
  const shippingCost = isEligibleForFreeShipping ? 0 : 100;
  const total = subtotal + shippingCost;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h1>
          <p className="text-gray-600 mb-6">You need to login to view your cart</p>
          <Button onClick={() => window.location.href = "/api/login"}>
            Login
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800" data-testid="text-cart-title">Shopping Cart</h1>
          {cartItems.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleClearCart}
              disabled={clearCartMutation.isPending}
              data-testid="button-clear-cart"
            >
              Clear Cart
            </Button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4" data-testid="text-empty-cart">Your cart is empty</div>
            <Button onClick={() => setLocation("/products")} data-testid="button-continue-shopping">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item: any) => (
                <div key={item.id} className="bg-white p-6 rounded-xl shadow-md" data-testid={`cart-item-${item.id}`}>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={item.product?.imageUrl || "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"}
                      alt={item.product?.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      data-testid={`img-cart-item-${item.id}`}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg" data-testid={`text-item-name-${item.id}`}>
                        {item.product?.name}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        {item.size && <p data-testid={`text-item-size-${item.id}`}>Size: {item.size}</p>}
                        {item.color && <p data-testid={`text-item-color-${item.id}`}>Color: {item.color}</p>}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div>
                          <span className="text-xl font-bold text-primary" data-testid={`text-item-price-${item.id}`}>
                            ₹{item.product?.salePrice || item.product?.price}
                          </span>
                          {item.product?.salePrice && (
                            <span className="text-gray-500 line-through ml-2" data-testid={`text-item-original-price-${item.id}`}>
                              ₹{item.product?.price}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={updateCartMutation.isPending}
                            data-testid={`button-decrease-${item.id}`}
                          >
                            -
                          </Button>
                          <span className="font-medium w-8 text-center" data-testid={`text-item-quantity-${item.id}`}>
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={updateCartMutation.isPending}
                            data-testid={`button-increase-${item.id}`}
                          >
                            +
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={removeFromCartMutation.isPending}
                            data-testid={`button-remove-${item.id}`}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-xl shadow-md h-fit">
              <h3 className="text-xl font-bold mb-6" data-testid="text-order-summary">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span data-testid="text-subtotal-label">Subtotal</span>
                  <span data-testid="text-subtotal-amount">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span data-testid="text-shipping-label">Shipping</span>
                  <span data-testid="text-shipping-amount">
                    {isEligibleForFreeShipping ? "Free" : `₹${shippingCost}`}
                  </span>
                </div>
                {!isEligibleForFreeShipping && (
                  <div className="text-sm text-primary">
                    <p data-testid="text-free-shipping-message">
                      Add ₹{(shippingThreshold - subtotal).toFixed(2)} more for free shipping!
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full" 
                        style={{ width: `${Math.min(100, (subtotal / shippingThreshold) * 100)}%` }}
                        data-testid="progress-free-shipping"
                      ></div>
                    </div>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span data-testid="text-total-label">Total</span>
                    <span data-testid="text-total-amount">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleCheckout}
                className="w-full bg-primary text-white py-4 rounded-full font-semibold text-lg hover:bg-primary/90"
                data-testid="button-checkout"
              >
                Proceed to Checkout
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setLocation("/products")}
                className="w-full mt-3"
                data-testid="button-continue-shopping-summary"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
