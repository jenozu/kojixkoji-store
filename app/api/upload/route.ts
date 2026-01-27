import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

// Note: This API route is kept for backwards compatibility
// New uploads use direct client-side uploads to Supabase Storage
// to bypass Vercel's 4.5MB body size limit

/**
 * POST /api/upload - Handle image file uploads to Supabase Storage
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type (images and videos)
    const allowedTypes = [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/gif', 
      'image/webp',
      'video/mp4',
      'video/webm',
      'video/quicktime'
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images (JPG, PNG, GIF, WebP) and videos (MP4, WebM, MOV) are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (50MB for images and videos)
    const isVideo = file.type.startsWith('video/')
    const maxSize = 50 * 1024 * 1024 // 50MB for both images and videos
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size is 50MB.` },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `uploads/${timestamp}-${originalName}`

    // Convert File to ArrayBuffer then Buffer
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filename, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return NextResponse.json(
        { error: `Failed to upload: ${error.message}` },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filename)

    // Return the public URL
    return NextResponse.json({ url: publicUrl }, { status: 200 })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file. Make sure Supabase is configured correctly.' },
      { status: 500 }
    )
  }
}
