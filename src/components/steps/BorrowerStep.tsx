'use client';

import { useState } from 'react';
import { borrowerSchema, type BorrowerInput } from '@/lib/schemas';

interface BorrowerStepProps {
  initialData: BorrowerInput | null;
  onComplete: (data: BorrowerInput) => void;
}

export default function BorrowerStep({ initialData, onComplete }: BorrowerStepProps) {
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
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 1: Borrower Income
        </h2>
        <p className="text-gray-600">
          Enter annual income information. We'll calculate your gross monthly income.
        </p>
      </div>

      <div>
        <label htmlFor="w2BaseAnnual" className="label">
          W-2 Base Annual Income <span className="text-red-500">*</span>
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
          Include if bonus income is stable and documented
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
          Include if overtime is consistent and documented
        </p>
      </div>

      {formData.w2BaseAnnual > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900">
            Estimated Gross Monthly Income
          </p>
          <p className="text-2xl font-bold text-blue-700 mt-1">
            ${((formData.w2BaseAnnual + (formData.bonusAnnual || 0) + (formData.overtimeAnnual || 0)) / 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <button type="submit" className="btn-primary">
          Continue to Credit
        </button>
      </div>
    </form>
  );
}
