// Currency types and pricing
export const CURRENCY_PRICING = {
  USD: { symbol: '$', code: 'USD', license: 10, advanced: 9, total: 19 },
  EUR: { symbol: '€', code: 'EUR', license: 10, advanced: 9, total: 19 },
  GBP: { symbol: '£', code: 'GBP', license: 8.5, advanced: 7.5, total: 16 },
  CAD: { symbol: 'C$', code: 'CAD', license: 14.5, advanced: 13, total: 27.5 },
  AUD: { symbol: 'A$', code: 'AUD', license: 16.5, advanced: 15, total: 31.5 },
} as const;

export type Currency = keyof typeof CURRENCY_PRICING;

// Partner types
export type AgencyTier = 'Registered' | 'Gold' | 'Platinum' | 'Diamond';
export type CommitmentType = 'Monthly Spending' | 'Annual Spending';
export type CommitmentDuration = '12 months' | '24 months' | '36 months';
export type ContractType = 'Reseller' | 'Direct';
export type SupportLevel = 'No Support' | 'Advanced Support' | 'Premium Support';

// Template types
export type TemplateType =
  | '1-marketing-website'
  | '5-marketing-websites'
  | '1-ecommerce-website'
  | '5-ecommerce-websites'
  | 'small-agency'
  | 'large-agency';

// Cost variation pattern types
export type VariationPattern =
  | 'super-stable'
  | 'seasonal'
  | 'highly-seasonal'
  | 'steady-growth'
  | 'highly-variable';

// Calculator inputs
export interface CalculatorInputs {
  agencyTier: AgencyTier;
  commitmentType: CommitmentType;
  commitmentDuration: CommitmentDuration;
  contractType: ContractType;
  freeUserLicenses: number;
  supportLevel: SupportLevel;
  currency: Currency;
  template: TemplateType;
  averageMonthlyCost: number; // $1000 to $20000
  variationPattern: VariationPattern;
}

// Discount calculations
export interface Discounts {
  resellerDiscount: number;
  commitmentDiscount: number;
  commitmentBonus: number;
  referralYear1: number;
  referralFollowing: number;
}

// Monthly calculation result
export interface MonthlyCalculation {
  month: number;
  year: number;
  baseUsage: number;
  costVariation: number;
  usage: number;
  freeLicenses: number;
  supportDiscount: number;
  resellerDiscount: number;
  usageAfterDiscount: number;
  committedAmount: number;
  costOfCommitmentYearly: number;
  costOfCommitmentMonthly: number;
  trueUp: number;
  overage: number;
  monthlyCost: number;
  blendedDiscount: number;
}

// Yearly summary
export interface YearlySummary {
  year: number;
  totalUsage: number;
  totalUsageAfterDiscount: number;
  totalTrueUp: number;
  totalOverage: number;
  totalMonthlyCost: number;
  averageBlendedDiscount: number;
  yearlyCommitment: number;
}

// Complete calculation result
export interface CalculationResult {
  monthlyCalculations: MonthlyCalculation[];
  yearlySummaries: YearlySummary[];
  discounts: Discounts;
  totalCost: number;
  totalSavings: number;
}

// Template definition
export interface Template {
  id: TemplateType;
  name: string;
  description: string;
  icon: string;
  baseMonthlyUsage: number; // Base usage pattern
  variability: number; // How much it varies month-to-month
  defaultMonthlyCost: number; // Default monthly cost estimate
}

// Variation pattern definition
export interface VariationPatternDef {
  id: VariationPattern;
  name: string;
  description: string;
  variationPercentage: string;
  peakMonths?: number[];
  growthRate?: number;
  variability?: number;
}
