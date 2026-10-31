/**
 * Currency Utilities for Brightloop
 * All monetary amounts in database are stored in minor units (paise) as integers.
 * 100 paise = 1 INR (₹1)
 * Tax rates are stored in basis points (e.g., 1800 = 18.00%).
 */

export const paiseToRupees = (paise: number): number => {
  return Number((paise / 100).toFixed(2));
};

export const rupeesToPaise = (rupees: number): number => {
  return Math.round(rupees * 100);
};

export const formatRupees = (paise: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(paise / 100);
};

export const calculateTaxAmount = (baseAmountPaise: number, taxRateBasisPoints: number): number => {
  // taxRateBasisPoints / 10000 = fractional rate (e.g. 1800 / 10000 = 0.18)
  return Math.round((baseAmountPaise * taxRateBasisPoints) / 10000);
};

export const calculateDiscountAmount = (
  baseAmountPaise: number,
  discountType: 'FIXED' | 'PERCENTAGE',
  discountValue: number
): number => {
  if (discountType === 'FIXED') {
    // discountValue is in paise
    return Math.min(baseAmountPaise, Math.max(0, discountValue));
  }
  // PERCENTAGE: discountValue is in basis points (e.g. 1000 = 10%)
  const calculated = Math.round((baseAmountPaise * discountValue) / 10000);
  return Math.min(baseAmountPaise, Math.max(0, calculated));
};

