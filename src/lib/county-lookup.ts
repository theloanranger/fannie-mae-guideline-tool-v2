import countyLimitsData from '@/data/county-limits.json';
import taxRatesData from '@/data/tax-rates.json';

export interface CountyLimits {
  conforming: number;
  highBalance: number;
}

export interface LoanLimitResult {
  conformingLimit: number;
  highBalanceLimit: number;
  loanType: 'conforming' | 'high-balance' | 'jumbo' | 'ineligible';
}

/**
 * Get loan limits for a specific county
 */
export function getCountyLoanLimits(state: string, county: string): CountyLimits {
  const stateData = countyLimitsData.limits[state as keyof typeof countyLimitsData.limits];
  
  if (stateData) {
    const countyData = stateData[county as keyof typeof stateData];
    if (countyData) {
      return countyData as CountyLimits;
    }
  }
  
  // Return default limits if county not found
  return countyLimitsData.limits.DEFAULT as CountyLimits;
}

/**
 * Determine loan type based on loan amount and county limits
 */
export function determineLoanType(
  loanAmount: number,
  state: string,
  county: string
): LoanLimitResult {
  const limits = getCountyLoanLimits(state, county);
  
  let loanType: LoanLimitResult['loanType'] = 'ineligible';
  
  if (loanAmount <= limits.conforming) {
    loanType = 'conforming';
  } else if (loanAmount <= limits.highBalance) {
    loanType = 'high-balance';
  } else {
    loanType = 'jumbo';
  }
  
  return {
    conformingLimit: limits.conforming,
    highBalanceLimit: limits.highBalance,
    loanType,
  };
}

/**
 * Get property tax rate for a specific county
 */
export function getCountyTaxRate(state: string, county: string): number {
  const stateData = taxRatesData.rates[state as keyof typeof taxRatesData.rates];
  
  if (stateData) {
    const countyRate = stateData[county as keyof typeof stateData];
    if (countyRate !== undefined) {
      return countyRate as number;
    }
  }
  
  // Return default rate if county not found
  return taxRatesData.rates.DEFAULT as number;
}

/**
 * Get available counties for a state
 */
export function getCountiesForState(state: string): string[] {
  const stateData = countyLimitsData.limits[state as keyof typeof countyLimitsData.limits];
  
  if (stateData && typeof stateData === 'object') {
    return Object.keys(stateData).sort();
  }
  
  return [];
}

/**
 * Get all available states (California only for this version)
 */
export function getAvailableStates(): string[] {
  return ['CA']; // Only California supported
}
