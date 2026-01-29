# Custom Font Setup Guide

## Step 1: Add Your Font File

1. Copy your font file(s) from your computer to the `app/fonts/` directory
2. Make sure the file name matches what you'll use in the configuration

## Step 2: Update the Font Configuration

Open `app/layout.tsx` and update the font configuration:

```typescript
const customFont = localFont({
  src: [
    {
      path: "./fonts/YOUR_FONT_FILE_NAME.woff2", // Change this to your font file name
      weight: "400", // Font weight (400 = normal, 700 = bold, etc.)
      style: "normal", // "normal" or "italic"
    },
  ],
  variable: "--font-custom",
  display: "swap",
  fallback: ["system-ui", "arial"],
})
```

## Step 3: Supported Font Formats

Next.js supports these font formats (in order of preference):
- **`.woff2`** - Best compression, recommended
- **`.woff`** - Good compression
- **`.ttf`** - TrueType font
- **`.otf`** - OpenType font

## Step 4: Multiple Font Weights/Styles

If you have multiple font files (bold, italic, etc.), add them like this:

```typescript
const customFont = localFont({
  src: [
    {
      path: "./fonts/MyFont-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/MyFont-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/MyFont-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-custom",
  display: "swap",
  fallback: ["system-ui", "arial"],
})
```

## Step 5: Font Weight Reference

- `100` - Thin
- `200` - Extra Light
- `300` - Light
- `400` - Regular/Normal (default)
- `500` - Medium
- `600` - Semi Bold
- `700` - Bold
- `800` - Extra Bold
- `900` - Black

## Step 6: Using the Font in CSS

The font is automatically applied to the body, but you can also use it with the CSS variable:

```css
.my-custom-text {
  font-family: var(--font-custom);
}
```

Or in Tailwind (if you configure it in `tailwind.config.js`):

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        custom: ['var(--font-custom)'],
      },
    },
  },
}
```

Then use it: `<div className="font-custom">Text</div>`

## Troubleshooting

**Font not loading?**
- Check that the file path in `layout.tsx` matches your actual file name
- Make sure the file is in the `app/fonts/` directory
- Check the browser console for errors

**Font looks different?**
- Verify the font weight matches your file (e.g., if it's a bold font, use weight: "700")
- Check that the font file isn't corrupted

**Want to use both custom font and Google Fonts?**
- You can import both and apply them to different elements
- Example: Use custom font for headings, Google font for body text
