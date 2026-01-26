# Bulk Product Upload Guide

## Overview

This guide outlines how to implement bulk product upload functionality using CSV files with image handling. The solution allows administrators to upload multiple products at once by providing a CSV file and a ZIP archive containing product images.

## Architecture Overview

### Recommended Approach: CSV + ZIP Upload

**Why this approach?**
- Single upload operation for users (CSV + images together)
- Images are bundled with product data, ensuring they stay together
- No need for external image hosting
- User-friendly workflow

### How It Works

1. **User Preparation:**
   - User creates a CSV file with product data
   - User places all product images in a folder
   - User creates a ZIP file containing both the CSV and images folder
   - User uploads the ZIP file via admin dashboard

2. **Server Processing:**
   - Server receives ZIP file
   - Extracts ZIP to temporary directory
   - Parses CSV file
   - For each product row:
     - Validates required fields
     - Locates image file(s) referenced in CSV
     - Uploads images to Supabase Storage
     - Creates product record with image URLs
   - Returns detailed results (success/failure per row)
   - Cleans up temporary files

## CSV File Structure

### Required Columns

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `name` | Text | Yes | Product name |
| `price` | Number | Yes | Product price (base price) |
| `category` | Text | Yes | Product category |
| `image_filename` | Text | Yes | Filename of primary image (must exist in ZIP) |
| `description` | Text | No | Product description |
| `cost` | Number | No | Product cost (for profit calculation) |
| `stock` | Integer | No | Total stock quantity (default: 0) |
| `sizes` | JSON | No | Size variants as JSON array |

### Optional: Multiple Images

For products with multiple images, you can use:
- **Option 1:** Comma-separated filenames: `image1.jpg,image2.jpg,image3.jpg`
- **Option 2:** Separate columns: `image1`, `image2`, `image3` (first becomes primary)

### Sizes Column Format

The `sizes` column should contain a JSON array string:

```json
[{"label":"S","price":25,"stock":10},{"label":"M","price":27,"stock":15},{"label":"L","price":29,"stock":8}]
```

Or simpler format (if implementing parser):
```
S:25:10,M:27:15,L:29:8
```

### CSV Example

```csv
name,description,price,cost,category,image_filename,stock,sizes
"Kawaii T-Shirt","Cute anime t-shirt",29.99,15.00,"Apparel","tshirt-blue.jpg",50,"[{\"label\":\"S\",\"price\":29.99,\"stock\":10},{\"label\":\"M\",\"price\":29.99,\"stock\":20},{\"label\":\"L\",\"price\":29.99,\"stock\":20}]"
"Anime Art Print","Pastel art print",24.99,8.00,"Prints","print-hello-kitty.jpg",100,"[{\"label\":\"8x10\",\"price\":24.99,\"stock\":50},{\"label\":\"11x14\",\"price\":34.99,\"stock\":30},{\"label\":\"16x20\",\"price\":44.99,\"stock\":20}]"
"Phone Case","Anime phone case",19.99,7.00,"Accessories","case-pink.jpg",75,"[{\"label\":\"iPhone 12\",\"price\":19.99,\"stock\":25},{\"label\":\"iPhone 13\",\"price\":19.99,\"stock\":25},{\"label\":\"iPhone 14\",\"price\":19.99,\"stock\":25}]"
```

## ZIP File Structure

The ZIP file should contain:
```
products.zip
├── products.csv          (or any CSV filename)
└── images/              (or root level)
    ├── tshirt-blue.jpg
    ├── print-hello-kitty.jpg
    ├── case-pink.jpg
    └── ...
```

**Note:** Images can be in a subfolder or at the root level. The CSV `image_filename` should match the path relative to the ZIP root or just the filename if images are in a known folder.

## Implementation Details

### Backend API Endpoint

**Route:** `POST /api/products/bulk-upload`

**Request:**
- Content-Type: `multipart/form-data`
- Fields:
  - `zipFile`: ZIP file containing CSV + images
  - `csvFilename`: (optional) Name of CSV file in ZIP if not standard name

**Response:**
```json
{
  "success": 45,
  "failed": 2,
  "total": 47,
  "results": [
    {
      "row": 1,
      "status": "success",
      "productId": "uuid-here",
      "productName": "Kawaii T-Shirt"
    },
    {
      "row": 2,
      "status": "failed",
      "error": "Image file 'missing.jpg' not found in ZIP",
      "productName": "Anime Print"
    }
  ]
}
```

### Required NPM Packages

```json
{
  "csv-parse": "^5.5.0",      // CSV parsing
  "adm-zip": "^0.5.10",        // ZIP extraction (or yauzl)
  "formidable": "^3.5.0"       // Form data parsing (or use Next.js built-in)
}
```

### Processing Flow

```typescript
1. Receive multipart form data with ZIP file
2. Extract ZIP to temporary directory (using fs/path)
3. Find CSV file in extracted directory
4. Parse CSV using csv-parse
5. For each row:
   a. Validate required fields (name, price, category, image_filename)
   b. Validate data types (price is number, stock is integer)
   c. Locate image file in extracted ZIP directory
   d. Validate image file exists and is valid image type
   e. Upload image to Supabase Storage (reuse existing upload logic)
   f. Get public URL from Supabase
   g. Parse sizes JSON if provided
   h. Create product using createProduct() helper
   i. Track result (success or error message)
6. Clean up temporary directory
7. Return results summary
```

### Error Handling

- **Continue on error:** If one product fails, continue processing others
- **Track all errors:** Return detailed error messages for each failed row
- **Validation errors:** Catch before attempting database operations
- **Image errors:** Handle missing files, invalid formats, upload failures
- **Database errors:** Catch and report but continue processing

### Image Upload Logic

