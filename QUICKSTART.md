# Quick Start Guide

## Get Started in 3 Steps

### 1. Install Dependencies
```bash
cd mortgage-calculator
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## What You'll See

1. **Landing Page** - Overview of features and disclaimer
2. **Click "Start New Scenario"** - Begin the wizard
3. **5-Step Wizard:**
   - Step 1: Enter borrower income
   - Step 2: Enter credit score
   - Step 3: Select property location and details
   - Step 4: Enter loan terms
   - Step 5: Enter monthly debts
4. **Results Page** - View calculations, ratios, and guideline flags
5. **Export PDF** - Download scenario summary

## Test the Calculator

Try this sample scenario:

**Step 1 - Borrower:**
- W-2 Base Annual: $120,000

**Step 2 - Credit:**
- FICO: 740
- Borrowers: 1

**Step 3 - Property:**
- State: CA
- County: Santa Clara
- Purchase Price: $900,000
- Down Payment: $180,000
- Occupancy: Primary Residence
- Property Type: Single Family Home

**Step 4 - Loan:**
- Term: 30 years
- Interest Rate: 6.75%
- HOA: $300
- Leave insurance blank (uses estimate)
- Leave tax rate blank (uses county default)

**Step 5 - Debts:**
- Credit Cards: $200
- Auto Loans: $450
- Student Loans: $0
- Other Debts: $0

**Expected Results:**
- Loan Amount: $720,000 (Conforming)
- LTV: 80%
- Monthly Payment (PITI+HOA): ~$5,771
- DTI: ~51% (will flag as error - exceeds 50%)
- Housing Ratio: ~48%

## Run Tests

```bash
npm test
```

Should see all tests passing for:
- Mortgage calculations (P&I, DTI, LTV, MI)
- County lookups (loan limits, tax rates)

## Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Run production build

# Testing
npm test             # Run tests once
npm run test:ui      # Run tests with UI
npm run test:coverage # Coverage report

# Code Quality
npm run lint         # Run ESLint
```

## Key Features to Test

✅ **Multi-step wizard** with progress indicator
✅ **Form validation** - Try entering invalid values
✅ **County selection** - Different states have different loan limits
✅ **Real-time calculations** - See estimates as you type
✅ **Guideline flags** - DTI, FICO, LTV, loan limit checks
✅ **PDF export** - Download scenario summary
✅ **Responsive design** - Try on mobile

## Project Structure

```
mortgage-calculator/
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   ├── lib/              # Calculations & utilities
│   ├── data/             # Loan limits & tax rates
│   └── __tests__/        # Unit tests
├── package.json
└── README.md            # Full documentation
```

## Next Steps

1. ✅ Verify the app runs locally
2. 📖 Read README.md for complete documentation
3. 📋 Review SETUP.md for deployment options
4. 🎨 Customize branding and colors
5. 📊 Update county data for your market
6. 🚀 Deploy to production (Vercel recommended)

## Need Help?

- **Full Documentation:** See README.md
- **Setup Guide:** See SETUP.md
- **File Structure:** See FILE_TREE.md
- **Contact:** Guillermo Santos, NMLS #972977

## Important Notes

⚠️ **This is an estimation tool only** - not a loan approval
⚠️ **MI calculations** are simplified estimates
⚠️ **Tax rates** are mock data - verify for your area
⚠️ **Loan limits** should be updated annually from Fannie Mae

---

**Happy Calculating!** 🏠💰
