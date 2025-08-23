import { NextResponse } from 'next/server';
import { db, products } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query = db.select().from(products);
    
    if (category && category !== 'all') {
      query = db.select().from(products).where(eq(products.category, category));
    }

    const allProducts = await query;
    
    // Filter by search if provided
    const filteredProducts = search 
      ? allProducts.filter(product => 
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description?.toLowerCase().includes(search.toLowerCase())
        )
      : allProducts;

    return NextResponse.json(filteredProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newProduct = await db.insert(products).values(body).returning();
    
    return NextResponse.json(newProduct[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}