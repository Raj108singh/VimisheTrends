import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { CartItem } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const checkoutSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Please enter a valid pincode"),
  paymentMethod: z.string().min(1, "Please select a payment method"),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Redirect to auth if not logged in
  if (!user) {
    router.push("/login");
    return null;
  }

  const { data: cartItems = [], isLoading } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
    retry: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return await apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Order Placed Successfully!",
        description: "Your order has been confirmed. You will receive an email confirmation shortly.",
      });
      router.push(`/profile?tab=orders`);
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
        title: "Order Failed",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CheckoutForm) => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add items to proceed.",
        variant: "destructive",
      });
      return;
    }

    const orderItems = (cartItems as CartItem[]).map((item: CartItem) => ({
      productId: item.productId,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      price: item.product?.salePrice || item.product?.price,
    }));

    const shippingAddress = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
    };

    createOrderMutation.mutate({
      totalAmount: total.toFixed(2),
      shippingAddress,
      billingAddress: shippingAddress,
      paymentMethod: data.paymentMethod,
      notes: data.notes,
      items: orderItems,
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h1>
          <p className="text-gray-600 mb-6">You need to login to checkout</p>
          <Button onClick={() => window.location.href = "/api/login"}>
            Login
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const subtotal = (cartItems as CartItem[]).reduce((total: number, item: CartItem) => {
    return total + (parseFloat(item.product?.salePrice || item.product?.price || "0") * item.quantity);
  }, 0);

  const shippingCost = subtotal >= 1000 ? 0 : 100;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shippingCost + tax;

  if ((cartItems as CartItem[]).length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add items to your cart to proceed with checkout</p>
          <Button onClick={() => router.push("/products")}>
            Continue Shopping
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8" data-testid="text-checkout-title">Checkout</h1>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4" data-testid="text-contact-info-title">Contact Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="your@email.com"
                      data-testid="input-email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1" data-testid="error-email">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...register("firstName")}
                        placeholder="First name"
                        data-testid="input-first-name"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1" data-testid="error-first-name">{errors.firstName.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...register("lastName")}
                        placeholder="Last name"
                        data-testid="input-last-name"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1" data-testid="error-last-name">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      placeholder="10-digit phone number"
                      data-testid="input-phone"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1" data-testid="error-phone">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4" data-testid="text-shipping-address-title">Shipping Address</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      {...register("address")}
                      placeholder="Street address, apartment, suite, etc."
                      data-testid="textarea-address"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1" data-testid="error-address">{errors.address.message}</p>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        {...register("city")}
                        placeholder="City"
                        data-testid="input-city"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1" data-testid="error-city">{errors.city.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        {...register("state")}
                        placeholder="State"
                        data-testid="input-state"
                      />
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1" data-testid="error-state">{errors.state.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      {...register("pincode")}
                      placeholder="6-digit pincode"
                      data-testid="input-pincode"
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-sm mt-1" data-testid="error-pincode">{errors.pincode.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4" data-testid="text-payment-method-title">Payment Method</h2>
                
                <div className="space-y-4">
                  <Select onValueChange={(value) => setValue("paymentMethod", value)}>
                    <SelectTrigger data-testid="select-payment-method">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="netbanking">Net Banking</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.paymentMethod && (
                    <p className="text-red-500 text-sm mt-1" data-testid="error-payment-method">{errors.paymentMethod.message}</p>
                  )}
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4" data-testid="text-order-notes-title">Order Notes (Optional)</h2>
                
                <Textarea
                  {...register("notes")}
                  placeholder="Any special instructions for your order..."
                  data-testid="textarea-order-notes"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white p-6 rounded-xl shadow-md sticky top-24">
                <h2 className="text-xl font-bold mb-6" data-testid="text-order-summary-title">Order Summary</h2>
                
                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {(cartItems as CartItem[]).map((item: CartItem) => (
                    <div key={item.id} className="flex items-center space-x-4" data-testid={`order-item-${item.id}`}>
                      <img
                        src={item.product?.imageUrl || "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"}
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        data-testid={`img-order-item-${item.id}`}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium" data-testid={`text-order-item-name-${item.id}`}>
                          {item.product?.name}
                        </h3>
                        <div className="text-sm text-gray-600">
                          {item.size && <span data-testid={`text-order-item-size-${item.id}`}>Size: {item.size}</span>}
                          {item.color && <span className="ml-2" data-testid={`text-order-item-color-${item.id}`}>Color: {item.color}</span>}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500" data-testid={`text-order-item-quantity-${item.id}`}>
                            Qty: {item.quantity}
                          </span>
                          <span className="font-semibold" data-testid={`text-order-item-total-${item.id}`}>
                            ₹{(parseFloat(item.product?.salePrice || item.product?.price || "0") * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Price Breakdown */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between">
                    <span data-testid="text-order-subtotal-label">Subtotal</span>
                    <span data-testid="text-order-subtotal-amount">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span data-testid="text-order-shipping-label">Shipping</span>
                    <span data-testid="text-order-shipping-amount">
                      {shippingCost === 0 ? "Free" : `₹${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span data-testid="text-order-tax-label">Tax (18% GST)</span>
                    <span data-testid="text-order-tax-amount">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span data-testid="text-order-total-label">Total</span>
                      <span data-testid="text-order-total-amount">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  type="submit"
                  disabled={createOrderMutation.isPending}
                  className="w-full mt-6 bg-primary text-white py-4 rounded-full font-semibold text-lg hover:bg-primary/90"
                  data-testid="button-place-order"
                >
                  {createOrderMutation.isPending ? "Placing Order..." : "Place Order"}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4" data-testid="text-order-terms">
                  By placing your order, you agree to our terms and conditions and privacy policy.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
