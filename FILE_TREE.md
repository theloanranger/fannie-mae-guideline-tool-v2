# Project File Tree

Complete file structure for the Mortgage Scenario Calculator application.

```
mortgage-calculator/
│
├── package.json                    # Project dependencies and scripts
├── package-lock.json               # Locked dependency versions
├── tsconfig.json                   # TypeScript configuration
├── next.config.js                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── vitest.config.ts                # Vitest test configuration
├── .gitignore                      # Git ignore rules
├── README.md                       # Project documentation
├── SETUP.md                        # Setup and deployment guide
└── FILE_TREE.md                    # This file
│
├── src/                            # Source code directory
│   │
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx             # Root layout with header/footer
│   │   ├── page.tsx               # Landing page (/)
│   │   ├── globals.css            # Global styles and Tailwind
│   │   │
│   │   ├── scenario/              # Scenario wizard route
│   │   │   └── page.tsx          # Multi-step form wizard
│   │   │
│   │   └── results/               # Results route
│   │       └── page.tsx          # Results display with PDF export
│   │
│   ├── components/                # React components
│   │   └── steps/                # Wizard step components
│   │       ├── BorrowerStep.tsx  # Step 1: Income inputs
│   │       ├── CreditStep.tsx    # Step 2: FICO & borrowers
│   │       ├── PropertyStep.tsx  # Step 3: Property details
│   │       ├── LoanStep.tsx      # Step 4: Loan terms
│   │       └── DebtsStep.tsx     # Step 5: Monthly debts
│   │
│   ├── lib/                       # Core utilities and business logic
│   │   ├── schemas.ts            # Zod validation schemas
│   │   ├── calculations.ts       # Mortgage calculations (P&I, DTI, LTV, MI)
│   │   ├── county-lookup.ts      # County limits and tax rate lookups
│   │   ├── rules-engine.ts       # Guideline flags and rules
│   │   └── pdf-generator.ts      # PDF export functionality
│   │
│   ├── data/                      # Static data files
│   │   ├── county-limits.json    # 2025 Fannie Mae loan limits by county
│   │   └── tax-rates.json        # Property tax rates by county
│   │
│   └── __tests__/                 # Unit tests
│       ├── calculations.test.ts  # Tests for mortgage calculations
│       └── county-lookup.test.ts # Tests for county data lookups
│
└── public/                        # Static assets (if needed)
    └── (empty - add images, icons, etc.)
```

## File Descriptions

### Configuration Files

- **package.json**: Dependencies (Next.js 14, React 18, TypeScript, Tailwind, Zod, jsPDF, Vitest)
- **tsconfig.json**: TypeScript compiler options with strict mode and path aliases
- **tailwind.config.ts**: Custom theme with primary color palette
- **vitest.config.ts**: Test configuration with jsdom environment
- **next.config.js**: Next.js framework configuration

### Application Pages

- **app/layout.tsx**: Root layout with header (title/subtitle) and footer (branding)
- **app/page.tsx**: Landing page with feature list and "Start New Scenario" button
- **app/scenario/page.tsx**: Multi-step wizard with progress indicator and step navigation
- **app/results/page.tsx**: Results display with calculations, flags, and PDF export

### Step Components (Wizard)

- **BorrowerStep.tsx**: W-2 base, bonus, overtime income inputs
- **CreditStep.tsx**: FICO score slider with visual feedback, number of borrowers
- **PropertyStep.tsx**: State/county dropdowns, purchase price, down payment, occupancy
- **LoanStep.tsx**: Term selection, interest rate, HOA, insurance, tax rate
- **DebtsStep.tsx**: Credit cards, auto loans, student loans, other debts

### Core Libraries

- **schemas.ts**: Zod schemas for all input validation with error messages
- **calculations.ts**: 
  - calculatePrincipalAndInterest() - Amortization formula
  - calculateLTV() - Loan-to-value ratio
  - calculateDTI() - Debt-to-income ratio
  - estimateMortgageInsurance() - MI estimation by LTV band
  - calculateMonthlyPropertyTax() - Tax calculation
  
- **county-lookup.ts**:
  - getCountyLoanLimits() - Get conforming/high-balance limits
  - determineLoanType() - Classify loan type
  - getCountyTaxRate() - Get effective tax rate
  
- **rules-engine.ts**:
  - evaluateGuidelines() - Run all rules and return flags
  - Config-driven rule checks for DTI, FICO, LTV, loan limits, occupancy
  
- **pdf-generator.ts**:
  - generateScenarioPDF() - Create comprehensive PDF report with jsPDF

### Data Files

- **county-limits.json**: 
  - Structure: { "STATE": { "County": { conforming, highBalance } } }
  - Includes CA, NY, TX, FL, WA counties
  - 2025 baseline: $806,500 conforming, up to $1,209,750 high-balance
  
- **tax-rates.json**:
  - Structure: { "STATE": { "County": rate } }
  - Rates as decimals (e.g., 0.012 = 1.2%)
  - Estimated effective rates by county

### Test Files

- **calculations.test.ts**: 
  - Tests for P&I calculation accuracy
  - Tests for DTI, LTV, MI, tax calculations
  - Edge cases and validation
  
- **county-lookup.test.ts**:
  - Tests for loan limit lookups
  - Tests for tax rate lookups
  - Tests for loan type classification

## Key Design Patterns

### Config-Driven Rules
Rules engine uses array of rule functions for easy extension:
```typescript
const rules: RuleCheck[] = [
  (context) => { /* DTI check */ },
  (context) => { /* FICO check */ },
  // Add new rules here
];
```

### Zod Validation
All forms validated before progression:
```typescript
const result = schema.safeParse(data);
if (!result.success) { /* handle errors */ }
```

### Session Storage
Scenario data persists across wizard steps and results page using sessionStorage.

### TypeScript Types
All types inferred from Zod schemas for type safety:
```typescript
export type BorrowerInput = z.infer<typeof borrowerSchema>;
```

## Adding New Features

### Adding a New State
1. Add state data to `county-limits.json`
2. Add tax rates to `tax-rates.json`
3. State automatically appears in dropdown

### Adding a New Rule
1. Add rule function to `rules` array in `rules-engine.ts`
2. Return GuidelineFlag[] with appropriate severity
3. Include reference to Selling Guide section

### Adding a New Calculation
1. Add function to `calculations.ts`
2. Add unit tests to `calculations.test.ts`
3. Import and use in `results/page.tsx`

## Code Organization Principles

1. **Separation of Concerns**: UI components separate from business logic
2. **Type Safety**: TypeScript + Zod for compile-time and runtime validation
3. **Testability**: Pure functions in lib/ for easy unit testing
4. **Maintainability**: Config files (JSON) for easy data updates
5. **Scalability**: Modular structure allows easy feature additions

---

**Total Files**: ~25 source files + configuration
**Lines of Code**: ~3,000+ (excluding tests and configs)
**Test Coverage**: Calculation and lookup functions fully tested
