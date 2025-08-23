import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  salePrice?: string;
  imageUrl: string;
  images?: string[];
  rating?: string;
  reviewCount?: number;
  sizes?: string[];
  colors?: string[];
  description?: string;
  shortDescription?: string;
  isOnSale?: boolean;
}

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

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
      onClose();
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

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Please Login",
        description: "You need to login to add items to cart",
        variant: "destructive",
      });
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Select Size",
        description: "Please select a size",
        variant: "destructive",
      });
      return;
    }

    addToCartMutation.mutate({
      productId: product.id,
      quantity,
      size: selectedSize || null,
      color: selectedColor || null,
    });
  };

  const handleAddToWishlist = () => {
    if (!user) {
      toast({
        title: "Please Login",
        description: "You need to login to add items to wishlist",
        variant: "destructive",
      });
      return;
    }

    addToWishlistMutation.mutate(product.id);
  };

  const displayPrice = product.salePrice || product.price;
  const originalPrice = product.salePrice ? product.price : null;
  const discountPercent = originalPrice 
    ? Math.round(((parseFloat(originalPrice) - parseFloat(displayPrice)) / parseFloat(originalPrice)) * 100)
    : 0;

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.imageUrl || "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"];

  if (!isOpen) return null;

  return (
    <div className="modal active items-center justify-center p-4" data-testid="quick-view-modal">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold" data-testid="text-quick-view-title">Quick View</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
              data-testid="button-close-quick-view"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              <img 
                src={images[activeImage]} 
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl mb-4"
                data-testid="img-quick-view-main"
              />
              <div className="grid grid-cols-4 gap-2">
                {images.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className={`w-full h-20 object-cover rounded-lg cursor-pointer border-2 ${
                      activeImage === index ? "border-primary" : "border-gray-200"
                    }`}
                    onClick={() => setActiveImage(index)}
                    data-testid={`img-quick-view-thumbnail-${index}`}
                  />
                ))}
              </div>
            </div>
            
            {/* Product Details */}
            <div>
              <h3 className="text-2xl font-bold mb-4" data-testid="text-quick-view-product-name">{product.name}</h3>
              
              {product.rating && parseFloat(product.rating) > 0 && (
                <div className="flex items-center mb-4">
                  <div className="star-rating mr-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <i key={i} className={`${i < Math.floor(parseFloat(product.rating || "0")) ? "fas" : "far"} fa-star`}></i>
                    ))}
                  </div>
                  <span className="text-gray-500" data-testid="text-quick-view-review-count">({product.reviewCount} reviews)</span>
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-primary" data-testid="text-quick-view-price">₹{displayPrice}</span>
                  {originalPrice && (
                    <>
                      <span className="text-gray-500 line-through text-xl" data-testid="text-quick-view-original-price">₹{originalPrice}</span>
                      <Badge variant="destructive" data-testid="badge-quick-view-discount">{discountPercent}% OFF</Badge>
                    </>
                  )}
                </div>
              </div>

              {product.shortDescription && (
                <p className="text-gray-600 mb-6" data-testid="text-quick-view-description">{product.shortDescription}</p>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Select Size/Age:</h4>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger className="w-full" data-testid="select-quick-view-size">
                      <SelectValue placeholder="Choose size" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.sizes.map((size: string) => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Select Color:</h4>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger className="w-full" data-testid="select-quick-view-color">
                      <SelectValue placeholder="Choose color" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.colors.map((color: string) => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Quantity:</h4>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    data-testid="button-quick-view-decrease"
                  >
                    -
                  </Button>
                  <span className="text-lg font-medium" data-testid="text-quick-view-quantity">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    data-testid="button-quick-view-increase"
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <Button
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending}
                  className="w-full bg-primary text-white py-4 rounded-full font-semibold text-lg hover:bg-primary/90"
                  data-testid="button-quick-view-add-to-cart"
                >
                  {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAddToWishlist}
                  disabled={addToWishlistMutation.isPending}
                  className="w-full py-3 rounded-full font-medium"
                  data-testid="button-quick-view-add-to-wishlist"
                >
                  {addToWishlistMutation.isPending ? "Adding..." : "Add to Wishlist"}
                </Button>
              </div>

              {/* Product Features */}
              <div className="text-sm text-gray-600 space-y-1">
                <p data-testid="text-quick-view-shipping"><i className="fas fa-truck mr-2"></i>Free shipping on orders above ₹1000</p>
                <p data-testid="text-quick-view-return"><i className="fas fa-undo mr-2"></i>30-day return policy</p>
                <p data-testid="text-quick-view-quality"><i className="fas fa-shield-alt mr-2"></i>Quality guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
