/**
 * Fannie Mae Conventional Loan Qualification Assessment
 * Based on Fannie Mae Selling Guide standards
 */

export type QualificationResult = 
  | 'appears-qualified'
  | 'may-qualify'
  | 'needs-work'
  | 'not-enough-info';

export interface QualificationInput {
  purchasePrice: number;
  downPayment: number;
  loanAmount: number;
  ltv: number;
  fico: number;
  monthlyIncome: number;
  monthlyDebts: number;
  propertyTax: number;
  insurance: number;
  pmi: number;
  hoa: number;
  occupancy: 'primary' | 'secondary' | 'investment';
  county?: string;
}

export interface QualificationOutput {
  result: QualificationResult;
  resultLabel: string;
  keyMetrics: {
    purchasePrice: number;
    loanAmount: number;
    ltv: number;
    estimatedPayment: number;
    dti: number;
    housingRatio: number;
  };
  explanation: string;
  fannieMaeAlignment: string;
  itemsNeeded: string[];
  nextStep: string;
  flags: string[];
}

/**
 * Assess borrower qualification based on Fannie Mae guidelines
 */
export function assessQualification(input: QualificationInput): QualificationOutput {
  const {
    purchasePrice,
    downPayment,
    loanAmount,
    ltv,
    fico,
    monthlyIncome,
    monthlyDebts,
    propertyTax,
    insurance,
    pmi,
    hoa,
    occupancy,
    county
  } = input;

  // Calculate total housing payment (PITI + MI + HOA)
  const estimatedPI = estimatePrincipalAndInterest(loanAmount, 6.75, 30); // Using 6.75% as estimate
  const totalHousingPayment = estimatedPI + propertyTax + insurance + pmi + hoa;
  
  // Calculate DTI ratios
  const housingRatio = monthlyIncome > 0 ? (totalHousingPayment / monthlyIncome) * 100 : 0;
  const dti = monthlyIncome > 0 ? ((totalHousingPayment + monthlyDebts) / monthlyIncome) * 100 : 0;

  // Calculate down payment percentage
  const downPaymentPercent = purchasePrice > 0 ? (downPayment / purchasePrice) * 100 : 0;

  // Check 2026 conforming loan limits
  const conformingLimit = 826350; // 2026 baseline
  const isConforming = loanAmount <= conformingLimit;

  // Collect flags
  const flags: string[] = [];
  
  if (fico < 620) flags.push('Credit score below conventional minimum (620)');
  if (fico >= 620 && fico < 680) flags.push('Credit score acceptable but may affect pricing');
  if (ltv > 97) flags.push('LTV exceeds 97% (max for conventional)');
  if (ltv > 80) flags.push('PMI required (LTV > 80%)');
  if (dti > 50) flags.push('DTI exceeds 50% (requires strong compensating factors)');
  if (dti > 45 && dti <= 50) flags.push('DTI between 45-50% (may need DU approval)');
  if (downPaymentPercent < 3) flags.push('Down payment below 3% minimum');
  if (!isConforming) flags.push(`Loan amount exceeds conforming limit ($${conformingLimit.toLocaleString()})`);
  if (occupancy === 'investment' && ltv > 80) flags.push('Investment property with LTV > 80% not allowed');

  // Determine qualification result
  let result: QualificationResult;
  let resultLabel: string;
  let explanation: string;
  let fannieMaeAlignment: string;
  let nextStep: string;

  // Check for missing critical data
  if (purchasePrice === 0 || monthlyIncome === 0 || fico === 0) {
    result = 'not-enough-info';
    resultLabel = 'Not Enough Information';
    explanation = 'We need more information to assess qualification. Critical data like purchase price, income, or credit score is missing.';
    fannieMaeAlignment = 'Cannot assess Fannie Mae alignment without complete borrower profile.';
    nextStep = 'Gather complete borrower information including verified income, credit score, and purchase details.';
  }
  // Appears Qualified
  else if (
    fico >= 700 &&
    dti <= 45 &&
    ltv <= 97 &&
    downPaymentPercent >= 3 &&
    isConforming &&
    (occupancy !== 'investment' || ltv <= 80)
  ) {
    result = 'appears-qualified';
    resultLabel = 'Appears Qualified';
    explanation = `This looks like a strong conventional loan scenario. With a ${fico} credit score and ${dti.toFixed(1)}% DTI, this borrower fits well within Fannie Mae standards. ${downPaymentPercent.toFixed(1)}% down payment is solid${ltv > 80 ? ', though PMI will be required until reaching 80% LTV' : ' and eliminates PMI'}.`;
    fannieMaeAlignment = `This scenario aligns with Fannie Mae conventional guidelines. Credit score exceeds the 620 minimum, DTI is within the 45% target range, and LTV is acceptable. ${isConforming ? 'Loan amount is within conforming limits.' : ''}`;
    nextStep = 'Move forward with full application. Request paystubs, bank statements, tax returns, and preliminary title work.';
  }
  // May Qualify
  else if (
    fico >= 620 &&
    fico < 700 &&
    dti <= 50 &&
    ltv <= 97 &&
    downPaymentPercent >= 3 &&
    isConforming
  ) {
    result = 'may-qualify';
    resultLabel = 'May Qualify';
    explanation = `This scenario is workable but will need careful structuring. With a ${fico} credit score${dti > 45 ? ` and ${dti.toFixed(1)}% DTI` : ''}, we'll likely need Desktop Underwriter (DU) approval with compensating factors. ${ltv > 80 ? `PMI will be required and the rate will be higher due to the credit profile.` : ''}`;
    fannieMaeAlignment = `Falls within Fannie Mae guidelines but sits in a higher risk tier. Credit meets the 620 minimum${dti > 45 ? ', though DTI is elevated and may require strong compensating factors like reserves or stable employment history' : ''}. Automated underwriting (DU) will determine if this qualifies.`;
    nextStep = 'Run through Desktop Underwriter to see if we get an approve/eligible finding. May need to structure with lower DTI or bring compensating factors.';
  }
  // Needs Work
  else if (
    fico < 620 ||
    dti > 50 ||
    ltv > 97 ||
    downPaymentPercent < 3 ||
    !isConforming ||
    (occupancy === 'investment' && ltv > 80)
  ) {
    result = 'needs-work';
    resultLabel = 'Needs Work';
    
    const issues: string[] = [];
    if (fico < 620) issues.push('credit score needs to improve to at least 620');
    if (dti > 50) issues.push('debt-to-income ratio needs to come down');
    if (ltv > 97) issues.push('down payment needs to increase');
    if (downPaymentPercent < 3) issues.push('minimum 3% down payment required');
    if (!isConforming) issues.push('loan amount exceeds conforming limits');
    if (occupancy === 'investment' && ltv > 80) issues.push('investment properties require 20% down minimum');

    explanation = `This scenario doesn't qualify for conventional financing as structured. ${issues.join('; ')}.${fico < 620 ? ' FHA might be a better option with a 580+ credit score.' : ''}`;
    fannieMaeAlignment = `Does not meet Fannie Mae conventional requirements in current form. ${fico < 620 ? 'Credit score is below the 620 conventional baseline.' : ''} ${dti > 50 ? 'DTI exceeds acceptable range even with compensating factors.' : ''}`;
    
    if (fico < 620 && fico >= 580) {
      nextStep = 'Explore FHA financing as an alternative, which allows 580+ credit scores with 3.5% down.';
    } else if (dti > 50) {
      nextStep = 'Work on reducing monthly debt obligations or increase income. Consider paying down high-balance accounts.';
    } else if (!isConforming) {
      nextStep = 'Consider a jumbo loan program or reduce purchase price to fit within conforming limits.';
    } else {
      nextStep = 'Address the qualification issues and revisit. May need restructuring or alternative loan program.';
    }
  }
  // Default fallback
  else {
    result = 'may-qualify';
    resultLabel = 'May Qualify';
    explanation = 'This scenario has potential but will require careful review and possibly some adjustments.';
    fannieMaeAlignment = 'Within Fannie Mae parameters but needs full underwriting review.';
    nextStep = 'Submit for full underwriting review and automated underwriting system (DU) analysis.';
  }

  // Items needed for all scenarios
  const itemsNeeded = [
    'Paystubs (most recent 30 days)',
    'W-2s (past 2 years)',
    'Tax returns (past 2 years if self-employed)',
    'Bank statements (most recent 2 months, all pages)',
    'Photo ID',
    'Purchase agreement (when available)',
    'Pre-qualification letter for offer',
  ];

  if (ltv > 95) {
    itemsNeeded.push('Gift letter if using gift funds for down payment');
  }

  if (downPaymentPercent < 5) {
    itemsNeeded.push('Proof of reserves (2+ months PITI recommended)');
  }

  return {
    result,
    resultLabel,
    keyMetrics: {
      purchasePrice,
      loanAmount,
      ltv: Math.round(ltv * 100) / 100,
      estimatedPayment: Math.round(totalHousingPayment),
      dti: Math.round(dti * 10) / 10,
      housingRatio: Math.round(housingRatio * 10) / 10,
    },
    explanation,
    fannieMaeAlignment,
    itemsNeeded,
    nextStep,
    flags,
  };
}

/**
 * Estimate P&I payment
 */
function estimatePrincipalAndInterest(
  loanAmount: number,
  annualRate: number,
  termYears: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  
  if (monthlyRate === 0) return loanAmount / numPayments;
  
  const pi = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
    (Math.pow(1 + monthlyRate, numPayments) - 1);
    
  return Math.round(pi * 100) / 100;
}
