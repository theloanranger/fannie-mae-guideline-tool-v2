# Property Ownership, ADU, First-Time Buyer & Income Limits Guide

## 🏘️ Overview of New Features

Critical underwriting factors added:
1. **Number of properties owned** - Affects reserves and qualification
2. **Legal ADU (Accessory Dwelling Unit)** - Can add qualifying income
3. **First-time homebuyer status** - Access to special programs
4. **Fannie Mae income limits** - HomeReady & Home Possible eligibility

---

## 🏠 Number of Properties Owned

### Why It Matters
Fannie Mae has specific requirements based on how many financed properties you own.

### Field: Properties Currently Owned
**Input:** Number (0-10)
**Question:** "How many financed properties do you currently own?"

**Count Includes:**
- Primary residence (if you have a mortgage)
- Second homes (with mortgages)
- Investment properties (with mortgages)
- This new purchase counts as +1

**Do NOT Count:**
- Properties fully paid off (no mortgage)
- Properties you're selling before closing

### Reserve Requirements by Property Count

| Properties Owned | Primary Res. Reserves | Investment Reserves | Notes |
|-----------------|----------------------|---------------------|-------|
| 1-3 properties | 2 months | 6 months | Standard requirements |
| 4 properties | 3 months | 6 months | Additional scrutiny |
| 5-6 properties | 4 months | 6 months | Portfolio review |
| 7-10 properties | 6+ months | 6 months | Experienced investor req. |
| 10+ properties | Special approval | Special approval | Portfolio loan |

### Guideline Flags Generated

**4-10 Properties (WARNING):**
```
⚠️ You own 5 properties. Additional reserves and scrutiny 
   required for 4-10 financed properties.
   Reference: Fannie Mae Selling Guide B3-4.3-01
```

**10+ Properties (ERROR):**
```
❌ You own 12 properties. Special portfolio loan requirements
   apply for 10+ financed properties.
   Reference: Fannie Mae Selling Guide B3-4.3-01
```

**Reserve Guidance (INFO):**
```
ℹ️ With 5 properties, recommend 4 months reserves for this
   purchase.
   Reference: Fannie Mae Selling Guide B3-4.3-01
```

### Example Scenarios

**Scenario 1: First-Time Buyer**
- Properties owned: 0
- Reserves needed: 2 months (primary) or 6 months (investment)
- ✅ Standard processing

**Scenario 2: Growing Portfolio**
- Properties owned: 3 (all rentals)
- Buying: 4th investment property
- Reserves needed: 6 months
- ⚠️ Approaching 4-property threshold

**Scenario 3: Experienced Investor**
- Properties owned: 6 (mix of primary + rentals)
- Buying: 7th investment property
- Reserves needed: 6+ months
- ⚠️ Enhanced documentation required
- Must show property management experience

**Scenario 4: Large Portfolio**
- Properties owned: 10+
- ❌ Requires special portfolio loan
- Conventional Fannie Mae limits reached
- Need commercial/portfolio lender

---

## 🏡 Legal ADU (Accessory Dwelling Unit)

### What Is an ADU?
An ADU is a secondary housing unit on the same lot as a primary residence:
- Granny flat
- In-law unit
- Detached cottage
- Converted garage
- Basement apartment

### Why It Matters
**ADU rental income can help you qualify** for a larger loan!

### Fields Required

**Has Legal ADU:** Yes/No checkbox

**If Yes, ADU Monthly Rental Income:** Dollar amount

### Requirements for ADU Income to Count

**Must Be LEGAL:**
- ✅ Proper permits obtained
- ✅ Separate entrance
- ✅ Full kitchen
- ✅ Full bathroom
- ✅ Documented in appraisal
- ✅ Meets local building codes

**Income Documentation:**
- Lease agreement (if currently rented)
- Rental market analysis (if vacant)
- Typically **75% of gross rent** is counted
- Must be arms-length rental (not to family)

### How ADU Income Is Calculated

**Example:**
- ADU rents for: $2,000/month
- Amount counted: $2,000 × 75% = $1,500/month
- Annual qualifying income: $1,500 × 12 = $18,000

**Added to your total income for DTI calculation!**

### Guideline Flags Generated

**ADU with Income (INFO):**
```
ℹ️ ADU rental income of $2,000/month can be counted 
   (typically 75%) with proper documentation.
   Reference: Fannie Mae Selling Guide B3-3.1-08
```

**Documentation Required (INFO):**
```
ℹ️ Legal ADU must be documented in appraisal. Requires
   permits, separate entrance, kitchen, and bathroom.
   Reference: Fannie Mae Selling Guide B3-3.1-08
```

**ADU But No Income (INFO):**
```
ℹ️ Property has legal ADU but no rental income entered.
   ADU can provide qualifying income if rented.
   Reference: Fannie Mae Selling Guide B3-3.1-08
```

### California ADU Benefits

California is **very ADU-friendly:**
- Streamlined permitting
- Reduced setback requirements
- Reduced parking requirements
- State laws override some local restrictions

