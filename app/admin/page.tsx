'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  packInfo: string;
  inStock: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    packInfo: '',
    description: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          price: parseInt(newProduct.price),
          originalPrice: newProduct.originalPrice ? parseInt(newProduct.originalPrice) : null,
          discount: newProduct.originalPrice ? 
            Math.round((1 - parseInt(newProduct.price) / parseInt(newProduct.originalPrice)) * 100) : 0,
          images: [\"https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=500&fit=crop&auto=format\"],
          features: [\"High Quality\", \"Comfortable\", \"Durable\"],
          sizes: [\"S\", \"M\", \"L\"],
          colors: [\"Mixed Colors\"],
          rating: 45, // 4.5 stars (stored as integer * 10)
          reviews: 0,
          tags: [\"new\"]
        })
      });

      if (response.ok) {
        setNewProduct({
          name: '',
          category: '',
          price: '',
          originalPrice: '',
          packInfo: '',
          description: ''
        });
        fetchProducts();
        alert('Product added successfully!');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product');
    }
  };

  if (loading) {
    return (
      <div className=\"min-h-screen bg-gray-50 flex items-center justify-center\">
        <div className=\"text-center\">
          <div className=\"animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto\"></div>
          <p className=\"mt-4 text-gray-600\">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=\"min-h-screen bg-gray-50\">
      {/* Header */}
      <header className=\"bg-white shadow-sm border-b\">
        <div className=\"container mx-auto px-4 py-4\">
          <div className=\"flex items-center justify-between\">
            <h1 className=\"text-2xl font-bold text-gray-800\">Admin Dashboard</h1>
            <Link href=\"/\" className=\"text-pink-600 hover:text-pink-700 font-medium\">
              ← Back to Store
            </Link>
          </div>
        </div>
      </header>

      <div className=\"container mx-auto px-4 py-8\">
        <div className=\"grid lg:grid-cols-3 gap-8\">
          {/* Add Product Form */}
          <div className=\"lg:col-span-1\">
            <div className=\"bg-white rounded-2xl shadow-sm border p-6\">
              <h2 className=\"text-xl font-bold text-gray-800 mb-6\">Add New Product</h2>
              
              <form onSubmit={handleAddProduct} className=\"space-y-4\">
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">Product Name</label>
                  <Input
                    type=\"text\"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder=\"e.g., Rainbow Star Underwear 3-Pack\"
                    required
                  />
                </div>

                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className=\"w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500\"
                    required
                  >
                    <option value=\"\">Select Category</option>
                    <option value=\"girl-underwear\">Girls Underwear</option>
                    <option value=\"girl-boxers\">Girls Boxers</option>
                    <option value=\"girl-camisoles\">Girls Camisoles</option>
                    <option value=\"boy-underwear\">Boys Underwear</option>
                    <option value=\"boy-boxers\">Boys Boxers</option>
                    <option value=\"t-shirt-sets\">T-shirt Sets</option>
                    <option value=\"skater-skirts\">Skater Skirts</option>
                  </select>
                </div>

                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">Price (₹)</label>
                  <Input
                    type=\"number\"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    placeholder=\"649\"
                    required
                  />
                </div>

                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">Original Price (₹)</label>
                  <Input
                    type=\"number\"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
                    placeholder=\"899\"
                  />
                </div>

                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">Pack Info</label>
                  <Input
                    type=\"text\"
                    value={newProduct.packInfo}
                    onChange={(e) => setNewProduct({...newProduct, packInfo: e.target.value})}
                    placeholder=\"3-Pack\"
                    required
                  />
                </div>

                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder=\"Comfortable cotton underwear perfect for kids...\"
                    className=\"w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500\"
                    rows={3}
                    required
                  />
                </div>

                <Button type=\"submit\" className=\"w-full bg-pink-600 hover:bg-pink-700\">
                  Add Product
                </Button>
              </form>
            </div>
          </div>

          {/* Products List */}
          <div className=\"lg:col-span-2\">
            <div className=\"bg-white rounded-2xl shadow-sm border\">
              <div className=\"p-6 border-b\">
                <div className=\"flex items-center justify-between\">
                  <h2 className=\"text-xl font-bold text-gray-800\">Products ({products.length})</h2>
                  <div className=\"text-sm text-gray-600\">
                    Total Revenue: ₹{products.reduce((sum, product) => sum + (product.price || 0), 0).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className=\"overflow-x-auto\">
                <table className=\"w-full\">
                  <thead className=\"bg-gray-50\">
                    <tr>
                      <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">Product</th>
                      <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">Category</th>
                      <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">Price</th>
                      <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">Stock</th>
                      <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">Actions</th>
                    </tr>
                  </thead>
                  <tbody className=\"bg-white divide-y divide-gray-200\">
                    {products.map((product) => (
                      <tr key={product.id} className=\"hover:bg-gray-50\">
                        <td className=\"px-6 py-4 whitespace-nowrap\">
                          <div>
                            <div className=\"text-sm font-medium text-gray-900\">{product.name}</div>
                            <div className=\"text-sm text-gray-500\">{product.packInfo}</div>
                          </div>
                        </td>
                        <td className=\"px-6 py-4 whitespace-nowrap\">
                          <span className=\"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800\">
                            {product.category}
                          </span>
                        </td>
                        <td className=\"px-6 py-4 whitespace-nowrap\">
                          <div className=\"text-sm text-gray-900\">₹{product.price}</div>
                          {product.originalPrice && (
                            <div className=\"text-sm text-gray-500 line-through\">₹{product.originalPrice}</div>
                          )}
                        </td>
                        <td className=\"px-6 py-4 whitespace-nowrap\">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className=\"px-6 py-4 whitespace-nowrap text-sm font-medium\">
                          <button className=\"text-pink-600 hover:text-pink-900 mr-4\">Edit</button>
                          <button className=\"text-red-600 hover:text-red-900\">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {products.length === 0 && (
                  <div className=\"text-center py-12\">
                    <div className=\"text-gray-500 mb-4\">
                      <svg className=\"w-12 h-12 mx-auto mb-4\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                        <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4\" />
                      </svg>
                      No products found
                    </div>
                    <p className=\"text-gray-400\">Add your first product using the form on the left</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}