Reuse existing `/api/upload` logic but adapt for bulk operations:
- Generate unique filenames: `uploads/{timestamp}-{originalName}`
- Validate file types: jpeg, jpg, png, gif, webp
- Validate file size: max 5MB per image
- Upload to Supabase Storage bucket `product-images`
- Get and return public URL

## Frontend Implementation

### Admin Dashboard UI

Add a new section/tab in the admin dashboard:

```tsx
// Bulk Upload Section
<div className="bulk-upload-section">
  <h2>Bulk Product Upload</h2>
  
  {/* Instructions */}
  <div className="instructions">
    <p>1. Create a CSV file with product data</p>
    <p>2. Place all product images in a folder</p>
    <p>3. Create a ZIP file containing CSV + images</p>
    <p>4. Upload the ZIP file below</p>
    <a href="/api/products/bulk-template" download>Download CSV Template</a>
  </div>
  
  {/* File Upload */}
  <input 
    type="file" 
    accept=".zip" 
    onChange={handleZipUpload}
  />
  
  {/* Progress Indicator */}
  {uploading && <ProgressBar />}
  
  {/* Results Display */}
  {results && (
    <div className="results">
      <p>Success: {results.success} / Failed: {results.failed}</p>
      <table>
        {/* Show each row result */}
      </table>
    </div>
  )}
</div>
```

### CSV Template Download

Create endpoint: `GET /api/products/bulk-template` that returns a CSV file with:
- Header row with all column names
- 2-3 example rows with sample data
- Proper formatting

## Alternative Approaches

### Option A: CSV with External Image URLs

**Simpler but less convenient:**
- CSV contains `image_url` column with full URLs
- Images must be hosted externally first
- No ZIP needed, just CSV upload
- Easier to implement but requires image hosting setup

**CSV Format:**
```csv
name,price,category,image_url
"Product 1",29.99,"Apparel","https://cdn.example.com/image1.jpg"
```

### Option B: Two-Step Process

1. Upload images first → get URLs
2. CSV references those URLs by some identifier

**Less user-friendly** - requires two separate operations.

### Option C: Multi-Part Form (CSV + Individual Images)

- Upload CSV + multiple image files in same form
- Match images to products by filename
- More complex form handling

## Database Considerations

### Current Schema

Products table has:
- `image_url` (TEXT) - single primary image URL
- No `mediaUrls` field currently

### Future Enhancement

If you want to support multiple images per product:
1. Add `media_urls` JSONB column to products table
2. Store array of image URLs: `["url1", "url2", "url3"]`
3. Update bulk upload to handle multiple images
4. Update frontend to display image galleries

## Security Considerations

1. **File Validation:**
   - Validate ZIP file is actually a ZIP
   - Limit ZIP size (e.g., 100MB max)
   - Limit number of images per upload
   - Validate image file types and sizes

2. **Rate Limiting:**
   - Limit bulk upload frequency
   - Prevent abuse

3. **Admin Authentication:**
   - Ensure bulk upload endpoint requires admin authentication
   - Check admin session before processing

4. **File Cleanup:**
   - Always clean up temporary extracted files
   - Use try/finally blocks
   - Set timeout for cleanup

## Testing Strategy

1. **Unit Tests:**
   - CSV parsing with various formats
   - Image file matching logic
   - Validation functions

2. **Integration Tests:**
   - Full upload flow with test ZIP
   - Error handling scenarios
   - Partial success scenarios

3. **Manual Testing:**
   - Upload valid CSV + ZIP
   - Upload with missing images
   - Upload with invalid data
   - Upload with mixed valid/invalid rows

## Performance Considerations

1. **Batch Processing:**
   - Process products sequentially to avoid overwhelming database
   - Consider batching database inserts if uploading 100+ products

2. **Image Upload:**
   - Upload images in parallel (Promise.all) for speed
   - But limit concurrency to avoid rate limits

3. **Memory Management:**
   - Stream ZIP extraction if possible
   - Don't load all images into memory at once

4. **Timeout Handling:**
   - Set reasonable timeout (e.g., 5 minutes for large uploads)
   - Consider background job processing for very large uploads

## Step-by-Step Implementation Plan

1. **Phase 1: Backend API**
   - Install required packages (csv-parse, adm-zip)
   - Create `/api/products/bulk-upload` endpoint
   - Implement ZIP extraction
   - Implement CSV parsing
   - Implement image upload logic
   - Implement product creation loop
   - Add error handling and result tracking

2. **Phase 2: Validation & Error Handling**
   - Add comprehensive validation
   - Improve error messages
   - Add logging

3. **Phase 3: Frontend UI**
   - Add bulk upload section to admin dashboard
   - Implement file upload UI
   - Add progress indicator
   - Display results table
   - Add CSV template download

4. **Phase 4: Testing & Refinement**
   - Test with various scenarios
   - Handle edge cases
   - Optimize performance
   - Add user feedback improvements

## Example Code Structure

```
app/api/products/
  ├── route.ts                    (existing single product)
  ├── [id]/route.ts               (existing)
  └── bulk-upload/
      └── route.ts                (new bulk upload endpoint)

lib/
  ├── bulk-upload/
  │   ├── csv-parser.ts          (CSV parsing utilities)
  │   ├── zip-handler.ts         (ZIP extraction)
  │   └── validator.ts           (data validation)
  └── supabase-helpers.ts        (existing - add bulk create if needed)
```

## Summary

The CSV + ZIP approach provides the best balance of:
- ✅ User convenience (single upload)
- ✅ Image handling (bundled together)
- ✅ Implementation complexity (manageable)
- ✅ Error handling (can track per-row results)

This solution allows you to upload hundreds of products with their images in a single operation, making inventory management much more efficient.
