import { ScenarioInput } from './schemas';
import { determineLoanType } from './county-lookup';

export type FlagSeverity = 'error' | 'warn' | 'info';

export interface GuidelineFlag {
  severity: FlagSeverity;
  code: string;
  message: string;
  reference?: string;
}

export interface RuleCheckContext {
  loanAmount: number;
  ltv: number;
  dti: number;
  housingRatio: number;
  fico: number;
  loanType: 'conforming' | 'high-balance' | 'jumbo' | 'ineligible';
  occupancy: string;
  propertyType: string;
  miRequired: boolean;
  bankruptcyHistory: string;
  foreclosureHistory: string;
  latePayments: string;
  monthsReserves: number;
  hasLandlordExperience: boolean;
  childSupportMonthly: number;
  selfEmployedMonthly: number;
  selfEmployedYears: number;
  propertiesOwned: number;
  hasLegalADU: boolean;
  aduRentalIncome: number;
  isFirstTimeHomeBuyer: boolean;
  annualIncome: number;
  county: string;
  state: string;
}

/**
 * Rules engine configuration
 * Each rule returns an array of flags (empty if passes)
 */
type RuleCheck = (context: RuleCheckContext, input: ScenarioInput) => GuidelineFlag[];

const rules: RuleCheck[] = [
  // DTI Rules
  (context) => {
    const flags: GuidelineFlag[] = [];
    
    if (context.dti > 50) {
      flags.push({
        severity: 'error',
        code: 'DTI_EXCEEDED',
        message: `DTI ratio ${context.dti.toFixed(2)}% exceeds maximum 50%`,
        reference: 'Fannie Mae Selling Guide B3-6-02',
      });
    } else if (context.dti > 45) {
      flags.push({
        severity: 'warn',
        code: 'DTI_HIGH',
        message: `DTI ratio ${context.dti.toFixed(2)}% is elevated. Additional compensating factors may be required.`,
        reference: 'Fannie Mae Selling Guide B3-6-02',
      });
    }
    
    return flags;
  },

  // FICO Score Rules
  (context) => {
    const flags: GuidelineFlag[] = [];
    
    if (context.fico < 620) {
      flags.push({
        severity: 'error',
        code: 'FICO_BELOW_MIN',
        message: `FICO score ${context.fico} is below minimum 620 for conventional financing`,
        reference: 'Fannie Mae Selling Guide B3-5.1-01',
      });
    } else if (context.fico < 680) {
      flags.push({
        severity: 'warn',
        code: 'FICO_LOW',
        message: `FICO score ${context.fico} may require higher down payment or pricing adjustments`,
        reference: 'Fannie Mae Selling Guide B3-5.1-01',
      });
    }
    
    return flags;
  },

  // LTV Rules
  (context) => {
    const flags: GuidelineFlag[] = [];
    
    if (context.ltv > 97) {
      flags.push({
        severity: 'error',
        code: 'LTV_EXCEEDED',
        message: `LTV ${context.ltv.toFixed(2)}% exceeds maximum 97%`,
        reference: 'Fannie Mae Selling Guide B5-1.1-01',
      });
    } else if (context.ltv > 95 && context.occupancy !== 'primary') {
      flags.push({
        severity: 'error',
        code: 'LTV_OCCUPANCY',
        message: `LTV ${context.ltv.toFixed(2)}% exceeds maximum for ${context.occupancy} residence`,
        reference: 'Fannie Mae Selling Guide B5-1.1-01',
      });
    } else if (context.ltv > 80) {
      flags.push({
        severity: 'info',
        code: 'MI_REQUIRED',
        message: `Mortgage insurance required for LTV ${context.ltv.toFixed(2)}% (above 80%)`,
        reference: 'Fannie Mae Selling Guide B5-1.3-02',
      });
    }
    
    return flags;
  },

  // Loan Limit Rules
  (context, input) => {
    const flags: GuidelineFlag[] = [];
    const loanLimitInfo = determineLoanType(
      context.loanAmount,
      input.property.state,
      input.property.county
    );
    
    if (context.loanType === 'jumbo') {
      flags.push({
        severity: 'error',
        code: 'LOAN_EXCEEDS_LIMIT',
        message: `Loan amount $${context.loanAmount.toLocaleString()} exceeds high-balance limit of $${loanLimitInfo.highBalanceLimit.toLocaleString()} for ${input.property.county}, ${input.property.state}`,
        reference: 'Fannie Mae Conforming Loan Limits',
      });
    } else if (context.loanType === 'high-balance') {
      flags.push({
        severity: 'info',
        code: 'HIGH_BALANCE_LOAN',
        message: `This is a high-balance loan. Loan amount exceeds conforming limit of $${loanLimitInfo.conformingLimit.toLocaleString()} but is within high-balance limit of $${loanLimitInfo.highBalanceLimit.toLocaleString()}`,
        reference: 'Fannie Mae High-Balance Loan Guidelines',
      });
    }
    
    return flags;
  },

  // Occupancy Rules
  (context) => {
    const flags: GuidelineFlag[] = [];
    
    if (context.occupancy === 'investment' && context.ltv > 80) {
      flags.push({
        severity: 'warn',
        code: 'INVESTMENT_LTV_HIGH',
        message: `Investment properties typically limited to 80% LTV for standard financing`,
        reference: 'Fannie Mae Selling Guide B5-1.1-02',
      });
    }
    
    if (context.occupancy === 'secondary' && context.ltv > 90) {
      flags.push({
        severity: 'error',
        code: 'SECOND_HOME_LTV',
        message: `Second homes typically limited to 90% LTV maximum`,
        reference: 'Fannie Mae Selling Guide B5-1.1-02',
      });
    }
    
    return flags;
  },

  // Housing Ratio Rules
  (context) => {
    const flags: GuidelineFlag[] = [];
    
    if (context.housingRatio > 28) {
      flags.push({
        severity: 'info',
        code: 'HOUSING_RATIO_HIGH',
        message: `Front-end ratio ${context.housingRatio.toFixed(2)}% exceeds traditional 28% guideline`,
        reference: 'Traditional housing ratio guidance',
      });
    }
    
    return flags;
  },

  // Combined DTI/LTV Rules
  (context) => {
    const flags: GuidelineFlag[] = [];
    
    if (context.dti > 43 && context.ltv > 90) {
      flags.push({
        severity: 'warn',
        code: 'HIGH_RISK_COMBINATION',
        message: `High DTI (${context.dti.toFixed(2)}%) combined with high LTV (${context.ltv.toFixed(2)}%) may require additional scrutiny`,
        reference: 'Fannie Mae Selling Guide B3-6-02',
      });
    }
    
    return flags;
  },

  // Bankruptcy Rules
  (context) => {
    const flags: GuidelineFlag[] = [];
    
    if (context.bankruptcyHistory === 'chapter7-2to4') {
      flags.push({
        severity: 'warn',
        code: 'BANKRUPTCY_RECENT',
        message: `Chapter 7 bankruptcy within 2-4 years requires re-established credit and compensating factors`,
        reference: 'Fannie Mae Selling Guide B3-6-01',
      });
    } else if (context.bankruptcyHistory === 'chapter7-4plus') {
      flags.push({
        severity: 'info',
        code: 'BANKRUPTCY_SEASONED',
        message: `Chapter 7 bankruptcy over 4 years old - credit should be re-established`,
        reference: 'Fannie Mae Selling Guide B3-6-01',
      });
    } else if (context.bankruptcyHistory === 'chapter13-active') {
      flags.push({
        severity: 'warn',
        code: 'CHAPTER13_ACTIVE',
        message: `Active Chapter 13 bankruptcy requires trustee permission and 12+ months payment history`,
        reference: 'Fannie Mae Selling Guide B3-6-01',
      });
    }
    
    return flags;
  },

  // Foreclosure Rules
  (context) => {
    const flags: GuidelineFlag[] = [];
    
    if (context.foreclosureHistory === '3to5-years') {
      flags.push({
        severity: 'error',
        code: 'FORECLOSURE_RECENT',
        message: `Foreclosure within 3-5 years typically requires 5-7 year waiting period`,
        reference: 'Fannie Mae Selling Guide B3-6-02',
      });
    } else if (context.foreclosureHistory === '5to7-years') {
      flags.push({
        severity: 'warn',
        code: 'FORECLOSURE_SEASONED',
        message: `Foreclosure 5-7 years old may qualify with re-established credit and compensating factors`,
        reference: 'Fannie Mae Selling Guide B3-6-02',
      });
    } else if (context.foreclosureHistory === '7plus-years') {
      flags.push({
        severity: 'info',
        code: 'FORECLOSURE_OLD',
        message: `Foreclosure over 7 years old - impact minimal with good payment history since`,
        reference: 'Fannie Mae Selling Guide B3-6-02',
      });
    }
    
    return flags;
  },

  // Late Payment Rules
  (context) => {
    const flags: GuidelineFlag[] = [];
    
    if (context.latePayments === 'recent-90plus') {
      flags.push({
        severity: 'error',
        code: 'LATE_PAYMENTS_SEVERE',
        message: `Recent 90+ day late payments may disqualify or require significant compensating factors`,
        reference: 'Fannie Mae Selling Guide B3-5.3-01',
      });
    } else if (context.latePayments === 'recent-60day') {
      flags.push({
        severity: 'warn',
        code: 'LATE_PAYMENTS_MODERATE',
        message: `Recent 60-day late payments will increase MI rates and require explanation`,
        reference: 'Fannie Mae Selling Guide B3-5.3-01',
      });
    } else if (context.latePayments === 'minor-30day') {
      flags.push({
        severity: 'info',
        code: 'LATE_PAYMENTS_MINOR',
        message: `Minor 30-day late payments noted - may affect MI pricing`,
        reference: 'Fannie Mae Selling Guide B3-5.3-01',
      });
    }
    
    return flags;
  },

  // Self-Employment Rules
  (context) => {
    const flags: GuidelineFlag[] = [];
    
    if (context.selfEmployedMonthly > 0 && context.selfEmployedYears < 2) {
      flags.push({
        severity: 'warn',
        code: 'SELF_EMPLOYED_NEW',
        message: `Self-employment income under 2 years requires additional documentation and may not be fully counted`,
        reference: 'Fannie Mae Selling Guide B3-3.2-01',
      });
    } else if (context.selfEmployedMonthly > 0 && context.selfEmployedYears >= 2) {
      flags.push({
        severity: 'info',
        code: 'SELF_EMPLOYED_DOCS',
        message: `Self-employment income requires 2 years tax returns and YTD profit/loss statement`,
        reference: 'Fannie Mae Selling Guide B3-3.2-01',
      });
    }
    
    return flags;
  },

  // Child Support Rules  
  (context) => {
    const flags: GuidelineFlag[] = [];
    
    if (context.childSupportMonthly > 0) {
      flags.push({
        severity: 'info',
        code: 'CHILD_SUPPORT_OBLIGATION',
        message: `Child support obligation of $${context.childSupportMonthly.toLocaleString()}/month included in DTI calculation`,
        reference: 'Fannie Mae Selling Guide B3-6-05',
      });
    }
    
    return flags;
  },

  // Investment Property Reserves Rules
  (context) => {
    const flags: GuidelineFlag[] = [];
    
    if (context.occupancy === 'investment') {
      const requiredReserves = 6; // Standard 6 months for investment properties
      
      if (context.monthsReserves < requiredReserves) {
        flags.push({
          severity: 'error',
          code: 'INSUFFICIENT_RESERVES',
          message: `Investment properties require ${requiredReserves} months reserves. You have ${context.monthsReserves} months.`,
          reference: 'Fannie Mae Selling Guide B3-4.3-01',
        });
      } else {
        flags.push({
          severity: 'info',
          code: 'RESERVES_ADEQUATE',
          message: `Reserves of ${context.monthsReserves} months meet ${requiredReserves} month requirement for investment properties`,
          reference: 'Fannie Mae Selling Guide B3-4.3-01',
        });
      }
      
      if (!context.hasLandlordExperience && context.ltv > 75) {
        flags.push({
          severity: 'warn',
          code: 'NO_LANDLORD_EXPERIENCE',
          message: `First-time landlords with LTV > 75% may face stricter requirements`,
          reference: 'Fannie Mae Selling Guide B5-1.1-02',
        });
      }
    }
    
    return flags;
  },

  // Multiple Properties Rules
  (context) => {
    const flags: GuidelineFlag[] = [];
    
    if (context.propertiesOwned >= 4 && context.propertiesOwned < 10) {
      flags.push({
        severity: 'warn',
        code: 'MULTIPLE_PROPERTIES_4TO10',
        message: `You own ${context.propertiesOwned} properties. Additional reserves and scrutiny required for 4-10 financed properties`,
        reference: 'Fannie Mae Selling Guide B3-4.3-01',
      });
    } else if (context.propertiesOwned >= 10) {
      flags.push({
        severity: 'error',
        code: 'MULTIPLE_PROPERTIES_10PLUS',
        message: `You own ${context.propertiesOwned} properties. Special portfolio loan requirements apply for 10+ financed properties`,
        reference: 'Fannie Mae Selling Guide B3-4.3-01',
      });
    }
    
    // Increased reserve requirements for multiple properties
    if (context.propertiesOwned >= 4 && context.occupancy === 'primary') {
      const requiredReserves = 2 + (context.propertiesOwned - 3); // Additional reserves for each property
      flags.push({
        severity: 'info',
        code: 'MULTIPLE_PROPERTIES_RESERVES',
        message: `With ${context.propertiesOwned} properties, recommend ${requiredReserves} months reserves for this purchase`,
        reference: 'Fannie Mae Selling Guide B3-4.3-01',
      });
    }
    
    return flags;
  },

  // ADU (Accessory Dwelling Unit) Rules
  (context) => {
    const flags: GuidelineFlag[] = [];
    
    if (context.hasLegalADU) {
      if (context.aduRentalIncome > 0) {
        flags.push({
          severity: 'info',
          code: 'ADU_RENTAL_INCOME',
          message: `ADU rental income of $${context.aduRentalIncome.toLocaleString()}/month can be counted (typically 75%) with proper documentation`,
          reference: 'Fannie Mae Selling Guide B3-3.1-08',
        });
        
        // Require appraisal to confirm legal ADU
        flags.push({
          severity: 'info',
          code: 'ADU_DOCUMENTATION',
          message: `Legal ADU must be documented in appraisal. Requires permits, separate entrance, kitchen, and bathroom`,
          reference: 'Fannie Mae Selling Guide B3-3.1-08',
        });
      } else {
        flags.push({
          severity: 'info',
          code: 'ADU_NO_INCOME',
          message: `Property has legal ADU but no rental income entered. ADU can provide qualifying income if rented`,
          reference: 'Fannie Mae Selling Guide B3-3.1-08',
        });
      }
    }
    
    return flags;
  },

  // First-Time Home Buyer Rules
  (context) => {
    const flags: GuidelineFlag[] = [];
    
    if (context.isFirstTimeHomeBuyer && context.occupancy === 'primary') {
      flags.push({
        severity: 'info',
        code: 'FIRST_TIME_HOMEBUYER_BENEFITS',
        message: `As a first-time homebuyer, you may qualify for HomeReady (3% down) or state/local assistance programs`,
        reference: 'Fannie Mae Selling Guide B5-6-02',
      });
      
      // First-time buyer with low down payment
      if (context.ltv > 95) {
        flags.push({
          severity: 'info',
          code: 'FIRST_TIME_HOMEBUYER_EDUCATION',
          message: `First-time buyers with >95% LTV should complete homeownership education course (may be required for some programs)`,
          reference: 'Fannie Mae Selling Guide B5-6-02',
        });
      }
    }
    
    // First-time buyer but owns other properties (conflicting)
    if (context.isFirstTimeHomeBuyer && context.propertiesOwned > 0) {
      flags.push({
        severity: 'warn',
        code: 'FIRST_TIME_BUYER_CONFLICT',
        message: `Marked as first-time buyer but owns ${context.propertiesOwned} properties. First-time buyer definition: Has not owned home in past 3 years`,
        reference: 'Fannie Mae Selling Guide B5-6-02',
      });
    }
    
    return flags;
  },

  // Income Limit Programs (HomeReady / Home Possible)
  (context) => {
    const flags: GuidelineFlag[] = [];
    
    // Only check for primary residence
    if (context.occupancy !== 'primary') {
      return flags;
    }
    
    // Import income limits utility (this would need to be imported at top of file)
    // For now, we'll use simplified logic
    const countyLimits: Record<string, number> = {
      'Santa Clara': 188000,
      'San Francisco': 174000,
      'San Mateo': 188000,
      'Marin': 174000,
      'Los Angeles': 108000,
      'Orange': 144000,
      'San Diego': 126000,
      'Alameda': 137000,
      'Contra Costa': 137000,
      'Sacramento': 112000,
      'DEFAULT': 100000,
    };
    
    const amiLimit = countyLimits[context.county] || countyLimits['DEFAULT'];
    const incomePercent = (context.annualIncome / amiLimit) * 100;
    
    // Check HomeReady eligibility
    if (context.annualIncome <= amiLimit && context.fico >= 620 && context.ltv <= 97) {
      flags.push({
        severity: 'info',
        code: 'HOMEREADY_ELIGIBLE',
        message: `You may qualify for HomeReady! Income at ${incomePercent.toFixed(0)}% of AMI ($${amiLimit.toLocaleString()}). Benefits: 97% LTV, reduced MI, 3% down`,
        reference: 'Fannie Mae Selling Guide B5-6-02',
      });
    } else if (context.annualIncome <= amiLimit && context.fico >= 660 && context.ltv <= 97) {
      flags.push({
        severity: 'info',
        code: 'HOMEPOSSIBLE_ELIGIBLE',
        message: `You may qualify for Home Possible! Income at ${incomePercent.toFixed(0)}% of AMI ($${amiLimit.toLocaleString()}). Benefits: 97% LTV, reduced MI`,
        reference: 'Freddie Mac Home Possible',
      });
    } else if (context.annualIncome > amiLimit && context.ltv > 95) {
      flags.push({
        severity: 'info',
        code: 'INCOME_ABOVE_AMI',
        message: `Income ($${context.annualIncome.toLocaleString()}) exceeds ${context.county} County AMI limit ($${amiLimit.toLocaleString()}). Not eligible for HomeReady/Home Possible`,
        reference: 'Fannie Mae Selling Guide B5-6-02',
      });
    }
    
    return flags;
  },
];

/**
 * Run all rules and collect flags
 */
export function evaluateGuidelines(
  context: RuleCheckContext,
  input: ScenarioInput
): GuidelineFlag[] {
  const allFlags: GuidelineFlag[] = [];
  
  for (const rule of rules) {
    const flags = rule(context, input);
    allFlags.push(...flags);
  }
  
  // Sort by severity: error, warn, info
  return allFlags.sort((a, b) => {
    const severityOrder = { error: 0, warn: 1, info: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}
