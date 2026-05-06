# Visual Demo - Enhanced Mortgage Calculator

## 🎬 Complete Walkthrough of New Features

---

## Landing Page (Unchanged)
```
┌─────────────────────────────────────────────────────────┐
│  🏠 Empower Home Loan                        [EN] [ES]  │
│  California Mortgage Scenario Calculator                │
└─────────────────────────────────────────────────────────┘

         Welcome to the Mortgage Scenario Calculator

    Estimate your mortgage payments and evaluate Fannie Mae
              conforming loan guidelines

    What This Tool Does
    ✓ Calculate PITI + MI + HOA
    ✓ Evaluate DTI and LTV ratios
    ✓ Determine Conforming or High-Balance limits
    ✓ Check Fannie Mae guidelines
    ✓ Export PDF report

              [Start New Scenario] ← Click this
```

---

## STEP 1: Enhanced Borrower Income (NEW!)

```
┌─────────────────────────────────────────────────────────┐
│  Step 1: Borrower Income                                │
│  Enter all sources of income                            │
└─────────────────────────────────────────────────────────┘

╔═══════════════════════════════════════════════════════╗
║  W-2 Employment Income                                 ║
╠═══════════════════════════════════════════════════════╣
║  Base Annual Salary *                                  ║
║  $ [120,000]                                          ║
║                                                        ║
║  Annual Bonus (Optional)                              ║
║  $ [15,000]                                           ║
║  💡 2+ year history required                          ║
║                                                        ║
║  Annual Overtime (Optional)                           ║
║  $ [0]                                                ║
║  💡 Must be consistent and documented                 ║
╚═══════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════╗
║  💼 Self-Employment Income          (Blue section)    ║
╠═══════════════════════════════════════════════════════╣
║  Average Monthly Net Income                           ║
║  $ [5,000]                                           ║
║  💡 From tax returns (2-year average)                ║
║                                                        ║
║  Years Self-Employed                                  ║
║  [2.5]                                               ║
║  ⚠️ Less than 2 years may require additional docs    ║
╚═══════════════════════════════════════════════════════╝

    ▶ Add Other Income (Rental, Pension, Investment, etc.)
         ← Click to expand

[If clicked, shows:]

╔═══════════════════════════════════════════════════════╗
║  Additional Income Sources         (Green section)    ║
╠═══════════════════════════════════════════════════════╣
║  Rental Income (Monthly)    │  Investment Income     ║
║  $ [1,500]                  │  $ [500]              ║
║  💡 75% typically counted   │  Dividends, interest  ║
║                                                        ║
║  Pension (Monthly)          │  Social Security      ║
║  $ [0]                      │  $ [0]                ║
║                                                        ║
║  Alimony Received (Monthly) │  Other Income         ║
║  $ [0]                      │  $ [0]                ║
║  💡 3+ years remaining req. │                       ║
╚═══════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════╗
║  Total Gross Monthly Income                           ║
║                                                        ║
║              $18,250.00                               ║
║                                                        ║
║  W-2: $11,250 | Self-Employed: $5,000 | Other: $2,000║
╚═══════════════════════════════════════════════════════╝

                      [Continue to Credit →]
```

---

## STEP 2: Enhanced Credit (NEW FIELDS!)

```
┌─────────────────────────────────────────────────────────┐
│  Step 2: Credit Information                             │
│  Credit score and risk factors                          │
└─────────────────────────────────────────────────────────┘

Representative FICO Score *
[680]  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Good

Number of Borrowers *
[1 Borrower ▼]

╔═══════════════════════════════════════════════════════╗
║  Credit History / Risk Factors         ⚠️ NEW!       ║
╠═══════════════════════════════════════════════════════╣
║  Bankruptcy History                                    ║
║  [Chapter 7 (2-4 years ago) ▼]                       ║
║                                                        ║
║  Foreclosure History                                  ║
║  [None ▼]                                             ║
║                                                        ║
║  Late Payment History                                 ║
║  [Minor (30-day late) ▼]                             ║
║                                                        ║
║  ℹ️ These factors affect MI rates and eligibility    ║
╚═══════════════════════════════════════════════════════╝

        [← Back]              [Continue to Property →]
```

**Dropdown Options Preview:**

**Bankruptcy History:**
```
[None                           ]
[Chapter 7 (4+ years ago)      ] ← Minimal impact
[Chapter 7 (2-4 years ago)     ] ← Selected, +50% MI
[Chapter 13 (Discharged)       ]
[Chapter 13 (Active)           ] ← Requires trustee OK
```

---

## STEP 3: Property Details (Unchanged)

