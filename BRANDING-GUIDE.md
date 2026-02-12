# White-Label Branding Guide

## ✅ CONFIRMED: Full .env-based Rebranding System

This application is **fully white-labelable** using environment variables. No code changes required!

## How It Works

### 1. Environment Variables (.env file)

Create a `.env` file in the root directory with your branding:

```bash
# Required
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
APP_SECRET=your-random-secret-key

# Default Admin Credentials (optional - defaults to syncfuse/syncfuse)
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=your-secure-password

# Branding (all optional - defaults to "Syncfuse")
APP_NAME=YourBrandName
HOMEPAGE_URL=https://yourdomain.com
DOCS_URL=https://yourdomain.com/docs
REPO_URL=https://github.com/yourorg/yourrepo
UPDATES_URL=https://api.yourdomain.com/v1/updates
TELEMETRY_URL=https://analytics.yourdomain.com/a.png
```

### 2. Default Admin User

The system automatically creates/updates a default admin user based on your environment variables:

- **Default Username**: `syncfuse` (or `DEFAULT_ADMIN_USERNAME` if set)
- **Default Password**: `syncfuse` (or `DEFAULT_ADMIN_PASSWORD` if set)
- **Role**: `admin`

The credentials are updated automatically during database migrations, so you can change them in `.env` and restart the application.

**Security Recommendation:** Always change the default credentials in production!

### 3. What Gets Rebranded

#### ✅ User Interface

- **Login Page**: Shows `APP_NAME` as heading
- **Side Navigation**: Logo area displays `APP_NAME`
- **Mobile Navigation**: Header shows `APP_NAME`
- **Page Titles**: All browser tabs show `APP_NAME`
- **Footer**: Links to `HOMEPAGE_URL`
- **Share Pages**: Headers and footers use `APP_NAME` and `HOMEPAGE_URL`

#### ✅ Storage & Cache Keys

All browser localStorage keys are prefixed with your brand:

- `{app_name}.auth` - Authentication token
- `{app_name}.locale` - User language preference
- `{app_name}.timezone` - User timezone
- `{app_name}.theme` - Light/dark theme
- `{app_name}.version-check` - Update notifications

#### ✅ HTTP Headers

- `x-{app_name}-cache` - Cache token
- `x-{app_name}-share-token` - Share authentication

#### ✅ Tracking & Events

JavaScript API uses your brand name:

```javascript
// Global tracking object
window.{appNameLowercase}.track('event-name', { data: 'value' });
window.{appNameLowercase}.identify({ userId: 123 });
```

HTML attributes:

```html
<button data-{appname}-event="click">Track This</button>
```

**Two ways to configure:**

1. **Runtime (Recommended)** - Add `data-tracker-name` attribute:

   ```html
   <script data-website-id="..." data-tracker-name="myanalytics" src="/script.js"></script>
   ```

   - ✅ No rebuild needed when changing APP_NAME
   - ✅ Just restart the server
   - See [TRACKER-RUNTIME-ENV.md](TRACKER-RUNTIME-ENV.md) for details

2. **Build-time** - Run `npm run build-tracker` after changing APP_NAME
   - See [TRACKER-BUILD-GUIDE.md](TRACKER-BUILD-GUIDE.md) for details

#### ✅ Backend Services

- **Kafka Client ID**: Uses `APP_NAME` for message queue identification
- **Debug Logs**: All debug namespaces use `{app_name}:service`
  - `{app_name}:auth`
  - `{app_name}:kafka`
  - `{app_name}:prisma`
  - `{app_name}:clickhouse`

#### ✅ External Links

All external links use environment variables:

- Documentation links → `DOCS_URL`
- Repository links → `REPO_URL`
- Homepage links → `HOMEPAGE_URL`
- Update checks → `UPDATES_URL`
- Telemetry → `TELEMETRY_URL`

### 4. Example Configurations

#### Keep Syncfuse Branding

```bash
# Leave unset or use defaults
APP_NAME=Syncfuse
HOMEPAGE_URL=https://syncfuse.io
```

#### Custom Brand

```bash
APP_NAME=Acme Analytics
HOMEPAGE_URL=https://acme.com
DOCS_URL=https://docs.acme.com
REPO_URL=https://github.com/acme/analytics
```

