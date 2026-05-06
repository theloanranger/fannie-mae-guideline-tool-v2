# Advanced Features - Income Types, Risk Factors & Investment Properties

## 🎯 Overview

Major enhancements to handle real-world lending scenarios:
- **Multiple income types** (W-2, self-employed, rental, pension, etc.)
- **Credit history factors** (bankruptcy, foreclosure, late payments)
- **Investment property requirements** (reserves, experience)
- **Child support obligations**
- **Enhanced MI calculations** based on risk factors

---

## 📊 New Income Types

### W-2 Employment (Existing)
- Base salary (annual)
- Bonus (annual, 2-year history)
- Overtime (annual, consistent history)

### Self-Employment Income ⭐ NEW
**Fields:**
- Average monthly net income
- Years self-employed

**Guidelines:**
- Requires 2 years tax returns
- < 2 years: May not be fully counted
- Calculated from Schedule C or business returns
- YTD profit/loss required

**Flags Generated:**
- WARN if < 2 years self-employed
- INFO reminding of documentation requirements

### Rental Income ⭐ NEW
**Field:** Monthly rental income

**Guidelines:**
- Typically 75% of rent counted (25% maintenance reserve)
- Requires lease agreement
- May require rental history

### Investment Income ⭐ NEW
**Field:** Monthly investment income

**Sources:**
- Dividends
- Interest
- Capital gains (consistent)

**Requirements:**
- 2-year history required
- Must be consistent and continuing

### Retirement Income ⭐ NEW
**Fields:**
- Pension (monthly)
- Social Security (monthly)

**Guidelines:**
- Fully counted if documented
- Must be recurring
- Award letters required

### Alimony/Child Support RECEIVED ⭐ NEW
**Field:** Monthly alimony received

**Guidelines:**
- Must have 3+ years remaining
- Court order or separation agreement required
- Fully counted if criteria met

### Other Income ⭐ NEW
**Field:** Other monthly income

**Sources:**
- Trust income
- VA benefits
- Disability income
- Any other documented regular income

---

## 🚨 Credit History / Risk Factors

### Bankruptcy History ⭐ NEW

**Options:**
1. **None** - No bankruptcy
2. **Chapter 7 (4+ years ago)** 
   - Flag: INFO - Credit should be re-established
   - Impact: Minimal if credit rebuilt
   
3. **Chapter 7 (2-4 years ago)**
   - Flag: WARN - Requires compensating factors
   - Impact: Higher MI, stricter requirements
   
4. **Chapter 13 (Discharged)**
   - Flag: INFO - Verify discharge
   - Impact: Moderate
   
5. **Chapter 13 (Active)**
   - Flag: WARN - Requires trustee permission
   - Requirements: 12+ months payment history
   - Impact: Significant restrictions

**MI Impact:**
- Bankruptcy adds **50% to MI rate**
- Example: 0.70% becomes 1.05%

### Foreclosure History ⭐ NEW

**Options:**
1. **None** - No foreclosure
2. **7+ years ago**
   - Flag: INFO - Minimal impact
   
3. **5-7 years ago**
   - Flag: WARN - May qualify with compensating factors
   - Requirements: Re-established credit
   
4. **3-5 years ago**
   - Flag: ERROR - Typically requires 5-7 year waiting period
   - Impact: Usually disqualifying

**MI Impact:**
- Foreclosure adds **75% to MI rate**
- Example: 0.70% becomes 1.225%

### Late Payment History ⭐ NEW

**Options:**
1. **None** - Clean payment history
2. **Minor (30-day late)**
   - Flag: INFO - May affect MI pricing
   - Impact: Small MI increase
   
3. **Recent 60-day late**
   - Flag: WARN - Requires explanation
   - Impact: Moderate MI increase
   
4. **Recent 90+ day late**
   - Flag: ERROR - May disqualify
   - Impact: Significant or disqualifying

