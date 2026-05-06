# Spanish Translation Implementation Guide

## Overview

This guide explains how to complete the Spanish translation integration for the remaining components. The core translation system is already set up - you just need to update the wizard steps and results page.

## What's Already Done ✅

1. **Translation System**
   - ✅ `src/data/translations.json` - Complete EN/ES translations
   - ✅ `src/contexts/LanguageContext.tsx` - Language state management
   - ✅ `src/components/LanguageToggle.tsx` - Toggle button component

2. **Layout & Landing**
   - ✅ `src/app/layout.tsx` - Header/footer translated, LanguageProvider wrapping app
   - ✅ `src/app/page.tsx` - Landing page fully translated

## What Needs Translation Integration ⬜

### Wizard Step Components (5 files)

These files need to:
1. Import `useLanguage` hook
2. Destructure `{ t }` from the hook
3. Replace hardcoded strings with `t.wizard.stepX.field` references

#### Files to Update:

1. `src/components/steps/BorrowerStep.tsx`
2. `src/components/steps/CreditStep.tsx`
3. `src/components/steps/PropertyStep.tsx`
4. `src/components/steps/LoanStep.tsx`
5. `src/components/steps/DebtsStep.tsx`

### Results Page (1 file)

6. `src/app/results/page.tsx`

## Step-by-Step Implementation

### Pattern to Follow

See `EXAMPLE-BorrowerStep-with-translations.tsx` for a complete working example.

#### 1. Add Import

```typescript
import { useLanguage } from '@/contexts/LanguageContext';
```

#### 2. Use the Hook

```typescript
export default function YourComponent() {
  const { t } = useLanguage();
  // ... rest of component
}
```

#### 3. Replace Strings

**Before:**
```typescript
<label>W-2 Base Annual Income</label>
<p>Enter annual income information</p>
<button>Continue to Credit</button>
```

**After:**
```typescript
<label>{t.wizard.step1.w2Base}</label>
<p>{t.wizard.step1.subtitle}</p>
<button>{t.wizard.step1.continueButton}</button>
```

## Translation Reference Guide

### Step 1 - BorrowerStep.tsx

```typescript
// Title and description
t.wizard.step1.title         // "Step 1: Borrower Income"
t.wizard.step1.subtitle      // "Enter annual income information..."

// Labels
t.wizard.step1.w2Base        // "W-2 Base Annual Income"
t.wizard.step1.bonus         // "Annual Bonus (Optional)"
t.wizard.step1.overtime      // "Annual Overtime (Optional)"

// Help text
t.wizard.step1.bonusHelp     // "Include if bonus income is stable..."
t.wizard.step1.overtimeHelp  // "Include if overtime is consistent..."

// Summary
t.wizard.step1.estimatedIncome // "Estimated Gross Monthly Income"

// Buttons
t.wizard.step1.continueButton  // "Continue to Credit"

// Common
t.common.required            // "*" (required field marker)
```

### Step 2 - CreditStep.tsx

```typescript
t.wizard.step2.title
t.wizard.step2.subtitle
t.wizard.step2.fico
t.wizard.step2.ficoHelp
t.wizard.step2.numberOfBorrowers
t.wizard.step2.numberOfBorrowersHelp
t.wizard.step2.borrower          // "1 Borrower"
t.wizard.step2.borrowers         // "2 Borrowers"
t.wizard.step2.ficoRatings.excellent
t.wizard.step2.ficoRatings.good
t.wizard.step2.ficoRatings.fair
t.wizard.step2.ficoRatings.poor
t.wizard.step2.backButton
t.wizard.step2.continueButton
```

### Step 3 - PropertyStep.tsx

```typescript
t.wizard.step3.title
t.wizard.step3.subtitle
t.wizard.step3.state
t.wizard.step3.selectState
t.wizard.step3.county
t.wizard.step3.selectCounty
t.wizard.step3.purchasePrice
t.wizard.step3.downPayment
t.wizard.step3.downPaymentInfo     // "% down • Loan Amount:"
t.wizard.step3.propertyType
t.wizard.step3.propertyTypes.singleFamily
t.wizard.step3.propertyTypes.condo
t.wizard.step3.propertyTypes.townhouse
t.wizard.step3.propertyTypes.multiUnit
t.wizard.step3.occupancy
t.wizard.step3.occupancyTypes.primary
t.wizard.step3.occupancyTypes.secondary
t.wizard.step3.occupancyTypes.investment
t.wizard.step3.occupancyHelp.primary
t.wizard.step3.occupancyHelp.secondary
t.wizard.step3.occupancyHelp.investment
t.wizard.step3.backButton
t.wizard.step3.continueButton
```

### Step 4 - LoanStep.tsx

```typescript
t.wizard.step4.title
t.wizard.step4.subtitle
t.wizard.step4.term
t.wizard.step4.years              // "30 Years" / "15 Years"
t.wizard.step4.interestRate
t.wizard.step4.hoa
t.wizard.step4.hoaHelp
t.wizard.step4.insurance
t.wizard.step4.insuranceHelp
t.wizard.step4.taxRateOverride
t.wizard.step4.taxRateHelp
t.wizard.step4.taxRateWillBeUsed
t.wizard.step4.estimatedTax
t.wizard.step4.basedOnRate
t.wizard.step4.backButton
t.wizard.step4.continueButton
```

### Step 5 - DebtsStep.tsx

