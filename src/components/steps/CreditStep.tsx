'use client';

import { useState } from 'react';
import { creditSchema, type CreditInput } from '@/lib/schemas';

interface CreditStepProps {
  initialData: CreditInput | null;
  onComplete: (data: CreditInput) => void;
  onBack: () => void;
}

interface CreditEvent {
  id: string;
  type: string;
  dateOccurred: string;
  dateResolved: string;
  isActive: boolean;
  isHousingRelated: boolean;
  notes: string;
}

export default function CreditStep({ initialData, onComplete, onBack }: CreditStepProps) {
  const [formData, setFormData] = useState<CreditInput>(
    initialData || {
      fico: 740,
      numberOfBorrowers: 1,
      bankruptcyHistory: 'none',
      foreclosureHistory: 'none',
      latePayments: 'none',
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasCreditEvents, setHasCreditEvents] = useState(false);
  const [creditEvents, setCreditEvents] = useState<CreditEvent[]>([]);
  const [eventCounter, setEventCounter] = useState(0);

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

  const handleChange = (field: keyof CreditInput, value: string | number) => {
    const numValue = typeof value === 'string' ? parseInt(value) : value;
    setFormData({ ...formData, [field]: isNaN(numValue) ? 0 : numValue });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const addCreditEvent = () => {
    const newEvent: CreditEvent = {
      id: `event-${eventCounter}`,
      type: '',
      dateOccurred: '',
      dateResolved: '',
      isActive: false,
      isHousingRelated: false,
      notes: '',
    };
    setCreditEvents([...creditEvents, newEvent]);
    setEventCounter(eventCounter + 1);
  };

  const removeCreditEvent = (id: string) => {
    setCreditEvents(creditEvents.filter(e => e.id !== id));
  };

  const updateCreditEvent = (id: string, field: keyof CreditEvent, value: any) => {
    setCreditEvents(creditEvents.map(event => 
      event.id === id ? { ...event, [field]: value } : event
    ));
  };

  const getWaitingPeriodGuidance = (type: string, yearsSince: number) => {
    let html = '';
    let colorClass = '';
    
    switch(type) {
      case 'bk-ch7':
        html = `<strong>Chapter 7 Bankruptcy</strong><br>`;
        if (yearsSince >= 4) {
          html += `• <span class="text-green-700 font-semibold">Conventional: Potentially eligible</span> (4 year waiting period met)<br>`;
          colorClass = 'bg-green-50 border border-green-200';
        } else {
          html += `• <span class="text-red-700 font-semibold">Conventional: Waiting period applies</span> (needs ${(4 - yearsSince).toFixed(1)} more years)<br>`;
          colorClass = 'bg-red-50 border border-red-200';
        }
        if (yearsSince >= 2) {
          html += `• <span class="text-green-700 font-semibold">FHA: Potentially eligible</span> (2 year waiting period met)`;
        } else {
          html += `• <span class="text-yellow-700 font-semibold">FHA: Waiting period applies</span> (needs ${(2 - yearsSince).toFixed(1)} more years)`;
          if (colorClass === '') colorClass = 'bg-yellow-50 border border-yellow-200';
        }
        break;
        
      case 'bk-ch13':
        html = `<strong>Chapter 13 Bankruptcy</strong><br>`;
        if (yearsSince >= 2) {
          html += `• <span class="text-green-700 font-semibold">Conventional: May qualify</span> (with 2+ years payment history)<br>`;
          html += `• <span class="text-green-700 font-semibold">FHA: May qualify</span> (with 1+ year payment history)`;
          colorClass = 'bg-green-50 border border-green-200';
        } else if (yearsSince >= 1) {
          html += `• <span class="text-yellow-700 font-semibold">Conventional: Not yet eligible</span><br>`;
          html += `• <span class="text-green-700 font-semibold">FHA: May qualify</span> (with court approval)`;
          colorClass = 'bg-yellow-50 border border-yellow-200';
        } else {
          html += `• <span class="text-yellow-700 font-semibold">Both programs: May require court approval and payment history verification</span>`;
          colorClass = 'bg-yellow-50 border border-yellow-200';
        }
        break;
        
      case 'foreclosure':
        html = `<strong>Foreclosure</strong><br>`;
        if (yearsSince >= 7) {
          html += `• <span class="text-green-700 font-semibold">Conventional: Potentially eligible</span> (7 year waiting period met)<br>`;
          colorClass = 'bg-green-50 border border-green-200';
        } else {
          html += `• <span class="text-red-700 font-semibold">Conventional: Waiting period applies</span> (needs ${(7 - yearsSince).toFixed(1)} more years)<br>`;
          colorClass = 'bg-red-50 border border-red-200';
        }
        if (yearsSince >= 3) {
          html += `• <span class="text-green-700 font-semibold">FHA: Potentially eligible</span> (3 year waiting period met)`;
        } else {
          html += `• <span class="text-yellow-700 font-semibold">FHA: Waiting period applies</span> (needs ${(3 - yearsSince).toFixed(1)} more years)`;
          if (colorClass === '') colorClass = 'bg-yellow-50 border border-yellow-200';
        }
        break;
        
      case 'short-sale':
        html = `<strong>Short Sale</strong><br>`;
        if (yearsSince >= 4) {
          html += `• <span class="text-green-700 font-semibold">Conventional: Potentially eligible</span> (4 year waiting period typically met)<br>`;
          colorClass = 'bg-green-50 border border-green-200';
        } else {
          html += `• <span class="text-yellow-700 font-semibold">Conventional: May still apply</span> (circumstances dependent)<br>`;
          colorClass = 'bg-yellow-50 border border-yellow-200';
        }
        html += `• <span class="text-green-700 font-semibold">FHA: Often no waiting period</span> if mortgage was current at sale completion`;
        break;
        
      case 'deed-lieu':
        html = `<strong>Deed in Lieu</strong><br>`;
        if (yearsSince >= 4) {
          html += `• <span class="text-green-700 font-semibold">Conventional: Potentially eligible</span> (4 year waiting period met)<br>`;
          html += `• <span class="text-green-700 font-semibold">FHA: Potentially eligible</span> (3 year waiting period met)`;
          colorClass = 'bg-green-50 border border-green-200';
        } else if (yearsSince >= 3) {
          html += `• <span class="text-yellow-700 font-semibold">Conventional: Needs ${(4 - yearsSince).toFixed(1)} more years</span><br>`;
          html += `• <span class="text-green-700 font-semibold">FHA: Potentially eligible</span>`;
          colorClass = 'bg-yellow-50 border border-yellow-200';
        } else {
          html += `• <span class="text-red-700 font-semibold">Both programs: Waiting periods apply</span>`;
          colorClass = 'bg-red-50 border border-red-200';
        }
        break;
        
      case 'collection':
      case 'charge-off':
        html = `<strong>${type === 'collection' ? 'Collection Account' : 'Charge Off'}</strong><br>`;
        html += `• <span class="text-blue-700">Conventional: Does not automatically disqualify</span><br>`;
        html += `• <span class="text-blue-700">FHA: Aggregate balance matters (medical may be excluded)</span><br>`;
        html += `• <span class="text-gray-700 text-xs">Additional documentation likely required</span>`;
        colorClass = 'bg-blue-50 border border-blue-200';
        break;
        
      case 'late-30':
      case 'late-60':
      case 'late-90':
      case 'mortgage-late':
        const severity = type.includes('90') ? 'significant concern' : type.includes('60') ? 'moderate concern' : 'minor concern';
        html = `<strong>Late Payment (${type.includes('30') ? '30' : type.includes('60') ? '60' : '90'} days)</strong><br>`;
        html += `• <span class="text-blue-700">Pattern and recency matter</span><br>`;
        if (yearsSince < 1) {
          html += `• <span class="text-yellow-700">Recent late payment: ${severity}</span><br>`;
          colorClass = 'bg-yellow-50 border border-yellow-200';
        } else {
          html += `• <span class="text-green-700">Occurred ${yearsSince.toFixed(1)} years ago</span><br>`;
          colorClass = 'bg-green-50 border border-green-200';
        }
        html += `• <span class="text-gray-700 text-xs">May require manual underwriting if pattern exists</span>`;
        break;
        
      default:
        html = `<strong>Credit Event Noted</strong><br>`;
        html += `• <span class="text-blue-700">Manual review recommended</span><br>`;
        html += `• <span class="text-gray-700 text-xs">Underwriter will assess impact on eligibility</span>`;
        colorClass = 'bg-blue-50 border border-blue-200';
    }
    
    html += `<br><span class="text-xs text-gray-600 italic mt-2 block">Note: Guideline interpretations are preliminary. Final determination requires full underwriting review.</span>`;
    
    return { html, colorClass };
  };

  const calculateYearsSince = (dateStr: string): number => {
    if (!dateStr) return 0;
    const date = new Date(dateStr);
    const today = new Date();
    return (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
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
          Credit score and financial history
        </p>
      </div>

      {/* FICO Score */}
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

      {/* Number of Borrowers */}
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
      </div>

      {/* Credit Events Question */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Have you had any late payments, bankruptcies, foreclosures, short sales, deed in lieu, loan modifications, collections, charge offs, or other major credit events?
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="hasCreditEvents"
              checked={!hasCreditEvents}
              onChange={() => {
                setHasCreditEvents(false);
                setCreditEvents([]);
              }}
              className="mr-2"
            />
            <span className="text-sm">No</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="hasCreditEvents"
              checked={hasCreditEvents}
              onChange={() => {
                setHasCreditEvents(true);
                if (creditEvents.length === 0) addCreditEvent();
              }}
              className="mr-2"
            />
            <span className="text-sm">Yes</span>
          </label>
        </div>
      </div>

      {/* Credit Events Detail Section */}
      {hasCreditEvents && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-300 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4">Financial Event Details</h3>
          
          <div className="space-y-4">
            {creditEvents.map((event, index) => (
              <div key={event.id} className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-900">Financial Event #{index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeCreditEvent(event.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Financial Issue Type *
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      value={event.type}
                      onChange={(e) => updateCreditEvent(event.id, 'type', e.target.value)}
                    >
                      <option value="">Select type...</option>
                      <option value="late-30">30 Day Late Payment</option>
                      <option value="late-60">60 Day Late Payment</option>
                      <option value="late-90">90 Day Late Payment</option>
                      <option value="bk-ch7">Bankruptcy Chapter 7</option>
                      <option value="bk-ch13">Bankruptcy Chapter 13</option>
                      <option value="foreclosure">Foreclosure</option>
                      <option value="short-sale">Short Sale</option>
                      <option value="deed-lieu">Deed in Lieu</option>
                      <option value="loan-mod">Loan Modification</option>
                      <option value="collection">Collection Account</option>
                      <option value="charge-off">Charge Off</option>
                      <option value="repossession">Repossession</option>
                      <option value="judgment">Judgment</option>
                      <option value="tax-lien">Tax Lien</option>
                      <option value="mortgage-late">Mortgage Lates</option>
                      <option value="student-default">Student Loan Default</option>
                      <option value="credit-counseling">Consumer Credit Counseling</option>
                      <option value="forbearance">Forbearance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Date Occurred *
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        value={event.dateOccurred}
                        onChange={(e) => updateCreditEvent(event.id, 'dateOccurred', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Date Resolved/Discharged
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        value={event.dateResolved}
                        onChange={(e) => updateCreditEvent(event.id, 'dateResolved', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Currently active/unresolved?
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        value={event.isActive ? 'yes' : 'no'}
                        onChange={(e) => updateCreditEvent(event.id, 'isActive', e.target.value === 'yes')}
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Related to housing/mortgage?
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        value={event.isHousingRelated ? 'yes' : 'no'}
                        onChange={(e) => updateCreditEvent(event.id, 'isHousingRelated', e.target.value === 'yes')}
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Additional Notes
                    </label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="Any additional context..."
                      value={event.notes}
                      onChange={(e) => updateCreditEvent(event.id, 'notes', e.target.value)}
                    />
                  </div>
                  
                  {/* Guideline Assessment */}
                  {event.type && event.dateOccurred && (
                    <div className={`mt-3 p-3 rounded-lg ${
                      getWaitingPeriodGuidance(
                        event.type,
                        calculateYearsSince(event.dateResolved || event.dateOccurred)
                      ).colorClass
                    }`}>
                      <p className="text-xs font-semibold mb-2">Guideline Assessment:</p>
                      <div
                        className="text-xs space-y-1"
                        dangerouslySetInnerHTML={{
                          __html: getWaitingPeriodGuidance(
                            event.type,
                            calculateYearsSince(event.dateResolved || event.dateOccurred)
                          ).html
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addCreditEvent}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            + Add Financial Event
          </button>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-gray-700">
            <strong>Disclaimer:</strong> Results are preliminary guideline interpretations only and do not represent final loan approval.
          </div>
        </div>
      )}

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
