# Empower Home Loan - Mortgage Scenario Calculator

A Next.js 14 web application for estimating mortgage scenarios and evaluating Fannie Mae Conventional loan guidelines for California properties. Features bilingual support (English/Spanish).

## Overview

This tool allows users to:
- Calculate estimated monthly PITI (Principal, Interest, Taxes, Insurance) + MI + HOA
- Evaluate Debt-to-Income (DTI) and Loan-to-Value (LTV) ratios
- Determine conforming vs. high-balance loan classification by California county
- Identify guideline flags based on Fannie Mae Selling Guide requirements
- Export detailed scenario summary as PDF
- **Switch between English and Spanish** with one click

**Important Disclaimer:** This is an estimation tool only, NOT a loan approval or commitment. Actual loan terms, rates, and approval are subject to full underwriting review.

## Key Features

### 🏠 California-Focused
- **2026 Loan Limits** for all 58 California counties
- County-specific property tax rates
- High-balance limits for high-cost California areas

### 🌐 Bilingual Support
- **Full English and Spanish** translations
- Toggle language with one click
- Language preference saved automatically
- All UI elements, forms, and results translated

### 🎨 Empower Home Loan Branding
- Professional branded header and footer
- Company logo and colors throughout
- Guillermo Santos, NMLS #972977 attribution
- "Licensed in California only" disclaimers

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Validation:** Zod
- **Testing:** Vitest
- **PDF Generation:** jsPDF
- **i18n:** React Context with JSON translations

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Testing

```bash
npm test
```

## Project Structure

```
mortgage-calculator/
├── src/
│   ├── app/                      # Next.js pages
│   ├── components/               # React components
│   │   ├── steps/               # Wizard step components
│   │   └── LanguageToggle.tsx   # EN/ES toggle
│   ├── contexts/
│   │   └── LanguageContext.tsx  # Language state management
│   ├── lib/                     # Core utilities
│   ├── data/
│   │   ├── county-limits.json   # 2026 CA loan limits
│   │   ├── tax-rates.json       # CA property tax rates
│   │   └── translations.json    # EN/ES translations
│   └── __tests__/               # Unit tests
└── ...config files
```

## 2026 California Loan Limits

The application uses the latest 2026 Fannie Mae loan limits for California:

- **Conforming Limit:** $826,350 (baseline)
- **High-Balance Limit:** $1,239,525 (for high-cost counties)

### High-Balance Counties Include:
- Alameda, Alpine, Contra Costa
- Los Angeles, Marin, Orange
- San Diego, San Francisco, San Mateo
- Santa Clara, Santa Cruz, Ventura
- Napa, San Benito

All other California counties use the conforming limit.

## Language Support

### How It Works

1. **Language Toggle:** Click EN/ES button in header
2. **Auto-Save:** Preference saved to browser localStorage
3. **Persistent:** Language selection persists across visits
4. **Complete:** All text, labels, buttons, and messages translated

### Supported Languages

- **English (EN)** - Default
- **Spanish (ES)** - Español

### Adding/Editing Translations

Edit `src/data/translations.json`:

```json
{
  "en": {
    "header": {
      "title": "Your English text"
    }
  },
  "es": {
    "header": {
      "title": "Tu texto en español"
    }
  }
}
```

## Customization

### Update Branding

**1. Layout Header/Footer** (`src/app/layout.tsx`):
- Company name
- Logo
- Colors
- Contact information

**2. PDF Generator** (`src/lib/pdf-generator.ts`):
- Footer branding
- Company information
- NMLS number

**3. Tailwind Colors** (`tailwind.config.ts`):
```typescript
colors: {
  primary: {
    // Your brand colors
  }
}
```

### Update Loan Limits

Edit `src/data/county-limits.json` when new limits are announced (typically November each year).

### Update Tax Rates

Edit `src/data/tax-rates.json` with county-specific rates.

## Features in Detail

### Multi-Step Wizard
1. **Borrower** - Income (W-2, bonus, overtime)
2. **Credit** - FICO score, number of borrowers
3. **Property** - California county, price, down payment
4. **Loan** - Term, rate, HOA, insurance, taxes
5. **Debts** - Monthly obligations

### Calculations
- Principal & Interest (standard amortization)
- Property taxes (county-specific)
- Homeowners insurance
- Mortgage insurance (LTV-based)
- DTI and LTV ratios
- Housing ratio

### Guideline Checks
- DTI limits (>50% error, >45% warning)
- FICO requirements (<620 error, <680 warning)
- LTV limits (>97% error, >80% MI required)
- Loan limits (conforming vs high-balance vs jumbo)
- Occupancy-specific rules

### PDF Export
- Complete scenario summary
- Borrower initials (privacy)
- All calculations and inputs
- Guideline flags
- Empower Home Loan branding
- Bilingual support (exports in current language)

## Testing

Unit tests cover:
- Mortgage calculations
- DTI/LTV calculations
- County lookups
- Tax rate lookups
- Loan type classification

```bash
npm test              # Run once
npm run test:ui       # Interactive UI
npm run test:coverage # Coverage report
```

## Deployment

### Vercel (Recommended)
```bash
vercel
```

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
No environment variables required for basic operation.

## Compliance & Disclaimers

### Displayed Disclaimers
- Landing page warning
- Results page banner
- PDF footer
- Footer on every page

### Key Messages
- Estimates only, not approval
- Subject to underwriting
- Licensed in California only
- 2026 loan limits

## Support

**Empower Home Loan**  
Guillermo Santos, NMLS #972977  
California Mortgage Specialist

## Updates & Maintenance

### Annual Updates Needed
1. **Loan Limits** (November) - Update county-limits.json
2. **Tax Rates** (as needed) - Update tax-rates.json
3. **Guidelines** (as changed) - Update rules-engine.ts

### Version History
- **v2.0** (2026) - California-only, Spanish support, Empower branding, 2026 limits
- **v1.0** (2025) - Initial multi-state version

## License

© 2026 Empower Home Loan. All rights reserved.

## Technical Support

For technical issues or questions:
- Review documentation
- Check unit tests
- Contact development team

---

**Remember:** This calculator provides estimates only. Always consult with a licensed mortgage professional for accurate quotes and loan approval.

**Servicing California homebuyers since 2010** 🏠