```
┌─────────────────────────────────────────────────────────┐
│  Step 3: Property Details                               │
└─────────────────────────────────────────────────────────┘

State *                    County *
[CA ▼]                     [Santa Clara ▼]

Purchase Price *           Down Payment *
$ [800,000]               $ [160,000]
                          20.00% down • Loan Amount: $640,000

Property Type *            Occupancy Type *
[Single Family Home ▼]    [Investment Property ▼] ← Important!

        [← Back]              [Continue to Loan Details →]
```

---

## STEP 4: Loan Details (With Improved Tax Input)

```
┌─────────────────────────────────────────────────────────┐
│  Step 4: Loan Details                                   │
└─────────────────────────────────────────────────────────┘

Loan Term *              Interest Rate (%) *
[30 Years ▼]            [6.750]
                        💡 Rates in eighths: 6.500, 6.625, 6.750...

HOA Dues (Monthly)       Homeowners Insurance (Monthly)
$ [300]                 $ [280]
💡 Enter 0 if no HOA    💡 Leave blank for estimate ($280/month)

Property Tax Rate Override (Annual %)
[1.35]  ← Typing custom rate
💡 Leave blank to use default, or enter custom rate

╔═══════════════════════════════════════════════════════╗
║  Estimated Monthly Property Tax     🟢 Custom Rate   ║
║                                                        ║
║              $900.00                                  ║
║                                                        ║
║  Based on 1.35% tax rate (your custom rate)          ║
╚═══════════════════════════════════════════════════════╝
        ↑ Green when custom, blue when default

        [← Back]              [Continue to Debts →]
```

---

## STEP 5: Enhanced Debts (NEW FIELDS!)

```
┌─────────────────────────────────────────────────────────┐
│  Step 5: Monthly Debts                                  │
│  Enter all recurring monthly debt obligations           │
└─────────────────────────────────────────────────────────┘

Credit Card Minimum Payments (Monthly)
$ [150]
💡 Total minimum monthly payments on all credit cards

Auto Loans (Monthly)           Student Loans (Monthly)
$ [450]                        $ [0]
Car loans, leases, etc.        Monthly student loan payments

╔═══════════════════════════════════════════════════════╗
║  Child Support & Alimony              ⚠️ NEW!        ║
╠═══════════════════════════════════════════════════════╣
║  Child Support Paid (Monthly)                         ║
║  $ [800]                                             ║
║  💡 Court-ordered child support                      ║
║                                                        ║
║  Alimony Paid (Monthly)                              ║
║  $ [0]                                               ║
║  💡 Spousal support payments                         ║
╚═══════════════════════════════════════════════════════╝

Other Monthly Debts
$ [0]
Personal loans, etc.

[Since occupancy = investment, this section appears:]

╔═══════════════════════════════════════════════════════╗
║  Investment Property Requirements      ⚠️ NEW!       ║
╠═══════════════════════════════════════════════════════╣
║  Months of Reserves (PITI)                            ║
║  [4]  ← User entered 4 months                        ║
║  ⚠️ Investment properties typically require 6 months ║
║                                                        ║
║  ☐ I have landlord/property management experience    ║
║                                                        ║
║  ℹ️ Reserves = PITI × Months (liquid assets)         ║
╚═══════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════╗
║  Total Monthly Debt Obligations                       ║
║                                                        ║
║              $2,200.00                                ║
║                                                        ║
║  Note: Do not include new mortgage - calculated auto ║
╚═══════════════════════════════════════════════════════╝

        [← Back]              [Calculate Results →]
```

---

## RESULTS PAGE: Enhanced with New Calculations

