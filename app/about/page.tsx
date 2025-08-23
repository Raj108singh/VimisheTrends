'use client';

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-50 to-purple-50 py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">About Vimishe Fashion Trends</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Creating comfortable, safe, and stylish innerwear for growing children with love, 
            care, and the finest materials available.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Vimishe Fashion Trends was born from a simple belief: every child deserves to feel 
                comfortable and confident in their own skin. As parents ourselves, we understand 
                the importance of quality innerwear during the crucial growing years.
              </p>
              <p className="text-gray-600 mb-4">
                Our journey began in 2020 when we noticed a gap in the market for premium, 
                comfortable kids' innerwear. We partnered with women-led manufacturing units 
                across India to create products that combine traditional comfort with modern design.
              </p>
              <p className="text-gray-600">
                Today, we're proud to serve thousands of families across India, helping children 
                transition comfortably through their growing years with our thoughtfully designed products.
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl h-80 flex items-center justify-center">
              <span className="text-6xl">👨‍👩‍👧‍👦</span>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-pink-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl">🌟</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Quality First</h3>
              <p className="text-gray-600">
                We use only the finest materials and maintain strict quality controls 
                to ensure every product meets our high standards.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl">💚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Comfort & Safety</h3>
              <p className="text-gray-600">
                Child safety is our top priority. All our products are tested for 
                comfort, breathability, and skin-friendliness.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl">🇮🇳</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Made in India</h3>
              <p className="text-gray-600">
                Proudly supporting local manufacturing and empowering women entrepreneurs 
                across the country.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Women-Led Manufacturing */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl h-80 flex items-center justify-center">
              <span className="text-6xl">👩‍💼</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Empowering Women</h2>
              <p className="text-gray-600 mb-4">
                We're proud to partner with women-led manufacturing units across India. 
                Our production facilities are run by skilled women entrepreneurs who 
                understand the importance of creating safe, comfortable clothing for children.
              </p>
              <p className="text-gray-600 mb-4">
                By working with these amazing women, we're not just creating great products – 
                we're supporting local communities and helping build sustainable livelihoods.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">Supporting 50+ women entrepreneurs</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">Creating sustainable employment</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">Building stronger communities</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Promise */}
      <section className="py-16 px-4 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Quality Promise</h2>
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">100% Cotton</h3>
              <p className="text-sm text-gray-600">Premium cotton for sensitive skin</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
                <span className="text-2xl">🧪</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Lab Tested</h3>
              <p className="text-sm text-gray-600">Rigorous quality testing</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
                <span className="text-2xl">💨</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Breathable</h3>
              <p className="text-sm text-gray-600">Maximum comfort all day</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Hypoallergenic</h3>
              <p className="text-sm text-gray-600">Safe for all skin types</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}