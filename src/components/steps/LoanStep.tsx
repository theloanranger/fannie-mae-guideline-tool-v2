'use client';

import { useState, useEffect } from 'react';
import { loanSchema, type LoanInput, type PropertyInput } from '@/lib/schemas';
import { getCountyTaxRate } from '@/lib/county-lookup';
import { estimateMonthlyInsurance } from '@/lib/calculations';

interface LoanStepProps {
  initialData: LoanInput | null;
  propertyData: PropertyInput | null;
  onComplete: (data: LoanInput) => void;
  onBack: () => void;
}

export default function LoanStep({ initialData, propertyData, onComplete, onBack }: LoanStepProps) {
  const [formData, setFormData] = useState<LoanInput>(
    initialData || {
      term: '30',
      interestRate: 6.500,
      hoaMonthly: 0,
      insuranceMonthly: undefined,
      taxRateOverride: undefined,
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [defaultTaxRate, setDefaultTaxRate] = useState<number>(0.012);
  const [estimatedInsurance, setEstimatedInsurance] = useState<number>(250); // Default fallback

  useEffect(() => {
    if (propertyData) {
      // Get default tax rate for county
      const rate = getCountyTaxRate(propertyData.state, propertyData.county);
      setDefaultTaxRate(rate);

      // Estimate insurance
      const insurance = estimateMonthlyInsurance(propertyData.purchasePrice);
      setEstimatedInsurance(insurance && !isNaN(insurance) ? insurance : 250);
    }
  }, [propertyData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = loanSchema.safeParse(formData);
    
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

  const handleNumberChange = (field: keyof LoanInput, value: string) => {
    if (value === '') {
      setFormData({ ...formData, [field]: undefined });
    } else {
      const numValue = parseFloat(value);
      setFormData({ ...formData, [field]: isNaN(numValue) ? undefined : numValue });
    }
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleChange = (field: keyof LoanInput, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const effectiveTaxRate = formData.taxRateOverride !== undefined 
    ? formData.taxRateOverride 
    : defaultTaxRate;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 4: Loan Details
        </h2>
        <p className="text-gray-600">
          Loan terms, interest rate, and associated costs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="term" className="label">
            Loan Term <span className="text-red-500">*</span>
          </label>
          <select
            id="term"
            className="input-field"
            value={formData.term}
            onChange={(e) => handleChange('term', e.target.value)}
          >
            <option value="10">10 Years</option>
            <option value="15">15 Years</option>
            <option value="20">20 Years</option>
            <option value="25">25 Years</option>
            <option value="30">30 Years</option>
          </select>
        </div>

        <div>
          <label htmlFor="interestRate" className="label">
            Interest Rate (%) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="interestRate"
            min="0.125"
            max="20"
            step="0.125"
            className={`input-field ${errors.interestRate ? 'border-red-500' : ''}`}
            value={formData.interestRate}
            onChange={(e) => handleNumberChange('interestRate', e.target.value)}
            placeholder="6.500"
          />
          {errors.interestRate && (
            <p className="error-message">{errors.interestRate}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Rates change in eighths: 5.500, 5.625, 5.750, 5.875, 6.000, etc.
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="hoaMonthly" className="label">
          HOA Dues (Monthly)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            type="number"
            id="hoaMonthly"
            min="0"
            step="10"
            className={`input-field pl-8 ${errors.hoaMonthly ? 'border-red-500' : ''}`}
            value={formData.hoaMonthly || ''}
            onChange={(e) => handleNumberChange('hoaMonthly', e.target.value)}
            placeholder="0"
          />
        </div>
        {errors.hoaMonthly && <p className="error-message">{errors.hoaMonthly}</p>}
        <p className="text-xs text-gray-500 mt-1">
          💡 Leave blank or enter 0 if no HOA
        </p>
      </div>

      <div>
        <label htmlFor="insuranceMonthly" className="label">
          Homeowners Insurance (Monthly)
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              id="insuranceMonthly"
              min="0"
              step="10"
              className="input-field pl-8"
              value={formData.insuranceMonthly !== undefined ? formData.insuranceMonthly : ''}
              onChange={(e) => handleNumberChange('insuranceMonthly', e.target.value)}
              placeholder={estimatedInsurance ? estimatedInsurance.toFixed(2) : '250'}
            />
          </div>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, insuranceMonthly: estimatedInsurance })}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium whitespace-nowrap"
          >
            Use Estimate
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          💡 Estimate: ${estimatedInsurance ? estimatedInsurance.toFixed(2) : '250'}/month (click "Use Estimate" or enter your own)
        </p>
      </div>

      <div>
        <label htmlFor="taxRateOverride" className="label">
          Property Tax Rate Override (Annual %)
        </label>
        <input
          type="number"
          id="taxRateOverride"
          min="0"
          max="5.00"
          step="0.01"
          className="input-field"
          value={formData.taxRateOverride !== undefined ? (formData.taxRateOverride * 100) : ''}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (inputValue === '') {
              setFormData({ ...formData, taxRateOverride: undefined });
            } else {
              const percentValue = parseFloat(inputValue);
              if (!isNaN(percentValue) && percentValue >= 0 && percentValue <= 5) {
                setFormData({ ...formData, taxRateOverride: percentValue / 100 });
              }
            }
          }}
          placeholder={(defaultTaxRate * 100).toFixed(2)}
        />
        <p className="text-xs text-gray-500 mt-1">
          Default for {propertyData?.county || 'selected county'}: {(defaultTaxRate * 100).toFixed(2)}%
          {formData.taxRateOverride === undefined && ' (will be used)'}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          💡 Leave blank to use default, or enter custom rate (e.g., 1.20 for 1.20%, range: 0.00 - 5.00%)
        </p>
      </div>

      {propertyData && (
        <div className={`border rounded-lg p-4 ${formData.taxRateOverride !== undefined ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
          <p className="text-sm font-medium text-gray-900 mb-2">
            Estimated Monthly Property Tax
            {formData.taxRateOverride !== undefined && (
              <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded">Custom Rate</span>
            )}
          </p>
          <p className={`text-2xl font-bold ${formData.taxRateOverride !== undefined ? 'text-green-700' : 'text-blue-700'}`}>
            ${((propertyData.purchasePrice * effectiveTaxRate) / 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Based on {(effectiveTaxRate * 100).toFixed(2)}% tax rate
            {formData.taxRateOverride === undefined && ` (${propertyData.county} County default)`}
            {formData.taxRateOverride !== undefined && ' (your custom rate)'}
          </p>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button type="button" onClick={onBack} className="btn-secondary">
          Back
        </button>
        <button type="submit" className="btn-primary">
          Continue to Debts
        </button>
      </div>
    </form>
  );
}