```
┌─────────────────────────────────────────────────────────┐
│  Scenario Results                       [Modify] [New]  │
│  Review your estimated mortgage scenario and flags      │
└─────────────────────────────────────────────────────────┘

⚠️  Disclaimer: These are estimates only. Not a loan
    approval. Subject to full underwriting review.

╔══════════════╗  ╔══════════════╗  ╔══════════════╗
║ Monthly      ║  ║ Debt Ratios  ║  ║ Loan Details ║
║ Payment      ║  ║              ║  ║              ║
║              ║  ║ Total DTI    ║  ║ Loan Amount  ║
║ $5,847.23    ║  ║   48.23% ⚠️ ║  ║ $640,000     ║
║              ║  ║              ║  ║              ║
║ P&I: $4,178  ║  ║ Housing      ║  ║ LTV: 80.00%  ║
║ Tax: $900    ║  ║   32.03%     ║  ║              ║
║ Ins: $280    ║  ║              ║  ║ Conforming   ║
║ MI:  $189 ⚠️║  ║ Monthly Debt ║  ║              ║
║ HOA: $300    ║  ║ $2,200       ║  ║              ║
╚══════════════╝  ╚══════════════╝  ╚══════════════╝
                   ↑ High DTI warning

╔═══════════════════════════════════════════════════════╗
║  Guideline Flags                                       ║
╠═══════════════════════════════════════════════════════╣
║                                                        ║
║  ✗ Errors (2)                                         ║
║  ┌──────────────────────────────────────────────────┐║
║  │ INSUFFICIENT_RESERVES                             │║
║  │ Investment properties require 6 months reserves.  │║
║  │ You have 4 months.                               │║
║  │ Reference: Fannie Mae Selling Guide B3-4.3-01    │║
║  └──────────────────────────────────────────────────┘║
║                                                        ║
║  ⚠ Warnings (3)                                       ║
║  ┌──────────────────────────────────────────────────┐║
║  │ DTI_HIGH                                          │║
║  │ DTI ratio 48.23% is elevated. Additional         │║
║  │ compensating factors may be required.            │║
║  │ Reference: Fannie Mae Selling Guide B3-6-02      │║
║  └──────────────────────────────────────────────────┘║
║  ┌──────────────────────────────────────────────────┐║
║  │ BANKRUPTCY_RECENT                                 │║
║  │ Chapter 7 bankruptcy within 2-4 years requires   │║
║  │ re-established credit and compensating factors.  │║
║  │ Reference: Fannie Mae Selling Guide B3-6-01      │║
║  │ MI Rate Increased by 50% due to this factor      │║
║  └──────────────────────────────────────────────────┘║
║  ┌──────────────────────────────────────────────────┐║
║  │ INVESTMENT_LTV_HIGH                               │║
║  │ Investment properties typically limited to 80%   │║
║  │ LTV for standard financing                       │║
║  │ Reference: Fannie Mae Selling Guide B5-1.1-02    │║
║  └──────────────────────────────────────────────────┘║
║                                                        ║
║  ℹ Information (4)                                    ║
║  ┌──────────────────────────────────────────────────┐║
║  │ SELF_EMPLOYED_DOCS                                │║
║  │ Self-employment income requires 2 years tax       │║
║  │ returns and YTD profit/loss statement            │║
║  │ Reference: Fannie Mae Selling Guide B3-3.2-01    │║
║  └──────────────────────────────────────────────────┘║
║  ┌──────────────────────────────────────────────────┐║
║  │ CHILD_SUPPORT_OBLIGATION                          │║
║  │ Child support obligation of $800/month included  │║
║  │ in DTI calculation                               │║
║  │ Reference: Fannie Mae Selling Guide B3-6-05      │║
║  └──────────────────────────────────────────────────┘║
║  ┌──────────────────────────────────────────────────┐║
║  │ LATE_PAYMENTS_MINOR                               │║
║  │ Minor 30-day late payments noted - may affect    │║
║  │ MI pricing                                       │║
║  │ MI Rate Increased by 20% due to this factor      │║
║  │ Reference: Fannie Mae Selling Guide B3-5.3-01    │║
║  └──────────────────────────────────────────────────┘║
║  ┌──────────────────────────────────────────────────┐║
║  │ HOUSING_RATIO_HIGH                                │║
║  │ Front-end ratio 32.03% exceeds traditional 28%   │║
║  │ guideline                                        │║
║  └──────────────────────────────────────────────────┘║
║                                                        ║
╚═══════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════╗
║  MI Calculation Breakdown              ℹ️ NEW!       ║
╠═══════════════════════════════════════════════════════╣
║  Base MI Rate (80% LTV):                    $105/mo  ║
║  FICO Adjustment (680 score):         +25%  $131/mo  ║
║  Bankruptcy Factor (Ch.7, 2-4 yr):    +50%  $197/mo  ║
║  Late Payment Factor (30-day):        +20%  $236/mo  ║
║  ─────────────────────────────────────────────────────║
║  Final Estimated MI:                        $189/mo  ║
║                                                        ║
║  Note: Actual MI rates vary by lender. This is an    ║
║  estimate based on typical pricing adjustments.      ║
╚═══════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════╗
║  Export Scenario                                       ║
╠═══════════════════════════════════════════════════════╣
║  Download PDF summary with all details and flags      ║
║                                                        ║
║  Borrower Initials (for PDF):  [GS]                  ║
║                                                        ║
║                    [Download PDF]                     ║
╚═══════════════════════════════════════════════════════╝

        [← Modify Scenario]      [Start New Scenario →]
```

---

## PDF OUTPUT: Enhanced

