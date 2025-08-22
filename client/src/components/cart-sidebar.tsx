import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CartItem as DBCartItem } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function CartSidebar() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isOpen, setOpen } = useCartStore();
  const [, setLocation] = useLocation();

  const { data: cartItems = [], isLoading } = useQuery<DBCartItem[]>({
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
        description: "Failed to remove item",
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

  const handleViewCart = () => {
    setOpen(false);
    setLocation("/cart");
  };

  const handleCheckout = () => {
    setOpen(false);
    setLocation("/checkout");
  };

  const subtotal = cartItems.reduce((total: number, item: any) => {
    return total + (parseFloat(item.product?.salePrice || item.product?.price || "0") * item.quantity);
  }, 0);

  const shippingThreshold = 1000;
  const isEligibleForFreeShipping = subtotal >= shippingThreshold;
  const remainingForFreeShipping = shippingThreshold - subtotal;

  if (!user) return null;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setOpen(false)}
          data-testid="cart-overlay"
        />
      )}

      {/* Cart Sidebar */}
      <div className={`floating-cart bg-white shadow-2xl rounded-l-2xl ${isOpen ? 'open' : ''}`} data-testid="cart-sidebar">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold" data-testid="text-cart-title">Shopping Cart</h3>
            <button 
              onClick={() => setOpen(false)} 
              className="text-gray-500 hover:text-gray-700"
              data-testid="button-close-cart"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          {/* Free Shipping Progress */}
          {!isEligibleForFreeShipping && remainingForFreeShipping > 0 && (
            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2" data-testid="text-free-shipping-message">
                You are ₹{remainingForFreeShipping.toFixed(0)} away from free shipping!
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, (subtotal / shippingThreshold) * 100)}%` }}
                  data-testid="progress-free-shipping"
                />
              </div>
            </div>
          )}
          
          {isEligibleForFreeShipping && (
            <div className="mt-2 text-sm text-success font-medium" data-testid="text-free-shipping-eligible">
              <i className="fas fa-check-circle mr-1"></i>
              You qualify for free shipping!
            </div>
          )}
        </div>
        
        {/* Cart Items */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 mb-4" data-testid="text-empty-cart">Your cart is empty</p>
              <Button onClick={() => setOpen(false)} data-testid="button-continue-shopping">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item: any) => (
                <div key={item.id} className="flex items-center space-x-4" data-testid={`cart-item-${item.id}`}>
                  <img 
                    src={item.product?.imageUrl || "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"}
                    alt={item.product?.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    data-testid={`img-cart-item-${item.id}`}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm" data-testid={`text-item-name-${item.id}`}>
                      {item.product?.name}
                    </h4>
                    <div className="text-xs text-gray-500">
                      {item.size && <span data-testid={`text-item-size-${item.id}`}>Size: {item.size}</span>}
                      {item.color && <span className="ml-2" data-testid={`text-item-color-${item.id}`}>Color: {item.color}</span>}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-primary font-semibold" data-testid={`text-item-price-${item.id}`}>
                        ₹{item.product?.salePrice || item.product?.price}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button 
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={updateCartMutation.isPending}
                          data-testid={`button-decrease-${item.id}`}
                        >
                          -
                        </button>
                        <span className="text-sm" data-testid={`text-quantity-${item.id}`}>{item.quantity}</span>
                        <button 
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={updateCartMutation.isPending}
                          data-testid={`button-increase-${item.id}`}
                        >
                          +
                        </button>
                        <button 
                          className="text-red-500 text-xs ml-2"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={removeFromCartMutation.isPending}
                          data-testid={`button-remove-${item.id}`}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Cart Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t">
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-xl text-primary" data-testid="text-cart-total">
                ₹{subtotal.toFixed(2)}
              </span>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={handleCheckout}
                className="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary/90"
                data-testid="button-checkout"
              >
                Checkout
              </Button>
              <Button 
                variant="outline"
                onClick={handleViewCart}
                className="w-full py-2 rounded-full font-medium"
                data-testid="button-view-cart"
              >
                View Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
