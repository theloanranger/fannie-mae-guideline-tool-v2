import React from 'react';

interface QualificationResult {
  result: string;
  resultLabel: string;
  explanation: string;
  fannieMaeAlignment: string;
  nextStep: string;
  flags: string[];
  itemsNeeded: string[];
}

interface QualificationDisplayProps {
  qualification: QualificationResult;
}

export default function QualificationDisplay({ qualification }: QualificationDisplayProps) {
  const getResultColor = () => {
    switch (qualification.result) {
      case 'appears-qualified':
        return 'text-green-700';
      case 'may-qualify':
        return 'text-yellow-700';
      case 'needs-work':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  const getBorderColor = () => {
    switch (qualification.result) {
      case 'appears-qualified':
        return 'border-green-300';
      case 'may-qualify':
        return 'border-yellow-300';
      case 'needs-work':
        return 'border-red-300';
      default:
        return 'border-gray-300';
    }
  };

  return (
    <div className={`mt-6 bg-gradient-to-br from-green-50 to-blue-50 border-2 ${getBorderColor()} rounded-lg p-6`}>
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        🎯 Fannie Mae Qualification Assessment
      </h3>
      
      <div className="bg-white rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Qualification Result:</span>
          <span className={`text-lg font-bold ${getResultColor()}`}>
            {qualification.resultLabel}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Explanation</h4>
          <p className="text-sm text-gray-700">{qualification.explanation}</p>
        </div>

        <div className="bg-white rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Fannie Mae Alignment</h4>
          <p className="text-sm text-gray-700">{qualification.fannieMaeAlignment}</p>
        </div>

        {qualification.flags.length > 0 && (
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">⚠️ Important Notes</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              {qualification.flags.map((flag, idx) => (
                <li key={idx}>• {flag}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-white rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Next Step</h4>
          <p className="text-sm font-semibold text-blue-700">{qualification.nextStep}</p>
        </div>

        <div className="bg-white rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Documents Needed</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {qualification.itemsNeeded.map((doc, idx) => (
              <li key={idx}>• {doc}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
