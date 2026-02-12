# Runtime Environment Variable Support for Tracker

## ✅ YES! Tracker Now Supports Direct .env APP_NAME (No Rebuild Needed!)

Your tracker can now read the brand name **directly from environment variables at runtime** without needing to rebuild the tracking script.

## How It Works

### Two Approaches Available:

#### **Approach 1: Runtime via data-tracker-name Attribute (Recommended)**

The tracker reads the brand name from a `data-tracker-name` attribute on the script tag. The server injects the value from `process.env.APP_NAME` when rendering HTML.

**HTML:**

```html
<script defer data-website-id="YOUR-WEBSITE-ID" data-tracker-name="myanalytics" src="/script.js"></script>
```

**Benefits:**

- ✅ No rebuild required when changing APP_NAME
- ✅ Just restart the Next.js server
- ✅ Dynamic per-request

#### **Approach 2: Server-Side Script Generation**

Use the dynamic API route `/api/script.js` instead of static `/script.js`. This route reads the compiled tracker and replaces `__TRACKER_NAME__` with the current `APP_NAME` on every request.

**HTML:**

```html
<script defer data-website-id="YOUR-WEBSITE-ID" src="/api/script.js"></script>
```

**Benefits:**

- ✅ Works even if data-tracker-name is not provided
- ✅ Automatic injection of APP_NAME
- ✅ Cached for 1 hour for performance

## Implementation Details

### Tracker Script Logic

The tracker checks for the brand name in this order:

```javascript
// 1. Runtime: Read from data-tracker-name attribute
const trackerName =
  attr(`${_data}tracker-name`) ||
  // 2. Build-time fallback: Use replaced value
  "__TRACKER_NAME__";
```

### Example Integration

**React/Next.js Component:**

```tsx
import { APP_NAME } from "@/lib/constants";

export function MyComponent({ websiteId }) {
  return <Script defer data-website-id={websiteId} data-tracker-name={APP_NAME.toLowerCase()} src="/script.js" />;
}
```

**Plain HTML:**

```html
<!-- Server generates this with your APP_NAME -->
<script defer data-website-id="e676c9b4-11e4-4ef1-a4d7-87001773e9f2" data-tracker-name="myanalytics" src="/script.js"></script>
```

## Files Updated

1. **[src/tracker/index.js](src/tracker/index.js#L37)** - Reads `data-tracker-name` attribute
2. **[src/app/api/script.js/route.ts](src/app/api/script.js/route.ts)** - Dynamic script generation endpoint
3. **[src/app/(main)/websites/[websiteId]/settings/WebsiteTrackingCode.tsx](<src/app/(main)/websites/[websiteId]/settings/WebsiteTrackingCode.tsx>)** - Includes data-tracker-name in generated code
4. **[src/app/(main)/console/[websiteId]/TestConsolePage.tsx](<src/app/(main)/console/[websiteId]/TestConsolePage.tsx>)** - Uses data-tracker-name attribute

## Usage Examples

### Method 1: Static Script + data-tracker-name (Recommended)

```html
<!-- 1. Set APP_NAME in .env -->
APP_NAME=MyAnalytics

<!-- 2. Server renders this HTML automatically -->
<script defer data-website-id="YOUR-ID" data-tracker-name="myanalytics" src="/script.js"></script>

<!-- 3. Tracker creates: window.myanalytics -->
<script>
  window.myanalytics.track("page-view");
</script>
```

### Method 2: Dynamic Script Generation

```html
<!-- 1. Set APP_NAME in .env -->
APP_NAME=CustomBrand

<!-- 2. Use dynamic API endpoint -->
<script defer data-website-id="YOUR-ID" src="/api/script.js"></script>

<!-- 3. API injects brand name automatically -->
<script>
  window.custombrand.track("signup");
</script>
```

## Testing

```bash
# 1. Update .env
echo "APP_NAME=TestBrand" >> .env

# 2. Restart server (no rebuild needed!)
npm run dev

# 3. Check generated tracking code in UI
# Should show: data-tracker-name="testbrand"

# 4. Browser console
window.testbrand.track('test-event'); // Should work!
```

## Comparison: Build-time vs Runtime

| Feature          | Build-time Replacement | Runtime data-tracker-name | Dynamic API Route      |
| ---------------- | ---------------------- | ------------------------- | ---------------------- |
| Rebuild Required | ✅ Yes                 | ❌ No                     | ❌ No                  |
| Server Restart   | ✅ Yes                 | ✅ Yes                    | ✅ Yes                 |
| Performance      | ⚡ Fastest (static)    | ⚡ Fast (static)          | 🐢 Slower (dynamic)    |
| Flexibility      | ⛔ One brand per build | ✅ Multi-brand capable    | ✅ Multi-brand capable |
| Recommended      | Legacy/Single-brand    | ✅ **Most cases**         | Special use cases      |

## Migration Guide

### From Build-time to Runtime

**Before (required rebuild):**

```bash
# Change .env
APP_NAME=NewBrand

# Must rebuild tracker
npm run build-tracker

# Restart server
npm run dev
```

**After (no rebuild):**

```bash
# Change .env
APP_NAME=NewBrand

# Just restart server
npm run dev

# Tracker auto-updates via data-tracker-name!
```

### HTML Changes

**Before:**

```html
<script defer data-website-id="..." src="/script.js"></script>
```

**After:**

```html
<script defer data-website-id="..." data-tracker-name="yourbrand" src="/script.js"></script>
```

Or use the dynamic endpoint:

```html
<script defer data-website-id="..." src="/api/script.js"></script>
```

## Backward Compatibility

The tracker is **fully backward compatible**:

- ✅ If `data-tracker-name` is provided → uses it (runtime)
- ✅ If NOT provided → falls back to `__TRACKER_NAME__` (build-time)
- ✅ Old installations continue working without changes

## Summary

🎉 **YES! The tracker can now use .env APP_NAME directly at runtime!**

**Best Setup:**

1. Add `data-tracker-name` attribute to your script tags
2. Server automatically injects value from `process.env.APP_NAME`
3. Change `.env` → Restart server → Done!

**No rebuild needed!** 🚀
