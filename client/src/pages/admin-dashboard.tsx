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
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Schema definitions
const siteSettingSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string(),
  category: z.string().min(1, "Category is required"),
  type: z.string().default("text"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

const sliderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  imageUrl: z.string().url("Please enter a valid image URL"),
  linkUrl: z.string().url("Please enter a valid link URL").optional(),
  buttonText: z.string().optional(),
  position: z.number().min(0, "Position must be 0 or greater"),
  type: z.string().default("slider"),
  placement: z.string().default("home"),
  isActive: z.boolean().default(true),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const couponSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.string().min(1, "Type is required"),
  value: z.string().min(1, "Value is required"),
  minimumAmount: z.string().optional(),
  maximumDiscount: z.string().optional(),
  usageLimit: z.number().optional(),
  userLimit: z.number().default(1),
  isActive: z.boolean().default(true),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const paymentSettingSchema = z.object({
  provider: z.string().min(1, "Provider is required"),
  displayName: z.string().min(1, "Display name is required"),
  apiKey: z.string().optional(),
  secretKey: z.string().optional(),
  webhookSecret: z.string().optional(),
  isActive: z.boolean().default(false),
  isTestMode: z.boolean().default(true),
  supportedCurrencies: z.array(z.string()).default(["INR"]),
});

type SiteSettingForm = z.infer<typeof siteSettingSchema>;
type SliderForm = z.infer<typeof sliderSchema>;
type CouponForm = z.infer<typeof couponSchema>;
type PaymentSettingForm = z.infer<typeof paymentSettingSchema>;

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeSubTab, setActiveSubTab] = useState("overview");
  const [isSettingDialogOpen, setIsSettingDialogOpen] = useState(false);
  const [isSliderDialogOpen, setIsSliderDialogOpen] = useState(false);
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

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

  // Fetch admin data
  const { data: siteSettings = [], isLoading: settingsLoading } = useQuery({
    queryKey: ["/api/admin/site-settings"],
    enabled: !!user?.isAdmin,
  });

  const { data: sliders = [], isLoading: slidersLoading } = useQuery({
    queryKey: ["/api/admin/sliders"],
    enabled: !!user?.isAdmin,
  });

  const { data: coupons = [], isLoading: couponsLoading } = useQuery({
    queryKey: ["/api/admin/coupons"],
    enabled: !!user?.isAdmin,
  });

  const { data: paymentSettings = [], isLoading: paymentLoading } = useQuery({
    queryKey: ["/api/admin/payment-settings"],
    enabled: !!user?.isAdmin,
  });

  const { data: customers = { customers: [], total: 0 }, isLoading: customersLoading } = useQuery({
    queryKey: ["/api/admin/customers", { limit: 100 }],
    enabled: !!user?.isAdmin,
  });

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/admin/analytics/summary"],
    enabled: !!user?.isAdmin,
  });

  // Forms
  const siteSettingForm = useForm<SiteSettingForm>({
    resolver: zodResolver(siteSettingSchema),
    defaultValues: {
      key: "",
      value: "",
      category: "",
      type: "text",
      description: "",
      isActive: true,
    },
  });

  const sliderForm = useForm<SliderForm>({
    resolver: zodResolver(sliderSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      linkUrl: "",
      buttonText: "",
      position: 0,
      type: "slider",
      placement: "home",
      isActive: true,
      startDate: "",
      endDate: "",
    },
  });

  const couponForm = useForm<CouponForm>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      title: "",
      description: "",
      type: "percentage",
      value: "",
      minimumAmount: "",
      maximumDiscount: "",
      usageLimit: undefined,
      userLimit: 1,
      isActive: true,
      startDate: "",
      endDate: "",
    },
  });

  const paymentForm = useForm<PaymentSettingForm>({
    resolver: zodResolver(paymentSettingSchema),
    defaultValues: {
      provider: "",
      displayName: "",
      apiKey: "",
      secretKey: "",
      webhookSecret: "",
      isActive: false,
      isTestMode: true,
      supportedCurrencies: ["INR"],
    },
  });

  // Mutations
  const createSiteSettingMutation = useMutation({
    mutationFn: async (data: any) => await apiRequest("POST", "/api/admin/site-settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-settings"] });
      toast({ title: "Setting saved successfully" });
      setIsSettingDialogOpen(false);
      siteSettingForm.reset();
    },
    onError: () => toast({ title: "Error", description: "Failed to save setting", variant: "destructive" }),
  });

  const createSliderMutation = useMutation({
    mutationFn: async (data: any) => await apiRequest("POST", "/api/admin/sliders", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sliders"] });
      toast({ title: "Slider saved successfully" });
      setIsSliderDialogOpen(false);
      sliderForm.reset();
    },
    onError: () => toast({ title: "Error", description: "Failed to save slider", variant: "destructive" }),
  });

  const createCouponMutation = useMutation({
    mutationFn: async (data: any) => await apiRequest("POST", "/api/admin/coupons", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coupons"] });
      toast({ title: "Coupon created successfully" });
      setIsCouponDialogOpen(false);
      couponForm.reset();
    },
    onError: () => toast({ title: "Error", description: "Failed to create coupon", variant: "destructive" }),
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (data: any) => await apiRequest("POST", "/api/admin/payment-settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payment-settings"] });
      toast({ title: "Payment setting saved successfully" });
      setIsPaymentDialogOpen(false);
      paymentForm.reset();
    },
    onError: () => toast({ title: "Error", description: "Failed to save payment setting", variant: "destructive" }),
  });

  const deleteItemMutation = useMutation({
    mutationFn: async ({ endpoint, id }: { endpoint: string; id: string }) => 
      await apiRequest("DELETE", `${endpoint}/${id}`),
    onSuccess: (_, variables) => {
      const queryKeys = {
        "/api/admin/site-settings": ["/api/admin/site-settings"],
        "/api/admin/sliders": ["/api/admin/sliders"],
        "/api/admin/coupons": ["/api/admin/coupons"],
        "/api/admin/payment-settings": ["/api/admin/payment-settings"],
      };
      const key = queryKeys[variables.endpoint as keyof typeof queryKeys];
      if (key) queryClient.invalidateQueries({ queryKey: key });
      toast({ title: "Item deleted successfully" });
    },
    onError: () => toast({ title: "Error", description: "Failed to delete item", variant: "destructive" }),
  });

  // Form handlers
  const onSubmitSiteSetting = (data: SiteSettingForm) => {
    createSiteSettingMutation.mutate(data);
  };

  const onSubmitSlider = (data: SliderForm) => {
    const sliderData = {
      ...data,
      position: Number(data.position),
      startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
    };
    createSliderMutation.mutate(sliderData);
  };

  const onSubmitCoupon = (data: CouponForm) => {
    const couponData = {
      ...data,
      value: parseFloat(data.value),
      minimumAmount: data.minimumAmount ? parseFloat(data.minimumAmount) : null,
      maximumDiscount: data.maximumDiscount ? parseFloat(data.maximumDiscount) : null,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
    };
    createCouponMutation.mutate(couponData);
  };

  const onSubmitPayment = (data: PaymentSettingForm) => {
    createPaymentMutation.mutate(data);
  };

  const handleDelete = (endpoint: string, id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteItemMutation.mutate({ endpoint, id });
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
      <div className="w-72 bg-white shadow-lg">
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
            onClick={() => setActiveTab("content")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === "content"
                ? "bg-pink-50 text-pink-600 border-l-4 border-pink-500"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            data-testid="nav-content"
          >
            <i className="fas fa-edit w-5"></i>
            <span>Website Content</span>
          </button>

          <button
            onClick={() => setActiveTab("sliders")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === "sliders"
                ? "bg-pink-50 text-pink-600 border-l-4 border-pink-500"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            data-testid="nav-sliders"
          >
            <i className="fas fa-images w-5"></i>
            <span>Sliders & Banners</span>
          </button>

          <button
            onClick={() => setActiveTab("coupons")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === "coupons"
                ? "bg-pink-50 text-pink-600 border-l-4 border-pink-500"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            data-testid="nav-coupons"
          >
            <i className="fas fa-tags w-5"></i>
            <span>Coupons & Offers</span>
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === "payments"
                ? "bg-pink-50 text-pink-600 border-l-4 border-pink-500"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            data-testid="nav-payments"
          >
            <i className="fas fa-credit-card w-5"></i>
            <span>Payment Settings</span>
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === "customers"
                ? "bg-pink-50 text-pink-600 border-l-4 border-pink-500"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            data-testid="nav-customers"
          >
            <i className="fas fa-users w-5"></i>
            <span>Customers</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === "analytics"
                ? "bg-pink-50 text-pink-600 border-l-4 border-pink-500"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            data-testid="nav-analytics"
          >
            <i className="fas fa-chart-line w-5"></i>
            <span>Analytics</span>
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

        <div className="absolute bottom-0 w-72 p-4 border-t bg-white">
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
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Dashboard Overview */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {customers?.total || 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Page Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {analyticsData?.totalPageViews || 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    ₹{analyticsData?.totalRevenue?.toFixed(2) || "0.00"}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Coupons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {coupons?.filter((c: any) => c.isActive)?.length || 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your website content and settings</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  onClick={() => setActiveTab("content")}
                  variant="outline"
                  className="h-16 flex flex-col items-center space-y-2"
                  data-testid="quick-action-content"
                >
                  <i className="fas fa-edit text-lg"></i>
                  <span className="text-sm">Edit Content</span>
                </Button>
                <Button
                  onClick={() => setActiveTab("sliders")}
                  variant="outline"
                  className="h-16 flex flex-col items-center space-y-2"
                  data-testid="quick-action-sliders"
                >
                  <i className="fas fa-images text-lg"></i>
                  <span className="text-sm">Manage Sliders</span>
                </Button>
                <Button
                  onClick={() => setActiveTab("coupons")}
                  variant="outline"
                  className="h-16 flex flex-col items-center space-y-2"
                  data-testid="quick-action-coupons"
                >
                  <i className="fas fa-tags text-lg"></i>
                  <span className="text-sm">Create Coupons</span>
                </Button>
                <Button
                  onClick={() => setActiveTab("analytics")}
                  variant="outline"
                  className="h-16 flex flex-col items-center space-y-2"
                  data-testid="quick-action-analytics"
                >
                  <i className="fas fa-chart-line text-lg"></i>
                  <span className="text-sm">View Analytics</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Website Content Management */}
        {activeTab === "content" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-800">Website Content Management</h2>
              <Dialog open={isSettingDialogOpen} onOpenChange={setIsSettingDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-setting">
                    <i className="fas fa-plus mr-2"></i>
                    Add Setting
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Site Setting</DialogTitle>
                  </DialogHeader>
                  <Form {...siteSettingForm}>
                    <form onSubmit={siteSettingForm.handleSubmit(onSubmitSiteSetting)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={siteSettingForm.control}
                          name="key"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Setting Key</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., site_name, header_logo" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={siteSettingForm.control}
                          name="category"
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
                                  <SelectItem value="header">Header</SelectItem>
                                  <SelectItem value="footer">Footer</SelectItem>
                                  <SelectItem value="menu">Menu</SelectItem>
                                  <SelectItem value="general">General</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={siteSettingForm.control}
                        name="value"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Value</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Setting value" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={siteSettingForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Setting description" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsSettingDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createSiteSettingMutation.isPending}>
                          {createSiteSettingMutation.isPending ? "Saving..." : "Save Setting"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Site Settings by Category */}
            <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
              <TabsList>
                <TabsTrigger value="header">Header</TabsTrigger>
                <TabsTrigger value="footer">Footer</TabsTrigger>
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
              </TabsList>

              {["header", "footer", "menu", "general"].map((category) => (
                <TabsContent key={category} value={category}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="capitalize">{category} Settings</CardTitle>
                      <CardDescription>
                        Manage your website's {category} content and appearance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {settingsLoading ? (
                        <div className="space-y-4">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="animate-pulse h-16 bg-gray-200 rounded"></div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {siteSettings
                            .filter((setting: any) => setting.category === category)
                            .map((setting: any) => (
                              <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                  <h3 className="font-medium">{setting.key}</h3>
                                  <p className="text-sm text-gray-600">{setting.description}</p>
                                  <p className="text-sm text-gray-500 mt-1">{setting.value}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant={setting.isActive ? "default" : "secondary"}>
                                    {setting.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete("/api/admin/site-settings", setting.id)}
                                  >
                                    <i className="fas fa-trash"></i>
                                  </Button>
                                </div>
                              </div>
                            ))}
                          {siteSettings.filter((setting: any) => setting.category === category).length === 0 && (
                            <p className="text-gray-500 text-center py-8">
                              No {category} settings found. Add your first setting above.
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}

        {/* Sliders & Banners Management */}
        {activeTab === "sliders" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-800">Sliders & Banners</h2>
              <Dialog open={isSliderDialogOpen} onOpenChange={setIsSliderDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-slider">
                    <i className="fas fa-plus mr-2"></i>
                    Add Slider
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Slider/Banner</DialogTitle>
                  </DialogHeader>
                  <Form {...sliderForm}>
                    <form onSubmit={sliderForm.handleSubmit(onSubmitSlider)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={sliderForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Slider title" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={sliderForm.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="slider">Slider</SelectItem>
                                  <SelectItem value="banner">Banner</SelectItem>
                                  <SelectItem value="popup">Popup</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={sliderForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Slider description" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={sliderForm.control}
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
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={sliderForm.control}
                          name="linkUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Link URL (Optional)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="https://example.com" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={sliderForm.control}
                          name="buttonText"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Button Text (Optional)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Shop Now" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={sliderForm.control}
                          name="placement"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Placement</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="home">Home</SelectItem>
                                  <SelectItem value="category">Category</SelectItem>
                                  <SelectItem value="product">Product</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={sliderForm.control}
                          name="position"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Position</FormLabel>
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
                        <FormField
                          control={sliderForm.control}
                          name="isActive"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Active</FormLabel>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={sliderForm.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date (Optional)</FormLabel>
                              <FormControl>
                                <Input {...field} type="datetime-local" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={sliderForm.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date (Optional)</FormLabel>
                              <FormControl>
                                <Input {...field} type="datetime-local" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsSliderDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createSliderMutation.isPending}>
                          {createSliderMutation.isPending ? "Creating..." : "Create Slider"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-6">
                {slidersLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse h-32 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ) : sliders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No sliders found. Create your first slider above.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sliders.map((slider: any) => (
                      <div key={slider.id} className="border rounded-lg overflow-hidden">
                        <img
                          src={slider.imageUrl}
                          alt={slider.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg">{slider.title}</h3>
                            <div className="flex items-center space-x-1">
                              <Badge variant={slider.type === "slider" ? "default" : "secondary"}>
                                {slider.type}
                              </Badge>
                              <Badge variant={slider.isActive ? "default" : "secondary"}>
                                {slider.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{slider.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              <span className="capitalize">{slider.placement}</span> • Position {slider.position}
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete("/api/admin/sliders", slider.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Coupons & Offers Management */}
        {activeTab === "coupons" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-800">Coupons & Offers</h2>
              <Dialog open={isCouponDialogOpen} onOpenChange={setIsCouponDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-coupon">
                    <i className="fas fa-plus mr-2"></i>
                    Create Coupon
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Coupon</DialogTitle>
                  </DialogHeader>
                  <Form {...couponForm}>
                    <form onSubmit={couponForm.handleSubmit(onSubmitCoupon)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={couponForm.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Coupon Code</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="SAVE20" className="uppercase" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={couponForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="20% Off Sale" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={couponForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Get 20% off on all products" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={couponForm.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Discount Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="percentage">Percentage</SelectItem>
                                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={couponForm.control}
                          name="value"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Value</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" placeholder="20" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={couponForm.control}
                          name="minimumAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minimum Amount (Optional)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" placeholder="500" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={couponForm.control}
                          name="maximumDiscount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maximum Discount (Optional)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" placeholder="1000" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={couponForm.control}
                          name="usageLimit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Usage Limit (Optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  placeholder="100"
                                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={couponForm.control}
                          name="userLimit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Per User Limit</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  placeholder="1"
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={couponForm.control}
                          name="isActive"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Active</FormLabel>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={couponForm.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date (Optional)</FormLabel>
                              <FormControl>
                                <Input {...field} type="datetime-local" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={couponForm.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date (Optional)</FormLabel>
                              <FormControl>
                                <Input {...field} type="datetime-local" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsCouponDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createCouponMutation.isPending}>
                          {createCouponMutation.isPending ? "Creating..." : "Create Coupon"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-6">
                {couponsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="animate-pulse h-20 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ) : coupons.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No coupons found. Create your first coupon above.</p>
                ) : (
                  <div className="space-y-4">
                    {coupons.map((coupon: any) => (
                      <div key={coupon.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-mono font-bold">
                              {coupon.code}
                            </div>
                            <div>
                              <h3 className="font-semibold">{coupon.title}</h3>
                              <p className="text-sm text-gray-600">{coupon.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-semibold">
                              {coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`} Off
                            </p>
                            <p className="text-sm text-gray-500">
                              Used: {coupon.usageCount || 0}
                              {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={coupon.isActive ? "default" : "secondary"}>
                              {coupon.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete("/api/admin/coupons", coupon.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Payment Settings Management */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-800">Payment Settings</h2>
              <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-payment">
                    <i className="fas fa-plus mr-2"></i>
                    Add Payment Method
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                  </DialogHeader>
                  <Form {...paymentForm}>
                    <form onSubmit={paymentForm.handleSubmit(onSubmitPayment)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={paymentForm.control}
                          name="provider"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Payment Provider</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select provider" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="stripe">Stripe</SelectItem>
                                  <SelectItem value="razorpay">Razorpay</SelectItem>
                                  <SelectItem value="paypal">PayPal</SelectItem>
                                  <SelectItem value="payu">PayU</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={paymentForm.control}
                          name="displayName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Display Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Credit/Debit Card" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={paymentForm.control}
                        name="apiKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>API Key</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" placeholder="Your API key" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={paymentForm.control}
                        name="secretKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Secret Key</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" placeholder="Your secret key" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={paymentForm.control}
                        name="webhookSecret"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Webhook Secret (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" placeholder="Webhook secret" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={paymentForm.control}
                          name="isActive"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Active</FormLabel>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={paymentForm.control}
                          name="isTestMode"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Test Mode</FormLabel>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createPaymentMutation.isPending}>
                          {createPaymentMutation.isPending ? "Saving..." : "Save Payment Method"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-6">
                {paymentLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ) : paymentSettings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No payment methods configured. Add your first payment method above.</p>
                ) : (
                  <div className="space-y-4">
                    {paymentSettings.map((payment: any) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <i className={`fab fa-${payment.provider} text-xl`}></i>
                          </div>
                          <div>
                            <h3 className="font-semibold">{payment.displayName}</h3>
                            <p className="text-sm text-gray-600 capitalize">{payment.provider}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={payment.isTestMode ? "secondary" : "default"}>
                            {payment.isTestMode ? "Test" : "Live"}
                          </Badge>
                          <Badge variant={payment.isActive ? "default" : "secondary"}>
                            {payment.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete("/api/admin/payment-settings", payment.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Customer Management */}
        {activeTab === "customers" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Customer Management</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {customers?.total || 0}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Active This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {customers?.activeThisMonth || 0}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>New This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {customers?.newThisWeek || 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Customer List</CardTitle>
                <CardDescription>Manage your customers and view their analytics</CardDescription>
              </CardHeader>
              <CardContent>
                {customersLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="animate-pulse h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ) : !customers?.customers || customers.customers.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No customers found.</p>
                ) : (
                  <div className="space-y-4">
                    {customers.customers.map((customer: any) => (
                      <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <i className="fas fa-user text-gray-600"></i>
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {customer.firstName} {customer.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">{customer.email}</p>
                            <p className="text-xs text-gray-500">
                              Joined {new Date(customer.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{customer.totalSpent || 0}</p>
                          <p className="text-sm text-gray-600">{customer.orderCount || 0} orders</p>
                          <Badge variant={customer.isAdmin ? "default" : "secondary"}>
                            {customer.isAdmin ? "Admin" : "Customer"}
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

        {/* Analytics */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Analytics & Reports</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Page Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {analyticsData?.totalPageViews || 0}
                  </div>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Unique Visitors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {analyticsData?.uniqueVisitors || 0}
                  </div>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {analyticsData?.conversionRate?.toFixed(1) || 0}%
                  </div>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg. Order Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    ₹{analyticsData?.averageOrderValue?.toFixed(2) || 0}
                  </div>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Products</CardTitle>
                  <CardDescription>Most viewed products this month</CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="animate-pulse h-12 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {analyticsData?.popularProducts?.slice(0, 5).map((product: any, index: number) => (
                        <div key={product.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-600">{product.views} views</p>
                            </div>
                          </div>
                          <p className="font-semibold">₹{product.price}</p>
                        </div>
                      )) || (
                        <p className="text-gray-500 text-center py-4">No data available</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest user interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="animate-pulse h-12 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {analyticsData?.recentEvents?.slice(0, 10).map((event: any) => (
                        <div key={event.id} className="flex items-center justify-between text-sm">
                          <div>
                            <span className="capitalize">{event.eventType}</span>
                            {event.productName && <span className="text-gray-600"> - {event.productName}</span>}
                          </div>
                          <span className="text-gray-500">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      )) || (
                        <p className="text-gray-500 text-center py-4">No recent activity</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Products & Orders - Simplified placeholders linking to existing admin */}
        {(activeTab === "products" || activeTab === "orders") && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 capitalize">{activeTab} Management</h2>
            <Card>
              <CardContent className="p-8 text-center">
                <i className={`fas fa-${activeTab === "products" ? "box" : "shopping-cart"} text-4xl text-gray-400 mb-4`}></i>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
                </h3>
                <p className="text-gray-500 mb-4">
                  Manage your {activeTab} with the dedicated admin interface
                </p>
                <Button onClick={() => window.location.href = "/admin"}>
                  Go to {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Admin
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}