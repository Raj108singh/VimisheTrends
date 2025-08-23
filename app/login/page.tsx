'use client';

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Login to Your Account</h1>
          
          <form className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" className="mt-1" />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" className="mt-1" />
            </div>
            
            <Button className="w-full">Login</Button>
            
            <div className="text-center">
              <p className="text-gray-600">Don't have an account? <a href="/register" className="text-primary hover:underline">Sign up</a></p>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}