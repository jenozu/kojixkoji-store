import { NextRequest, NextResponse } from 'next/server'
import { getProducts, createProduct } from '@/lib/supabase-helpers'

/**
 * GET /api/products - Fetch all products from Supabase
 */
export async function GET() {
  try {
    const products = await getProducts()
    
    // Transform Supabase format to match frontend expectations
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      cost: product.cost,
      category: product.category,
      imageUrl: product.image_url,
      stock: product.stock,
      sizes: product.sizes,
    }))
    
    return NextResponse.json(transformedProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/products - Create a new product in Supabase
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('POST /api/products - Received body:', { 
      name: body.name, 
      category: body.category, 
      price: body.price,
      hasImage: !!body.imageUrl,
      sizesCount: body.sizes?.length 
    })

    // Validate required fields
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, category' },
        { status: 400 }
      )
    }

    // Create product
    const newProduct = await createProduct({
      name: body.name,
      description: body.description || '',
      price: parseFloat(body.price),
      cost: body.cost ? parseFloat(body.cost) : undefined,
      category: body.category,
      image_url: body.imageUrl || '',
      stock: body.stock ? parseInt(body.stock, 10) : 0,
      sizes: body.sizes || [],
    })

    // Transform back to frontend format
    const transformedProduct = {
      id: newProduct.id,
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      cost: newProduct.cost,
      category: newProduct.category,
      imageUrl: newProduct.image_url,
      stock: newProduct.stock,
      sizes: newProduct.sizes,
    }

    return NextResponse.json(transformedProduct, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: `Failed to create product: ${errorMessage}` },
      { status: 500 }
    )
  }
}

