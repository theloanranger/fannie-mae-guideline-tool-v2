'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BorrowerStep from '@/components/steps/BorrowerStep';
import CreditStep from '@/components/steps/CreditStep';
import PropertyStep from '@/components/steps/PropertyStep';
import LoanStep from '@/components/steps/LoanStep';
import DebtsStep from '@/components/steps/DebtsStep';
import type {
  BorrowerInput,
  CreditInput,
  PropertyInput,
  LoanInput,
  DebtsInput,
} from '@/lib/schemas';

export default function ScenarioWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [borrowerData, setBorrowerData] = useState<BorrowerInput | null>(null);
  const [creditData, setCreditData] = useState<CreditInput | null>(null);
  const [propertyData, setPropertyData] = useState<PropertyInput | null>(null);
  const [loanData, setLoanData] = useState<LoanInput | null>(null);

  const steps = [
    { number: 1, name: 'Borrower', description: 'Income Information' },
    { number: 2, name: 'Credit', description: 'Score & Borrowers' },
    { number: 3, name: 'Property', description: 'Location & Details' },
    { number: 4, name: 'Loan', description: 'Terms & Costs' },
    { number: 5, name: 'Debts', description: 'Monthly Obligations' },
  ];

  const handleBorrowerComplete = (data: BorrowerInput) => {
    setBorrowerData(data);
    setCurrentStep(2);
  };

  const handleCreditComplete = (data: CreditInput) => {
    setCreditData(data);
    setCurrentStep(3);
  };

  const handlePropertyComplete = (data: PropertyInput) => {
    setPropertyData(data);
    setCurrentStep(4);
  };

  const handleLoanComplete = (data: LoanInput) => {
    setLoanData(data);
    setCurrentStep(5);
  };

  const handleDebtsComplete = (data: DebtsInput) => {
    // Compile all data and navigate to results
    const scenarioData = {
      borrower: borrowerData!,
      credit: creditData!,
      property: propertyData!,
      loan: loanData!,
      debts: data,
    };

    // Store in sessionStorage for results page
    sessionStorage.setItem('scenarioData', JSON.stringify(scenarioData));
    router.push('/results');
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between">
            {steps.map((step, index) => (
              <li key={step.number} className="flex-1">
                <div
                  className={`flex flex-col items-center ${
                    index < steps.length - 1 ? 'relative' : ''
                  }`}
                >
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute top-5 left-1/2 w-full h-0.5 ${
                        step.number < currentStep
                          ? 'bg-primary-600'
                          : 'bg-gray-300'
                      }`}
                      style={{ transform: 'translateX(50%)' }}
                    />
                  )}

                  {/* Step circle */}
                  <div
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      step.number === currentStep
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : step.number < currentStep
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : 'border-gray-300 bg-white text-gray-500'
                    }`}
                  >
                    {step.number < currentStep ? (
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span className="text-sm font-semibold">{step.number}</span>
                    )}
                  </div>

                  {/* Step label */}
                  <div className="mt-2 text-center">
                    <p
                      className={`text-sm font-medium ${
                        step.number <= currentStep
                          ? 'text-primary-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </p>
                    <p className="text-xs text-gray-500 hidden sm:block">
                      {step.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Step Content */}
      <div className="card">
        {currentStep === 1 && (
          <BorrowerStep
            initialData={borrowerData}
            onComplete={handleBorrowerComplete}
          />
        )}
        {currentStep === 2 && (
          <CreditStep
            initialData={creditData}
            onComplete={handleCreditComplete}
            onBack={handleBack}
          />
        )}
        {currentStep === 3 && (
          <PropertyStep
            initialData={propertyData}
            onComplete={handlePropertyComplete}
            onBack={handleBack}
          />
        )}
        {currentStep === 4 && (
          <LoanStep
            initialData={loanData}
            propertyData={propertyData}
            onComplete={handleLoanComplete}
            onBack={handleBack}
          />
        )}
        {currentStep === 5 && (
          <DebtsStep onComplete={handleDebtsComplete} onBack={handleBack} />
        )}
      </div>
    </div>
  );
}
