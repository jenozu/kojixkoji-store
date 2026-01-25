import { getProducts as getProductsFromStorage, getProduct as getProductFromStorage } from './product-storage'
import { Product as StorageProduct } from './product-storage'

// Map storage product format to frontend format (for compatibility with existing pages)
function mapProduct(product: StorageProduct) {
  return {
    id: product.id,
    title: product.name, // Map name to title for compatibility
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.cost, // Map cost to originalPrice if needed
    cost: product.cost,
    category: product.category,
    image: product.imageUrl, // Map imageUrl to image
    imageUrl: product.imageUrl,
    stock: product.stock,
    inStock: product.stock > 0,
    sizes: product.sizes,
    isNew: false, // Can be calculated based on createdAt if needed
  }
}

/**
 * Get all products (compatible with existing pages)
 */
export async function getProducts() {
  const products = await getProductsFromStorage()
  return products.map(mapProduct)
}

/**
 * Get single product by ID (compatible with existing pages)
 */
export async function getProduct(id: string) {
  const product = await getProductFromStorage(id)
  if (!product) return null
  return mapProduct(product)
}

/**
 * Alternative names for new code
 */
export async function getAllProducts() {
  return getProducts()
}

export async function getProductById(id: string) {
  return getProduct(id)
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: string) {
  const products = await getProductsFromStorage()
  return products
    .filter(p => p.category.toLowerCase() === category.toLowerCase())
    .map(mapProduct)
}

/**
 * Search products
 */
export async function searchProducts(query: string) {
  const products = await getProductsFromStorage()
  const lowerQuery = query.toLowerCase()
  
  return products
    .filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
    )
    .map(mapProduct)
}

