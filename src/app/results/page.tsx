'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ScenarioInput } from '@/lib/schemas';
import {
  calculatePrincipalAndInterest,
  calculateLTV,
  calculateDTI,
  calculateHousingRatio,
  calculateGrossMonthlyIncome,
  estimateMortgageInsurance,
  calculateMonthlyPropertyTax,
  estimateMonthlyInsurance,
} from '@/lib/calculations';
import { determineLoanType, getCountyTaxRate } from '@/lib/county-lookup';
import { evaluateGuidelines, GuidelineFlag } from '@/lib/rules-engine';
import { assessQualification } from '@/lib/qualification';
import QualificationDisplay from '@/components/QualificationDisplay';
import { generateScenarioPDF } from '@/lib/pdf-generator';

export default function Results() {
  const router = useRouter();
  const [scenarioData, setScenarioData] = useState<ScenarioInput | null>(null);
  const [results, setResults] = useState<any>(null);
  const [flags, setFlags] = useState<GuidelineFlag[]>([]);
  const [qualification, setQualification] = useState<any>(null);
  const [borrowerInitials, setBorrowerInitials] = useState('XX');

  useEffect(() => {
    // Load scenario data from sessionStorage
    const stored = sessionStorage.getItem('scenarioData');
    if (!stored) {
      router.push('/');
      return;
    }

    const data: ScenarioInput = JSON.parse(stored);
    setScenarioData(data);

    // Calculate all results
    const grossMonthlyIncome = calculateGrossMonthlyIncome(
      data.borrower.w2BaseAnnual,
      data.borrower.bonusAnnual,
      data.borrower.overtimeAnnual
    );

    const loanAmount = data.property.purchasePrice - data.property.downPayment;
    const ltv = calculateLTV(loanAmount, data.property.purchasePrice);

    const principalAndInterest = calculatePrincipalAndInterest(
      loanAmount,
      data.loan.interestRate,
      parseInt(data.loan.term)
    );

    const taxRate = data.loan.taxRateOverride !== undefined
      ? data.loan.taxRateOverride
      : getCountyTaxRate(data.property.state, data.property.county);

    const propertyTaxMonthly = calculateMonthlyPropertyTax(
      data.property.purchasePrice,
      taxRate
    );

    const insuranceMonthly = data.loan.insuranceMonthly !== undefined
      ? data.loan.insuranceMonthly
      : estimateMonthlyInsurance(data.property.purchasePrice);

    const miMonthly = estimateMortgageInsurance(loanAmount, ltv);

    const totalPITI =
      principalAndInterest +
      propertyTaxMonthly +
      insuranceMonthly +
      miMonthly +
      (data.loan.hoaMonthly || 0);

    const totalMonthlyDebt =
      totalPITI +
      (data.debts.creditCards || 0) +
      (data.debts.autoLoans || 0) +
      (data.debts.studentLoans || 0) +
      (data.debts.otherDebts || 0);

    const dti = calculateDTI(totalMonthlyDebt, grossMonthlyIncome);
    const housingRatio = calculateHousingRatio(totalPITI, grossMonthlyIncome);

    const loanTypeResult = determineLoanType(
      loanAmount,
      data.property.state,
      data.property.county
    );

    const calculatedResults = {
      grossMonthlyIncome,
      loanAmount,
      principalAndInterest,
      propertyTaxMonthly,
      insuranceMonthly,
      hoaMonthly: data.loan.hoaMonthly || 0,
      miMonthly,
      totalPITI,
      totalMonthlyDebt,
      dti,
      housingRatio,
      ltv,
      loanType: loanTypeResult.loanType,
      conformingLimit: loanTypeResult.conformingLimit,
      highBalanceLimit: loanTypeResult.highBalanceLimit,
    };

    setResults(calculatedResults);

    // Evaluate guidelines
    const guidelineFlags = evaluateGuidelines(
      {
        loanAmount,
        ltv,
        dti,
        housingRatio,
        fico: data.credit.fico,
        loanType: loanTypeResult.loanType,
        occupancy: data.property.occupancy,
        propertyType: data.property.propertyType,
        miRequired: ltv > 80,
        bankruptcyHistory: data.credit.bankruptcyHistory || 'none',
        foreclosureHistory: data.credit.foreclosureHistory || 'none',
        latePayments: data.credit.latePayments || 'none',
        monthsReserves: data.debts.monthsReserves || 0,
        hasLandlordExperience: data.debts.hasLandlordExperience || false,
        childSupportMonthly: data.debts.childSupportMonthly || 0,
        selfEmployedMonthly: data.borrower.selfEmployedMonthly || 0,
        selfEmployedYears: data.borrower.selfEmployedYears || 0,
        propertiesOwned: data.property.propertiesOwned || 0,
        hasLegalADU: data.property.hasLegalADU || false,
        aduRentalIncome: data.property.aduRentalIncome || 0,
        isFirstTimeHomeBuyer: data.property.isFirstTimeHomeBuyer || false,
        annualIncome: (data.borrower.w2BaseAnnual || 0) + 
                      (data.borrower.bonusAnnual || 0) + 
                      (data.borrower.overtimeAnnual || 0),
        county: data.property.county,
        state: data.property.state || 'CA',
      },
      data
    );

    setFlags(guidelineFlags);

    // Calculate Fannie Mae Qualification
    const qualificationResult = assessQualification({
      purchasePrice: data.property.purchasePrice,
      downPayment: data.property.downPayment,
      loanAmount,
      ltv,
      fico: data.credit.fico,
      monthlyIncome: grossMonthlyIncome,
      monthlyDebts: calculatedResults.totalMonthlyDebt,
      propertyTax: calculatedResults.propertyTaxMonthly,
      insurance: calculatedResults.insuranceMonthly,
      pmi: miMonthly,
      hoa: calculatedResults.hoaMonthly,
      occupancy: data.property.occupancy,
      county: data.property.county,
    });

    setQualification(qualificationResult);
  }, [router]);

  const handleExportPDF = () => {
    if (!scenarioData || !results) return;

    const doc = generateScenarioPDF(
      scenarioData,
      { ...results, flags },
      borrowerInitials
    );

    doc.save(`mortgage-scenario-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (!scenarioData || !results) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const errorFlags = flags.filter((f) => f.severity === 'error');
  const warnFlags = flags.filter((f) => f.severity === 'warn');
  const infoFlags = flags.filter((f) => f.severity === 'info');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Scenario Results</h2>
        <p className="text-gray-600 mt-2">
          Review your estimated mortgage scenario and guideline flags
        </p>
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Disclaimer:</strong> These are estimates only. Not a loan
              approval or commitment. Actual loan terms and approval subject to
              full underwriting review.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Monthly Payment Card */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Payment
          </h3>
          <div className="text-3xl font-bold text-primary-700 mb-4">
            ${results.totalPITI.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Principal & Interest:</span>
              <span className="font-medium">${results.principalAndInterest.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Property Tax:</span>
              <span className="font-medium">${results.propertyTaxMonthly.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Insurance:</span>
              <span className="font-medium">${results.insuranceMonthly.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            {results.miMonthly > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">MI (Est.):</span>
                <span className="font-medium">${results.miMonthly.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            {results.hoaMonthly > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">HOA:</span>
                <span className="font-medium">${results.hoaMonthly.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            )}
          </div>
        </div>

        {/* DTI Card */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Debt Ratios
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Total DTI</span>
                <span
                  className={`text-xl font-bold ${
                    results.dti > 50
                      ? 'text-red-600'
                      : results.dti > 43
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }`}
                >
                  {results.dti.toFixed(2)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    results.dti > 50
                      ? 'bg-red-600'
                      : results.dti > 43
                      ? 'bg-yellow-500'
                      : 'bg-green-600'
                  }`}
                  style={{ width: `${Math.min(results.dti, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Housing Ratio</span>
                <span className="text-xl font-bold text-gray-900">
                  {results.housingRatio.toFixed(2)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-blue-600"
                  style={{ width: `${Math.min(results.housingRatio, 100)}%` }}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Total Monthly Debt: ${results.totalMonthlyDebt.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* LTV Card */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Loan Details
          </h3>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">Loan Amount</div>
              <div className="text-2xl font-bold text-gray-900">
                ${results.loanAmount.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">LTV Ratio</div>
              <div
                className={`text-xl font-bold ${
                  results.ltv > 80 ? 'text-orange-600' : 'text-green-600'
                }`}
              >
                {results.ltv.toFixed(2)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Loan Type</div>
              <div className="text-lg font-medium capitalize text-gray-900">
                {results.loanType === 'high-balance'
                  ? 'High-Balance'
                  : results.loanType}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guideline Flags */}
      <div className="card mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Guideline Flags
        </h3>

        {flags.length === 0 ? (
          <div className="flex items-center text-green-600">
            <svg
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">
              No guideline flags identified - scenario appears to meet basic
              guidelines
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            {errorFlags.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-red-700 mb-2">
                  Errors ({errorFlags.length})
                </h4>
                {errorFlags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="bg-red-50 border-l-4 border-red-500 p-3 mb-2"
                  >
                    <p className="text-sm font-medium text-red-800">
                      {flag.message}
                    </p>
                    {flag.reference && (
                      <p className="text-xs text-red-600 mt-1">
                        {flag.reference}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {warnFlags.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-yellow-700 mb-2">
                  Warnings ({warnFlags.length})
                </h4>
                {warnFlags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mb-2"
                  >
                    <p className="text-sm font-medium text-yellow-800">
                      {flag.message}
                    </p>
                    {flag.reference && (
                      <p className="text-xs text-yellow-600 mt-1">
                        {flag.reference}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {infoFlags.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-blue-700 mb-2">
                  Information ({infoFlags.length})
                </h4>
                {infoFlags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-2"
                  >
                    <p className="text-sm font-medium text-blue-800">
                      {flag.message}
                    </p>
                    {flag.reference && (
                      <p className="text-xs text-blue-600 mt-1">
                        {flag.reference}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fannie Mae Qualification Assessment */}
      {qualification && <QualificationDisplay qualification={qualification} />}

      {/* Export Section */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Export Scenario
        </h3>
        <p className="text-gray-600 mb-4">
          Download a PDF summary of this scenario with all details and guideline
          flags.
        </p>

        <div className="flex items-center space-x-4 mb-4">
          <div>
            <label htmlFor="initials" className="label">
              Borrower Initials (for PDF)
            </label>
            <input
              type="text"
              id="initials"
              maxLength={4}
              className="input-field w-32"
              value={borrowerInitials}
              onChange={(e) =>
                setBorrowerInitials(e.target.value.toUpperCase())
              }
              placeholder="XX"
            />
          </div>
          <button onClick={handleExportPDF} className="btn-primary mt-6">
            Download PDF
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-8">
        <Link href="/scenario" className="btn-secondary">
          Modify Scenario
        </Link>
        <Link href="/" className="btn-primary">
          Start New Scenario
        </Link>
      </div>
    </div>
  );
}
