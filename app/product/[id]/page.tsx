'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id;
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Sample product data - in real app, this would be fetched based on productId
  const product = {
    id: parseInt(productId as string) || 1,
    name: "Comfort First Training Bra - 3 Pack",
    category: "Training Bras",
    price: 899,
    originalPrice: 1299,
    discount: 31,
    packInfo: "3-Pack",
    images: [
      "/api/placeholder/500/600",
      "/api/placeholder/500/600",
      "/api/placeholder/500/600"
    ],
    description: "Soft cotton training bras perfect for growing girls. Made with premium cotton blend for all-day comfort and support during this important transition phase.",
    features: [
      "100% Cotton Inner Lining for sensitive skin",
      "No Underwire for maximum comfort",
      "Adjustable Straps for perfect fit",
      "Breathable Fabric prevents irritation",
      "Machine Washable for easy care"
    ],
    ageGroup: "8-14 years",
    sizes: ["28", "30", "32", "34"],
    fabric: "Cotton Spandex Blend",
    colors: ["Pink", "White", "Peach"],
    rating: 4.8,
    reviews: 156,
    tags: ["bestseller", "comfort", "cotton"],
    careInstructions: "Machine wash cold with like colors. Tumble dry low. Do not bleach."
  };

  const reviews = [
    {
      id: 1,
      name: "Priya M.",
      rating: 5,
      comment: "Perfect first bra for my daughter. Very comfortable and good quality.",
      date: "2 weeks ago"
    },
    {
      id: 2,
      name: "Sunita K.",
      rating: 4,
      comment: "Good value for money. My daughter loves the soft fabric.",
      date: "1 month ago"
    },
    {
      id: 3,
      name: "Meera S.",
      rating: 5,
      comment: "Excellent quality! Will definitely buy again.",
      date: "1 month ago"
    }
  ];

  const addToCart = () => {
    // Cart logic would go here - no login required
    alert('Added to cart! Go to checkout to complete your purchase.');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 px-4">
        <div className="container mx-auto">
          <div className="text-sm text-gray-600">
            <Link href="/" className="hover:text-pink-500">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-pink-500">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{product.category}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <span className="text-8xl opacity-50">👙</span>
              </div>
              <div className="absolute top-4 left-4">
                <Badge className="bg-green-500 text-white">{product.discount}% OFF</Badge>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {product.images.map((_, index) => (
                <div 
                  key={index}
                  className={`w-full h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg cursor-pointer border-2 ${
                    activeImageIndex === index ? 'border-pink-500' : 'border-gray-200'
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl opacity-50">👙</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                  <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
                  <Badge className="bg-green-100 text-green-800">{product.discount}% OFF</Badge>
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-400 text-lg">★★★★★</span>
                  <span className="ml-2 text-gray-600">({product.rating}) {product.reviews} reviews</span>
                </div>
                <Badge variant="outline" className="bg-pink-50 text-pink-600">{product.packInfo}</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      className={selectedSize === size ? "bg-pink-500 hover:bg-pink-600" : ""}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedColor(color)}
                      className={selectedColor === color ? "bg-pink-500 hover:bg-pink-600" : ""}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="text-lg font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button 
                onClick={addToCart}
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3"
              >
                Add to Cart
              </Button>
              <Button variant="outline" className="px-6">
                <span className="text-xl">🤍</span>
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Key Features</h3>
                <ul className="space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-gray-600 text-sm flex items-start">
                      <span className="text-pink-500 mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Product Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-600">Age Group:</span>
                  <span>{product.ageGroup}</span>
                  <span className="text-gray-600">Fabric:</span>
                  <span>{product.fabric}</span>
                  <span className="text-gray-600">Care:</span>
                  <span>{product.careInstructions}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold text-gray-800">{review.name}</span>
                    <div className="flex items-center">
                      <span className="text-yellow-400">{'★'.repeat(review.rating)}</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}