```
═══════════════════════════════════════════════════════
           MORTGAGE SCENARIO SUMMARY
           Generated: Feb 2, 2026 8:45 PM
═══════════════════════════════════════════════════════

⚠️  DISCLAIMER: This is an estimate tool only, not a
    loan approval or commitment...

───────────────────────────────────────────────────────
BORROWER INFORMATION
───────────────────────────────────────────────────────
Initials: GS
Number of Borrowers: 1
Representative FICO: 680

───────────────────────────────────────────────────────
INCOME SUMMARY
───────────────────────────────────────────────────────
W-2 Base Annual: $120,000
W-2 Bonus Annual: $15,000
Self-Employment (Monthly): $5,000
  Years Self-Employed: 2.5 years
Rental Income (Monthly): $1,500
Investment Income (Monthly): $500

Gross Monthly Income: $18,250.00

───────────────────────────────────────────────────────
CREDIT & RISK FACTORS                          ⚠️ NEW!
───────────────────────────────────────────────────────
FICO Score: 680
Bankruptcy: Chapter 7 (2-4 years ago)
Foreclosure: None
Late Payments: Minor (30-day late)

⚠️ Risk factors increase MI rate by 95%

───────────────────────────────────────────────────────
PROPERTY DETAILS
───────────────────────────────────────────────────────
Location: Santa Clara County, CA
Purchase Price: $800,000
Down Payment: $160,000 (20.00%)
Property Type: Single Family Home
Occupancy: Investment Property

───────────────────────────────────────────────────────
LOAN DETAILS
───────────────────────────────────────────────────────
Loan Amount: $640,000
Loan Type: Conforming
Term: 30 years
Interest Rate: 6.750%
LTV: 80.00%

───────────────────────────────────────────────────────
MONTHLY PAYMENT BREAKDOWN
───────────────────────────────────────────────────────
Principal & Interest:              $4,178.23
Property Tax:                        $900.00
Homeowners Insurance:                $280.00
Mortgage Insurance (Est.):           $189.00  ⚠️
HOA Dues:                            $300.00
                                   ──────────
Total PITI + MI + HOA:             $5,847.23

───────────────────────────────────────────────────────
MONTHLY DEBTS                                  ⚠️ NEW!
───────────────────────────────────────────────────────
Credit Cards:                        $150.00
Auto Loans:                          $450.00
Student Loans:                         $0.00
Child Support Paid:                  $800.00  ⚠️
Other Debts:                           $0.00
                                   ──────────
Total Monthly Debts:               $2,200.00

───────────────────────────────────────────────────────
DEBT RATIOS
───────────────────────────────────────────────────────
Housing Ratio (Front-end): 32.03%
Total Monthly Debts: $8,047.23
Debt-to-Income Ratio: 48.23%  ⚠️

───────────────────────────────────────────────────────
INVESTMENT PROPERTY INFO                       ⚠️ NEW!
───────────────────────────────────────────────────────
Reserves: 4 months
Required: 6 months  ⚠️ INSUFFICIENT
Landlord Experience: No

───────────────────────────────────────────────────────
GUIDELINE FLAGS
───────────────────────────────────────────────────────

✗ [ERROR] INSUFFICIENT_RESERVES
  Investment properties require 6 months reserves.
  You have 4 months.
  Reference: Fannie Mae Selling Guide B3-4.3-01

⚠ [WARN] DTI_HIGH
  DTI ratio 48.23% is elevated. Additional compensating
  factors may be required.
  Reference: Fannie Mae Selling Guide B3-6-02

⚠ [WARN] BANKRUPTCY_RECENT
  Chapter 7 bankruptcy within 2-4 years requires
  re-established credit and compensating factors.
  Reference: Fannie Mae Selling Guide B3-6-01

[... all other flags listed ...]

───────────────────────────────────────────────────────
Prepared by:
The Santos Lending Team | Empower Home Loans
Guillermo Santos, NMLS #972977
(510) 931-9114
Guillermo@empowermyloan.com

Bishop Ranch 3, 2603 Camino Ramon, Suite 200
San Ramon, CA 94583

This estimate is based on information provided and is
subject to change. Licensed in California only.
═══════════════════════════════════════════════════════
```

---

## Key Visual Differences - Before vs After

### INCOME (Step 1)
**Before:**
- 3 fields (W-2 base, bonus, overtime)

**After:**
- 3 W-2 fields (same)
- **Self-employment section** (blue box)
- **Expandable "Other Income"** with 6 additional fields
- **Real-time total** showing breakdown

### CREDIT (Step 2)
**Before:**
- FICO + number of borrowers

**After:**
- FICO + number of borrowers (same)
- **3 new dropdowns** for risk factors
- **Warning icons** showing MI impact

### DEBTS (Step 5)
**Before:**
- 4 debt categories

**After:**
- 4 debt categories (same)
- **Child support field** (always shows)
- **Alimony field** (always shows)
- **Investment section** (conditional - only if investment property)

### RESULTS
**Before:**
- Basic MI estimate

**After:**
- **MI breakdown** showing each adjustment
- **Many more flags** (7 new categories)
- **Investment property warnings**
- **Self-employment reminders**
- **Child support noted**

---

This is exactly what users will see when the frontend is connected! 🎬