**MI Impact:**
- Late payments add **20% to MI rate**
- Example: 0.70% becomes 0.84%

---

## 💰 Investment Property Features

### Reserve Requirements ⭐ NEW

**Field:** Months of reserves

**Guidelines:**
- **Investment properties:** 6 months PITI required
- **Primary residence:** 2 months typical
- **Second home:** 2-4 months typical

**Calculation:**
```
Required Reserves = PITI × Number of Months
Example: $2,500 PITI × 6 months = $15,000 reserves needed
```

**Flags Generated:**
- ERROR if reserves insufficient for investment property
- INFO if reserves adequate

### Landlord Experience ⭐ NEW

**Field:** Has landlord experience (Yes/No)

**Guidelines:**
- First-time landlords with LTV > 75%: Stricter requirements
- Experienced landlords: More lenient underwriting

**Flags Generated:**
- WARN if no experience + LTV > 75%

### LTV Limits for Investment Properties

**Existing rule enhanced:**
- Standard limit: 80% LTV
- With strong factors: Up to 85% LTV possible
- Flags generated if exceeding 80%

---

## 👨‍👩‍👧‍👦 Child Support & Alimony

### Child Support PAID ⭐ NEW

**Field:** Monthly child support obligation

**Guidelines:**
- **Always** included in DTI calculation
- Must be documented (court order)
- Reduces qualifying income

**Flags Generated:**
- INFO noting obligation included in DTI
- Shows amount in flag message

### Alimony PAID ⭐ NEW

**Field:** Monthly alimony payment

**Guidelines:**
- Included in DTI calculation
- Must have 3+ years remaining to count against you
- Separation agreement or court order required

---

## 📈 Enhanced MI Calculations

### Base MI Rates (Unchanged)
- LTV 95.01-97%: 0.85% annual
- LTV 90.01-95%: 0.70% annual
- LTV 85.01-90%: 0.55% annual
- LTV 80.01-85%: 0.32% annual

### Risk Factor Multipliers ⭐ NEW

**FICO Score Adjustments:**
- FICO < 680: ×1.25 (25% higher)
- FICO 680-699: ×1.15 (15% higher)
- FICO 700+: No adjustment

**Credit History Adjustments (Cumulative!):**
- Bankruptcy: ×1.50 (50% higher)
- Foreclosure: ×1.75 (75% higher)
- Late Payments: ×1.20 (20% higher)

### Example MI Calculations

**Scenario 1: Clean Credit**
- LTV: 95%
- FICO: 740
- No issues
- Base Rate: 0.70%
- **Final Rate: 0.70%**

**Scenario 2: Past Bankruptcy**
- LTV: 95%
- FICO: 680
- Chapter 7 (3 years ago)
- Base: 0.70% × 1.25 (low FICO) × 1.50 (bankruptcy)
- **Final Rate: 1.3125%** (87% higher!)

**Scenario 3: Multiple Issues**
- LTV: 95%
- FICO: 650
- Foreclosure (6 years ago)
- Recent late payments
- Base: 0.70% × 1.25 × 1.75 × 1.20
- **Final Rate: 1.8375%** (162% higher!)

---

## 🔧 Implementation Status

### ✅ Completed - Backend
- [x] Schema updates for all income types
- [x] Schema updates for risk factors
- [x] Schema updates for investment fields
- [x] Enhanced income calculation function
- [x] Enhanced MI calculation with risk factors
- [x] New rules for bankruptcy
- [x] New rules for foreclosure
- [x] New rules for late payments
- [x] New rules for self-employment
- [x] New rules for child support
- [x] New rules for investment reserves

### ⬜ To Complete - Frontend
- [ ] Replace BorrowerStep.tsx with BorrowerStep-ENHANCED.tsx
- [ ] Update CreditStep.tsx to include risk factor questions
- [ ] Update DebtsStep.tsx to include child support + investment fields
- [ ] Update results page to pass new context variables
- [ ] Test all new calculations
- [ ] Test all new flags

