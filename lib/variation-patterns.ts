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

export interface MonthlyUsageData {
  baseUsage: number;
  variation: number;
  totalUsage: number;
}

/**
 * Generate 36 months of usage based on average cost and variation pattern
 */
export function generateMonthlyUsage(
  averageMonthlyCost: number,
  pattern: VariationPattern,
  applyVariations: boolean = true
): MonthlyUsageData[][] {
  const patternDef = VARIATION_PATTERNS[pattern];
  const usage: MonthlyUsageData[][] = [];

  for (let year = 0; year < 3; year++) {
    const yearUsage: MonthlyUsageData[] = [];

    for (let month = 0; month < 12; month++) {
      const baseUsage = averageMonthlyCost;
      let variation = 0;

      if (applyVariations) {
        // Apply pattern-specific logic
        if (patternDef.growthRate !== undefined) {
          // Steady growth: compound growth over time
          const monthsElapsed = year * 12 + month;
          const growthMultiplier = Math.pow(1 + patternDef.growthRate, monthsElapsed);
          variation = baseUsage * (growthMultiplier - 1);
        } else if (patternDef.peakMonths && patternDef.peakMonths.length > 0) {
          // Seasonal or highly seasonal
          if (patternDef.peakMonths.includes(month)) {
            variation = baseUsage * (patternDef.variability || 0);
          } else {
            // Lower usage in non-peak months to balance out
            const numPeakMonths = patternDef.peakMonths.length;
            const numNormalMonths = 12 - numPeakMonths;
            const totalPeakExtra = numPeakMonths * baseUsage * (patternDef.variability || 0);
            variation = -(totalPeakExtra / numNormalMonths);
          }
        } else {
          // Super stable or highly variable: random variation around average
          const variationPercent = (Math.random() - 0.5) * 2 * (patternDef.variability || 0);
          variation = baseUsage * variationPercent;
        }
      }

      yearUsage.push({
        baseUsage: Math.round(baseUsage),
        variation: Math.round(variation),
        totalUsage: Math.round(baseUsage + variation),
      });
    }

    usage.push(yearUsage);
  }

  return usage;
}
