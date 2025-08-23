import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  imageUrl: z.string().url("Please enter a valid image URL").optional(),
  parentId: z.string().optional(),
  isActive: z.boolean().default(true),
});

type ProductForm = z.infer<typeof productSchema>;
type CategoryForm = z.infer<typeof categorySchema>;

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [user, authLoading, toast]);

  // Fetch data
  const { data: products = { products: [], total: 0 }, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products", { limit: 100 }],
    retry: false,
    enabled: !!user?.isAdmin,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
    retry: false,
    enabled: !!user?.isAdmin,
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
    retry: false,
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

  // Category form
  const categoryForm = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
      parentId: "",
      isActive: true,
    },
  });

  // Mutations
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
        description: "Failed to create product",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiRequest("PUT", `/api/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product Updated",
        description: "Product has been updated successfully",
      });
      setIsProductDialogOpen(false);
      setEditingProduct(null);
      productForm.reset();
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
        description: "Failed to update product",
        variant: "destructive",
      });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: any) => {
      return await apiRequest("POST", "/api/categories", categoryData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Category Created",
        description: "Category has been created successfully",
      });
      setIsCategoryDialogOpen(false);
      categoryForm.reset();
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
        description: "Failed to create category",
        variant: "destructive",
      });
    },
  });

  // Form handlers
  const onSubmitProduct = (data: ProductForm) => {
    const productData = {
      ...data,
      price: data.price.toString(),
      salePrice: data.salePrice || null,
      sizes: data.sizes?.filter(Boolean) || [],
      colors: data.colors?.filter(Boolean) || [],
      tags: data.tags?.filter(Boolean) || [],
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: productData });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  const onSubmitCategory = (data: CategoryForm) => {
    const categoryData = {
      ...data,
      parentId: data.parentId || null,
    };

    createCategoryMutation.mutate(categoryData);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    productForm.reset({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      shortDescription: product.shortDescription || "",
      price: product.price,
      salePrice: product.salePrice || "",
      sku: product.sku || "",
      stock: product.stock || 0,
      imageUrl: product.imageUrl || "",
      categoryId: product.categoryId,
      sizes: product.sizes || [],
      colors: product.colors || [],
      tags: product.tags || [],
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      isOnSale: product.isOnSale,
    });
    setIsProductDialogOpen(true);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  // Calculate dashboard stats
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
    return null; // Redirect is handled in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8" data-testid="text-admin-title">
            Admin Dashboard
          </h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4" data-testid="tabs-admin">
              <TabsTrigger value="dashboard" data-testid="tab-dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="products" data-testid="tab-products">Products</TabsTrigger>
              <TabsTrigger value="categories" data-testid="tab-categories">Categories</TabsTrigger>
              <TabsTrigger value="orders" data-testid="tab-orders">Orders</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card data-testid="card-total-products">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <i className="fas fa-box text-primary"></i>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="text-total-products">{totalProducts}</div>
                  </CardContent>
                </Card>

                <Card data-testid="card-total-orders">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <i className="fas fa-shopping-cart text-primary"></i>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="text-total-orders">{totalOrders}</div>
                  </CardContent>
                </Card>

                <Card data-testid="card-total-revenue">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <i className="fas fa-rupee-sign text-primary"></i>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="text-total-revenue">₹{totalRevenue.toFixed(2)}</div>
                  </CardContent>
                </Card>

                <Card data-testid="card-pending-orders">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                    <i className="fas fa-clock text-warning"></i>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="text-pending-orders">{pendingOrders}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle data-testid="text-recent-orders-title">Recent Orders</CardTitle>
                  <CardDescription>Latest orders from customers</CardDescription>
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
                    <p className="text-gray-500 text-center py-8" data-testid="text-no-recent-orders">No orders yet</p>
                  ) : (
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`recent-order-${order.id}`}>
                          <div>
                            <p className="font-medium" data-testid={`text-recent-order-id-${order.id}`}>
                              Order #{order.id.slice(-8)}
                            </p>
                            <p className="text-sm text-gray-600" data-testid={`text-recent-order-date-${order.id}`}>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold" data-testid={`text-recent-order-amount-${order.id}`}>
                              ₹{order.totalAmount}
                            </p>
                            <Badge 
                              variant={order.status === "delivered" ? "default" : "secondary"}
                              data-testid={`badge-recent-order-status-${order.id}`}
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold" data-testid="text-products-title">Products Management</h2>
                <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-product">
                      <i className="fas fa-plus mr-2"></i>
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle data-testid="text-product-dialog-title">
                        {editingProduct ? "Edit Product" : "Add New Product"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingProduct ? "Update product information" : "Create a new product for your store"}
                      </DialogDescription>
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
                                      if (!editingProduct) {
                                        productForm.setValue("slug", generateSlug(e.target.value));
                                      }
                                    }}
                                    data-testid="input-product-name"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={productForm.control}
                            name="slug"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="product-slug" data-testid="input-product-slug" />
                                </FormControl>
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
                                <Input {...field} placeholder="Brief product description" data-testid="input-product-short-description" />
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
                                <Textarea {...field} placeholder="Detailed product description" data-testid="textarea-product-description" />
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
                                  <Input {...field} type="number" step="0.01" placeholder="0.00" data-testid="input-product-price" />
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
                                  <Input {...field} type="number" step="0.01" placeholder="0.00" data-testid="input-product-sale-price" />
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
                                    data-testid="input-product-stock"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={productForm.control}
                            name="sku"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>SKU</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Product SKU" data-testid="input-product-sku" />
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
                                    <SelectTrigger data-testid="select-product-category">
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
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="https://example.com/image.jpg" data-testid="input-product-image-url" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex space-x-4">
                          <FormField
                            control={productForm.control}
                            name="isActive"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    data-testid="checkbox-product-active"
                                  />
                                </FormControl>
                                <FormLabel>Active</FormLabel>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={productForm.control}
                            name="isFeatured"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    data-testid="checkbox-product-featured"
                                  />
                                </FormControl>
                                <FormLabel>Featured</FormLabel>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={productForm.control}
                            name="isOnSale"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    data-testid="checkbox-product-on-sale"
                                  />
                                </FormControl>
                                <FormLabel>On Sale</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsProductDialogOpen(false);
                              setEditingProduct(null);
                              productForm.reset();
                            }}
                            data-testid="button-cancel-product"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={createProductMutation.isPending || updateProductMutation.isPending}
                            data-testid="button-save-product"
                          >
                            {createProductMutation.isPending || updateProductMutation.isPending
                              ? "Saving..."
                              : editingProduct
                              ? "Update Product"
                              : "Create Product"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {productsLoading ? (
                  <div className="p-6">
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-16 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : products?.products?.length === 0 ? (
                  <div className="p-6 text-center">
                    <i className="fas fa-box text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500" data-testid="text-no-products">No products found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products.products.map((product: any) => (
                          <tr key={product.id} data-testid={`product-row-${product.id}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  src={product.imageUrl || "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded-lg"
                                  data-testid={`img-product-${product.id}`}
                                />
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900" data-testid={`text-product-name-${product.id}`}>
                                    {product.name}
                                  </div>
                                  <div className="text-sm text-gray-500" data-testid={`text-product-sku-${product.id}`}>
                                    SKU: {product.sku || "N/A"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900" data-testid={`text-product-price-${product.id}`}>
                                ₹{product.salePrice || product.price}
                                {product.salePrice && (
                                  <span className="text-gray-500 line-through ml-2">₹{product.price}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900" data-testid={`text-product-stock-${product.id}`}>
                                {product.stock || 0}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex space-x-1">
                                {product.isActive && (
                                  <Badge variant="default" data-testid={`badge-product-active-${product.id}`}>Active</Badge>
                                )}
                                {product.isFeatured && (
                                  <Badge variant="secondary" data-testid={`badge-product-featured-${product.id}`}>Featured</Badge>
                                )}
                                {product.isOnSale && (
                                  <Badge variant="destructive" data-testid={`badge-product-sale-${product.id}`}>Sale</Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                                data-testid={`button-edit-product-${product.id}`}
                              >
                                Edit
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold" data-testid="text-categories-title">Categories Management</h2>
                <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-category">
                      <i className="fas fa-plus mr-2"></i>
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle data-testid="text-category-dialog-title">Add New Category</DialogTitle>
                      <DialogDescription>Create a new product category</DialogDescription>
                    </DialogHeader>
                    
                    <Form {...categoryForm}>
                      <form onSubmit={categoryForm.handleSubmit(onSubmitCategory)} className="space-y-4">
                        <FormField
                          control={categoryForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category Name</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="Category name"
                                  onChange={(e) => {
                                    field.onChange(e);
                                    categoryForm.setValue("slug", generateSlug(e.target.value));
                                  }}
                                  data-testid="input-category-name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={categoryForm.control}
                          name="slug"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Slug</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="category-slug" data-testid="input-category-slug" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={categoryForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea {...field} placeholder="Category description" data-testid="textarea-category-description" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={categoryForm.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="https://example.com/image.jpg" data-testid="input-category-image-url" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={categoryForm.control}
                          name="parentId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Parent Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-parent-category">
                                    <SelectValue placeholder="Select parent category (optional)" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="">No Parent</SelectItem>
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

                        <FormField
                          control={categoryForm.control}
                          name="isActive"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  data-testid="checkbox-category-active"
                                />
                              </FormControl>
                              <FormLabel>Active</FormLabel>
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsCategoryDialogOpen(false);
                              categoryForm.reset();
                            }}
                            data-testid="button-cancel-category"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={createCategoryMutation.isPending}
                            data-testid="button-save-category"
                          >
                            {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoriesLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="w-full h-32 bg-gray-200 rounded-lg mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))
                ) : categories.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <i className="fas fa-tags text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500" data-testid="text-no-categories">No categories found</p>
                  </div>
                ) : (
                  categories.map((category: any) => (
                    <Card key={category.id} data-testid={`category-card-${category.id}`}>
                      <CardContent className="p-6">
                        <img
                          src={category.imageUrl || "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"}
                          alt={category.name}
                          className="w-full h-32 object-cover rounded-lg mb-4"
                          data-testid={`img-category-${category.id}`}
                        />
                        <h3 className="font-semibold text-lg mb-2" data-testid={`text-category-name-${category.id}`}>
                          {category.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4" data-testid={`text-category-description-${category.id}`}>
                          {category.description || "No description"}
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge variant={category.isActive ? "default" : "secondary"} data-testid={`badge-category-status-${category.id}`}>
                            {category.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Button variant="outline" size="sm" data-testid={`button-edit-category-${category.id}`}>
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <h2 className="text-2xl font-bold" data-testid="text-orders-title">Orders Management</h2>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {ordersLoading ? (
                  <div className="p-6">
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-16 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="p-6 text-center">
                    <i className="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500" data-testid="text-no-orders">No orders found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order: any) => (
                          <tr key={order.id} data-testid={`order-row-${order.id}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900" data-testid={`text-order-id-${order.id}`}>
                                #{order.id.slice(-8)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900" data-testid={`text-order-customer-${order.id}`}>
                                {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                              </div>
                              <div className="text-sm text-gray-500" data-testid={`text-order-customer-email-${order.id}`}>
                                {order.shippingAddress?.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900" data-testid={`text-order-date-${order.id}`}>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900" data-testid={`text-order-total-${order.id}`}>
                                ₹{order.totalAmount}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge 
                                variant={order.status === "delivered" ? "default" : order.status === "cancelled" ? "destructive" : "secondary"}
                                data-testid={`badge-order-status-${order.id}`}
                              >
                                {order.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900" data-testid={`text-order-payment-${order.id}`}>
                                {order.paymentMethod || "N/A"}
                              </div>
                              <Badge 
                                variant={order.paymentStatus === "paid" ? "default" : "secondary"}
                                data-testid={`badge-payment-status-${order.id}`}
                              >
                                {order.paymentStatus || "pending"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
