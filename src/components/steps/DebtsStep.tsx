'use client';

import { useState } from 'react';
import { debtsSchema, type DebtsInput } from '@/lib/schemas';

interface DebtsStepProps {
  onComplete: (data: DebtsInput) => void;
  onBack: () => void;
}

export default function DebtsStep({ onComplete, onBack }: DebtsStepProps) {
  const [formData, setFormData] = useState<DebtsInput>({
    creditCards: 0,
    autoLoans: 0,
    studentLoans: 0,
    childSupportMonthly: 0,
    alimonyPaymentMonthly: 0,
    otherDebts: 0,
    monthsReserves: 0,
    hasLandlordExperience: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = debtsSchema.safeParse(formData);
    
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

  const handleChange = (field: keyof DebtsInput, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    setFormData({ ...formData, [field]: isNaN(numValue) ? 0 : numValue });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const totalMonthlyDebt = 
    (formData.creditCards || 0) +
    (formData.autoLoans || 0) +
    (formData.studentLoans || 0) +
    (formData.otherDebts || 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 5: Monthly Debts
        </h2>
        <p className="text-gray-600">
          Enter all recurring monthly debt obligations. These will be used to calculate your DTI ratio.
        </p>
      </div>

      <div>
        <label htmlFor="creditCards" className="label">
          Credit Card Minimum Payments (Monthly)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            type="number"
            id="creditCards"
            min="0"
            step="0.01"
            className="input-field pl-8"
            value={formData.creditCards || ''}
            onChange={(e) => handleChange('creditCards', e.target.value)}
            placeholder="0"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Total minimum monthly payments on all credit cards
        </p>
      </div>

      <div>
        <label htmlFor="autoLoans" className="label">
          Auto Loans (Monthly)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            type="number"
            id="autoLoans"
            min="0"
            step="0.01"
            className="input-field pl-8"
            value={formData.autoLoans || ''}
            onChange={(e) => handleChange('autoLoans', e.target.value)}
            placeholder="0"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Car loans, leases, etc.
        </p>
      </div>

      <div>
        <label htmlFor="studentLoans" className="label">
          Student Loans (Monthly)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            type="number"
            id="studentLoans"
            min="0"
            step="0.01"
            className="input-field pl-8"
            value={formData.studentLoans || ''}
            onChange={(e) => handleChange('studentLoans', e.target.value)}
            placeholder="0"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Monthly student loan payments
        </p>
      </div>

      <div>
        <label htmlFor="otherDebts" className="label">
          Other Monthly Debts
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            type="number"
            id="otherDebts"
            min="0"
            step="0.01"
            className="input-field pl-8"
            value={formData.otherDebts || ''}
            onChange={(e) => handleChange('otherDebts', e.target.value)}
            placeholder="0"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Personal loans, child support, alimony, etc.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-900">
          Total Monthly Debt Obligations
        </p>
        <p className="text-2xl font-bold text-blue-700 mt-1">
          ${totalMonthlyDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-gray-600 mt-2">
          Note: Do not include the new mortgage payment - that will be calculated automatically
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <button type="button" onClick={onBack} className="btn-secondary">
          Back
        </button>
        <button type="submit" className="btn-primary">
          Calculate Results
        </button>
      </div>
    </form>
  );
}
