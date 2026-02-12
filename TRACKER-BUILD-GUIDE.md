# Tracker Build & Deployment Guide

## Overview

The tracking script (`public/script.js`) is a compiled JavaScript file that needs to be **rebuilt** whenever you change branding environment variables. This is because browsers can't access server-side `process.env` - the values must be injected at build time.

## How It Works

### 1. Build Process

The tracker uses Rollup to compile `src/tracker/index.js` → `public/script.js` with environment variables injected:

```javascript
// rollup.tracker.config.js
replace({
  __TRACKER_NAME__: (process.env.APP_NAME || "syncfuse").toLowerCase(),
  __COLLECT_API_HOST__: process.env.COLLECT_API_HOST || "",
  __COLLECT_API_ENDPOINT__: process.env.COLLECT_API_ENDPOINT || "/api/send",
});
```

### 2. Dynamic Branding in Tracker

After build, the tracker automatically uses your brand name for:

#### JavaScript API

```javascript
// If APP_NAME=MyAnalytics in .env:
window.myanalytics.track("event-name");
window.myanalytics.identify({ userId: 123 });
```

#### HTML Attributes

```html
<!-- If APP_NAME=MyAnalytics -->
<button data-myanalytics-event="click">Track Me</button>
<a data-myanalytics-event="purchase" data-myanalytics-event-revenue="99.99" data-myanalytics-event-currency="USD">Buy Now</a>
```

#### Browser Storage

```javascript
// Opt-out key: {appname}.disabled
localStorage.setItem("myanalytics.disabled", "1");
```

#### HTTP Headers

```javascript
// Cache header: x-{appname}-cache
'x-myanalytics-cache': cacheToken
```

## Build Commands

### Development Build

```bash
npm run build-tracker
```

### Production Build

```bash
# Full build including tracker
npm run build
```

### Docker Build

The tracker is automatically built during Docker image creation with your environment variables baked in.

## Important Notes

⚠️ **You must rebuild the tracker after changing APP_NAME** in .env:

```bash
# 1. Update .env file
APP_NAME=MyCustomAnalytics

# 2. Rebuild tracker
npm run build-tracker

# 3. Restart application
npm run dev  # or npm start
```

⚠️ **The compiled script is static** - browsers receive the same `script.js` file. To support multiple brands from one installation, you'd need to:

- Build separate tracker files per brand
- Use server-side dynamic script generation
- Or use a CDN with brand-specific paths

## Verification

After building, check the compiled tracker:

```bash
# Check compiled script contains your brand name
cat public/script.js | grep -o "window\.[a-z]*" | head -1

# Should output: window.myanalytics (if APP_NAME=MyAnalytics)
```

## TypeScript Support

The TypeScript definitions are generic and include documentation about dynamic naming:

```typescript
// src/tracker/index.d.ts
/**
 * Window interface extended with tracker.
 * The global object name is determined by APP_NAME environment variable.
 *
 * @example window.syncfuse // when APP_NAME=Syncfuse (default)
 * @example window.myanalytics // when APP_NAME=MyAnalytics
 */
export interface Window {
  syncfuse: SyncfuseTracker; // Type name for compatibility
}
```

In your TypeScript code, reference it as:

```typescript
declare global {
  interface Window {
    [key: string]: any; // For dynamic property access
  }
}

// Then use:
const trackerName = process.env.APP_NAME?.toLowerCase() || "syncfuse";
window[trackerName].track("event");
```

## HTML Integration

### Basic Setup

```html
<script async defer data-website-id="YOUR-WEBSITE-ID" src="/script.js"></script>
```

### With Options

```html
<script async defer data-website-id="YOUR-WEBSITE-ID" data-host-url="https://analytics.yourdomain.com" data-auto-track="true" data-cache="true" data-domains="yourdomain.com,app.yourdomain.com" src="/script.js"></script>
```

## Testing Your Build

```bash
# 1. Set branding in .env
echo "APP_NAME=TestAnalytics" >> .env

# 2. Build tracker
npm run build-tracker

# 3. Check compiled output
cat public/script.js | grep "window\[" | head -1
# Should show: window["testanalytics"]

# 4. Start dev server
npm run dev

# 5. Open browser console
# window.testanalytics should be available

# 6. Test tracking
window.testanalytics.track('test-event');
```

## Summary

✅ Tracker branding is controlled by `APP_NAME` in `.env`
✅ Must rebuild tracker (`npm run build-tracker`) after changing `APP_NAME`
✅ Browser receives pre-compiled script with branding baked in
✅ HTML attributes, JavaScript API, and storage keys all adapt to brand name
✅ TypeScript definitions document the dynamic behavior
