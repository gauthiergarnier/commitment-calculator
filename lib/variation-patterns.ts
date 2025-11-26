import { VariationPattern, VariationPatternDef } from './types';

export const VARIATION_PATTERNS: Record<VariationPattern, VariationPatternDef> = {
  'super-stable': {
    id: 'super-stable',
    name: 'Super Stable',
    description: 'Very predictable usage with minimal variation',
    variationPercentage: '<5%',
    variability: 0.03,
  },
  'seasonal': {
    id: 'seasonal',
    name: 'Seasonal',
    description: '4 months of higher costs (50-100% more)',
    variationPercentage: '50-100%',
    peakMonths: [10, 11, 0, 1], // Oct, Nov, Dec, Jan
    variability: 0.75,
  },
  'highly-seasonal': {
    id: 'highly-seasonal',
    name: 'Highly Seasonal',
    description: "5x peak for Mother's Day and Valentine's Day",
    variationPercentage: '500%',
    peakMonths: [1, 4], // Feb (Valentine's), May (Mother's Day)
    variability: 4,
  },
  'steady-growth': {
    id: 'steady-growth',
    name: 'Steady Growth',
    description: 'Consistent 5% monthly growth',
    variationPercentage: '+5%/month',
    growthRate: 0.05,
    variability: 0,
  },
  'highly-variable': {
    id: 'highly-variable',
    name: 'Highly Variable',
    description: 'Unpredictable ±30% variation',
    variationPercentage: '±30%',
    variability: 0.3,
  },
};

export function getVariationPattern(id: VariationPattern): VariationPatternDef {
  return VARIATION_PATTERNS[id];
}

export function getAllVariationPatterns(): VariationPatternDef[] {
  return Object.values(VARIATION_PATTERNS);
}

/**
 * Generate 36 months of usage based on average cost and variation pattern
 */
export function generateMonthlyUsage(
  averageMonthlyCost: number,
  pattern: VariationPattern
): number[][] {
  const patternDef = VARIATION_PATTERNS[pattern];
  const usage: number[][] = [];

  for (let year = 0; year < 3; year++) {
    const yearUsage: number[] = [];

    for (let month = 0; month < 12; month++) {
      let monthUsage = averageMonthlyCost;

      // Apply pattern-specific logic
      if (patternDef.growthRate !== undefined) {
        // Steady growth: compound growth over time
        const monthsElapsed = year * 12 + month;
        monthUsage = averageMonthlyCost * Math.pow(1 + patternDef.growthRate, monthsElapsed);
      } else if (patternDef.peakMonths && patternDef.peakMonths.length > 0) {
        // Seasonal or highly seasonal
        if (patternDef.peakMonths.includes(month)) {
          monthUsage = averageMonthlyCost * (1 + patternDef.variability);
        } else {
          // Lower usage in non-peak months to balance out
          const numPeakMonths = patternDef.peakMonths.length;
          const numNormalMonths = 12 - numPeakMonths;
          const totalPeakExtra = numPeakMonths * averageMonthlyCost * patternDef.variability;
          monthUsage = averageMonthlyCost - (totalPeakExtra / numNormalMonths);
        }
      } else {
        // Super stable or highly variable: random variation around average
        const variation = (Math.random() - 0.5) * 2 * patternDef.variability;
        monthUsage = averageMonthlyCost * (1 + variation);
      }

      yearUsage.push(Math.round(monthUsage));
    }

    usage.push(yearUsage);
  }

  return usage;
}

/**
 * Calculate optimal yearly commitments based on usage pattern
 */
export function calculateOptimalCommitments(monthlyUsage: number[][]): number[] {
  return monthlyUsage.map((yearUsage) => {
    // Calculate average monthly usage for the year
    const avgMonthly = yearUsage.reduce((sum, val) => sum + val, 0) / 12;
    // Commitment should be slightly lower than average to allow for some overage
    // but not too low to maximize discount benefits
    return Math.round(avgMonthly * 12 * 0.9);
  });
}
