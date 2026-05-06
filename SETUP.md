# Setup & Deployment Guide

## Quick Start

### Development Setup

1. **Clone or extract the project:**
```bash
cd mortgage-calculator
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run development server:**
```bash
npm run dev
```

4. **Open browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Project Configuration

### TypeScript Configuration

The project uses strict TypeScript settings:
- Strict mode enabled
- Path aliases configured (`@/*` → `./src/*`)
- JSX set to preserve for Next.js

### Tailwind CSS

Custom theme extended with primary color palette (blue):
- Primary colors: 50-950 shades
- Custom component classes: `.btn-primary`, `.btn-secondary`, `.input-field`, `.card`

### Vitest Configuration

- Environment: jsdom (for React component testing)
- Globals enabled
- Path aliases match TypeScript config

## Data Configuration

### Updating Loan Limits

Edit `src/data/county-limits.json`:

```json
{
  "limits": {
    "STATE_CODE": {
      "County Name": {
        "conforming": 806500,
        "highBalance": 1209750
      }
    }
  }
}
```

**To add a new state:**
1. Add state code to limits object
2. Add counties with conforming and highBalance values
3. State will automatically appear in dropdown

### Updating Tax Rates

Edit `src/data/tax-rates.json`:

```json
{
  "rates": {
    "STATE_CODE": {
      "County Name": 0.0120
    }
  }
}
```

Tax rates should be entered as decimals (e.g., 1.2% = 0.012).

## Customization

### Branding

Update branding in multiple locations:

1. **Footer in `src/app/layout.tsx`:**
```typescript
<p className="text-sm text-gray-600 text-center">
  Prepared by Guillermo Santos, NMLS #972977
</p>
```

2. **PDF Generator in `src/lib/pdf-generator.ts`:**
```typescript
addText('Guillermo Santos, NMLS #972977', 10);
```

### Disclaimer Text

Update disclaimers in:
- `src/app/page.tsx` (landing page)
- `src/app/results/page.tsx` (results banner)
- `src/lib/pdf-generator.ts` (PDF footer)

### Styling

Modify colors in `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    // Change these values for different brand colors
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  }
}
```

## Production Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in `.next/`.

### Start Production Server

```bash
npm start
```

Server runs on port 3000 by default.

### Environment Variables

No environment variables required for basic operation. If adding API integrations:

Create `.env.local`:
```
NEXT_PUBLIC_API_KEY=your_key_here
```

### Deployment Platforms

#### Vercel (Recommended)

1. Push code to GitHub/GitLab/Bitbucket
2. Import project in Vercel
3. Deploy automatically

#### Netlify

```bash
npm run build
```

Upload `.next/` directory to Netlify.

#### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t mortgage-calculator .
docker run -p 3000:3000 mortgage-calculator
```

## Troubleshooting

### Port Already in Use

```bash
# Use different port
PORT=3001 npm run dev
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### Tests Failing

```bash
# Clear test cache
npm test -- --clearCache
npm test
```

### TypeScript Errors

```bash
# Regenerate types
rm -rf .next
npm run dev
```

## Performance Optimization

### Image Optimization

If adding images, use Next.js Image component:

```typescript
import Image from 'next/image';

<Image 
  src="/logo.png" 
  alt="Logo" 
  width={200} 
  height={100}
  priority
/>
```

### Font Optimization

Next.js automatically optimizes fonts. To use custom fonts, add to `layout.tsx`:

```typescript
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// Use in body: className={inter.className}
```

### Bundle Analysis

```bash
npm install --save-dev @next/bundle-analyzer

# Add to next.config.js:
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Run analysis:
ANALYZE=true npm run build
```

## Security Considerations

### Input Validation

All inputs validated with Zod schemas. Do not bypass validation.

### PDF Generation

PDF generation runs client-side. No sensitive data sent to servers.

### Data Storage

Scenario data stored in sessionStorage (cleared on browser close).

### HTTPS

Always deploy with HTTPS enabled (automatic on Vercel/Netlify).

## Maintenance

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Update major versions (careful!)
npx npm-check-updates -u
npm install
```

### Updating Loan Limits Annually

1. Check Fannie Mae website for new limits (typically announced in November)
2. Update `src/data/county-limits.json`
3. Update year in metadata
4. Test with various scenarios
5. Update README if baseline limit changes

### Code Quality

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

## Support

For technical issues:
1. Check GitHub Issues
2. Review documentation
3. Contact Guillermo Santos, NMLS #972977

## Backup & Recovery

### Backing Up Data Files

```bash
# Create backup
cp src/data/county-limits.json src/data/county-limits.backup.json
cp src/data/tax-rates.json src/data/tax-rates.backup.json
```

### Version Control

Commit changes regularly:

```bash
git add .
git commit -m "Update loan limits for 2025"
git push
```

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zod Documentation](https://zod.dev)
- [Vitest Documentation](https://vitest.dev)
- [Fannie Mae Selling Guide](https://singlefamily.fanniemae.com/selling-guide)

---

**Last Updated:** January 2025
