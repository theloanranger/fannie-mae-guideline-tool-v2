import { z } from 'zod';

// Step 1: Borrower Income
export const borrowerSchema = z.object({
  // W-2 Income
  w2BaseAnnual: z.number().min(0, 'Base income must be positive').max(10000000, 'Base income too high').default(0),
  bonusAnnual: z.number().min(0).max(5000000).optional().default(0),
  overtimeAnnual: z.number().min(0).max(5000000).optional().default(0),
  
  // Self-Employed Income
  selfEmployedMonthly: z.number().min(0).max(500000).optional().default(0),
  selfEmployedYears: z.number().min(0).max(50).optional().default(0),
  
  // Other Income
  rentalIncomeMonthly: z.number().min(0).max(100000).optional().default(0),
  investmentIncomeMonthly: z.number().min(0).max(100000).optional().default(0),
  pensionMonthly: z.number().min(0).max(100000).optional().default(0),
  socialSecurityMonthly: z.number().min(0).max(50000).optional().default(0),
  alimonyMonthly: z.number().min(0).max(50000).optional().default(0),
  otherIncomeMonthly: z.number().min(0).max(100000).optional().default(0),
});

// Step 2: Credit
export const creditSchema = z.object({
  fico: z.number().min(300, 'FICO must be at least 300').max(850, 'FICO cannot exceed 850'),
  numberOfBorrowers: z.number().int().min(1, 'At least 1 borrower required').max(4, 'Maximum 4 borrowers'),
  
  // Credit History / Risk Factors
  bankruptcyHistory: z.enum(['none', 'chapter7-4plus', 'chapter7-2to4', 'chapter13-discharged', 'chapter13-active'], {
    errorMap: () => ({ message: 'Select bankruptcy history' }),
  }).default('none'),
  foreclosureHistory: z.enum(['none', '7plus-years', '5to7-years', '3to5-years'], {
    errorMap: () => ({ message: 'Select foreclosure history' }),
  }).default('none'),
  latePayments: z.enum(['none', 'minor-30day', 'recent-60day', 'recent-90plus'], {
    errorMap: () => ({ message: 'Select late payment history' }),
  }).default('none'),
});

// Step 3: Property
export const propertySchema = z.object({
  state: z.string().min(2, 'State is required').max(2, 'Use 2-letter state code'),
  county: z.string().min(1, 'County is required').max(100),
  purchasePrice: z.number().min(50000, 'Purchase price too low').max(25000000, 'Purchase price too high'),
  downPayment: z.number().min(0, 'Down payment cannot be negative'),
  occupancy: z.enum(['primary', 'secondary', 'investment'], {
    errorMap: () => ({ message: 'Invalid occupancy type' }),
  }),
  propertyType: z.enum(['single-family', 'condo', 'townhouse', 'multi-unit'], {
    errorMap: () => ({ message: 'Invalid property type' }),
  }).default('single-family'),
  
  // Property ownership and features
  propertiesOwned: z.number().int().min(0).max(10).default(0),
  hasLegalADU: z.boolean().default(false),
  aduRentalIncome: z.number().min(0).max(10000).optional().default(0),
  isFirstTimeHomeBuyer: z.boolean().default(false),
});

// Step 4: Loan
export const loanSchema = z.object({
  term: z.enum(['10', '15', '20', '25', '30'], {
    errorMap: () => ({ message: 'Term must be 10, 15, 20, 25, or 30 years' }),
  }),
  interestRate: z.number()
    .min(0.125, 'Interest rate must be at least 0.125%')
    .max(20, 'Interest rate cannot exceed 20%')
    .refine(
      (val) => {
        // Check if the rate is a multiple of 0.125 (1/8th of a percent)
        const multiplier = val / 0.125;
        return Math.abs(multiplier - Math.round(multiplier)) < 0.0001;
      },
      { message: 'Interest rate must be in 1/8th percent increments (e.g., 5.500, 5.625, 5.750, 5.875, 6.000)' }
    ),
  hoaMonthly: z.number().min(0, 'HOA fee cannot be negative').max(10000, 'HOA fee too high').default(0),
  insuranceMonthly: z.number().min(0, 'Insurance cannot be negative').max(5000).optional(),
  taxRateOverride: z.number().min(0).max(0.05).optional(), // Override as decimal (e.g., 0.012 = 1.2%)
});

// Step 5: Debts
export const debtsSchema = z.object({
  creditCards: z.number().min(0).default(0),
  autoLoans: z.number().min(0).default(0),
  studentLoans: z.number().min(0).default(0),
  childSupportMonthly: z.number().min(0).default(0),
  alimonyPaymentMonthly: z.number().min(0).default(0),
  otherDebts: z.number().min(0).default(0),
  
  // Investment Property Specific
  monthsReserves: z.number().min(0).max(24).default(0),
  hasLandlordExperience: z.boolean().default(false),
});

// Combined scenario schema
export const scenarioSchema = z.object({
  borrower: borrowerSchema,
  credit: creditSchema,
  property: propertySchema,
  loan: loanSchema,
  debts: debtsSchema,
});

// Types inferred from schemas
export type BorrowerInput = z.infer<typeof borrowerSchema>;
export type CreditInput = z.infer<typeof creditSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type LoanInput = z.infer<typeof loanSchema>;
export type DebtsInput = z.infer<typeof debtsSchema>;
export type ScenarioInput = z.infer<typeof scenarioSchema>;
