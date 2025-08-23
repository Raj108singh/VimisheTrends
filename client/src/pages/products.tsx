import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Product, Category } from "@shared/schema";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import CartSidebar from "@/components/cart-sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Products() {
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    minPrice: 0,
    maxPrice: 5000,
    isOnSale: false,
    page: 1,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const isMobile = useIsMobile();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    retry: false,
  });

  const { data: productsData, isLoading } = useQuery<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>({
    queryKey: ["/api/products", filters],
    retry: false,
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({ ...prev, minPrice: value[0], maxPrice: value[1] }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      categoryId: "",
      minPrice: 0,
      maxPrice: 5000,
      isOnSale: false,
      page: 1,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-4">
        {/* Mobile Filter Toggle */}
        {isMobile && (
          <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-lg shadow-sm">
            <h1 className="text-xl font-bold text-gray-900">Products</h1>
            <Button
              variant="outline"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2"
              data-testid="button-toggle-filters"
            >
              <i className="fas fa-filter"></i>
              Filters
            </Button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${isMobile ? (showMobileFilters ? 'block' : 'hidden') : ''}`}>
            <div className="bg-white p-4 lg:p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold" data-testid="text-filters-title">Filters</h3>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    onClick={clearFilters}
                    className="text-sm text-pink-600"
                    data-testid="button-clear-filters"
                  >
                    Clear All
                  </Button>
                  {isMobile && (
                    <Button
                      variant="ghost"
                      onClick={() => setShowMobileFilters(false)}
                      className="lg:hidden"
                    >
                      <i className="fas fa-times"></i>
                    </Button>
                  )}
                </div>
              </div>

              {/* Search */}
              <div className="mb-6">
                <Label htmlFor="search" className="text-sm font-medium mb-2 block">Search</Label>
                <Input
                  id="search"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  data-testid="input-search"
                />
              </div>

              {/* Category */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-2 block">Category</Label>
                <Select value={filters.categoryId} onValueChange={(value) => handleFilterChange("categoryId", value)}>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-2 block">Price Range</Label>
                <div className="px-2">
                  <Slider
                    value={[filters.minPrice, filters.maxPrice]}
                    onValueChange={handlePriceChange}
                    min={0}
                    max={5000}
                    step={100}
                    className="mb-4"
                    data-testid="slider-price"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span data-testid="text-min-price">₹{filters.minPrice}</span>
                    <span data-testid="text-max-price">₹{filters.maxPrice}</span>
                  </div>
                </div>
              </div>

              {/* Sale Only */}
              <div className="mb-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.isOnSale}
                    onChange={(e) => handleFilterChange("isOnSale", e.target.checked)}
                    className="rounded border-gray-300"
                    data-testid="checkbox-sale-only"
                  />
                  <span className="text-sm font-medium">Sale Items Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold" data-testid="text-products-title">Products</h1>
                {productsData && (
                  <p className="text-gray-600" data-testid="text-products-count">
                    {productsData.total} products found
                  </p>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                    <div className="w-full h-32 md:h-64 bg-gray-200"></div>
                    <div className="p-2 md:p-4">
                      <div className="h-3 md:h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 md:h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-6 md:h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : productsData?.products?.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-8">
                  {productsData?.products?.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {productsData?.totalPages && productsData.totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleFilterChange("page", Math.max(1, filters.page - 1))}
                      disabled={filters.page === 1}
                      data-testid="button-prev-page"
                    >
                      Previous
                    </Button>
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, productsData?.totalPages || 1) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            variant={filters.page === page ? "default" : "outline"}
                            onClick={() => handleFilterChange("page", page)}
                            className="w-10 h-10"
                            data-testid={`button-page-${page}`}
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handleFilterChange("page", Math.min(productsData?.totalPages || 1, filters.page + 1))}
                      disabled={filters.page === (productsData?.totalPages || 1)}
                      data-testid="button-next-page"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4" data-testid="text-no-products">No products found</div>
                <Button onClick={clearFilters} data-testid="button-clear-filters-empty">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <CartSidebar />
    </div>
  );
}