**Perfect for qualifying income boost!**

### Example Impact

**Without ADU Income:**
- Gross monthly income: $8,000
- Max payment (45% DTI): $3,600
- Max home price: ~$600,000

**With ADU Income:**
- Base income: $8,000
- ADU income (75% of $2,000): $1,500
- Total income: $9,500
- Max payment (45% DTI): $4,275
- Max home price: ~$715,000

**$115,000 more buying power!**

---

## 🏠 First-Time Homebuyer Status

### Definition
A first-time homebuyer is someone who:
- Has **not owned** a primary residence in the past **3 years**
- Includes never owned, OR
- Owned more than 3 years ago

### Why It Matters
Access to special programs with better terms!

### Field: First-Time Homebuyer
**Input:** Yes/No checkbox
**Question:** "Are you a first-time homebuyer?"

### Benefits for First-Time Buyers

**1. HomeReady Program (Fannie Mae)**
- 3% down payment (97% LTV)
- Reduced mortgage insurance rates
- Income limit: Must be ≤ Area Median Income
- Min FICO: 620
- Homeownership education may be required

**2. Home Possible (Freddie Mac)**
- 3% down payment (97% LTV)
- Reduced mortgage insurance rates
- Income limit: Must be ≤ Area Median Income
- Min FICO: 660
- Homeownership education may be required

**3. State/Local Programs**
- Down payment assistance
- Closing cost grants
- Reduced interest rates
- Varies by California county

**4. Lenient Underwriting**
- More flexible on reserves
- Educational course may substitute for some requirements
- First-time buyer intent valued

### Guideline Flags Generated

**First-Time Buyer Benefits (INFO):**
```
ℹ️ As a first-time homebuyer, you may qualify for HomeReady
   (3% down) or state/local assistance programs.
   Reference: Fannie Mae Selling Guide B5-6-02
```

**Education Requirement (INFO):**
```
ℹ️ First-time buyers with >95% LTV should complete
   homeownership education course (may be required).
   Reference: Fannie Mae Selling Guide B5-6-02
```

**Conflicting Status (WARNING):**
```
⚠️ Marked as first-time buyer but owns 2 properties.
   First-time buyer definition: Has not owned home in past
   3 years.
   Reference: Fannie Mae Selling Guide B5-6-02
```

### Common Scenarios

**Scenario 1: True First-Timer**
- Never owned property
- First-time buyer: YES ✅
- Eligible for HomeReady if income qualifies

**Scenario 2: Previous Owner**
- Owned home, sold 4 years ago
- First-time buyer: YES ✅
- Qualifies! (3+ years since ownership)

**Scenario 3: Current Owner**
- Owns primary residence
- First-time buyer: NO ❌
- Not a first-time buyer

**Scenario 4: Inherited Property**
- Inherited paid-off property
- Never purchased/financed
- First-time buyer: Potentially YES ✅
- Discuss with lender (gray area)

---

## 💰 Fannie Mae Income Limits (HomeReady / Home Possible)

### Area Median Income (AMI)

Each county has an **Area Median Income** set by HUD.

**California Examples (2026):**
| County | AMI (Family of 4) |
|--------|-------------------|
| Santa Clara | $188,000 |
| San Francisco | $174,000 |
| San Mateo | $188,000 |
| Los Angeles | $108,000 |
| Orange | $144,000 |
| San Diego | $126,000 |
| Sacramento | $112,000 |
| Fresno | $80,000 |

### Income Qualification

**To qualify for HomeReady or Home Possible:**
- Your annual income must be **≤ 100% of AMI**
- Includes ALL borrowers' income
- Includes ADU income (if counted)

### Programs Comparison

| Feature | HomeReady | Home Possible |
|---------|-----------|---------------|
| **Lender** | Fannie Mae | Freddie Mac |
| **Income Limit** | ≤ 100% AMI | ≤ 100% AMI |
| **Min FICO** | 620 | 660 |
| **Max LTV** | 97% (3% down) | 97% (3% down) |
| **MI Rates** | Reduced | Reduced |
| **Education** | Required | Required |
| **Occupancy** | Primary only | Primary only |

### How Income Is Calculated

**Example Calculation:**
```
W-2 Income: $85,000/year
Self-Employment: $2,000/month × 12 = $24,000/year
ADU Rental: $1,500/month × 12 × 75% = $13,500/year
─────────────────────────────────────────────────────
Total Annual Income: $122,500

County: San Diego (AMI = $126,000)
Income as % of AMI: 97.2%
✅ Qualifies for HomeReady/Home Possible!
```

### Guideline Flags Generated

**Eligible for HomeReady (INFO):**
```
ℹ️ You may qualify for HomeReady! Income at 97% of AMI
   ($126,000). Benefits: 97% LTV, reduced MI, 3% down.
   Reference: Fannie Mae Selling Guide B5-6-02
```

