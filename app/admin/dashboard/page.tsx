"use client"

import React, { useState, useRef, useMemo, useEffect } from 'react'
import { useRouter } from "next/navigation"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts'
import { LayoutDashboard, Package, Settings, Plus, Trash2, Edit2, Upload, Image as ImageIcon, X, ArrowRight, AlertCircle, TrendingUp, DollarSign, ShoppingBag, LogOut, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Standard print sizes for art prints
const STANDARD_PRINT_SIZES = [
  { label: '5" × 7"', value: '5x7', defaultPrice: 15 },
  { label: '8" × 10"', value: '8x10', defaultPrice: 20 },
  { label: '11" × 14"', value: '11x14', defaultPrice: 30 },
  { label: '12" × 18"', value: '12x18', defaultPrice: 35 },
  { label: '16" × 20"', value: '16x20', defaultPrice: 45 },
  { label: '18" × 24"', value: '18x24', defaultPrice: 55 },
  { label: '20" × 30"', value: '20x30', defaultPrice: 65 },
  { label: '24" × 32"', value: '24x32', defaultPrice: 85 },
  { label: '24" × 36"', value: '24x36', defaultPrice: 95 },
]

interface ProductSize {
  label: string
  price: number
  stock?: number
}

interface MediaFile {
  url: string
  type: 'image' | 'video'
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  cost?: number
  category: string
  imageUrl: string
  mediaUrls?: MediaFile[]
  stock: number
  sizes?: ProductSize[]
}

type AdminTab = 'DASHBOARD' | 'PRODUCTS' | 'ORDERS' | 'SETTINGS'
type AnalyticsViewType = 'INVENTORY' | 'CATEGORIES' | 'SALES'
type DetailModalType = 'NONE' | 'LOW_STOCK' | 'ORDER_DETAILS'

interface Order {
  id: string
  orderId: string
  email: string
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  shippingAddress?: {
    firstName: string
    lastName: string
    address1: string
    city: string
    province: string
    postal: string
  }
  items?: Array<{
    name: string
    price: number
    quantity: number
  }>
}

const COLORS = ['#FF6B9D', '#C8A1FF', '#95D5B2', '#FFD93D', '#6BCB77', '#4D96FF']

export default function AdminDashboardPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<AdminTab>('DASHBOARD')
  const [isEditing, setIsEditing] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Dashboard State
  const [analyticsView, setAnalyticsView] = useState<AnalyticsViewType>('SALES')
  const [detailModal, setDetailModal] = useState<DetailModalType>('NONE')

  // Form State
  const [currentId, setCurrentId] = useState<string>('')
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [sizes, setSizes] = useState<ProductSize[]>(
    STANDARD_PRINT_SIZES.map(size => ({
      label: size.label,
      price: size.defaultPrice,
      stock: 0
    }))
  )

  // Upload State
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const mediaInputRef = useRef<HTMLInputElement>(null)

  // Simple admin authentication check
  useEffect(() => {
    const auth = sessionStorage.getItem("admin-auth")
    if (auth === "true") {
      setIsAuthenticated(true)
    } else {
      router.replace("/admin/login")
    }
  }, [router])

  // Load products and orders on mount
  useEffect(() => {
    refreshProducts()
    refreshOrders()
  }, [])

  const refreshOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders')
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error loading orders:', error)
    }
  }

  const refreshProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  // --- Calculations for Dashboard ---
  const lowStockItems = useMemo(() => products.filter(p => p.stock < 5), [products])
  const totalStock = useMemo(() => products.reduce((acc, p) => acc + p.stock, 0), [products])
  const totalValue = useMemo(() => products.reduce((acc, p) => acc + (p.price * p.stock), 0), [products])
  
  // Sales metrics
  const totalRevenue = useMemo(() => orders.reduce((acc, o) => acc + (o.total || 0), 0), [orders])
  const totalOrders = useMemo(() => orders.length, [orders])
  const pendingOrders = useMemo(() => orders.filter(o => o.status === 'pending' || o.status === 'processing').length, [orders])
  
  // Sales data for charts
  const salesData = useMemo(() => {
    const now = new Date()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthlyRevenue: Record<string, number> = {}
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${months[date.getMonth()]} ${date.getFullYear()}`
      monthlyRevenue[key] = 0
    }
    
    // Calculate revenue from orders
    orders.forEach(order => {
      if (order.createdAt) {
        const date = new Date(order.createdAt)
        const key = `${months[date.getMonth()]} ${date.getFullYear()}`
        if (monthlyRevenue[key] !== undefined) {
          monthlyRevenue[key] += order.total || 0
        }
      }
    })
    
    return Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month: month.split(' ')[0],
      revenue: Math.round(revenue),
      profit: Math.round(revenue * 0.4), // Estimate 40% profit margin
    }))
  }, [orders])

  const categoryData = useMemo(() => {
    const counts = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [products])

  const valuationData = useMemo(() => {
    return products
      .map(p => ({ name: p.name, value: p.price * p.stock }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  }, [products])

  const inventoryData = useMemo(() => {
    return products.map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      stock: p.stock,
      full_name: p.name
    }))
  }, [products])

  const handleMediaUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return

    console.log('[DEBUG] handleMediaUpload entry', {
      fileCount: files.length,
      firstFile: files[0] ? {
        name: files[0].name,
        size: files[0].size,
        type: files[0].type
      } : null
    })

    try {
      setUploading(true)
      const uploadedMedia: MediaFile[] = []

      // Import Supabase client for direct uploads (bypasses Vercel 4.5MB limit)
      console.log('[DEBUG] Importing @supabase/supabase-js')
      const { createClient } = await import('@supabase/supabase-js')
      console.log('[DEBUG] Import successful')
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      
      console.log('[DEBUG] Environment variables', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
        urlLength: supabaseUrl.length,
        keyLength: supabaseKey.length
      })
      
      if (!supabaseUrl || !supabaseKey) {
        alert('Supabase is not configured. Please check your environment variables.')
        return
      }

      const supabase = createClient(supabaseUrl, supabaseKey)
      console.log('[DEBUG] Supabase client created')

      for (const file of Array.from(files)) {
        // Validate file type
        const allowedTypes = [
          'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
          'video/mp4', 'video/webm', 'video/quicktime'
        ]
        if (!allowedTypes.includes(file.type)) {
          alert(`Invalid file type for ${file.name}. Only images and videos are allowed.`)
          continue
        }

        // Validate file size (5MB for images, 50MB for videos)
        const isVideo = file.type.startsWith('video/')
        const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024
        if (file.size > maxSize) {
          alert(`File ${file.name} is too large. Maximum is ${isVideo ? '50MB for videos' : '5MB for images'}.`)
          continue
        }

        // Generate unique filename
        const timestamp = Date.now()
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const filename = `uploads/${timestamp}-${originalName}`

        console.log('[DEBUG] Starting upload', {
          filename,
          fileSize: file.size,
          fileType: file.type
        })

        // Upload directly to Supabase Storage (bypasses API route and Vercel limits)
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filename, file, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false
          })

        console.log('[DEBUG] Upload result', {
          success: !error,
          errorMessage: error?.message,
          errorCode: error?.statusCode,
          dataPath: data?.path
        })

        if (error) {
          console.error('Upload error:', error)
          alert(`Failed to upload ${file.name}: ${error.message}`)
          continue
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filename)

        const type = file.type.startsWith('video/') ? 'video' : 'image'
        uploadedMedia.push({ url: publicUrl, type })
      }

      setMediaFiles([...mediaFiles, ...uploadedMedia])
    } catch (error) {
      console.log('[DEBUG] Catch block entered', {
        errorMessage: error instanceof Error ? error.message : 'Unknown',
        errorName: error instanceof Error ? error.name : 'Unknown',
        errorStack: error instanceof Error ? error.stack : 'None'
      })
      
      console.error('Upload error:', error)
      alert(`Failed to upload media files: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleMediaUpload(e.dataTransfer.files)
    }
  }

  const removeMedia = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index))
  }

  const updateSizePrice = (index: number, price: number) => {
    const newSizes = [...sizes]
    newSizes[index].price = price
    setSizes(newSizes)
  }

  const updateSizeStock = (index: number, stock: number) => {
    const newSizes = [...sizes]
    newSizes[index].stock = stock
    setSizes(newSizes)
  }

  const handleSubmit = async () => {
    if (!name || !category || mediaFiles.length === 0) {
      alert('Please fill in name, category, and upload at least one image or video')
      return
    }

    // Calculate base price from smallest size for compatibility
    const basePrice = sizes[0]?.price || 0

    const productData = {
      name,
      description,
      price: basePrice,
      category,
      imageUrl: mediaFiles[0]?.url || '',
      mediaUrls: mediaFiles,
      stock: sizes.reduce((sum, s) => sum + (s.stock || 0), 0),
      sizes,
    }

    try {
      let res: Response
      if (isEditing && currentId) {
        // Update
        res = await fetch(`/api/products/${currentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        })
      } else {
        // Create
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        })
      }

      // Check if the response is successful
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error occurred' }))
        console.error('API error:', errorData)
        alert(`Failed to ${isEditing ? 'update' : 'create'} product: ${errorData.error || `HTTP ${res.status}`}`)
        return
      }

      // Only reset form and refresh if successful
      const createdProduct = await res.json()
      console.log(`Product ${isEditing ? 'updated' : 'created'} successfully:`, createdProduct)
      
      resetForm()
      refreshProducts()
    } catch (error) {
      console.error('Save error:', error)
      alert(`Failed to ${isEditing ? 'update' : 'create'} product: ${error instanceof Error ? error.message : 'Network error'}`)
    }
  }

  const handleEdit = (product: Product) => {
    setCurrentId(product.id)
    setName(product.name)
    setDescription(product.description)
    setCategory(product.category)
    setMediaFiles(product.mediaUrls || [{ url: product.imageUrl, type: 'image' }])
    
    // Restore size pricing or use defaults
    if (product.sizes && product.sizes.length > 0) {
      setSizes(product.sizes)
    } else {
      setSizes(STANDARD_PRINT_SIZES.map(size => ({
        label: size.label,
        price: size.defaultPrice,
        stock: 0
      })))
    }
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' })
      refreshProducts()
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete product')
    }
  }

  const resetForm = () => {
    setCurrentId('')
    setName('')
    setDescription('')
    setCategory('')
    setMediaFiles([])
    setSizes(STANDARD_PRINT_SIZES.map(size => ({
      label: size.label,
      price: size.defaultPrice,
      stock: 0
    })))
    setIsEditing(false)
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r flex flex-col shadow-lg z-10">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">KOJI × KOJI</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Admin Portal</p>
        </div>

        <nav className="flex-1 py-6 space-y-2">
          <button
            onClick={() => { setActiveTab('DASHBOARD'); setIsEditing(false); }}
            className={`w-full flex items-center px-6 py-3 transition-colors ${
              activeTab === 'DASHBOARD' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            <LayoutDashboard className="mr-3" size={20} />
            Dashboard
          </button>

          <button
            onClick={() => { setActiveTab('PRODUCTS'); setIsEditing(false); }}
            className={`w-full flex items-center px-6 py-3 transition-colors ${
              activeTab === 'PRODUCTS' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            <Package className="mr-3" size={20} />
            Products
          </button>

          <button
            onClick={() => { setActiveTab('ORDERS'); setIsEditing(false); }}
            className={`w-full flex items-center px-6 py-3 transition-colors ${
              activeTab === 'ORDERS' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            <ShoppingBag className="mr-3" size={20} />
            Orders
          </button>

          <button
            onClick={() => setActiveTab('SETTINGS')}
            className={`w-full flex items-center px-6 py-3 transition-colors ${
              activeTab === 'SETTINGS' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            <Settings className="mr-3" size={20} />
            Settings
          </button>
        </nav>

        <div className="p-6 border-t space-y-2">
          <Button asChild variant="outline" className="w-full">
            <Link href="/">
              <ArrowRight className="mr-2" size={16} />
              Back to Site
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => {
              sessionStorage.removeItem("admin-auth")
              router.replace("/admin/login")
            }}
          >
            <LogOut className="mr-2" size={16} />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Dashboard View */}
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold">Executive Overview</h2>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-card border rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-3xl font-bold mt-2">${totalRevenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground mt-1">{totalOrders} orders</p>
                    </div>
                    <DollarSign className="text-muted-foreground" size={40} />
                  </div>
                </div>

                <div className="bg-card border rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Products</p>
                      <p className="text-3xl font-bold mt-2">{products.length}</p>
                    </div>
                    <Package className="text-muted-foreground" size={40} />
                  </div>
                </div>

                <div
                  className="bg-card border rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setDetailModal('LOW_STOCK')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Inventory Value</p>
                      <p className="text-3xl font-bold mt-2">${totalValue.toLocaleString()}</p>
                      {lowStockItems.length > 0 && (
                        <p className="text-xs text-destructive mt-1 flex items-center">
                          <AlertCircle size={12} className="mr-1" />
                          {lowStockItems.length} low stock
                        </p>
                      )}
                    </div>
                    <TrendingUp className="text-muted-foreground" size={40} />
                  </div>
                </div>

                <div className="bg-card border rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Orders</p>
                      <p className="text-3xl font-bold mt-2">{pendingOrders}</p>
                      <p className="text-xs text-muted-foreground mt-1">Needs attention</p>
                    </div>
                    <ShoppingBag className="text-muted-foreground" size={40} />
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card border rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Sales Performance</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setAnalyticsView('SALES')}
                        className={`px-3 py-1 text-xs rounded ${
                          analyticsView === 'SALES' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                        }`}
                      >
                        Sales
                      </button>
                      <button
                        onClick={() => setAnalyticsView('INVENTORY')}
                        className={`px-3 py-1 text-xs rounded ${
                          analyticsView === 'INVENTORY' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                        }`}
                      >
                        Inventory
                      </button>
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={300}>
                    {analyticsView === 'SALES' && (
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                        <Bar dataKey="profit" fill="#82ca9d" name="Profit" />
                      </BarChart>
                    )}

                    {analyticsView === 'INVENTORY' && (
                      <BarChart data={inventoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="stock" fill="#FF6B9D" />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>

                <div className="bg-card border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-6">Category Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Products View */}
          {activeTab === 'PRODUCTS' && !isEditing && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Product Management</h2>
                <Button onClick={() => setIsEditing(true)}>
                  <Plus className="mr-2" size={18} />
                  Add Product
                </Button>
              </div>

              <div className="grid gap-4">
                {products.map(product => (
                  <div key={product.id} className="bg-card border rounded-lg p-4 flex items-center gap-4">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                      <p className="text-sm">${product.price} • Stock: {product.stock}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleEdit(product)} variant="outline" size="sm">
                        <Edit2 size={16} />
                      </Button>
                      <Button onClick={() => handleDelete(product.id)} variant="destructive" size="sm">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Form */}
          {activeTab === 'PRODUCTS' && isEditing && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">{currentId ? 'Edit Product' : 'New Product'}</h2>
                <Button onClick={resetForm} variant="outline">
                  <X className="mr-2" size={18} />
                  Cancel
                </Button>
              </div>

              <div className="bg-card border rounded-lg p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Product name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Category"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                    placeholder="Product description"
                  />
                </div>

                {/* Bulk Media Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Photos & Videos *</label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={mediaInputRef}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={(e) => e.target.files && handleMediaUpload(e.target.files)}
                      className="hidden"
                    />
                    <Upload className="mx-auto mb-4 text-muted-foreground" size={48} />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop images or videos here, or click to browse
                    </p>
                    <Button
                      onClick={() => mediaInputRef.current?.click()}
                      disabled={uploading}
                      variant="outline"
                      type="button"
                    >
                      {uploading ? 'Uploading...' : 'Select Files'}
                    </Button>
                  </div>

                  {/* Media Preview Grid */}
                  {mediaFiles.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      {mediaFiles.map((media, idx) => (
                        <div key={idx} className="relative group">
                          {media.type === 'image' ? (
                            <img
                              src={media.url}
                              alt={`Media ${idx + 1}`}
                              className="w-full h-32 object-cover rounded border"
                            />
                          ) : (
                            <div className="w-full h-32 bg-muted rounded border flex items-center justify-center">
                              <Video size={32} className="text-muted-foreground" />
                            </div>
                          )}
                          <button
                            onClick={() => removeMedia(idx)}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            type="button"
                          >
                            <X size={16} />
                          </button>
                          {idx === 0 && (
                            <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                              Primary
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Print Size Pricing Grid */}
                <div>
                  <label className="block text-sm font-medium mb-2">Print Size Variations</label>
                  <p className="text-xs text-muted-foreground mb-4">Set pricing and stock for each standard print size</p>
                  <div className="grid grid-cols-3 gap-4">
                    {sizes.map((size, idx) => (
                      <div key={idx} className="bg-muted p-4 rounded-lg space-y-2">
                        <div className="font-semibold text-sm">{size.label}</div>
                        <div>
                          <label className="text-xs text-muted-foreground">Price ($)</label>
                          <input
                            type="number"
                            value={size.price}
                            onChange={(e) => updateSizePrice(idx, parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 border rounded text-sm mt-1"
                            placeholder="0.00"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Stock</label>
                          <input
                            type="number"
                            value={size.stock || 0}
                            onChange={(e) => updateSizeStock(idx, parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 border rounded text-sm mt-1"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSubmit} type="button">
                    {currentId ? 'Update Product' : 'Create Product'}
                  </Button>
                  <Button onClick={resetForm} variant="outline" type="button">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Orders View */}
          {activeTab === 'ORDERS' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">Order Management</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {orders.length} total orders • ${totalRevenue.toLocaleString()} total revenue
                  </p>
                </div>
                <Button onClick={refreshOrders} variant="outline">
                  Refresh
                </Button>
              </div>

              {orders.length === 0 ? (
                <div className="bg-card border rounded-lg p-12 text-center">
                  <ShoppingBag className="mx-auto text-muted-foreground mb-4" size={48} />
                  <p className="text-muted-foreground">No orders yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Orders will appear here once customers make purchases
                  </p>
                </div>
              ) : (
                <div className="bg-card border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-4 text-left text-sm font-semibold">Order ID</th>
                          <th className="p-4 text-left text-sm font-semibold">Date</th>
                          <th className="p-4 text-left text-sm font-semibold">Customer</th>
                          <th className="p-4 text-left text-sm font-semibold">Items</th>
                          <th className="p-4 text-left text-sm font-semibold">Total</th>
                          <th className="p-4 text-left text-sm font-semibold">Status</th>
                          <th className="p-4 text-left text-sm font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-muted/50">
                            <td className="p-4">
                              <code className="text-xs font-mono">{order.orderId || order.id}</code>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString()
                                : 'N/A'}
                            </td>
                            <td className="p-4">
                              <div className="text-sm">
                                <div className="font-medium">
                                  {order.shippingAddress
                                    ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
                                    : 'Guest'}
                                </div>
                                <div className="text-muted-foreground text-xs">{order.email}</div>
                              </div>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">
                              {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                            </td>
                            <td className="p-4 font-semibold">${(order.total || 0).toFixed(2)}</td>
                            <td className="p-4">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  order.status === 'delivered'
                                    ? 'bg-green-100 text-green-800'
                                    : order.status === 'shipped'
                                    ? 'bg-blue-100 text-blue-800'
                                    : order.status === 'processing'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : order.status === 'cancelled'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {order.status || 'pending'}
                              </span>
                            </td>
                            <td className="p-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order)
                                  setDetailModal('ORDER_DETAILS')
                                }}
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Settings View */}
          {activeTab === 'SETTINGS' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Settings</h2>
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Environment Configuration</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  This application uses <code className="bg-secondary px-2 py-1">Supabase</code> for product data storage.
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  Images and videos are stored via the upload API.
                </p>
                <p className="text-sm text-muted-foreground">
                  Configuration managed via environment variables in Vercel.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Low Stock Modal */}
      {detailModal === 'LOW_STOCK' && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setDetailModal('NONE')}
        >
          <div
            className="bg-card p-6 rounded-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Low Stock Alert</h3>
            <div className="space-y-2">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="text-destructive">{item.stock} left</span>
                </div>
              ))}
            </div>
            <Button onClick={() => setDetailModal('NONE')} className="mt-4 w-full">
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {detailModal === 'ORDER_DETAILS' && selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setDetailModal('NONE')
            setSelectedOrder(null)
          }}
        >
          <div
            className="bg-card p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold">Order Details</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedOrder.orderId || selectedOrder.id}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setDetailModal('NONE')
                  setSelectedOrder(null)
                }}
              >
                <X size={20} />
              </Button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Customer Information</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      {selectedOrder.shippingAddress
                        ? `${selectedOrder.shippingAddress.firstName} ${selectedOrder.shippingAddress.lastName}`
                        : 'Guest Customer'}
                    </p>
                    <p className="text-muted-foreground">{selectedOrder.email}</p>
                    {selectedOrder.shippingAddress && (
                      <>
                        <p className="text-muted-foreground mt-2">
                          {selectedOrder.shippingAddress.address1}
                        </p>
                        <p className="text-muted-foreground">
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.province}{' '}
                          {selectedOrder.shippingAddress.postal}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Order Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(
                      (status) => (
                        <Button
                          key={status}
                          variant={selectedOrder.status === status ? 'default' : 'outline'}
                          size="sm"
                          onClick={async () => {
                            // TODO: Implement order status update API
                            alert(`Order status update coming soon! Would update to: ${status}`)
                          }}
                        >
                          {status}
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-4 flex justify-between items-end">
                <div className="text-sm text-muted-foreground">
                  <p>
                    Order Date:{' '}
                    {selectedOrder.createdAt
                      ? new Date(selectedOrder.createdAt).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold">${(selectedOrder.total || 0).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
