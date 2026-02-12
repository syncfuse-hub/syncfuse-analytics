# Default Admin Credentials Configuration

## Overview

The default admin user credentials can now be configured via environment variables, eliminating the need to manually change passwords after deployment.

## How It Works

### Automatic User Management

A script (`scripts/ensure-admin.js`) runs automatically after database migrations to ensure the default admin user exists with the correct credentials from your `.env` file.

### Environment Variables

```bash
# Set custom credentials for the default admin user
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=your-secure-password-here
```

If these variables are not set, the system defaults to:

- **Username**: `syncfuse`
- **Password**: `syncfuse`

### When It Runs

The admin user is created/updated:

1. During initial database setup (first migration)
2. Every time migrations run (via `npm run update-db` or startup)
3. During Docker container initialization

### What It Does

1. **Checks** if the default admin user exists (ID: `41e2b680-648e-4b09-bcd7-3e2b10c06264`)
2. **Creates** the user if it doesn't exist
3. **Updates** the user if credentials have changed
4. **Ensures** the user has admin role

## Usage Examples

### Development

```bash
# .env file
DATABASE_URL=postgresql://localhost:5432/mydb
APP_SECRET=dev-secret

# Use default credentials (syncfuse/syncfuse)
# No additional variables needed
```

### Production

```bash
# .env file
DATABASE_URL=postgresql://prod-db:5432/mydb
APP_SECRET=production-secret-key

# Set secure custom credentials
DEFAULT_ADMIN_USERNAME=superadmin
DEFAULT_ADMIN_PASSWORD=VerySecurePassword123!
```

### Docker Deployment

```bash
docker run -d \
  -e DATABASE_URL="postgresql://..." \
  -e APP_SECRET="..." \
  -e DEFAULT_ADMIN_USERNAME="admin" \
  -e DEFAULT_ADMIN_PASSWORD="SecurePass123!" \
  -p 3000:3000 \
  your-image
```

### Docker Compose

```yaml
services:
  analytics:
    image: your-image
    environment:
      - DATABASE_URL=postgresql://db:5432/analytics
      - APP_SECRET=${APP_SECRET}
      - DEFAULT_ADMIN_USERNAME=admin
      - DEFAULT_ADMIN_PASSWORD=${ADMIN_PASSWORD}
    ports:
      - "3000:3000"
```

### Kubernetes

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: analytics-credentials
type: Opaque
stringData:
  admin-username: admin
  admin-password: your-secure-password
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: analytics
spec:
  template:
    spec:
      containers:
        - name: analytics
          image: your-image
          env:
            - name: DEFAULT_ADMIN_USERNAME
              valueFrom:
                secretKeyRef:
                  name: analytics-credentials
                  key: admin-username
            - name: DEFAULT_ADMIN_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: analytics-credentials
                  key: admin-password
```

## Changing Credentials

### Method 1: Update .env and Restart

```bash
# 1. Update .env file
DEFAULT_ADMIN_USERNAME=newadmin
DEFAULT_ADMIN_PASSWORD=NewPassword123!

# 2. Run migrations (this will update the admin user)
npm run update-db

# Or just restart the application (migrations run on startup)
npm run dev
```

### Method 2: Via Docker Environment

```bash
# Stop existing container
docker stop analytics

# Start with new credentials
docker run -d \
  -e DEFAULT_ADMIN_USERNAME="newadmin" \
  -e DEFAULT_ADMIN_PASSWORD="NewPassword456!" \
  --name analytics \
  your-image
```

## Security Best Practices

### ✅ DO:

- **Always change default credentials in production**
- Use strong passwords (12+ characters, mixed case, numbers, symbols)
- Store credentials in secrets management (Kubernetes Secrets, AWS Secrets Manager, etc.)
- Use different credentials per environment
- Rotate credentials regularly

### ❌ DON'T:

- Use the same password across environments
- Commit `.env` files with real passwords to version control
- Use simple passwords like "admin123"
- Share admin credentials with regular users
- Leave default credentials (syncfuse/syncfuse) in production

## Password Requirements

The system uses bcrypt hashing with 10 salt rounds. You can use any password, but we recommend:

- Minimum 12 characters
- Mix of uppercase and lowercase
- Include numbers and symbols
- Avoid common words or patterns

## Verification

After setting up, verify your credentials:

```bash
# 1. Check logs during startup
npm run dev

# Look for:
# ✓ Default admin user created: admin
# ℹ Using custom credentials from environment variables

# 2. Try logging in with your credentials
# Go to http://localhost:3000/login
# Use your DEFAULT_ADMIN_USERNAME and DEFAULT_ADMIN_PASSWORD
```

## Troubleshooting

### Credentials Not Working

1. **Check environment variables are loaded:**

   ```bash
   # In your application
   console.log(process.env.DEFAULT_ADMIN_USERNAME);
   ```

2. **Verify migrations ran:**

   ```bash
   npm run update-db
   ```

3. **Check logs for errors:**
   ```bash
   # Look for "ensure-admin" output
   npm run dev
   ```

### Reset to Defaults

Remove the environment variables and restart:

```bash
# Remove from .env
# DEFAULT_ADMIN_USERNAME=...
# DEFAULT_ADMIN_PASSWORD=...

# Run migrations
npm run update-db

# Default credentials (syncfuse/syncfuse) will be restored
```

## Files Involved

- **`scripts/ensure-admin.js`** - Script that creates/updates admin user
- **`scripts/check-db.js`** - Calls ensure-admin after migrations
- **`.env.example`** - Template with credential variables
- **`prisma/migrations/01_init/migration.sql`** - Initial migration with default user

## Summary

✅ **Default admin credentials are now fully configurable via .env**
✅ **Credentials update automatically on restart**
✅ **No manual database changes needed**
✅ **Works with all deployment methods (Docker, Kubernetes, local)**
✅ **Secure by design with bcrypt hashing**

Set `DEFAULT_ADMIN_USERNAME` and `DEFAULT_ADMIN_PASSWORD` in your `.env` file and restart!
