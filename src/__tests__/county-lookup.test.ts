import { describe, it, expect } from 'vitest';
import {
  getCountyLoanLimits,
  determineLoanType,
  getCountyTaxRate,
  getCountiesForState,
  getAvailableStates,
} from '../lib/county-lookup';

describe('getCountyLoanLimits', () => {
  it('should return high-balance limits for SF Bay Area counties', () => {
    const limits = getCountyLoanLimits('CA', 'Santa Clara');
    expect(limits.conforming).toBe(806500);
    expect(limits.highBalance).toBe(1209750);
  });

  it('should return conforming limits for standard counties', () => {
    const limits = getCountyLoanLimits('CA', 'Sacramento');
    expect(limits.conforming).toBe(806500);
    expect(limits.highBalance).toBe(806500);
  });

  it('should return default limits for unknown county', () => {
    const limits = getCountyLoanLimits('CA', 'UnknownCounty');
    expect(limits.conforming).toBe(806500);
    expect(limits.highBalance).toBe(806500);
  });

  it('should return default limits for unknown state', () => {
    const limits = getCountyLoanLimits('ZZ', 'AnyCounty');
    expect(limits.conforming).toBe(806500);
    expect(limits.highBalance).toBe(806500);
  });
});

describe('determineLoanType', () => {
  it('should classify as conforming for loan within conforming limit', () => {
    const result = determineLoanType(700000, 'CA', 'Sacramento');
    expect(result.loanType).toBe('conforming');
    expect(result.conformingLimit).toBe(806500);
  });

  it('should classify as high-balance for loan between conforming and high-balance', () => {
    const result = determineLoanType(900000, 'CA', 'Santa Clara');
    expect(result.loanType).toBe('high-balance');
    expect(result.conformingLimit).toBe(806500);
    expect(result.highBalanceLimit).toBe(1209750);
  });

  it('should classify as jumbo for loan exceeding high-balance limit', () => {
    const result = determineLoanType(1500000, 'CA', 'Santa Clara');
    expect(result.loanType).toBe('jumbo');
  });

  it('should handle edge case at exact conforming limit', () => {
    const result = determineLoanType(806500, 'CA', 'Sacramento');
    expect(result.loanType).toBe('conforming');
  });

  it('should handle edge case at exact high-balance limit', () => {
    const result = determineLoanType(1209750, 'CA', 'Santa Clara');
    expect(result.loanType).toBe('high-balance');
  });
});

describe('getCountyTaxRate', () => {
  it('should return correct tax rate for known county', () => {
    const rate = getCountyTaxRate('CA', 'Santa Clara');
    expect(rate).toBe(0.0120);
  });

  it('should return correct tax rate for high-tax NY county', () => {
    const rate = getCountyTaxRate('NY', 'Nassau');
    expect(rate).toBe(0.0195);
  });

  it('should return default rate for unknown county', () => {
    const rate = getCountyTaxRate('CA', 'UnknownCounty');
    expect(rate).toBe(0.0120); // DEFAULT rate
  });

  it('should return default rate for unknown state', () => {
    const rate = getCountyTaxRate('ZZ', 'AnyCounty');
    expect(rate).toBe(0.0120);
  });
});

describe('getCountiesForState', () => {
  it('should return counties for California', () => {
    const counties = getCountiesForState('CA');
    expect(counties).toContain('Santa Clara');
    expect(counties).toContain('Los Angeles');
    expect(counties).toContain('San Francisco');
    expect(counties.length).toBeGreaterThan(0);
  });

  it('should return counties for Texas', () => {
    const counties = getCountiesForState('TX');
    expect(counties).toContain('Harris');
    expect(counties).toContain('Dallas');
  });

  it('should return sorted county list', () => {
    const counties = getCountiesForState('CA');
    const sorted = [...counties].sort();
    expect(counties).toEqual(sorted);
  });

  it('should return empty array for unknown state', () => {
    const counties = getCountiesForState('ZZ');
    expect(counties).toEqual([]);
  });
});

describe('getAvailableStates', () => {
  it('should return list of available states', () => {
    const states = getAvailableStates();
    expect(states).toContain('CA');
    expect(states).toContain('NY');
    expect(states).toContain('TX');
    expect(states).toContain('FL');
    expect(states).toContain('WA');
  });

  it('should not include DEFAULT in states list', () => {
    const states = getAvailableStates();
    expect(states).not.toContain('DEFAULT');
  });

  it('should return sorted state list', () => {
    const states = getAvailableStates();
    const sorted = [...states].sort();
    expect(states).toEqual(sorted);
  });
});
