import { useState } from "react";
import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import QuickViewModal from "./quick-view-modal";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  salePrice?: string;
  imageUrl: string;
  rating?: string;
  reviewCount?: number;
  sizes?: string[];
  isOnSale?: boolean;
  isFeatured?: boolean;
}

interface ProductCardProps {
  product: Product;
  showLogin?: () => void;
}

export default function ProductCard({ product, showLogin }: ProductCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showQuickView, setShowQuickView] = useState(false);

  const addToCartMutation = useMutation({
    mutationFn: async (cartData: any) => {
      await apiRequest("POST", "/api/cart", cartData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to Cart",
        description: "Product has been added to your cart!",
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
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      await apiRequest("POST", "/api/wishlist", { productId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({
        title: "Added to Wishlist",
        description: "Product has been added to your wishlist!",
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
        description: "Failed to add product to wishlist",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user) {
      if (showLogin) {
        showLogin();
      } else {
        toast({
          title: "Please Login",
          description: "You need to login to add items to cart",
          variant: "destructive",
        });
      }
      return;
    }

    addToCartMutation.mutate({
      productId: product.id,
      quantity: 1,
    });
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user) {
      if (showLogin) {
        showLogin();
      } else {
        toast({
          title: "Please Login",
          description: "You need to login to add items to wishlist",
          variant: "destructive",
        });
      }
      return;
    }

    addToWishlistMutation.mutate(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowQuickView(true);
  };

  const displayPrice = product.salePrice || product.price;
  const originalPrice = product.salePrice ? product.price : null;
  const discountPercent = originalPrice 
    ? Math.round(((parseFloat(originalPrice) - parseFloat(displayPrice)) / parseFloat(originalPrice)) * 100)
    : 0;

  return (
    <>
      <div className="product-card bg-white rounded-lg overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300" data-testid={`product-card-${product.id}`}>
        <Link href={`/products/${product.slug}`}>
          <div className="relative">
            <img 
              src={product.imageUrl || "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"} 
              alt={product.name}
              className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
              data-testid={`img-product-${product.id}`}
            />
            
            {/* Rating Badge */}
            <div className="absolute top-3 left-3">
              <span className="bg-white px-2 py-1 rounded text-xs font-bold shadow-md">
                {product.rating || "4.5"} ★
              </span>
            </div>
            
            {/* Sale Badge */}
            {product.isOnSale && discountPercent > 0 && (
              <div className="absolute top-3 right-3">
                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold" data-testid={`badge-sale-${product.id}`}>
                  {discountPercent}% OFF
                </span>
              </div>
            )}
            
            {/* Wishlist Button */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="secondary"
                className="p-2 bg-white shadow-md hover:shadow-lg rounded-full"
                onClick={handleAddToWishlist}
                disabled={addToWishlistMutation.isPending}
                data-testid={`button-wishlist-${product.id}`}
              >
                <i className="fas fa-heart text-gray-600 hover:text-red-500 transition-colors"></i>
              </Button>
            </div>
          </div>
        </Link>

        <div className="p-4">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-medium text-gray-800 mb-1 text-sm line-clamp-2 hover:text-primary transition-colors" data-testid={`text-product-name-${product.id}`}>
              {product.name}
            </h3>
          </Link>
          
          {/* Brand or Category */}
          <p className="text-gray-500 text-xs mb-2">Bewakoof®</p>

          {/* Price */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-lg font-bold text-gray-900" data-testid={`text-price-${product.id}`}>
              ₹{displayPrice}
            </span>
            {originalPrice && (
              <>
                <span className="text-gray-500 line-through text-sm" data-testid={`text-original-price-${product.id}`}>
                  ₹{originalPrice}
                </span>
                <span className="text-green-600 text-sm font-medium">
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          {/* Size Info */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500" data-testid={`text-sizes-${product.id}`}>
                {product.sizes.slice(0, 3).join(", ")}...
              </p>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending}
            className="w-full bg-black text-white py-2 rounded text-sm font-medium hover:bg-gray-800 transition-colors"
            data-testid={`button-add-to-cart-${product.id}`}
          >
            {addToCartMutation.isPending ? "ADDING..." : "ADD TO CART"}
          </Button>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <QuickViewModal
          product={product}
          isOpen={showQuickView}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </>
  );
}
