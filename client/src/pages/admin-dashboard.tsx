import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  salePrice: z.string().optional(),
  sku: z.string().optional(),
  stock: z.number().min(0, "Stock must be 0 or greater"),
  imageUrl: z.string().url("Please enter a valid image URL"),
  categoryId: z.string().min(1, "Category is required"),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isOnSale: z.boolean().default(false),
});

type ProductForm = z.infer<typeof productSchema>;

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      toast({
        title: "Access Denied",
        description: "Admin access required",
        variant: "destructive",
      });
      window.location.href = "/admin/login";
    }
  }, [user, authLoading, toast]);

  // Fetch data
  const { data: products = { products: [], total: 0 }, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products", { limit: 100 }],
    enabled: !!user?.isAdmin,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
    enabled: !!user?.isAdmin,
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
    enabled: !!user?.isAdmin,
  });

  // Product form
  const productForm = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      shortDescription: "",
      price: "",
      salePrice: "",
      sku: "",
      stock: 0,
      imageUrl: "",
      categoryId: "",
      sizes: [],
      colors: [],
      tags: [],
      isActive: true,
      isFeatured: false,
      isOnSale: false,
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      return await apiRequest("POST", "/api/products", productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product Created",
        description: "Product has been created successfully",
      });
      setIsProductDialogOpen(false);
      productForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    },
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const onSubmitProduct = (data: ProductForm) => {
    const productData = {
      ...data,
      price: parseFloat(data.price),
      salePrice: data.salePrice ? parseFloat(data.salePrice) : null,
      sizes: data.sizes?.filter(Boolean) || [],
      colors: data.colors?.filter(Boolean) || [],
      tags: data.tags?.filter(Boolean) || [],
    };

    createProductMutation.mutate(productData);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Calculate stats
  const totalProducts = products?.products?.length || 0;
  const totalOrders = Array.isArray(orders) ? orders.length : 0;
  const totalRevenue = Array.isArray(orders) ? orders.reduce((sum: number, order: any) => sum + parseFloat(order.totalAmount || "0"), 0) : 0;
  const pendingOrders = Array.isArray(orders) ? orders.filter((order: any) => order.status === "pending").length : 0;

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

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-baby text-white"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">YouGotPlanB</h1>
              <p className="text-sm text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === "dashboard"
                ? "bg-pink-50 text-pink-600 border-l-4 border-pink-500"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            data-testid="nav-dashboard"
          >
            <i className="fas fa-chart-bar w-5"></i>
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === "products"
                ? "bg-pink-50 text-pink-600 border-l-4 border-pink-500"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            data-testid="nav-products"
          >
            <i className="fas fa-box w-5"></i>
            <span>Products</span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === "categories"
                ? "bg-pink-50 text-pink-600 border-l-4 border-pink-500"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            data-testid="nav-categories"
          >
            <i className="fas fa-tags w-5"></i>
            <span>Categories</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === "orders"
                ? "bg-pink-50 text-pink-600 border-l-4 border-pink-500"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            data-testid="nav-orders"
          >
            <i className="fas fa-shopping-cart w-5"></i>
            <span>Orders</span>
          </button>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t bg-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-gray-600 text-sm"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{user?.firstName}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full"
            data-testid="button-admin-logout"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{totalProducts}</div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{totalOrders}</div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">₹{totalRevenue.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{pendingOrders}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : !Array.isArray(orders) || orders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No orders yet</p>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Order #{order.id.slice(-8)}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{order.totalAmount}</p>
                          <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Products */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-800">Products Management</h2>
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-pink-500 to-blue-500">
                    <i className="fas fa-plus mr-2"></i>
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  
                  <Form {...productForm}>
                    <form onSubmit={productForm.handleSubmit(onSubmitProduct)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={productForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product Name</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="Product name"
                                  onChange={(e) => {
                                    field.onChange(e);
                                    productForm.setValue("slug", generateSlug(e.target.value));
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={productForm.control}
                          name="categoryId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Array.isArray(categories) && categories.map((category: any) => (
                                    <SelectItem key={category.id} value={category.id}>
                                      {category.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={productForm.control}
                        name="shortDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Short Description</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Brief product description" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={productForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Detailed product description" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={productForm.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price (₹)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" step="0.01" placeholder="0.00" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={productForm.control}
                          name="salePrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sale Price (₹)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" step="0.01" placeholder="0.00" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={productForm.control}
                          name="stock"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Stock</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  placeholder="0"
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={productForm.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="https://example.com/image.jpg" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-4">
                        <Button type="button" variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createProductMutation.isPending}>
                          {createProductMutation.isPending ? "Creating..." : "Create Product"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Products List */}
            <Card>
              <CardContent className="p-6">
                {productsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : !products?.products || products.products.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No products found</p>
                ) : (
                  <div className="space-y-4">
                    {products?.products && products.products.map((product: any) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <img
                            src={product.imageUrl || "https://via.placeholder.com/60"}
                            alt={product.name}
                            className="w-15 h-15 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-gray-600">{product.shortDescription}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={product.isActive ? "default" : "secondary"}>
                                {product.isActive ? "Active" : "Inactive"}
                              </Badge>
                              {product.isFeatured && <Badge variant="secondary">Featured</Badge>}
                              {product.isOnSale && <Badge variant="destructive">On Sale</Badge>}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{product.price}</p>
                          {product.salePrice && (
                            <p className="text-sm text-gray-500 line-through">₹{product.salePrice}</p>
                          )}
                          <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Categories */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Categories</h2>
            <Card>
              <CardContent className="p-6">
                {categoriesLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : !Array.isArray(categories) || categories.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No categories found</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.isArray(categories) && categories.map((category: any) => (
                      <Card key={category.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={category.imageUrl || "https://via.placeholder.com/50"}
                              alt={category.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <h3 className="font-medium">{category.name}</h3>
                              <p className="text-sm text-gray-600">{category.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Orders Management</h2>
            <Card>
              <CardContent className="p-6">
                {ordersLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : !Array.isArray(orders) || orders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No orders found</p>
                ) : (
                  <div className="space-y-4">
                    {Array.isArray(orders) && orders.map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Order #{order.id.slice(-8)}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">Customer ID: {order.userId}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{order.totalAmount}</p>
                          <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}