---

## 🚀 Quick Implementation Guide

### Step 1: Replace Borrower Component
```bash
# Backup original
mv src/components/steps/BorrowerStep.tsx src/components/steps/BorrowerStep-OLD.tsx

# Use enhanced version
mv src/components/steps/BorrowerStep-ENHANCED.tsx src/components/steps/BorrowerStep.tsx
```

### Step 2: Create Enhanced Credit Component
Add to `CreditStep.tsx`:
- Bankruptcy history dropdown
- Foreclosure history dropdown
- Late payment history dropdown

### Step 3: Create Enhanced Debts Component
Add to `DebtsStep.tsx`:
- Child support paid field
- Alimony paid field
- Investment property section:
  - Months of reserves
  - Landlord experience checkbox

### Step 4: Update Results Calculation
Pass all new fields to:
- `calculateGrossMonthlyIncome()` - Add all new income params
- `estimateMortgageInsurance()` - Add risk factor params
- `evaluateGuidelines()` - Add all new context fields

---

## 📝 User Experience

### Income Section
- Clean W-2 section (default visible)
- Self-employment section (highlighted in blue)
- "Add Other Income" expandable button
- Green section for additional income sources
- Real-time total calculation

### Credit Section
- FICO score (existing)
- Number of borrowers (existing)
- **NEW:** Bankruptcy history dropdown
- **NEW:** Foreclosure history dropdown  
- **NEW:** Late payment history dropdown
- Info icons explaining impact

### Debts Section
- Existing debt fields
- **NEW:** Child support payment field
- **NEW:** Alimony payment field
- **NEW:** Investment property subsection (only shows if occupancy=investment)
  - Months of reserves input
  - Landlord experience checkbox

### Results Page
- MI calculation shows: "Estimated based on LTV, credit score, and risk factors"
- Flags explain each issue clearly
- PDF includes all new information

---

## 🧪 Testing Scenarios

### Test 1: Self-Employed Income
- W-2: $0
- Self-Employed: $8,000/month
- Years: 1.5 years
- **Expected:** WARN flag about < 2 years

### Test 2: Investment Property
- Occupancy: Investment
- Reserves: 3 months
- **Expected:** ERROR flag (need 6 months)

### Test 3: Bankruptcy Impact on MI
- LTV: 90%
- FICO: 720
- Bankruptcy: Chapter 7 (3 years ago)
- **Expected:** MI rate 50% higher than clean credit

### Test 4: Multiple Income Sources
- W-2: $60,000/year ($5,000/month)
- Rental: $1,500/month
- Pension: $2,000/month
- **Expected:** Total = $8,500/month

### Test 5: Child Support
- Child support paid: $800/month
- **Expected:** Added to debts, INFO flag generated

---

## 📊 Business Value

### For Loan Officers:
- ✅ Handle complex income scenarios
- ✅ Identify issues early
- ✅ Set proper expectations on MI costs
- ✅ Pre-qualify investment buyers accurately

### For Borrowers:
- ✅ See realistic estimates
- ✅ Understand impact of credit history
- ✅ Know documentation requirements upfront
- ✅ Plan for reserve requirements

### Compliance:
- ✅ Follows Fannie Mae guidelines
- ✅ Documents rationale for decisions
- ✅ Clear disclosure of limitations

---

## 🎓 Documentation References

All rules reference Fannie Mae Selling Guide sections:
- B3-3.2-01: Self-Employment Income
- B3-4.3-01: Reserves
- B3-5.3-01: Credit History
- B3-6-01: Bankruptcy
- B3-6-02: Foreclosure
- B3-6-05: Alimony/Child Support
- B5-1.1-02: Investment Property LTV

---

**Version:** 2.1.0
**Status:** Backend Complete, Frontend In Progress
**Priority:** High - These are essential real-world scenarios
