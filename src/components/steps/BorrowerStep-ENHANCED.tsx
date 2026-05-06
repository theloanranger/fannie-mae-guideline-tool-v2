'use client';

import { useState } from 'react';
import { borrowerSchema, type BorrowerInput } from '@/lib/schemas';

interface BorrowerStepProps {
  initialData: BorrowerInput | null;
  onComplete: (data: BorrowerInput) => void;
}

export default function BorrowerStepEnhanced({ initialData, onComplete }: BorrowerStepProps) {
  const [formData, setFormData] = useState<BorrowerInput>(
    initialData || {
      w2BaseAnnual: 0,
      bonusAnnual: 0,
      overtimeAnnual: 0,
      selfEmployedMonthly: 0,
      selfEmployedYears: 0,
      rentalIncomeMonthly: 0,
      investmentIncomeMonthly: 0,
      pensionMonthly: 0,
      socialSecurityMonthly: 0,
      alimonyMonthly: 0,
      otherIncomeMonthly: 0,
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAdditionalIncome, setShowAdditionalIncome] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = borrowerSchema.safeParse(formData);
    
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    onComplete(result.data);
  };

  const handleChange = (field: keyof BorrowerInput, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    setFormData({ ...formData, [field]: isNaN(numValue) ? 0 : numValue });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  // Calculate total monthly income
  const w2Monthly = (formData.w2BaseAnnual + (formData.bonusAnnual || 0) + (formData.overtimeAnnual || 0)) / 12;
  const totalMonthly = w2Monthly + 
    (formData.selfEmployedMonthly || 0) +
    (formData.rentalIncomeMonthly || 0) +
    (formData.investmentIncomeMonthly || 0) +
    (formData.pensionMonthly || 0) +
    (formData.socialSecurityMonthly || 0) +
    (formData.alimonyMonthly || 0) +
    (formData.otherIncomeMonthly || 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 1: Borrower Income
        </h2>
        <p className="text-gray-600">
          Enter all sources of income. We'll calculate your total gross monthly income.
        </p>
      </div>

      {/* W-2 Employment Income */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">W-2 Employment Income</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="w2BaseAnnual" className="label">
              Base Annual Salary <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                id="w2BaseAnnual"
                min="0"
                step="1000"
                className={`input-field pl-8 ${errors.w2BaseAnnual ? 'border-red-500' : ''}`}
                value={formData.w2BaseAnnual || ''}
                onChange={(e) => handleChange('w2BaseAnnual', e.target.value)}
                placeholder="80,000"
              />
            </div>
            {errors.w2BaseAnnual && (
              <p className="error-message">{errors.w2BaseAnnual}</p>
            )}
          </div>

          <div>
            <label htmlFor="bonusAnnual" className="label">
              Annual Bonus (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                id="bonusAnnual"
                min="0"
                step="1000"
                className="input-field pl-8"
                value={formData.bonusAnnual || ''}
                onChange={(e) => handleChange('bonusAnnual', e.target.value)}
                placeholder="0"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              2+ year history required
            </p>
          </div>

          <div>
            <label htmlFor="overtimeAnnual" className="label">
              Annual Overtime (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                id="overtimeAnnual"
                min="0"
                step="1000"
                className="input-field pl-8"
                value={formData.overtimeAnnual || ''}
                onChange={(e) => handleChange('overtimeAnnual', e.target.value)}
                placeholder="0"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Must be consistent and documented
            </p>
          </div>
        </div>
      </div>

      {/* Self-Employment Income */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Self-Employment Income
        </h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="selfEmployedMonthly" className="label">
              Average Monthly Net Income
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                id="selfEmployedMonthly"
                min="0"
                step="100"
                className="input-field pl-8"
                value={formData.selfEmployedMonthly || ''}
                onChange={(e) => handleChange('selfEmployedMonthly', e.target.value)}
                placeholder="0"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              From tax returns (2-year average)
            </p>
          </div>

          {formData.selfEmployedMonthly > 0 && (
            <div>
              <label htmlFor="selfEmployedYears" className="label">
                Years Self-Employed
              </label>
              <input
                type="number"
                id="selfEmployedYears"
                min="0"
                max="50"
                step="0.5"
                className="input-field"
                value={formData.selfEmployedYears || ''}
                onChange={(e) => handleChange('selfEmployedYears', e.target.value)}
                placeholder="2"
              />
              <p className="text-xs text-gray-500 mt-1">
                ⚠️ Less than 2 years may require additional documentation
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Income Toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdditionalIncome(!showAdditionalIncome)}
          className="text-primary-600 font-medium flex items-center hover:text-primary-700"
        >
          {showAdditionalIncome ? (
            <>
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Hide Additional Income Sources
            </>
          ) : (
            <>
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Add Other Income (Rental, Pension, Investment, etc.)
            </>
          )}
        </button>
      </div>

      {/* Additional Income Sources */}
      {showAdditionalIncome && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 space-y-4">
          <h3 className="font-semibold text-gray-900 mb-3">Additional Income Sources</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rentalIncomeMonthly" className="label">
                Rental Income (Monthly)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="rentalIncomeMonthly"
                  min="0"
                  step="100"
                  className="input-field pl-8"
                  value={formData.rentalIncomeMonthly || ''}
                  onChange={(e) => handleChange('rentalIncomeMonthly', e.target.value)}
                  placeholder="0"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                75% typically counted
              </p>
            </div>

            <div>
              <label htmlFor="investmentIncomeMonthly" className="label">
                Investment Income (Monthly)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="investmentIncomeMonthly"
                  min="0"
                  step="100"
                  className="input-field pl-8"
                  value={formData.investmentIncomeMonthly || ''}
                  onChange={(e) => handleChange('investmentIncomeMonthly', e.target.value)}
                  placeholder="0"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Dividends, interest, capital gains
              </p>
            </div>

            <div>
              <label htmlFor="pensionMonthly" className="label">
                Pension (Monthly)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="pensionMonthly"
                  min="0"
                  step="100"
                  className="input-field pl-8"
                  value={formData.pensionMonthly || ''}
                  onChange={(e) => handleChange('pensionMonthly', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label htmlFor="socialSecurityMonthly" className="label">
                Social Security (Monthly)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="socialSecurityMonthly"
                  min="0"
                  step="100"
                  className="input-field pl-8"
                  value={formData.socialSecurityMonthly || ''}
                  onChange={(e) => handleChange('socialSecurityMonthly', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label htmlFor="alimonyMonthly" className="label">
                Alimony Received (Monthly)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="alimonyMonthly"
                  min="0"
                  step="100"
                  className="input-field pl-8"
                  value={formData.alimonyMonthly || ''}
                  onChange={(e) => handleChange('alimonyMonthly', e.target.value)}
                  placeholder="0"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                3+ years remaining required
              </p>
            </div>

            <div>
              <label htmlFor="otherIncomeMonthly" className="label">
                Other Income (Monthly)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="otherIncomeMonthly"
                  min="0"
                  step="100"
                  className="input-field pl-8"
                  value={formData.otherIncomeMonthly || ''}
                  onChange={(e) => handleChange('otherIncomeMonthly', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Total Income Summary */}
      {totalMonthly > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <p className="text-sm font-medium text-primary-900">
            Total Gross Monthly Income
          </p>
          <p className="text-3xl font-bold text-primary-700 mt-1">
            ${totalMonthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          {w2Monthly > 0 && (
            <p className="text-xs text-gray-600 mt-2">
              W-2: ${w2Monthly.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              {formData.selfEmployedMonthly > 0 && ` | Self-Employed: $${formData.selfEmployedMonthly.toLocaleString()}`}
              {(formData.rentalIncomeMonthly || 0) + (formData.investmentIncomeMonthly || 0) + (formData.pensionMonthly || 0) + (formData.socialSecurityMonthly || 0) + (formData.alimonyMonthly || 0) + (formData.otherIncomeMonthly || 0) > 0 && ' | Other Income Included'}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button type="submit" className="btn-primary">
          Continue to Credit
        </button>
      </div>
    </form>
  );
}
