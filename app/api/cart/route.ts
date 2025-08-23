import { NextResponse } from 'next/server';
import { db, cart, products } from '@/lib/db';
import { eq, sql } from 'drizzle-orm';
import { cookies } from 'next/headers';

// Get session ID from cookies or create new one
async function getSessionId() {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('session_id')?.value;
  
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(7);
  }
  
  return sessionId;
}

export async function GET() {
  try {
    const sessionId = await getSessionId();
    
    const cartItems = await db
      .select({
        id: cart.id,
        productId: cart.productId,
        quantity: cart.quantity,
        size: cart.size,
        color: cart.color,
        product: {
          id: products.id,
          name: products.name,
          price: products.price,
          images: products.images,
          packInfo: products.packInfo
        }
      })
      .from(cart)
      .leftJoin(products, eq(cart.productId, products.id))
      .where(eq(cart.sessionId, sessionId));
      
    return NextResponse.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const sessionId = await getSessionId();
    
    const newCartItem = await db.insert(cart).values({
      ...body,
      sessionId
    }).returning();
    
    const response = NextResponse.json(newCartItem[0]);
    response.cookies.set('session_id', sessionId, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });
    
    return response;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('id');
    
    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
    }
    
    await db.delete(cart).where(eq(cart.id, parseInt(itemId)));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, quantity } = body;
    
    if (!id || !quantity) {
      return NextResponse.json({ error: 'ID and quantity required' }, { status: 400 });
    }
    
    await db.update(cart)
      .set({ quantity })
      .where(eq(cart.id, parseInt(id)));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}