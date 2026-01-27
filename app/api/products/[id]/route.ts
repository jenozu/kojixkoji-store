import { NextRequest, NextResponse } from 'next/server'
import { getProduct, updateProduct, deleteProduct } from '@/lib/supabase-helpers'

/**
 * GET /api/products/[id] - Fetch single product from Supabase
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProduct(params.id)

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Transform to frontend format
    const transformedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      cost: product.cost,
      category: product.category,
      image: product.image_url, // ProductCard expects 'image' field
      imageUrl: product.image_url, // Keep for backwards compatibility
      stock: product.stock,
      sizes: product.sizes,
    }

    return NextResponse.json(transformedProduct)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/products/[id] - Update product in Supabase
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Build updates object, transforming field names
    const updates: any = {}
    if (body.name !== undefined) updates.name = body.name
    if (body.description !== undefined) updates.description = body.description
    if (body.price !== undefined) updates.price = parseFloat(body.price)
    if (body.cost !== undefined) updates.cost = body.cost ? parseFloat(body.cost) : undefined
    if (body.category !== undefined) updates.category = body.category
    if (body.imageUrl !== undefined) updates.image_url = body.imageUrl
    if (body.stock !== undefined) updates.stock = parseInt(body.stock, 10)
    if (body.sizes !== undefined) updates.sizes = body.sizes

    const updatedProduct = await updateProduct(params.id, updates)

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Transform back to frontend format
    const transformedProduct = {
      id: updatedProduct.id,
      name: updatedProduct.name,
      description: updatedProduct.description,
      price: updatedProduct.price,
      cost: updatedProduct.cost,
      category: updatedProduct.category,
      image: updatedProduct.image_url, // ProductCard expects 'image' field
      imageUrl: updatedProduct.image_url, // Keep for backwards compatibility
      stock: updatedProduct.stock,
      sizes: updatedProduct.sizes,
    }

    return NextResponse.json(transformedProduct)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/products/[id] - Delete product from Supabase
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteProduct(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

