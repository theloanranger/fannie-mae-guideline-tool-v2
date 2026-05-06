import incomeLimitsData from '@/data/income-limits.json';

export interface IncomeLimitResult {
  lowIncome: number;
  moderateIncome: number;
  areaMedianIncome: number;
  qualifiesForHomeReady: boolean;
  qualifiesForHomePossible: boolean;
}

/**
 * Get income limits for a specific county
 */
export function getIncomeLimits(state: string, county: string): IncomeLimitResult {
  const stateData = incomeLimitsData.incomeLimits[state as keyof typeof incomeLimitsData.incomeLimits];
  
  if (!stateData) {
    // Return default if state not found
    const defaultData = incomeLimitsData.incomeLimits.CA.DEFAULT;
    return {
      ...defaultData,
      qualifiesForHomeReady: false,
      qualifiesForHomePossible: false,
    };
  }
  
  const countyData = stateData[county as keyof typeof stateData] || stateData.DEFAULT;
  
  return {
    ...countyData,
    qualifiesForHomeReady: false, // Will be calculated based on actual income
    qualifiesForHomePossible: false,
  };
}

/**
 * Check if borrower qualifies for HomeReady based on income and property
 */
export function checkHomeReadyEligibility(
  annualIncome: number,
  county: string,
  state: string = 'CA',
  fico: number,
  occupancy: string
): {
  eligible: boolean;
  reason?: string;
  incomeLimit: number;
  incomePercent: number;
} {
  const limits = getIncomeLimits(state, county);
  const incomePercent = (annualIncome / limits.areaMedianIncome) * 100;
  
  // Check occupancy
  if (occupancy !== 'primary') {
    return {
      eligible: false,
      reason: 'HomeReady requires primary residence',
      incomeLimit: limits.areaMedianIncome,
      incomePercent,
    };
  }
  
  // Check FICO
  if (fico < 620) {
    return {
      eligible: false,
      reason: 'HomeReady requires minimum 620 FICO',
      incomeLimit: limits.areaMedianIncome,
      incomePercent,
    };
  }
  
  // Check income limit
  if (annualIncome > limits.areaMedianIncome) {
    return {
      eligible: false,
      reason: `Income exceeds ${county} County AMI limit ($${limits.areaMedianIncome.toLocaleString()})`,
      incomeLimit: limits.areaMedianIncome,
      incomePercent,
    };
  }
  
  return {
    eligible: true,
    incomeLimit: limits.areaMedianIncome,
    incomePercent,
  };
}

/**
 * Check if borrower qualifies for Home Possible (Freddie Mac)
 */
export function checkHomePossibleEligibility(
  annualIncome: number,
  county: string,
  state: string = 'CA',
  fico: number,
  occupancy: string
): {
  eligible: boolean;
  reason?: string;
  incomeLimit: number;
  incomePercent: number;
} {
  const limits = getIncomeLimits(state, county);
  const incomePercent = (annualIncome / limits.areaMedianIncome) * 100;
  
  // Check occupancy
  if (occupancy !== 'primary') {
    return {
      eligible: false,
      reason: 'Home Possible requires primary residence',
      incomeLimit: limits.areaMedianIncome,
      incomePercent,
    };
  }
  
  // Check FICO (Home Possible requires 660, higher than HomeReady)
  if (fico < 660) {
    return {
      eligible: false,
      reason: 'Home Possible requires minimum 660 FICO',
      incomeLimit: limits.areaMedianIncome,
      incomePercent,
    };
  }
  
  // Check income limit
  if (annualIncome > limits.areaMedianIncome) {
    return {
      eligible: false,
      reason: `Income exceeds ${county} County AMI limit ($${limits.areaMedianIncome.toLocaleString()})`,
      incomeLimit: limits.areaMedianIncome,
      incomePercent,
    };
  }
  
  return {
    eligible: true,
    incomeLimit: limits.areaMedianIncome,
    incomePercent,
  };
}

/**
 * Calculate total annual income including ADU rental income
 */
export function calculateTotalAnnualIncome(
  grossMonthlyIncome: number,
  hasADU: boolean,
  aduRentalIncome: number
): number {
  // Base income
  let totalAnnual = grossMonthlyIncome * 12;
  
  // Add ADU income if applicable (75% typically counted)
  if (hasADU && aduRentalIncome > 0) {
    totalAnnual += (aduRentalIncome * 12 * 0.75);
  }
  
  return totalAnnual;
}

/**
 * Get program information
 */
export function getHomeReadyInfo() {
  return incomeLimitsData.programs.HomeReady;
}

export function getHomePossibleInfo() {
  return incomeLimitsData.programs.HomePossible;
}
