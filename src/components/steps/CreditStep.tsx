'use client';

import { useState } from 'react';
import { creditSchema, type CreditInput } from '@/lib/schemas';

interface CreditStepProps {
  initialData: CreditInput | null;
  onComplete: (data: CreditInput) => void;
  onBack: () => void;
}

export default function CreditStep({ initialData, onComplete, onBack }: CreditStepProps) {
  const [formData, setFormData] = useState<CreditInput>(
    initialData || {
      fico: 740,
      numberOfBorrowers: 1,
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = creditSchema.safeParse(formData);
    
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

  const handleChange = (field: keyof CreditInput, value: string) => {
    const numValue = parseInt(value);
    setFormData({ ...formData, [field]: isNaN(numValue) ? 0 : numValue });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const getFicoColor = (fico: number) => {
    if (fico >= 740) return 'text-green-700';
    if (fico >= 680) return 'text-yellow-700';
    if (fico >= 620) return 'text-orange-700';
    return 'text-red-700';
  };

  const getFicoLabel = (fico: number) => {
    if (fico >= 740) return 'Excellent';
    if (fico >= 680) return 'Good';
    if (fico >= 620) return 'Fair';
    return 'Poor (may not qualify)';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 2: Credit Information
        </h2>
        <p className="text-gray-600">
          Credit score and number of borrowers on the loan.
        </p>
      </div>

      <div>
        <label htmlFor="fico" className="label">
          Representative FICO Score <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="fico"
          min="300"
          max="850"
          className={`input-field ${errors.fico ? 'border-red-500' : ''}`}
          value={formData.fico}
          onChange={(e) => handleChange('fico', e.target.value)}
          placeholder="740"
        />
        {errors.fico && <p className="error-message">{errors.fico}</p>}
        
        {formData.fico >= 300 && formData.fico <= 850 && (
          <div className="mt-2 flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  formData.fico >= 740
                    ? 'bg-green-600'
                    : formData.fico >= 680
                    ? 'bg-yellow-500'
                    : formData.fico >= 620
                    ? 'bg-orange-500'
                    : 'bg-red-600'
                }`}
                style={{ width: `${((formData.fico - 300) / 550) * 100}%` }}
              />
            </div>
            <span className={`ml-3 text-sm font-medium ${getFicoColor(formData.fico)}`}>
              {getFicoLabel(formData.fico)}
            </span>
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-1">
          For multiple borrowers, use the lowest middle score
        </p>
      </div>

      <div>
        <label htmlFor="numberOfBorrowers" className="label">
          Number of Borrowers <span className="text-red-500">*</span>
        </label>
        <select
          id="numberOfBorrowers"
          className={`input-field ${errors.numberOfBorrowers ? 'border-red-500' : ''}`}
          value={formData.numberOfBorrowers}
          onChange={(e) => handleChange('numberOfBorrowers', e.target.value)}
        >
          <option value={1}>1 Borrower</option>
          <option value={2}>2 Borrowers</option>
          <option value={3}>3 Borrowers</option>
          <option value={4}>4 Borrowers</option>
        </select>
        {errors.numberOfBorrowers && (
          <p className="error-message">{errors.numberOfBorrowers}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          All borrowers on the loan application
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <button type="button" onClick={onBack} className="btn-secondary">
          Back
        </button>
        <button type="submit" className="btn-primary">
          Continue to Property
        </button>
      </div>
    </form>
  );
}