```typescript
t.wizard.step5.title
t.wizard.step5.subtitle
t.wizard.step5.creditCards
t.wizard.step5.creditCardsHelp
t.wizard.step5.autoLoans
t.wizard.step5.autoLoansHelp
t.wizard.step5.studentLoans
t.wizard.step5.studentLoansHelp
t.wizard.step5.otherDebts
t.wizard.step5.otherDebtsHelp
t.wizard.step5.totalDebt
t.wizard.step5.note
t.wizard.step5.backButton
t.wizard.step5.calculateButton
```

### Results Page

```typescript
t.results.title
t.results.subtitle
t.results.disclaimer
t.results.disclaimerText
t.results.monthlyPayment
t.results.principalInterest
t.results.propertyTax
t.results.insurance
t.results.mi
t.results.hoa
t.results.totalPiti
t.results.debtRatios
t.results.totalDti
t.results.housingRatio
t.results.totalMonthlyDebt
t.results.loanDetails
t.results.loanAmount
t.results.ltvRatio
t.results.loanType
t.results.loanTypes.conforming
t.results.loanTypes.highBalance
t.results.loanTypes.jumbo
t.results.guidelineFlags
t.results.noFlags
t.results.errors
t.results.warnings
t.results.information
t.results.exportScenario
t.results.exportDescription
t.results.borrowerInitials
t.results.downloadPdf
t.results.modifyScenario
t.results.startNew
```

## Quick Implementation Example

### Before (CreditStep.tsx):

```typescript
export default function CreditStep({ initialData, onComplete, onBack }: Props) {
  // ... state setup ...

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 2: Credit Information
        </h2>
        <p className="text-gray-600">
          Credit score and number of borrowers on the loan.
        </p>
      </div>
      {/* ... rest of form ... */}
    </form>
  );
}
```

### After (CreditStep.tsx):

```typescript
import { useLanguage } from '@/contexts/LanguageContext';  // ADD THIS

export default function CreditStep({ initialData, onComplete, onBack }: Props) {
  const { t } = useLanguage();  // ADD THIS
  // ... state setup ...

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t.wizard.step2.title}
        </h2>
        <p className="text-gray-600">
          {t.wizard.step2.subtitle}
        </p>
      </div>
      {/* ... rest of form ... */}
    </form>
  );
}
```

## Testing Translation Integration

### 1. Visual Testing

After updating each component:

1. Run `npm run dev`
2. Navigate to the wizard
3. Click EN/ES toggle
4. Verify all text changes
5. Check for any missing translations (will show as `undefined`)

### 2. Console Errors

Watch for:
```
Cannot read property 'title' of undefined
```

This means you're trying to access a translation key that doesn't exist. Check `translations.json` for the correct path.

### 3. Common Issues

**Problem:** Text doesn't change when toggling language
**Solution:** Make sure component is using `useLanguage()` hook and `t` object

**Problem:** "undefined" shows in UI
**Solution:** Check translation key path - might be typo or missing in translations.json

**Problem:** Language resets on page refresh
**Solution:** This should NOT happen - localStorage saves preference. Check browser console for errors.

## Priority Order

Implement in this order for fastest results:

1. ✅ BorrowerStep (see example file)
2. ⬜ CreditStep (very similar pattern)
3. ⬜ PropertyStep (has dropdowns - see occupancyHelp example)
4. ⬜ LoanStep (has conditional text)
5. ⬜ DebtsStep (simplest one)
6. ⬜ Results page (most complex - lots of dynamic content)

## Advanced: Dynamic Text with Variables

For text that includes dynamic values:

### English Template:
"10% down • Loan Amount: $500,000"

### Translation:
```json
"downPaymentInfo": "down • Loan Amount:"
```

### Usage:
```typescript
<p>
  {downPaymentPercent.toFixed(2)}% {t.wizard.step3.downPaymentInfo} ${loanAmount.toLocaleString()}
</p>
```

## Validation Messages

Zod error messages are currently in English. To translate them, you'd need to:

1. Add error messages to translations.json
2. Create custom Zod error maps
3. Apply based on current language

This is optional - can be a future enhancement.

## PDF Export Translation

The PDF generator (`src/lib/pdf-generator.ts`) needs manual Spanish support:

### Option 1: Generate in Current Language
Pass language to PDF generator, use appropriate translations

### Option 2: Always English
Keep PDFs in English for consistency

### Option 3: Ask User
Add language selector to export dialog

Recommend Option 1 for best UX.

## Completion Checklist

Use this to track your progress:

- [ ] BorrowerStep.tsx updated and tested
- [ ] CreditStep.tsx updated and tested
- [ ] PropertyStep.tsx updated and tested
- [ ] LoanStep.tsx updated and tested
- [ ] DebtsStep.tsx updated and tested
- [ ] Results page updated and tested
- [ ] Full wizard flow tested in English
- [ ] Full wizard flow tested in Spanish
- [ ] Language toggle works on all pages
- [ ] No "undefined" text visible
- [ ] No console errors
- [ ] Language preference persists across sessions
- [ ] Mobile responsive in both languages
- [ ] PDF still generates correctly (if implemented)

## Need Help?

Reference files:
- `EXAMPLE-BorrowerStep-with-translations.tsx` - Complete working example
- `src/data/translations.json` - All available translations
- `src/contexts/LanguageContext.tsx` - How the system works
- `src/app/page.tsx` - Another working example

## Estimated Time

- Per step component: 15-20 minutes
- Results page: 30-40 minutes
- Testing: 20 minutes
- **Total: ~2.5 hours**

This is straightforward find-and-replace work. The translation system is robust and ready to use!

---

**Questions?** Check the example file or test the landing page (already working) to see the pattern in action.
