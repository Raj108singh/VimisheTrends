import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CartSidebar from "@/components/cart-sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProductDetail() {
  const { slug } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, title: "", comment: "" });

  const { data: product, isLoading } = useQuery({
    queryKey: ["/api/products", slug],
    retry: false,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["/api/products", product?.id, "reviews"],
    enabled: !!product?.id,
    retry: false,
  });

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ["/api/products", slug, "related"],
    enabled: !!slug,
    retry: false,
  });

  const addToCartMutation = useMutation({
    mutationFn: async (cartData: any) => {
      const response = await apiRequest("POST", "/api/cart", cartData);
      return response.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to Cart",
        description: "Product has been added to your cart!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to add product to cart",
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

  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: any) => {
      await apiRequest("POST", `/api/products/${product?.id}/reviews`, reviewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products", product?.id, "reviews"] });
      setShowReviewForm(false);
      setReviewData({ rating: 5, title: "", comment: "" });
      toast({
        title: "Review Submitted",
        description: "Thank you for your review!",
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
        description: "Failed to submit review",
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

    if (product?.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Select Size",
        description: "Please select a size",
        variant: "destructive",
      });
      return;
    }

    addToCartMutation.mutate({
      productId: product?.id,
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

    addToWishlistMutation.mutate(product?.id);
  };

  const handleSubmitReview = () => {
    if (!user) {
      toast({
        title: "Please Login",
        description: "You need to login to submit a review",
        variant: "destructive",
      });
      return;
    }

    createReviewMutation.mutate(reviewData);
  };

  const displayPrice = product?.salePrice || product?.price;
  const originalPrice = product?.salePrice ? product?.price : null;
  const discountPercent = originalPrice 
    ? Math.round(((parseFloat(originalPrice) - parseFloat(displayPrice)) / parseFloat(originalPrice)) * 100)
    : 0;

  const images = product?.images && product.images.length > 0 
    ? product.images 
    : [product?.imageUrl || "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8 animate-pulse">
            <div className="space-y-4">
              <div className="w-full h-96 bg-gray-200 rounded-xl"></div>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-full h-20 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-40"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <img 
                src={images[activeImage]} 
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl"
                data-testid="img-product-main"
              />
            </div>
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
                  data-testid={`img-thumbnail-${index}`}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 font-medium">Bewakoof®</p>
              <h1 className="text-2xl font-bold text-gray-900" data-testid="text-product-name">{product.name}</h1>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="star-rating text-warning mr-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <i key={i} className={`${i < Math.floor(parseFloat(product.rating || "0")) ? "fas" : "far"} fa-star`}></i>
                ))}
              </div>
              <span className="text-gray-500 text-sm" data-testid="text-review-count">({product.reviewCount} reviews)</span>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900" data-testid="text-price">₹{displayPrice}</span>
                {originalPrice && (
                  <>
                    <span className="text-gray-500 line-through text-xl" data-testid="text-original-price">₹{originalPrice}</span>
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-bold" data-testid="badge-discount">{discountPercent}% OFF</span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">Inclusive of all taxes</p>
            </div>

            {product.shortDescription && (
              <p className="text-gray-600 mb-6" data-testid="text-product-description">{product.shortDescription}</p>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">Select Size</h4>
                  <Button variant="link" className="text-sm text-blue-600 p-0 h-auto">
                    Size Guide
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size: string) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      className={`h-12 text-sm font-medium ${
                        selectedSize === size 
                          ? "bg-black text-white border-black" 
                          : "bg-white text-gray-700 border-gray-300 hover:border-black"
                      }`}
                      onClick={() => setSelectedSize(size)}
                      data-testid={`size-${size}`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="text-xs text-gray-500 mt-2">Please select a size</p>
                )}
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Select Color</h4>
                <div className="grid grid-cols-5 gap-2">
                  {product.colors.map((color: string) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      className={`h-12 text-sm font-medium ${
                        selectedColor === color 
                          ? "bg-black text-white border-black" 
                          : "bg-white text-gray-700 border-gray-300 hover:border-black"
                      }`}
                      onClick={() => setSelectedColor(color)}
                      data-testid={`color-${color}`}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
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
                  data-testid="button-decrease-quantity"
                >
                  -
                </Button>
                <span className="text-lg font-medium" data-testid="text-quantity">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  data-testid="button-increase-quantity"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending || (!selectedSize && product.sizes?.length > 0)}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-4 rounded-lg font-semibold text-lg"
                data-testid="button-add-to-cart"
              >
                🛍️ {addToCartMutation.isPending ? "Adding..." : "ADD TO BAG"}
              </Button>
              <Button
                variant="outline"
                onClick={handleAddToWishlist}
                disabled={addToWishlistMutation.isPending}
                className="w-full py-3 rounded-lg font-medium border-gray-300"
                data-testid="button-add-to-wishlist"
              >
                ♡ {addToWishlistMutation.isPending ? "Adding..." : "WISHLIST"}
              </Button>
            </div>

            {/* Delivery & Offers Section */}
            <div className="space-y-4 mt-6">
              {/* Delivery Details */}
              <div className="border border-gray-200 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">📍</span>
                    <span className="font-medium text-gray-800">Check for Delivery Details</span>
                  </div>
                  <button className="text-blue-600 text-sm font-medium hover:underline">CHECK</button>
                </div>
                <input 
                  type="text" 
                  placeholder="Enter Pincode" 
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              
              {/* Free Shipping */}
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">🚛</span>
                  <span className="text-sm font-medium text-blue-800">This product is eligible for FREE SHIPPING</span>
                </div>
              </div>

              {/* Offers */}
              <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-800 mb-3">Save extra with these offers</h5>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded mt-0.5">✓</span>
                    <div>
                      <p className="text-sm text-gray-700">
                        Get EXTRA 10% Cashback on all Products above Rs.499!
                      </p>
                      <p className="text-xs text-green-700 font-medium mt-1">
                        Coupon code: <span className="bg-green-600 text-white px-1 py-0.5 rounded">GETCASH10</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Features */}
            <div className="text-sm text-gray-600 space-y-1">
              <p data-testid="text-shipping-info"><i className="fas fa-truck mr-2"></i>Free shipping on orders above ₹1000</p>
              <p data-testid="text-return-policy"><i className="fas fa-undo mr-2"></i>30-day return policy</p>
              <p data-testid="text-quality-guarantee"><i className="fas fa-shield-alt mr-2"></i>Quality guaranteed</p>
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
            <h3 className="text-lg font-semibold mb-3 text-gray-800" data-testid="text-description-title">Product Details</h3>
            <p className="text-gray-600 leading-relaxed text-sm" data-testid="text-full-description">{product.description}</p>
          </div>
        )}

        {/* Reviews Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold" data-testid="text-reviews-title">Customer Reviews</h3>
            {user && (
              <Button 
                onClick={() => setShowReviewForm(!showReviewForm)}
                data-testid="button-write-review"
              >
                Write a Review
              </Button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="mb-6 p-4 border rounded-lg">
              <h4 className="font-semibold mb-4" data-testid="text-review-form-title">Write Your Review</h4>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className={`text-2xl ${star <= reviewData.rating ? "text-warning" : "text-gray-300"}`}
                      data-testid={`button-rating-${star}`}
                    >
                      <i className="fas fa-star"></i>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={reviewData.title}
                  onChange={(e) => setReviewData({ ...reviewData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Review title"
                  data-testid="input-review-title"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Comment</label>
                <Textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  placeholder="Share your experience..."
                  data-testid="textarea-review-comment"
                />
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={handleSubmitReview}
                  disabled={createReviewMutation.isPending}
                  data-testid="button-submit-review"
                >
                  {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowReviewForm(false)}
                  data-testid="button-cancel-review"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review: any, index: number) => (
                <div key={review.id} className="border-b pb-4" data-testid={`review-${index}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="star-rating text-warning">
                        {Array.from({ length: 5 }, (_, i) => (
                          <i key={i} className={`${i < review.rating ? "fas" : "far"} fa-star`}></i>
                        ))}
                      </div>
                      {review.title && <span className="font-medium" data-testid={`text-review-title-${index}`}>{review.title}</span>}
                    </div>
                    <span className="text-sm text-gray-500" data-testid={`text-review-date-${index}`}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-gray-600" data-testid={`text-review-comment-${index}`}>{review.comment}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8" data-testid="text-no-reviews">No reviews yet. Be the first to review this product!</p>
            )}
          </div>
        </div>

        {/* Key Highlights Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Key Highlights</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <h4 className="text-xs font-medium text-gray-500 mb-1 uppercase">Design</h4>
              <p className="text-gray-800 font-medium text-sm">Graphic Print</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <h4 className="text-xs font-medium text-gray-500 mb-1 uppercase">Fit</h4>
              <p className="text-gray-800 font-medium text-sm">Comfortable Fit</p>
            </div>
            {product.tags && product.tags.length > 0 && (
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="text-xs font-medium text-gray-500 mb-1 uppercase">Category</h4>
                <p className="text-gray-800 font-medium text-sm capitalize">{product.tags[0]}</p>
              </div>
            )}
            <div className="bg-gray-50 p-3 rounded">
              <h4 className="text-xs font-medium text-gray-500 mb-1 uppercase">Occasion</h4>
              <p className="text-gray-800 font-medium text-sm">Casual Wear</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 py-12 border-t bg-white">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct: any) => (
              <div key={relatedProduct.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <Link href={`/product/${relatedProduct.slug}`}>
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img 
                      src={relatedProduct.imageUrl || "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/product/${relatedProduct.slug}`}>
                    <h3 className="font-medium text-gray-800 text-sm line-clamp-2 hover:text-blue-600 transition-colors mb-2">
                      {relatedProduct.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900">₹{relatedProduct.salePrice || relatedProduct.price}</span>
                      {relatedProduct.salePrice && (
                        <span className="text-xs text-gray-500 line-through">₹{relatedProduct.price}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-xs text-gray-600">{relatedProduct.rating || "4.5"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
      <CartSidebar />
    </div>
  );
}
