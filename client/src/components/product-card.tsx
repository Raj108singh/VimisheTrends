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
      <div className="product-card bg-white rounded-xl shadow-md overflow-hidden group cursor-pointer" data-testid={`product-card-${product.id}`}>
        <Link href={`/products/${product.slug}`}>
          <div className="relative">
            <img 
              src={product.imageUrl || "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"} 
              alt={product.name}
              className="w-full h-64 object-cover transition-transform duration-300"
              data-testid={`img-product-${product.id}`}
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 space-y-2">
              {product.isOnSale && discountPercent > 0 && (
                <Badge variant="destructive" data-testid={`badge-sale-${product.id}`}>
                  {discountPercent}% OFF
                </Badge>
              )}
              {product.isFeatured && (
                <Badge className="bg-accent text-white" data-testid={`badge-featured-${product.id}`}>
                  FEATURED
                </Badge>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="secondary"
                className="p-2 bg-white shadow-md hover:shadow-lg"
                onClick={handleAddToWishlist}
                disabled={addToWishlistMutation.isPending}
                data-testid={`button-wishlist-${product.id}`}
              >
                <i className="fas fa-heart text-gray-600"></i>
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="p-2 bg-white shadow-md hover:shadow-lg"
                onClick={handleQuickView}
                data-testid={`button-quick-view-${product.id}`}
              >
                <i className="fas fa-eye text-gray-600"></i>
              </Button>
            </div>
          </div>
        </Link>

        <div className="p-4">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-gray-800 mb-2 hover:text-primary transition-colors" data-testid={`text-product-name-${product.id}`}>
              {product.name}
            </h3>
          </Link>
          
          {/* Rating */}
          {product.rating && parseFloat(product.rating) > 0 && (
            <div className="flex items-center mb-2">
              <div className="star-rating">
                {Array.from({ length: 5 }, (_, i) => (
                  <i key={i} className={`${i < Math.floor(parseFloat(product.rating || "0")) ? "fas" : "far"} fa-star`}></i>
                ))}
              </div>
              <span className="text-gray-500 text-sm ml-2" data-testid={`text-review-count-${product.id}`}>
                ({product.reviewCount || 0} reviews)
              </span>
            </div>
          )}

          {/* Price and Actions */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-primary" data-testid={`text-price-${product.id}`}>
                ₹{displayPrice}
              </span>
              {originalPrice && (
                <span className="text-gray-500 line-through ml-2" data-testid={`text-original-price-${product.id}`}>
                  ₹{originalPrice}
                </span>
              )}
            </div>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending}
              className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90"
              data-testid={`button-add-to-cart-${product.id}`}
            >
              {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
            </Button>
          </div>

          {/* Size Info */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-gray-500" data-testid={`text-sizes-${product.id}`}>
                Available: {product.sizes.join(", ")}
              </p>
            </div>
          )}
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
