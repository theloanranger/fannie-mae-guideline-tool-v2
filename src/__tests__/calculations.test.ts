import { describe, it, expect } from 'vitest';
import {
  calculatePrincipalAndInterest,
  calculateLTV,
  calculateDTI,
  calculateHousingRatio,
  calculateGrossMonthlyIncome,
  estimateMortgageInsurance,
  calculateMonthlyPropertyTax,
  estimateMonthlyInsurance,
} from '../lib/calculations';

describe('calculatePrincipalAndInterest', () => {
  it('should calculate correct P&I for typical 30-year loan', () => {
    const result = calculatePrincipalAndInterest(300000, 6.5, 30);
    expect(result).toBeCloseTo(1896.20, 1);
  });

  it('should calculate correct P&I for 15-year loan', () => {
    const result = calculatePrincipalAndInterest(300000, 6.5, 15);
    expect(result).toBeCloseTo(2613.32, 1);
  });

  it('should handle zero interest rate', () => {
    const result = calculatePrincipalAndInterest(120000, 0, 30);
    expect(result).toBeCloseTo(333.33, 1);
  });

  it('should return 0 for invalid inputs', () => {
    expect(calculatePrincipalAndInterest(0, 6.5, 30)).toBe(0);
    expect(calculatePrincipalAndInterest(-1000, 6.5, 30)).toBe(0);
    expect(calculatePrincipalAndInterest(300000, -1, 30)).toBe(0);
  });

  it('should calculate correct P&I for high interest rate', () => {
    const result = calculatePrincipalAndInterest(500000, 8.0, 30);
    expect(result).toBeCloseTo(3668.82, 1);
  });
});

describe('calculateLTV', () => {
  it('should calculate correct LTV for 20% down', () => {
    const result = calculateLTV(400000, 500000);
    expect(result).toBe(80);
  });

  it('should calculate correct LTV for 10% down', () => {
    const result = calculateLTV(450000, 500000);
    expect(result).toBe(90);
  });

  it('should calculate correct LTV for 3% down', () => {
    const result = calculateLTV(485000, 500000);
    expect(result).toBe(97);
  });

  it('should handle edge cases', () => {
    expect(calculateLTV(0, 500000)).toBe(0);
    expect(calculateLTV(500000, 0)).toBe(0);
  });

  it('should round to 2 decimal places', () => {
    const result = calculateLTV(333333, 500000);
    expect(result).toBe(66.67);
  });
});

describe('calculateDTI', () => {
  it('should calculate correct DTI', () => {
    const result = calculateDTI(2500, 8000);
    expect(result).toBe(31.25);
  });

  it('should handle high DTI', () => {
    const result = calculateDTI(4000, 8000);
    expect(result).toBe(50);
  });

  it('should return 0 for zero income', () => {
    const result = calculateDTI(2500, 0);
    expect(result).toBe(0);
  });

  it('should round to 2 decimal places', () => {
    const result = calculateDTI(3333, 10000);
    expect(result).toBe(33.33);
  });
});

describe('calculateHousingRatio', () => {
  it('should calculate correct housing ratio', () => {
    const result = calculateHousingRatio(2240, 8000);
    expect(result).toBe(28);
  });

  it('should handle high ratio', () => {
    const result = calculateHousingRatio(3200, 8000);
    expect(result).toBe(40);
  });

  it('should return 0 for zero income', () => {
    const result = calculateHousingRatio(2000, 0);
    expect(result).toBe(0);
  });
});

describe('calculateGrossMonthlyIncome', () => {
  it('should calculate monthly from annual base only', () => {
    const result = calculateGrossMonthlyIncome(96000);
    expect(result).toBe(8000);
  });

  it('should include bonus and overtime', () => {
    const result = calculateGrossMonthlyIncome(96000, 12000, 12000);
    expect(result).toBe(10000);
  });

  it('should handle decimals correctly', () => {
    const result = calculateGrossMonthlyIncome(100000, 5000, 3000);
    expect(result).toBe(9000);
  });

  it('should default optional params to 0', () => {
    const result = calculateGrossMonthlyIncome(120000);
    expect(result).toBe(10000);
  });
});

describe('estimateMortgageInsurance', () => {
  it('should return 0 for LTV at or below 80%', () => {
    expect(estimateMortgageInsurance(400000, 80)).toBe(0);
    expect(estimateMortgageInsurance(400000, 75)).toBe(0);
  });

  it('should estimate MI for LTV 81-85%', () => {
    const result = estimateMortgageInsurance(400000, 83);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeCloseTo(106.67, 1); // 0.32% annual / 12
  });

  it('should estimate higher MI for LTV 86-90%', () => {
    const result = estimateMortgageInsurance(400000, 88);
    expect(result).toBeCloseTo(183.33, 1); // 0.55% annual / 12
  });

  it('should estimate higher MI for LTV 91-95%', () => {
    const result = estimateMortgageInsurance(400000, 93);
    expect(result).toBeCloseTo(233.33, 1); // 0.70% annual / 12
  });

  it('should estimate highest MI for LTV > 95%', () => {
    const result = estimateMortgageInsurance(400000, 97);
    expect(result).toBeCloseTo(283.33, 1); // 0.85% annual / 12
  });
});

describe('calculateMonthlyPropertyTax', () => {
  it('should calculate monthly tax correctly', () => {
    const result = calculateMonthlyPropertyTax(500000, 0.012);
    expect(result).toBe(500);
  });

  it('should handle high tax rate', () => {
    const result = calculateMonthlyPropertyTax(1000000, 0.025);
    expect(result).toBe(2083.33);
  });

  it('should handle low tax rate', () => {
    const result = calculateMonthlyPropertyTax(300000, 0.008);
    expect(result).toBe(200);
  });
});

describe('estimateMonthlyInsurance', () => {
  it('should estimate insurance at ~0.42% annually', () => {
    const result = estimateMonthlyInsurance(500000);
    expect(result).toBeCloseTo(175, 5); // 500000 * 0.0042 / 12
  });

  it('should scale with purchase price', () => {
    const result1 = estimateMonthlyInsurance(300000);
    const result2 = estimateMonthlyInsurance(600000);
    expect(result2).toBeCloseTo(result1 * 2, 1);
  });
});
