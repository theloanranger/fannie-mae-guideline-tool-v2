/**
 * Calculate monthly principal and interest payment using amortization formula
 * Formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
 * Where:
 * M = Monthly payment
 * P = Principal loan amount
 * i = Monthly interest rate (annual rate / 12)
 * n = Number of payments (term in years * 12)
 */
export function calculatePrincipalAndInterest(
  loanAmount: number,
  annualInterestRate: number,
  termYears: number
): number {
  if (loanAmount <= 0 || annualInterestRate <= 0 || termYears <= 0) {
    return 0;
  }

  const monthlyRate = annualInterestRate / 100 / 12;
  const numberOfPayments = termYears * 12;

  // Handle edge case of 0% interest
  if (monthlyRate === 0) {
    return loanAmount / numberOfPayments;
  }

  const payment =
    loanAmount *
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  return Math.round(payment * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate Loan-to-Value ratio (LTV)
 * LTV = (Loan Amount / Purchase Price) * 100
 */
export function calculateLTV(loanAmount: number, purchasePrice: number): number {
  if (purchasePrice <= 0) {
    return 0;
  }
  return Math.round((loanAmount / purchasePrice) * 10000) / 100; // Round to 2 decimal places
}

/**
 * Calculate Debt-to-Income ratio (DTI)
 * DTI = (Total Monthly Debt Payments / Gross Monthly Income) * 100
 */
export function calculateDTI(totalMonthlyDebt: number, grossMonthlyIncome: number): number {
  if (grossMonthlyIncome <= 0) {
    return 0;
  }
  return Math.round((totalMonthlyDebt / grossMonthlyIncome) * 10000) / 100; // Round to 2 decimal places
}

/**
 * Calculate Housing Ratio (Front-end DTI)
 * Housing Ratio = (PITI + HOA / Gross Monthly Income) * 100
 */
export function calculateHousingRatio(
  pitiPlusHoa: number,
  grossMonthlyIncome: number
): number {
  if (grossMonthlyIncome <= 0) {
    return 0;
  }
  return Math.round((pitiPlusHoa / grossMonthlyIncome) * 10000) / 100;
}

/**
 * Calculate gross monthly income from all income sources
 */
export function calculateGrossMonthlyIncome(
  baseAnnual: number,
  bonusAnnual: number = 0,
  overtimeAnnual: number = 0,
  selfEmployedMonthly: number = 0,
  rentalIncomeMonthly: number = 0,
  investmentIncomeMonthly: number = 0,
  pensionMonthly: number = 0,
  socialSecurityMonthly: number = 0,
  alimonyMonthly: number = 0,
  otherIncomeMonthly: number = 0
): number {
  const w2Monthly = (baseAnnual + bonusAnnual + overtimeAnnual) / 12;
  const totalMonthly = w2Monthly + 
    selfEmployedMonthly + 
    rentalIncomeMonthly + 
    investmentIncomeMonthly + 
    pensionMonthly + 
    socialSecurityMonthly + 
    alimonyMonthly + 
    otherIncomeMonthly;
  
  return Math.round(totalMonthly * 100) / 100;
}

/**
 * Estimate monthly mortgage insurance (MI) based on LTV and credit score
 * Uses 2026 realistic risk-based guidelines
 */
export function estimateMortgageInsurance(
  loanAmount: number, 
  ltv: number,
  fico: number = 720,
  hasBankruptcy: boolean = false,
  hasForeclosure: boolean = false,
  hasLatePayments: boolean = false
): number {
  if (ltv <= 80) {
    return 0; // No MI required at or below 80% LTV
  }

  let annualMIRate = 0;

  // 2026 Credit-Based PMI Guidelines
  // LTV >= 95%
  if (ltv >= 95) {
    if (fico >= 760) {
      annualMIRate = 0.006; // 0.6% (midpoint of 0.5-0.7%)
    } else if (fico >= 700) {
      annualMIRate = 0.0075; // 0.75% (midpoint of 0.6-0.9%)
    } else if (fico >= 660) {
      annualMIRate = 0.0105; // 1.05% (midpoint of 0.9-1.2%)
    } else {
      annualMIRate = 0.0135; // 1.35% (midpoint of 1.2-1.5%)
    }
  }
  // LTV 90-94.99%
  else if (ltv >= 90) {
    if (fico >= 760) {
      annualMIRate = 0.005; // 0.5% (midpoint of 0.4-0.6%)
    } else if (fico >= 700) {
      annualMIRate = 0.0065; // 0.65% (midpoint of 0.5-0.8%)
    } else if (fico >= 660) {
      annualMIRate = 0.0095; // 0.95% (midpoint of 0.8-1.1%)
    } else {
      annualMIRate = 0.012; // 1.2% (midpoint of 1.0-1.4%)
    }
  }
  // LTV 85-89.99%
  else if (ltv >= 85) {
    if (fico >= 760) {
      annualMIRate = 0.0035; // 0.35% (midpoint of 0.25-0.45%)
    } else if (fico >= 700) {
      annualMIRate = 0.00475; // 0.475% (midpoint of 0.35-0.6%)
    } else if (fico >= 660) {
      annualMIRate = 0.0075; // 0.75% (midpoint of 0.6-0.9%)
    } else {
      annualMIRate = 0.0105; // 1.05% (midpoint of 0.9-1.2%)
    }
  }
  // LTV 80-84.99%
  else {
    if (fico >= 700) {
      annualMIRate = 0.003; // 0.3% (midpoint of 0.2-0.4%)
    } else if (fico >= 660) {
      annualMIRate = 0.0035; // 0.35%
    } else {
      annualMIRate = 0.004; // 0.4%
    }
  }

  // Adjust for credit history issues
  if (hasBankruptcy) {
    annualMIRate *= 1.25; // 25% higher with bankruptcy
  }
  if (hasForeclosure) {
    annualMIRate *= 1.35; // 35% higher with foreclosure
  }
  if (hasLatePayments) {
    annualMIRate *= 1.15; // 15% higher with recent late payments
  }

  const monthlyMI = (loanAmount * annualMIRate) / 12;
  return Math.round(monthlyMI * 100) / 100;
}

/**
 * Calculate monthly property taxes
 */
export function calculateMonthlyPropertyTax(
  purchasePrice: number,
  annualTaxRate: number
): number {
  const annualTax = purchasePrice * annualTaxRate;
  return Math.round((annualTax / 12) * 100) / 100;
}

/**
 * Estimate monthly homeowners insurance if not provided
 * Typical range is 0.35% to 0.50% of home value annually
 */
export function estimateMonthlyInsurance(purchasePrice: number): number {
  const annualInsurance = purchasePrice * 0.0042; // 0.42% average
  return Math.round((annualInsurance / 12) * 100) / 100;
}
