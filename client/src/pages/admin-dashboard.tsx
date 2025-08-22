import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { SiteSetting, Slider, Coupon } from "@shared/schema";

// Simplified schema definitions for non-technical users
const sliderSchema = z.object({
  title: z.string().min(1, "Please enter a title for your image"),
  description: z.string().optional(),
  imageUrl: z.string().url("Please enter a valid image web address"),
  linkUrl: z.string().url("Please enter a valid web address").optional().or(z.literal("")),
  buttonText: z.string().optional(),
  position: z.number().min(0, "Position must be 0 or higher"),
  type: z.string().default("slider"),
  placement: z.string().default("home"),
  isActive: z.boolean().default(true),
});

const siteSettingSchema = z.object({
  key: z.string().min(1, "Please enter a setting name"),
  value: z.string(),
  category: z.string().min(1, "Please choose a category"),
  type: z.string().default("text"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

const whatsappSchema = z.object({
  businessNumber: z.string().min(1, "Please enter your WhatsApp Business number"),
  welcomeMessage: z.string().min(1, "Please enter a welcome message"),
  isEnabled: z.boolean().default(true),
});

type SliderForm = z.infer<typeof sliderSchema>;
type SiteSettingForm = z.infer<typeof siteSettingSchema>;
type WhatsAppForm = z.infer<typeof whatsappSchema>;

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Navigation state
  const [activeSection, setActiveSection] = useState("overview");
  const [activeSubSection, setActiveSubSection] = useState("");
  
  // Dialog states
  const [isSliderDialogOpen, setIsSliderDialogOpen] = useState(false);
  const [isSettingDialogOpen, setIsSettingDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      toast({
        title: "Access Denied",
        description: "You need admin permissions to access this page",
        variant: "destructive",
      });
      window.location.href = "/admin/login";
    }
  }, [user, authLoading, toast]);

  // Data queries
  const { data: sliders = [], isLoading: slidersLoading } = useQuery<Slider[]>({
    queryKey: ["/api/admin/sliders"],
    enabled: !!user?.isAdmin,
  });

  const { data: siteSettings = [], isLoading: settingsLoading } = useQuery<SiteSetting[]>({
    queryKey: ["/api/admin/site-settings"],
    enabled: !!user?.isAdmin,
  });

  // Forms
  const sliderForm = useForm<SliderForm>({
    resolver: zodResolver(sliderSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      linkUrl: "",
      buttonText: "Shop Now",
      position: 0,
      type: "slider",
      placement: "home",
      isActive: true,
    },
  });

  const settingForm = useForm<SiteSettingForm>({
    resolver: zodResolver(siteSettingSchema),
    defaultValues: {
      key: "",
      value: "",
      category: "general",
      type: "text",
      description: "",
      isActive: true,
    },
  });

  // Mutations
  const createSliderMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingItem) {
        return await apiRequest("PUT", `/api/admin/sliders/${editingItem.id}`, data);
      }
      return await apiRequest("POST", "/api/admin/sliders", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sliders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sliders"] });
      toast({ title: editingItem ? "Image updated successfully!" : "New image added successfully!" });
      setIsSliderDialogOpen(false);
      sliderForm.reset();
      setEditingItem(null);
    },
    onError: () => toast({ 
      title: "Error", 
      description: "Failed to save the image. Please try again.", 
      variant: "destructive" 
    }),
  });

  const createSettingMutation = useMutation({
    mutationFn: async (data: any) => await apiRequest("POST", "/api/admin/site-settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
      toast({ title: "Setting saved successfully!" });
      setIsSettingDialogOpen(false);
      settingForm.reset();
    },
    onError: () => toast({ 
      title: "Error", 
      description: "Failed to save setting. Please try again.", 
      variant: "destructive" 
    }),
  });

  const deleteItemMutation = useMutation({
    mutationFn: async ({ endpoint, id }: { endpoint: string; id: string }) =>
      await apiRequest("DELETE", `${endpoint}/${id}`),
    onSuccess: (_, { endpoint }) => {
      if (endpoint.includes("sliders")) {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/sliders"] });
        queryClient.invalidateQueries({ queryKey: ["/api/sliders"] });
      } else if (endpoint.includes("site-settings")) {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/site-settings"] });
        queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
      }
      toast({ title: "Item deleted successfully!" });
    },
    onError: () => toast({ 
      title: "Error", 
      description: "Failed to delete item. Please try again.", 
      variant: "destructive" 
    }),
  });

  // Form handlers
  const onSubmitSlider = (data: SliderForm) => {
    createSliderMutation.mutate(data);
  };

  const onSubmitSetting = (data: SiteSettingForm) => {
    createSettingMutation.mutate(data);
  };

  const handleEdit = (item: any, type: string) => {
    setEditingItem(item);
    if (type === 'slider') {
      sliderForm.reset({
        title: item.title,
        description: item.description || "",
        imageUrl: item.imageUrl,
        linkUrl: item.linkUrl || "",
        buttonText: item.buttonText || "Shop Now",
        position: item.position || 0,
        type: item.type || "slider",
        placement: item.placement || "home",
        isActive: item.isActive,
      });
      setIsSliderDialogOpen(true);
    }
  };

  const handleDelete = (endpoint: string, id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteItemMutation.mutate({ endpoint, id });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Store Admin Panel</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome back, Admin!</span>
            <Button variant="outline" onClick={() => window.location.href = "/"}>
              <i className="fas fa-home mr-2"></i>
              View Store
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Now Scrollable */}
        <nav className="w-64 bg-white shadow-lg h-screen sticky top-0 overflow-y-auto">
          <div className="p-4">
            <div className="space-y-2">
              {/* Overview */}
              <div>
                <button
                  onClick={() => setActiveSection("overview")}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 ${
                    activeSection === "overview" 
                      ? "bg-blue-100 text-blue-700" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <i className="fas fa-chart-line"></i>
                  <span className="font-medium">Overview</span>
                </button>
              </div>

              {/* Store Management */}
              <div className="pt-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
                  Store Management
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveSection("banners")}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 ${
                      activeSection === "banners" 
                        ? "bg-blue-100 text-blue-700" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <i className="fas fa-images"></i>
                    <span>Homepage Images</span>
                  </button>
                  
                  <button
                    onClick={() => window.location.href = "/admin"}
                    className="w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 text-gray-700 hover:bg-gray-100"
                  >
                    <i className="fas fa-box"></i>
                    <span>Products</span>
                  </button>
                  
                  <button
                    onClick={() => window.location.href = "/admin"}
                    className="w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 text-gray-700 hover:bg-gray-100"
                  >
                    <i className="fas fa-tags"></i>
                    <span>Categories</span>
                  </button>
                </div>
              </div>

              {/* Settings */}
              <div className="pt-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
                  Settings
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveSection("website-settings")}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 ${
                      activeSection === "website-settings" 
                        ? "bg-blue-100 text-blue-700" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <i className="fas fa-globe"></i>
                    <span>Website Settings</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveSection("whatsapp")}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 ${
                      activeSection === "whatsapp" 
                        ? "bg-blue-100 text-blue-700" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <i className="fab fa-whatsapp"></i>
                    <span>WhatsApp Setup</span>
                  </button>

                  <button
                    onClick={() => setActiveSection("appearance")}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 ${
                      activeSection === "appearance" 
                        ? "bg-blue-100 text-blue-700" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <i className="fas fa-palette"></i>
                    <span>Store Appearance</span>
                  </button>

                  <button
                    onClick={() => setActiveSection("seo")}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 ${
                      activeSection === "seo" 
                        ? "bg-blue-100 text-blue-700" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <i className="fas fa-search"></i>
                    <span>SEO Settings</span>
                  </button>
                </div>
              </div>

              {/* Customer & Sales */}
              <div className="pt-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
                  Customer & Sales
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => window.location.href = "/admin"}
                    className="w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 text-gray-700 hover:bg-gray-100"
                  >
                    <i className="fas fa-shopping-cart"></i>
                    <span>Orders</span>
                  </button>
                  
                  <button
                    onClick={() => window.location.href = "/admin"}
                    className="w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 text-gray-700 hover:bg-gray-100"
                  >
                    <i className="fas fa-users"></i>
                    <span>Customers</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Store Overview</h2>
                <p className="text-gray-600">Welcome to your store admin panel. Here's a quick overview of your store.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
                    <i className="fas fa-box text-blue-500"></i>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-gray-500 mt-1">Products in your store</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Homepage Images</CardTitle>
                    <i className="fas fa-images text-green-500"></i>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{sliders.length}</div>
                    <p className="text-xs text-gray-500 mt-1">Images on homepage</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Website Settings</CardTitle>
                    <i className="fas fa-cog text-purple-500"></i>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{siteSettings.length}</div>
                    <p className="text-xs text-gray-500 mt-1">Configured settings</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Store Status</CardTitle>
                    <i className="fas fa-store text-orange-500"></i>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">Active</div>
                    <p className="text-xs text-gray-500 mt-1">Your store is live</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks to manage your store</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      onClick={() => setActiveSection("banners")}
                      className="h-auto p-4 flex flex-col items-center space-y-2"
                      variant="outline"
                    >
                      <i className="fas fa-images text-2xl"></i>
                      <span>Manage Homepage Images</span>
                    </Button>
                    
                    <Button 
                      onClick={() => window.location.href = "/admin"}
                      className="h-auto p-4 flex flex-col items-center space-y-2"
                      variant="outline"
                    >
                      <i className="fas fa-plus text-2xl"></i>
                      <span>Add New Product</span>
                    </Button>
                    
                    <Button 
                      onClick={() => setActiveSection("whatsapp")}
                      className="h-auto p-4 flex flex-col items-center space-y-2"
                      variant="outline"
                    >
                      <i className="fab fa-whatsapp text-2xl"></i>
                      <span>Setup WhatsApp</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Homepage Images (Sliders/Banners) Section */}
          {activeSection === "banners" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Homepage Images</h2>
                  <p className="text-gray-600 mt-1">Manage the images that appear on your homepage</p>
                </div>
                <Dialog open={isSliderDialogOpen} onOpenChange={setIsSliderDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <i className="fas fa-plus mr-2"></i>
                      Add New Image
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingItem ? "Edit Image" : "Add New Homepage Image"}</DialogTitle>
                    </DialogHeader>
                    <Form {...sliderForm}>
                      <form onSubmit={sliderForm.handleSubmit(onSubmitSlider)} className="space-y-4">
                        <FormField
                          control={sliderForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image Title *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., Summer Collection 2024" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={sliderForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description (Optional)</FormLabel>
                              <FormControl>
                                <Textarea {...field} placeholder="Describe what this image is about..." rows={3} />
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
                              <FormLabel>Image Web Address *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="https://example.com/your-image.jpg" />
                              </FormControl>
                              <FormMessage />
                              <p className="text-xs text-gray-500">
                                Upload your image to a hosting service like Imgur, Cloudinary, or use Unsplash links
                              </p>
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={sliderForm.control}
                            name="linkUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Link When Clicked (Optional)</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="https://example.com/collection" />
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

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={sliderForm.control}
                            name="position"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Display Order</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    type="number" 
                                    placeholder="0"
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                                <p className="text-xs text-gray-500">0 = first, 1 = second, etc.</p>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={sliderForm.control}
                            name="isActive"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Show on Website</FormLabel>
                                  <p className="text-xs text-gray-500">Turn on to display this image</p>
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

                        <div className="flex justify-end space-x-3 pt-4">
                          <Button type="button" variant="outline" onClick={() => setIsSliderDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={createSliderMutation.isPending}>
                            {createSliderMutation.isPending ? "Saving..." : editingItem ? "Update Image" : "Add Image"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slidersLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="h-48 bg-gray-200 animate-pulse"></div>
                      <CardContent className="p-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))
                ) : sliders.length > 0 ? (
                  sliders.map((slider: any) => (
                    <Card key={slider.id} className="overflow-hidden">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={slider.imageUrl} 
                          alt={slider.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                          }}
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant={slider.isActive ? "default" : "secondary"}>
                            {slider.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{slider.title}</h3>
                        {slider.description && (
                          <p className="text-gray-600 text-sm mb-3">{slider.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Order: {slider.position}</span>
                          <div className="space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEdit(slider, 'slider')}
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDelete("/api/admin/sliders", slider.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full">
                    <Card>
                      <CardContent className="p-12 text-center">
                        <i className="fas fa-images text-4xl text-gray-300 mb-4"></i>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Images Yet</h3>
                        <p className="text-gray-500 mb-4">Add your first homepage image to get started</p>
                        <Button onClick={() => setIsSliderDialogOpen(true)}>
                          <i className="fas fa-plus mr-2"></i>
                          Add First Image
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* WhatsApp Setup Section */}
          {activeSection === "whatsapp" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">WhatsApp Business Setup</h2>
                <p className="text-gray-600">Connect your WhatsApp Business number to receive orders and inquiries</p>
              </div>

              <Card className="max-w-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <i className="fab fa-whatsapp text-green-500"></i>
                    <span>WhatsApp Configuration</span>
                  </CardTitle>
                  <CardDescription>
                    Set up your WhatsApp Business integration for customer support and orders
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp Business Number *
                    </label>
                    <Input 
                      placeholder="+91 9876543210" 
                      className="mb-2"
                    />
                    <p className="text-xs text-gray-500">
                      Include country code (e.g., +91 for India)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Welcome Message
                    </label>
                    <Textarea 
                      placeholder="Hi! Welcome to our store. How can I help you today?"
                      rows={3}
                      className="mb-2"
                    />
                    <p className="text-xs text-gray-500">
                      This message will be sent when customers click the WhatsApp button
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Enable WhatsApp Button</h4>
                      <p className="text-sm text-gray-500">Show WhatsApp button on your website</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="pt-4">
                    <Button className="w-full">
                      <i className="fab fa-whatsapp mr-2"></i>
                      Save WhatsApp Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="max-w-2xl">
                <CardHeader>
                  <CardTitle>WhatsApp Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Order Notifications</h4>
                      <p className="text-sm text-gray-600 mb-3">Get notified on WhatsApp when new orders arrive</p>
                      <Badge>Coming Soon</Badge>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Customer Support</h4>
                      <p className="text-sm text-gray-600 mb-3">Let customers contact you directly via WhatsApp</p>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Website Settings Section */}
          {activeSection === "website-settings" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Website Settings</h2>
                  <p className="text-gray-600 mt-1">Configure your website's basic information and appearance</p>
                </div>
                <Dialog open={isSettingDialogOpen} onOpenChange={setIsSettingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <i className="fas fa-plus mr-2"></i>
                      Add Setting
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Website Setting</DialogTitle>
                    </DialogHeader>
                    <Form {...settingForm}>
                      <form onSubmit={settingForm.handleSubmit(onSubmitSetting)} className="space-y-4">
                        <FormField
                          control={settingForm.control}
                          name="key"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Setting Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., store_name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={settingForm.control}
                          name="value"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Setting Value</FormLabel>
                              <FormControl>
                                <Textarea {...field} placeholder="Enter the setting value..." />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={settingForm.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="general">General</SelectItem>
                                  <SelectItem value="header">Header</SelectItem>
                                  <SelectItem value="footer">Footer</SelectItem>
                                  <SelectItem value="seo">SEO</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end space-x-3">
                          <Button type="button" variant="outline" onClick={() => setIsSettingDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={createSettingMutation.isPending}>
                            {createSettingMutation.isPending ? "Saving..." : "Add Setting"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Settings Categories */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {["general", "header", "footer", "seo"].map((category) => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="capitalize">{category} Settings</CardTitle>
                      <CardDescription>
                        Manage your {category} configuration
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {siteSettings
                          .filter((setting: any) => setting.category === category)
                          .map((setting: any) => (
                            <div key={setting.id} className="p-3 border rounded-lg">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-medium">{setting.key}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{setting.value}</p>
                                  {setting.description && (
                                    <p className="text-xs text-gray-500 mt-1">{setting.description}</p>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                  <Badge variant={setting.isActive ? "default" : "secondary"}>
                                    {setting.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => handleDelete("/api/admin/site-settings", setting.id)}
                                  >
                                    <i className="fas fa-trash"></i>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        {siteSettings.filter((setting: any) => setting.category === category).length === 0 && (
                          <p className="text-gray-500 text-center py-4">
                            No {category} settings found. Add your first setting above.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Store Appearance Section */}
          {activeSection === "appearance" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Store Appearance</h2>
                <p className="text-gray-600">Customize how your store looks to customers</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Colors & Theme</CardTitle>
                    <CardDescription>Choose your store's color scheme</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Primary Color</label>
                        <div className="flex items-center space-x-3">
                          <input type="color" value="#3B82F6" className="w-12 h-10 rounded border" />
                          <Input value="#3B82F6" className="flex-1" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Secondary Color</label>
                        <div className="flex items-center space-x-3">
                          <input type="color" value="#10B981" className="w-12 h-10 rounded border" />
                          <Input value="#10B981" className="flex-1" />
                        </div>
                      </div>
                      <Button className="w-full">Save Color Changes</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Logo & Branding</CardTitle>
                    <CardDescription>Upload your store logo and branding</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Store Logo URL</label>
                        <Input placeholder="https://example.com/logo.png" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Store Name</label>
                        <Input placeholder="Your Store Name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Tagline</label>
                        <Input placeholder="Your store's tagline" />
                      </div>
                      <Button className="w-full">Save Branding</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* SEO Settings Section */}
          {activeSection === "seo" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">SEO Settings</h2>
                <p className="text-gray-600">Optimize your store for search engines</p>
              </div>

              <Card className="max-w-4xl">
                <CardHeader>
                  <CardTitle>Search Engine Optimization</CardTitle>
                  <CardDescription>
                    Help customers find your store on Google and other search engines
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Store Title (SEO)</label>
                      <Input placeholder="Best Fashion Store in India" />
                      <p className="text-xs text-gray-500 mt-1">Appears in Google search results</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Meta Keywords</label>
                      <Input placeholder="fashion, clothing, kids wear, online store" />
                      <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Store Description (SEO)</label>
                    <Textarea 
                      placeholder="Shop the latest fashion trends for kids and adults. Free shipping on orders over ₹999. Best prices guaranteed."
                      rows={4}
                    />
                    <p className="text-xs text-gray-500 mt-1">Appears in Google search results under your title</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Google Analytics ID</label>
                      <Input placeholder="GA-XXXXXXXXX-X" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Facebook Pixel ID</label>
                      <Input placeholder="123456789012345" />
                    </div>
                  </div>

                  <Button className="w-full">Save SEO Settings</Button>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}