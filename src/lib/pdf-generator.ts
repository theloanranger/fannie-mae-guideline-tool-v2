import { jsPDF } from 'jspdf';
import { ScenarioInput } from './schemas';
import { GuidelineFlag } from './rules-engine';

export interface ScenarioResults {
  grossMonthlyIncome: number;
  loanAmount: number;
  principalAndInterest: number;
  propertyTaxMonthly: number;
  insuranceMonthly: number;
  hoaMonthly: number;
  miMonthly: number;
  totalPITI: number;
  totalMonthlyDebt: number;
  dti: number;
  housingRatio: number;
  ltv: number;
  loanType: string;
  flags: GuidelineFlag[];
}

export function generateScenarioPDF(
  input: ScenarioInput,
  results: ScenarioResults,
  borrowerInitials: string
): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // Helper function to add text with word wrap
  const addText = (text: string, size: number = 10, isBold: boolean = false) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
    doc.text(lines, margin, yPos);
    yPos += lines.length * (size * 0.4) + 2;
  };

  const addLine = () => {
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 5;
  };

  const addSpace = (space: number = 5) => {
    yPos += space;
  };

  // Title
  addText('MORTGAGE SCENARIO SUMMARY', 16, true);
  addText(`Generated: ${new Date().toLocaleString()}`, 9);
  addSpace(3);
  addLine();

  // Disclaimer
  addSpace(3);
  doc.setFillColor(255, 243, 205);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 25, 'F');
  yPos += 5;
  addText('DISCLAIMER: This is an estimate tool only, not a loan approval or commitment. Actual loan terms, rates, and approval are subject to full underwriting review and may differ from these estimates.', 8);
  addSpace(8);

  // Borrower Info
  addText('BORROWER INFORMATION', 12, true);
  addText(`Initials: ${borrowerInitials}`, 10);
  addText(`Number of Borrowers: ${input.credit.numberOfBorrowers}`, 10);
  addText(`Representative FICO: ${input.credit.fico}`, 10);
  addSpace(5);
  addLine();

  // Income Summary
  addSpace(3);
  addText('INCOME SUMMARY', 12, true);
  addText(`Base Annual Income: $${input.borrower.w2BaseAnnual.toLocaleString()}`, 10);
  if (input.borrower.bonusAnnual) {
    addText(`Bonus Annual: $${input.borrower.bonusAnnual.toLocaleString()}`, 10);
  }
  if (input.borrower.overtimeAnnual) {
    addText(`Overtime Annual: $${input.borrower.overtimeAnnual.toLocaleString()}`, 10);
  }
  addText(`Gross Monthly Income: $${results.grossMonthlyIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 10, true);
  addSpace(5);
  addLine();

  // Property Details
  addSpace(3);
  addText('PROPERTY DETAILS', 12, true);
  addText(`Location: ${input.property.county}, ${input.property.state}`, 10);
  addText(`Purchase Price: $${input.property.purchasePrice.toLocaleString()}`, 10);
  addText(`Down Payment: $${input.property.downPayment.toLocaleString()} (${((input.property.downPayment / input.property.purchasePrice) * 100).toFixed(2)}%)`, 10);
  addText(`Property Type: ${input.property.propertyType}`, 10);
  addText(`Occupancy: ${input.property.occupancy}`, 10);
  addSpace(5);
  addLine();

  // Loan Details
  addSpace(3);
  addText('LOAN DETAILS', 12, true);
  addText(`Loan Amount: $${results.loanAmount.toLocaleString()}`, 10, true);
  addText(`Loan Type: ${results.loanType}`, 10);
  addText(`Term: ${input.loan.term} years`, 10);
  addText(`Interest Rate: ${input.loan.interestRate}%`, 10);
  addText(`LTV: ${results.ltv.toFixed(2)}%`, 10);
  addSpace(5);
  addLine();

  // Check if new page needed
  if (yPos > 240) {
    doc.addPage();
    yPos = 20;
  }

  // Monthly Payment Breakdown
  addSpace(3);
  addText('MONTHLY PAYMENT BREAKDOWN', 12, true);
  addText(`Principal & Interest: $${results.principalAndInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 10);
  addText(`Property Tax: $${results.propertyTaxMonthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 10);
  addText(`Homeowners Insurance: $${results.insuranceMonthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 10);
  if (results.miMonthly > 0) {
    addText(`Mortgage Insurance (Est.): $${results.miMonthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 10);
  }
  if (results.hoaMonthly > 0) {
    addText(`HOA Dues: $${results.hoaMonthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 10);
  }
  addText(`Total PITI + MI + HOA: $${results.totalPITI.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 10, true);
  addSpace(5);
  addLine();

  // Debt Ratios
  addSpace(3);
  addText('DEBT RATIOS', 12, true);
  addText(`Housing Ratio (Front-end): ${results.housingRatio.toFixed(2)}%`, 10);
  addText(`Total Monthly Debts: $${results.totalMonthlyDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 10);
  addText(`Debt-to-Income Ratio: ${results.dti.toFixed(2)}%`, 10, true);
  addSpace(5);
  addLine();

  // Guideline Flags
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }

  addSpace(3);
  addText('GUIDELINE FLAGS', 12, true);
  
  if (results.flags.length === 0) {
    addText('✓ No guideline flags identified', 10);
  } else {
    results.flags.forEach((flag) => {
      const severityText = flag.severity.toUpperCase();
      const prefix = flag.severity === 'error' ? '✗' : flag.severity === 'warn' ? '⚠' : 'ℹ';
      addText(`${prefix} [${severityText}] ${flag.message}`, 9);
      if (flag.reference) {
        addText(`   Reference: ${flag.reference}`, 8);
      }
      addSpace(2);
    });
  }

  // Footer
  if (yPos > 260) {
    doc.addPage();
    yPos = 20;
  }

  addSpace(10);
  addLine();
  addSpace(3);
  
  // Santos Lending Team Contact Information
  addText('Prepared by:', 10, true);
  addText('The Santos Lending Team | Empower Home Loans', 12, true);
  addSpace(2);
  addText('Guillermo Santos, NMLS #972977', 10);
  addText('(510) 931-9114', 9);
  addText('Guillermo@empowermyloan.com', 9);
  addSpace(2);
  addText('Bishop Ranch 3, 2603 Camino Ramon, Suite 200', 8);
  addText('San Ramon, CA 94583', 8);
  addSpace(3);
  addText('This estimate is based on information provided and is subject to change. Interest rates, loan programs, and approval are subject to full underwriting review. Fannie Mae conforming loan limits and guidelines as of 2026. Licensed in California only.', 8);

  return doc;
}
