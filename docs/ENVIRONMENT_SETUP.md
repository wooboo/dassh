# Environment Variables Setup

This project uses environment variables for configuration. All environment files are located in the workspace root for centralized management.

## File Structure

```
dassh/                          # Workspace root
├── .env                        # Template with default values (committed)
├── .env.local                  # Local overrides (not committed, use for actual credentials)
├── apps/
│   └── dashboard/              # Next.js app automatically loads from root
└── packages/
    └── shared/                 # Drizzle config loads from root
```

## Setup Instructions

1. **Copy the template**: Copy `.env` to `.env.local`
   ```bash
   cp .env .env.local
   ```

2. **Update credentials**: Edit `.env.local` with your actual values:
   - Kinde authentication credentials
   - Database connection string
   - JWT secret
   - Other environment-specific values

3. **Never commit**: The `.env.local` file is gitignored and should never be committed

## Supported Environments

- **Next.js Dashboard App**: Automatically loads `.env` and `.env.local` from workspace root
- **Drizzle Kit**: Configured to load environment variables from workspace root
- **Tests**: Can access environment variables through the root configuration

## Environment Variables

### Authentication (Kinde)
- `KINDE_CLIENT_ID`: Your Kinde application client ID
- `KINDE_CLIENT_SECRET`: Your Kinde application client secret
- `KINDE_ISSUER_URL`: Your Kinde domain URL
- `KINDE_SITE_URL`: Your application URL
- `KINDE_POST_LOGIN_REDIRECT_URL`: Redirect after login
- `KINDE_POST_LOGOUT_REDIRECT_URL`: Redirect after logout

### Database
- `DATABASE_URL`: PostgreSQL connection string (Neon or local)

### Security
- `JWT_SECRET`: Secret for JWT token signing (min 32 characters)

### Application
- `NODE_ENV`: Environment mode (`development` | `production` | `test`)

## Troubleshooting

If environment variables aren't loading:

1. **Check file location**: Ensure `.env.local` is in the workspace root
2. **Check file content**: Verify no syntax errors or extra spaces
3. **Restart services**: Restart development servers after changes
4. **Check precedence**: `.env.local` overrides `.env` values

## Development vs Production

- **Development**: Use `.env.local` with local/staging credentials
- **Production**: Set environment variables directly in deployment platform
- **Testing**: Use test-specific values or mock implementations