#### Self-Hosted Private

```bash
APP_NAME=Internal Analytics
HOMEPAGE_URL=https://analytics.company.internal
DOCS_URL=https://wiki.company.internal/analytics
REPO_URL=https://git.company.internal/analytics
UPDATES_URL=https://analytics.company.internal/updates
TELEMETRY_URL=https://analytics.company.internal/telemetry
```

### 5. Testing Your Configuration

1. **Create `.env` file** with your branding variables
2. **Restart the application** to load new environment variables
3. **Check these locations**:
   - Login page heading
   - Main navigation sidebar
   - Browser tab titles
   - Footer links
   - Developer console: `window.{yourappname}`
   - LocalStorage keys: `{yourappname}.auth`, etc.
   - HTML attributes: `data-{yourappname}-event`

**Tracking Script:** The UI automatically includes `data-tracker-name` attribute, so tracker branding happens at runtime. No rebuild needed! For more options, see [TRACKER-RUNTIME-ENV.md](TRACKER-RUNTIME-ENV.md).

### 6. Production Deployment

**Docker:**

```bash
docker run -e APP_NAME="MyBrand" \
  -e HOMEPAGE_URL="https://mybrand.com" \
  -e DEFAULT_ADMIN_USERNAME="admin" \
  -e DEFAULT_ADMIN_PASSWORD="secure-password-here" \
  -e DATABASE_URL="..." \
  -e APP_SECRET="..." \
  your-image
```

**Docker Compose:**

```yaml
services:
  app:
    image: your-image
    environment:
      - APP_NAME=MyBrand
      - HOMEPAGE_URL=https://mybrand.com
      - DOCS_URL=https://mybrand.com/docs
      - REPO_URL=https://github.com/mybrand/analytics
      - DEFAULT_ADMIN_USERNAME=admin
      - DEFAULT_ADMIN_PASSWORD=secure-password-here
      - DATABASE_URL=postgresql://...
      - APP_SECRET=...
```

**Kubernetes:**

```yaml
env:
  - name: APP_NAME
    value: "MyBrand"
  - name: HOMEPAGE_URL
    value: "https://mybrand.com"
```

## Files Using Environment Variables

### Core Constants

- `src/lib/constants.ts` - All branding constants read from `process.env`

### UI Components

- `src/app/layout.tsx` - Page metadata
- `src/app/login/LoginForm.tsx` - Login heading
- `src/app/(main)/SideNav.tsx` - Sidebar branding
- `src/app/(main)/MobileNav.tsx` - Mobile navigation
- `src/app/(main)/UpdateNotice.tsx` - Update notifications
- `src/app/share/[...shareId]/Header.tsx` - Share page header
- `src/app/share/[...shareId]/Footer.tsx` - Share page footer
- All `layout.tsx` files - Metadata templates

### Backend Services

- `src/lib/kafka.ts` - Kafka client ID and debug namespace
- `src/lib/auth.ts` - Auth debug namespace
- `src/lib/prisma.ts` - Prisma debug namespace
- `src/lib/clickhouse.ts` - ClickHouse debug namespace

### Tracking

- `src/tracker/index.js` - JavaScript tracking SDK
- `src/tracker/index.d.ts` - TypeScript definitions
- `src/declaration.d.ts` - Window interface

### API Endpoints

- All API routes use constants from `src/lib/constants.ts`
- Headers automatically include brand name

## ✅ Confirmation Checklist

- [x] APP_NAME configurable via environment
- [x] All URLs configurable via environment
- [x] UI components use APP_NAME constant
- [x] Page metadata uses APP_NAME
- [x] Storage keys dynamically generated
- [x] HTTP headers use brand name
- [x] Tracking API uses brand name
- [x] Backend services use brand name
- [x] Debug namespaces use brand name
- [x] Default credentials: syncfuse/syncfuse
- [x] .env.example provided with documentation
- [x] No hardcoded "Umami" references remaining
- [x] No code changes needed for rebranding

## Support

All branding is controlled through environment variables. Set them before starting the application, and everything will automatically use your custom branding!
