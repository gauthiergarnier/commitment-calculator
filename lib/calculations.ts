import {
  CalculatorInputs,
  Discounts,
  MonthlyCalculation,
  YearlySummary,
  CalculationResult,
  CURRENCY_PRICING,
} from './types';
import { MonthlyUsageData } from './variation-patterns';

/**
 * Calculate all discount percentages based on partner configuration
 */
export function calculateDiscounts(inputs: CalculatorInputs): Discounts {
  // Reseller discount: 10% for non-registered resellers
  const resellerDiscount =
    inputs.contractType === 'Reseller' && inputs.agencyTier !== 'Registered' ? 0.1 : 0;

  // Commitment discount based on type and duration
  let commitmentDiscount = 0;
  if (inputs.commitmentType === 'Monthly Spending') {
    if (inputs.commitmentDuration === '12 months') commitmentDiscount = 0.1;
    else if (inputs.commitmentDuration === '24 months') commitmentDiscount = 0.15;
    else if (inputs.commitmentDuration === '36 months') commitmentDiscount = 0.2;
  } else if (inputs.commitmentType === 'Annual Spending') {
    if (inputs.commitmentDuration === '12 months') commitmentDiscount = 0.05;
    else if (inputs.commitmentDuration === '24 months') commitmentDiscount = 0.1;
    else if (inputs.commitmentDuration === '36 months') commitmentDiscount = 0.15;
  }

  // Commitment bonus for resellers with monthly spending
  let commitmentBonus = 0;
  if (inputs.contractType === 'Reseller' && inputs.commitmentType === 'Monthly Spending') {
    if (inputs.agencyTier === 'Gold') commitmentBonus = 0.05;
    else if (inputs.agencyTier === 'Platinum' || inputs.agencyTier === 'Diamond')
      commitmentBonus = 0.07;
  }

  // Referral commissions (informational, not applied to costs)
  const referralYear1 = inputs.agencyTier !== 'Registered' ? 0.1 : 0;

  let referralFollowing = 0;
  if (inputs.agencyTier === 'Gold') referralFollowing = 0.02;
  else if (inputs.agencyTier === 'Platinum') referralFollowing = 0.035;
  else if (inputs.agencyTier === 'Diamond') referralFollowing = 0.05;

  return {
    resellerDiscount,
    commitmentDiscount,
    commitmentBonus,
    referralYear1,
    referralFollowing,
  };
}

/**
 * Calculate complete 36-month projection with yearly summaries
 */
export function calculateProjection(
  inputs: CalculatorInputs,
  monthlyUsage: MonthlyUsageData[][],
  yearCommitments: number[]
): CalculationResult {
  const discounts = calculateDiscounts(inputs);
  const monthlyCalculations: MonthlyCalculation[] = [];
  const yearlySummaries: YearlySummary[] = [];

  for (let yearIndex = 0; yearIndex < 3; yearIndex++) {
    const yearlyCommitment = yearCommitments[yearIndex];
    const committedMonthly = yearlyCommitment / 12;
    const costOfCommitment =
      yearlyCommitment * (1 - (discounts.commitmentDiscount + discounts.commitmentBonus));
    const monthlyCommitmentCost = costOfCommitment / 12;

    let yearTotalUsage = 0;
    let yearTotalUsageAfterDiscount = 0;
    let yearTotalTrueUp = 0;
    let yearTotalOverage = 0;
    let yearTotalMonthlyCost = 0;

    // Calculate each month
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const usageData = monthlyUsage[yearIndex][monthIndex];
      const baseUsage = usageData.baseUsage;
      const costVariation = usageData.variation;
      const usage = usageData.totalUsage;
      const freeLicenses = -CURRENCY_PRICING[inputs.currency].total * inputs.freeUserLicenses;

      // Support discount
      let supportDiscount = 0;
      if (inputs.supportLevel === 'Advanced Support') {
        supportDiscount = -usage * 0.05;
      } else if (inputs.supportLevel === 'Premium Support') {
        supportDiscount = -usage * 0.04;
      }

      const resellerDiscountAmount = -discounts.resellerDiscount * usage;
      const usageAfterDiscount = usage + freeLicenses + supportDiscount + resellerDiscountAmount;

      const trueUp = Math.max(0, committedMonthly - usageAfterDiscount);
      const overage = Math.max(0, usageAfterDiscount - committedMonthly);
      const monthlyCost = monthlyCommitmentCost + overage;
      const blendedDiscount = usage > 0 ? (monthlyCost - usage) / usage : 0;

      yearTotalUsage += usage;
      yearTotalUsageAfterDiscount += usageAfterDiscount;
      yearTotalTrueUp += trueUp;
      yearTotalOverage += overage;
      yearTotalMonthlyCost += monthlyCost;

      monthlyCalculations.push({
        month: monthIndex + 1,
        year: yearIndex + 1,
        baseUsage,
        costVariation,
        usage,
        freeLicenses,
        supportDiscount,
        resellerDiscount: resellerDiscountAmount,
        usageAfterDiscount,
        committedAmount: committedMonthly,
        costOfCommitmentYearly: costOfCommitment,
        costOfCommitmentMonthly: monthlyCommitmentCost,
        trueUp,
        overage,
        monthlyCost,
        blendedDiscount,
      });
    }

    const averageBlendedDiscount =
      yearTotalUsage > 0 ? (yearTotalMonthlyCost - yearTotalUsage) / yearTotalUsage : 0;

    yearlySummaries.push({
      year: yearIndex + 1,
      totalUsage: yearTotalUsage,
      totalUsageAfterDiscount: yearTotalUsageAfterDiscount,
      totalTrueUp: yearTotalTrueUp,
      totalOverage: yearTotalOverage,
      totalMonthlyCost: yearTotalMonthlyCost,
      averageBlendedDiscount,
      yearlyCommitment,
    });
  }

  const totalCost = yearlySummaries.reduce((sum, year) => sum + year.totalMonthlyCost, 0);
  const totalUsageWithoutDiscounts = yearlySummaries.reduce(
    (sum, year) => sum + year.totalUsage,
    0
  );
  const totalSavings = totalUsageWithoutDiscounts - totalCost;

  return {
    monthlyCalculations,
    yearlySummaries,
    discounts,
    totalCost,
    totalSavings,
  };
}

/**
 * Format currency value with proper symbol
 */
export function formatCurrency(value: number, currency: keyof typeof CURRENCY_PRICING): string {
  const pricing = CURRENCY_PRICING[currency];
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: pricing.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format percentage value
 */
export function formatPercent(value: number): string {
  return (value * 100).toFixed(1) + '%';
}

/**
 * Calculate optimal yearly commitments based on average usage after discounts
 * Returns the average of usageAfterDiscount × 12 for each year
 */
export function calculateOptimalCommitments(result: CalculationResult): [number, number, number] {
  const commitments: [number, number, number] = [0, 0, 0];

  for (let year = 0; year < 3; year++) {
    const yearMonths = result.monthlyCalculations.filter((m) => m.year === year + 1);
    const avgUsageAfterDiscount = yearMonths.reduce((sum, m) => sum + m.usageAfterDiscount, 0) / 12;
    commitments[year] = Math.round(avgUsageAfterDiscount * 12);
  }

  return commitments;
}
