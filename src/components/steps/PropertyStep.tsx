'use client';

import { useState, useEffect } from 'react';
import { propertySchema, type PropertyInput } from '@/lib/schemas';
import { getAvailableStates, getCountiesForState } from '@/lib/county-lookup';

interface PropertyStepProps {
  initialData: PropertyInput | null;
  onComplete: (data: PropertyInput) => void;
  onBack: () => void;
}

export default function PropertyStep({ initialData, onComplete, onBack }: PropertyStepProps) {
  const [formData, setFormData] = useState<PropertyInput>(
    initialData || {
      state: 'CA',
      county: '',
      purchasePrice: 0,
      downPayment: 0,
      occupancy: 'primary',
      propertyType: 'single-family',
      propertiesOwned: 0,
      hasLegalADU: false,
      aduRentalIncome: 0,
      isFirstTimeHomeBuyer: false,
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableCounties, setAvailableCounties] = useState<string[]>([]);

  const states = getAvailableStates();

  useEffect(() => {
    if (formData.state) {
      const counties = getCountiesForState(formData.state);
      setAvailableCounties(counties);
      
      // If current county is not in new state, reset it
      if (formData.county && !counties.includes(formData.county)) {
        setFormData({ ...formData, county: '' });
      }
    }
  }, [formData.state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = propertySchema.safeParse(formData);
    
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

  const handleNumberChange = (field: keyof PropertyInput, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    setFormData({ ...formData, [field]: isNaN(numValue) ? 0 : numValue });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleChange = (field: keyof PropertyInput, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const loanAmount = formData.purchasePrice - formData.downPayment;
  const downPaymentPercent = formData.purchasePrice > 0 
    ? (formData.downPayment / formData.purchasePrice) * 100 
    : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 3: Property Details
        </h2>
        <p className="text-gray-600">
          Property location, purchase price, and occupancy type.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="state" className="label">
            State <span className="text-red-500">*</span>
          </label>
          <select
            id="state"
            className={`input-field ${errors.state ? 'border-red-500' : ''}`}
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.state && <p className="error-message">{errors.state}</p>}
        </div>

        <div>
          <label htmlFor="county" className="label">
            County <span className="text-red-500">*</span>
          </label>
          <select
            id="county"
            className={`input-field ${errors.county ? 'border-red-500' : ''}`}
            value={formData.county}
            onChange={(e) => handleChange('county', e.target.value)}
            disabled={!formData.state}
          >
            <option value="">Select County</option>
            {availableCounties.map((county) => (
              <option key={county} value={county}>
                {county}
              </option>
            ))}
          </select>
          {errors.county && <p className="error-message">{errors.county}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="purchasePrice" className="label">
          Purchase Price <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            type="number"
            id="purchasePrice"
            min="0"
            step="1000"
            className={`input-field pl-8 ${errors.purchasePrice ? 'border-red-500' : ''}`}
            value={formData.purchasePrice || ''}
            onChange={(e) => handleNumberChange('purchasePrice', e.target.value)}
            placeholder="500,000"
          />
        </div>
        {errors.purchasePrice && (
          <p className="error-message">{errors.purchasePrice}</p>
        )}
      </div>

      <div>
        <label htmlFor="downPayment" className="label">
          Down Payment <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            type="number"
            id="downPayment"
            min="0"
            step="1000"
            className={`input-field pl-8 ${errors.downPayment ? 'border-red-500' : ''}`}
            value={formData.downPayment || ''}
            onChange={(e) => handleNumberChange('downPayment', e.target.value)}
            placeholder="100,000"
          />
        </div>
        {errors.downPayment && (
          <p className="error-message">{errors.downPayment}</p>
        )}
        {formData.purchasePrice > 0 && formData.downPayment > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            {downPaymentPercent.toFixed(2)}% down • Loan Amount: ${loanAmount.toLocaleString()}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="propertyType" className="label">
          Property Type <span className="text-red-500">*</span>
        </label>
        <select
          id="propertyType"
          className="input-field"
          value={formData.propertyType}
          onChange={(e) => handleChange('propertyType', e.target.value)}
        >
          <option value="single-family">Single Family Home</option>
          <option value="condo">Condominium</option>
          <option value="townhouse">Townhouse</option>
          <option value="multi-unit">Multi-Unit (2-4 units)</option>
        </select>
      </div>

      <div>
        <label htmlFor="occupancy" className="label">
          Occupancy Type <span className="text-red-500">*</span>
        </label>
        <select
          id="occupancy"
          className="input-field"
          value={formData.occupancy}
          onChange={(e) => handleChange('occupancy', e.target.value)}
        >
          <option value="primary">Primary Residence</option>
          <option value="secondary">Second Home</option>
          <option value="investment">Investment Property</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          {formData.occupancy === 'primary' && 'You will live in the property as your main home'}
          {formData.occupancy === 'secondary' && 'Vacation or occasional use property'}
          {formData.occupancy === 'investment' && 'Property will be rented out'}
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <button type="button" onClick={onBack} className="btn-secondary">
          Back
        </button>
        <button type="submit" className="btn-primary">
          Continue to Loan Details
        </button>
      </div>
    </form>
  );
}