**Income Above AMI (INFO):**
```
ℹ️ Income ($145,000) exceeds San Diego County AMI limit
   ($126,000). Not eligible for HomeReady/Home Possible.
   Reference: Fannie Mae Selling Guide B5-6-02
```

**FICO Too Low (No flag shown - just not eligible)**

### Benefits of These Programs

**1. Lower Down Payment**
- 3% down vs 5% or 20%
- $600,000 home: $18,000 vs $30,000 or $120,000
- Keeps more cash for reserves, moving, etc.

**2. Reduced MI Rates**
- Can save $50-150/month vs standard 97% LTV
- Over 30 years: $18,000 - $54,000 savings!

**3. Flexible Income Sources**
- Boarder income can count (primary residence)
- ADU income counts
- Non-occupant co-borrower income

**4. Special Eligibility**
- Low-to-moderate income areas automatically qualify
- No income limit in certain census tracts

### Who Should Consider These Programs?

✅ **Good Fit:**
- First-time buyers
- Income ≤ county AMI
- FICO ≥ 620 (HomeReady) or 660 (Home Possible)
- Want low down payment
- Willing to take homeownership course

❌ **Not a Fit:**
- Income > county AMI
- Want second home or investment property
- FICO < 620
- Don't want to take education course

---

## 🔄 How These Features Work Together

### Example: Complete Scenario

**Borrower Profile:**
- First-time buyer: YES
- Properties owned: 0
- Has legal ADU: YES
- ADU rental income: $2,000/month
- W-2 income: $90,000/year
- County: San Diego (AMI = $126,000)
- FICO: 680

**Calculations:**
```
Annual Income Calculation:
W-2: $90,000
ADU (75%): $2,000 × 12 × 0.75 = $18,000
Total: $108,000

Income vs AMI:
$108,000 / $126,000 = 85.7% of AMI
✅ Qualifies for HomeReady!
```

**Flags Generated:**
1. ✅ "May qualify for HomeReady - 85% of AMI"
2. ℹ️ "ADU income of $2,000/mo can be counted (75%)"
3. ℹ️ "As first-time buyer, HomeReady offers 3% down"
4. ℹ️ "ADU must be documented in appraisal"
5. ℹ️ "Homeownership education may be required"

**Result:**
- Can put down just 3% ($18,000 on $600k home)
- Gets reduced MI rates
- ADU income helps qualify
- $18,000 of ADU income counted annually

---

## 📊 User Interface Additions Needed

### Property Step - New Fields

```
╔═══════════════════════════════════════════════════╗
║  Property Ownership                               ║
╠═══════════════════════════════════════════════════╣
║  How many financed properties do you own?         ║
║  [2] properties                                   ║
║  💡 Count properties with mortgages (not paid off)║
║                                                    ║
║  ☐ Property has a legal ADU (accessory dwelling)  ║
║                                                    ║
║  [If checked, shows:]                             ║
║  ADU Monthly Rental Income                        ║
║  $ [2,000]                                       ║
║  💡 75% typically counted, requires documentation ║
║                                                    ║
║  ☐ I am a first-time homebuyer                   ║
║  💡 Has not owned primary residence in 3+ years  ║
╚═══════════════════════════════════════════════════╝
```

### Results Page - Income Limit Info

```
╔═══════════════════════════════════════════════════╗
║  Special Programs Eligibility                     ║
╠═══════════════════════════════════════════════════╣
║  Annual Income: $108,000                          ║
║  Santa Clara County AMI: $188,000                 ║
║  Income as % of AMI: 57.4%                        ║
║                                                    ║
║  ✅ Eligible for HomeReady (3% down, reduced MI)  ║
║  ✅ Eligible for Home Possible (3% down)          ║
║                                                    ║
║  Benefits:                                        ║
║  • Down payment: $18,000 vs $30,000 (save $12K)  ║
║  • MI rate: ~$185/mo vs ~$262/mo (save $77/mo)   ║
║  • Education required: ~8 hours online           ║
╚═══════════════════════════════════════════════════╝
```

---

## ✅ Implementation Checklist

### Backend (Completed)
- [x] Add fields to property schema
- [x] Create income limits data file
- [x] Create income limit lookup functions
- [x] Add rules for multiple properties
- [x] Add rules for ADU income
- [x] Add rules for first-time buyers
- [x] Add rules for income limit programs
- [x] Update context interface

### Frontend (To Do)
- [ ] Add property ownership count input
- [ ] Add ADU checkbox and income field
- [ ] Add first-time buyer checkbox
- [ ] Display income limit eligibility in results
- [ ] Show program benefits comparison
- [ ] Add AMI lookup by county

### Testing
- [ ] Test 4+ properties reserve requirements
- [ ] Test ADU income calculation
- [ ] Test first-time buyer flags
- [ ] Test HomeReady eligibility
- [ ] Test all California counties AMI limits

---

**Version:** 2.2.0
**Date:** February 2, 2026
**Status:** Backend Complete, Frontend Ready to Implement
**Business Value:** HIGH - These features are game-changers for buyers!
