# 🎨 Complete Rebranding Setup Guide

## ✅ What Was Fixed

### 1. Environment Variable Exposure
**Problem**: APP_NAME and branding variables weren't accessible to client-side components.

**Solution**: Updated [next.config.ts](next.config.ts) to expose all branding environment variables:
- `APP_NAME`
- `HOMEPAGE_URL`
- `DOCS_URL`
- `REPO_URL`
- `UPDATES_URL`
- `TELEMETRY_URL`

### 2. Layout Metadata
**Fixed**: [src/app/(main)/layout.tsx](src/app/(main)/layout.tsx) - Changed hardcoded 'Umami' to use `APP_NAME`

### 3. Update Notifications
**Fixed**: [src/app/(main)/UpdateNotice.tsx](src/app/(main)/UpdateNotice.tsx) - Now uses dynamic `APP_NAME` in messages

### 4. Translation System
**Fixed**: [src/components/messages.ts](src/components/messages.ts) & [src/lang/en-US.json](src/lang/en-US.json) - Changed "Syncfuse" to "{app}" variable

## 🚀 How to Rebrand Your Application

### Step 1: Create `.env` File

Create a `.env` file in the root directory with your branding:

```env
# Required
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
APP_SECRET=your-random-secret-key-here

# === BRANDING (Change These!) ===
APP_NAME=YourBrandName
HOMEPAGE_URL=https://yourdomain.com
DOCS_URL=https://yourdomain.com/docs
REPO_URL=https://github.com/yourorg/yourrepo
UPDATES_URL=https://api.yourdomain.com/v1/updates
TELEMETRY_URL=https://analytics.yourdomain.com/a.png

# Default Admin Credentials (optional)
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=your-secure-password
```

### Step 2: Restart the Application

**Important**: After creating or updating `.env`, you MUST rebuild and restart:

```bash
# Stop the current server (Ctrl+C)

# Rebuild the application (required for env changes)
pnpm run build

# Start the server
pnpm run start

# Or for development:
pnpm run dev
```

### Step 3: Verify Changes

Check these locations to confirm your rebranding worked:

#### ✅ UI Elements
- [ ] **Login Page**: Header shows your `APP_NAME`
- [ ] **Browser Tabs**: All pages show "Page Name | YourBrandName"
- [ ] **Sidebar**: Logo area displays your `APP_NAME`
- [ ] **Mobile Header**: Shows your `APP_NAME`
- [ ] **Share Pages**: Header and footer show your brand
- [ ] **Update Notifications**: Shows "A new version of YourBrandName..."

#### ✅ Technical Elements
- [ ] **LocalStorage Keys**: Open DevTools → Application → Local Storage → Check for `yourbrandname.auth`, `yourbrandname.theme`, etc.
- [ ] **Window Object**: In DevTools Console, type `window.yourbrandname` (should exist)
- [ ] **Links**: Footer and external links point to your URLs

### Step 4: Customize Logo (Optional)

The logo SVG is located at:
- [src/components/svg/Logo.tsx](src/components/svg/Logo.tsx) - Main logo
- [src/components/svg/LogoWhite.tsx](src/components/svg/LogoWhite.tsx) - White version

To use your own logo:

**Option A: Replace SVG**
```tsx
// Edit src/components/svg/Logo.tsx
const SvgLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 100 100">
    {/* Your custom SVG paths here */}
  </svg>
);
```

**Option B: Use Image File**
```tsx
// Replace Logo import with:
import Image from 'next/image';

// In component:
<Image src="/your-logo.png" alt={APP_NAME} width={40} height={40} />
```

Then place your logo in the `public` folder.

## 🎯 What Gets Rebranded

### Automatically Changed by Environment Variables:

| Element | Location | Variable Used |
|---------|----------|---------------|
| Page Titles | All pages | `APP_NAME` |
| Login Heading | Login page | `APP_NAME` |
| Sidebar Label | Main navigation | `APP_NAME` |
| Mobile Header | Mobile view | `APP_NAME` |
| Share Pages | Public shares | `APP_NAME` + `HOMEPAGE_URL` |
| Update Banner | Admin notifications | `APP_NAME` |
| Footer Links | All pages | `HOMEPAGE_URL` |
| Documentation Links | Help buttons | `DOCS_URL` |
| Repository Links | Update notices | `REPO_URL` |
| LocalStorage Keys | Browser storage | `APP_NAME` (lowercase) |
| HTTP Headers | API requests | `APP_NAME` (lowercase) |
| Tracking API | JavaScript SDK | `APP_NAME` (lowercase) |

### Not Changed (Static Assets):
- Logo SVG graphics (must be manually replaced)
- Favicon files in `/public` folder
- README.md images and badges

## 🔧 Troubleshooting

### "I changed .env but nothing updated"

**Solution**: You must rebuild the application:
```bash
pnpm run build
pnpm run start
```

Next.js bakes environment variables into the build, so simply restarting dev mode isn't enough.

### "Logo still shows default icon"

**Reason**: The Logo component is just an SVG graphic. The APP_NAME text next to it will change, but the icon itself needs manual customization.

**Solution**: Edit [src/components/svg/Logo.tsx](src/components/svg/Logo.tsx) with your own SVG code or replace with an image.

### "Some pages still show 'Syncfuse'"

**Check**:
1. Did you rebuild? (`pnpm run build`)
2. Is `.env` in the root directory?
3. Are the variables properly formatted? (No quotes around values, no spaces)
4. Did you restart the server?

### "LocalStorage keys still use old name"

**Reason**: LocalStorage is cached in your browser from previous sessions.

**Solution**: 
1. Open DevTools → Application → Local Storage
2. Delete all old keys manually, or
3. Clear all site data and log in again

## 📚 Example Configurations

### Keep Default Branding
```env
# Leave unset or use defaults
APP_NAME=Syncfuse
HOMEPAGE_URL=https://syncfuse.io
```

### Custom Brand
```env
APP_NAME=Acme Analytics
HOMEPAGE_URL=https://acme.com
DOCS_URL=https://docs.acme.com
REPO_URL=https://github.com/acme/analytics
```

### Self-Hosted Private
```env
APP_NAME=Internal Analytics
HOMEPAGE_URL=https://analytics.company.internal
DOCS_URL=https://wiki.company.internal/analytics
REPO_URL=https://git.company.internal/analytics

# Disable external calls
DISABLE_UPDATES=1
DISABLE_TELEMETRY=1
```

## 🎉 You're Done!

Your application is now fully rebranded! All UI elements, metadata, and technical identifiers will use your custom brand name.

For more details, see:
- [BRANDING-GUIDE.md](BRANDING-GUIDE.md) - Complete branding system overview
- [.env.example](.env.example) - All available environment variables
- [TRACKER-RUNTIME-ENV.md](TRACKER-RUNTIME-ENV.md) - Tracking script customization
