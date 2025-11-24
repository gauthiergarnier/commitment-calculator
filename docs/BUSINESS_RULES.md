# Business Rules

This document defines all business rules and calculation formulas used in the Agency Commitment & Discount Calculator.

## Overview

The calculator helps Agencies and System Integrators (SIs) determine optimal commitment amounts by calculating discounts, costs, and effective rates based on various configuration parameters and usage patterns.

## Discount Rules

### 1. Reseller Discount

- **Applicability**: Applied to all usage amounts
- **Rate**: 10%
- **Conditions**:
  - Contract Type must be "Reseller"
  - Agency Tier must NOT be "Registered"
- **Formula**: `Reseller Discount = -10% × Usage` (when conditions met, otherwise 0%)

### 2. Commitment Discount

- **Applicability**: Applied to the yearly commitment amount (affects cost of commitment)
- **Rates**:

  **Monthly Spending Commitments:**
  - 12 months: 10%
  - 24 months: 15%
  - 36 months: 20%

  **Annual Spending Commitments:**
  - 12 months: 5%
  - 24 months: 10%
  - 36 months: 15%

- **Formula**: `Cost of Commitment = Yearly Commitment × (1 - (Commitment Discount + Commitment Bonus))`

### 3. Commitment Bonus

- **Applicability**: Applied to the yearly commitment amount (affects cost of commitment)
- **Rates**:
  - Gold tier: 5%
  - Platinum tier: 7%
  - Diamond tier: 7%
  - Registered tier: 0%
- **Conditions**:
  - Contract Type must be "Reseller"
  - Commitment Type must be "Monthly Spending"
- **Formula**: Combined with Commitment Discount in cost calculation

### 4. Referral Commissions

**First Year Commission:**
- All tiers except Registered: 10%
- Registered tier: 0%

**Following Years Commission:**
- Gold: 2%
- Platinum: 3.5%
- Diamond: 5%
- Registered: 0%

*Note: Referral commissions are displayed but not included in cost calculations.*

## Usage Discounts

### Free User Licenses

- **Rate**: $19 per license per month
- **Application**: Deducted from monthly usage
- **Formula**: `Free License Discount = -$19 × Number of Free Licenses`

### Support Level Discounts

**Advanced Support:**
- Rate: -5% of monthly usage
- Formula: `Support Discount = -5% × Monthly Usage`

**Premium Support:**
- Rate: -4% of monthly usage
- Formula: `Support Discount = -4% × Monthly Usage`

**None:**
- No discount applied

## Monthly Calculation Flow

For each month, calculations proceed in this order:

1. **Base Usage**: Monthly usage at list price (editable input)

2. **Usage After Discount**:
   ```
   Usage After Discount = Monthly Usage
                        + Free License Discount
                        + Support Discount
                        + Reseller Discount
   ```

3. **Committed Amount**:
   ```
   Monthly Committed Amount = Yearly Commitment / 12
   ```

4. **True Up** (unused commitment):
   ```
   True Up = max(0, Monthly Committed Amount - Usage After Discount)
   ```
   *True Up represents the unused portion of the monthly commitment.*

5. **Overage** (usage exceeding commitment):
   ```
   Overage = max(0, Usage After Discount - Monthly Committed Amount)
   ```
   *Overage is billed at list price.*

6. **Monthly Cost**:
   ```
   Cost of Commitment (monthly) = (Yearly Commitment × (1 - (Commitment Discount + Commitment Bonus))) / 12
   Monthly Cost = Cost of Commitment (monthly) + Overage
   ```

7. **Blended Discount**:
   ```
   Blended Discount = (Monthly Cost - Monthly Usage) / Monthly Usage
   ```
   *Negative values indicate savings; positive values indicate additional costs.*

## Yearly Calculation

Yearly totals are the sum of all 12 monthly values:

- **Total Usage**: Sum of all monthly usage amounts
- **Total Usage After Discount**: Sum of all monthly usage after discounts
- **Total True Up**: Sum of all monthly true-up amounts
- **Total Overage**: Sum of all monthly overage amounts
- **Total Monthly Cost**: Sum of all monthly costs
- **Yearly Blended Discount**:
  ```
  (Total Monthly Cost - Total Usage) / Total Usage
  ```

## Overall Metrics

### Average Monthly Cost

Calculated across all commitment period (default: 36 months):

```
Average Monthly Cost = Sum of all Monthly Costs / Total Number of Months
```

For a 3-year commitment:
```
Average Monthly Cost = (Year1 Total Cost + Year2 Total Cost + Year3 Total Cost) / 36
```

## Editable vs. Calculated Values

### Editable Values (User Inputs)

**Configuration Level:**
- Agency Tier
- Commitment Type
- Commitment Duration
- Contract Type
- Support Level
- Free User Licenses

**Data Grid Level:**
- Monthly Usage (List Price) - for each month row
- Yearly Commitment Amount - for each year row

### Calculated Values (Auto-computed)

All other values are automatically calculated based on the business rules above:
- Free Licenses discount
- Support Discount
- Reseller Discount
- Usage After Discount
- Committed Amount (monthly breakdown)
- True Up
- Overage
- Monthly Cost
- Blended Discount
- All yearly totals
- Average monthly cost

## Validation Rules

1. **Positive Values Only**: All monetary and numeric inputs must be ≥ 0
2. **Integer Constraints**:
   - Free User Licenses: Must be whole numbers
   - Monthly Usage: Can be decimals (dollars and cents)
   - Yearly Commitments: Typically whole numbers
3. **Realistic Ranges**:
   - Suggested minimum yearly commitment: $1,000
   - Suggested minimum monthly usage: $100
   - Maximum values: No hard limits, but calculations must not overflow

## Data Persistence

Currently, the calculator does not persist data. All values reset to defaults on page reload:

**Default Values:**
- Agency Tier: Platinum
- Commitment Type: Monthly Spending
- Commitment Duration: 36 months
- Contract Type: Reseller
- Support Level: Advanced Support
- Free User Licenses: 10
- Year 1 Commitment: $14,000
- Year 2 Commitment: $15,000
- Year 3 Commitment: $14,000
- Monthly Usage: [1512, 1800, 1200, 1500, 5000, 500, 1500, 1500, 1500, 1500, 1500, 1500]

## Calculation Precision

- All financial calculations use floating-point arithmetic
- Currency values are displayed rounded to the nearest dollar
- Percentage values are displayed to one decimal place (e.g., "15.5%")
- Internal calculations maintain full precision

## Business Constraints

1. **Commitment Period**: Currently fixed at 3 years (36 months)
2. **Yearly Pre-payment**: Always required for all commitment types
3. **Overage Billing**: Always at list price (no discounts applied to overage)
4. **True-Up**: Non-refundable (unused commitment cannot be recovered)

## Source of Truth

All business rules are derived from the reference Excel file: `doc/Ref-calc.xlsx`

Any discrepancies between this calculator and the Excel file should be resolved in favor of the Excel file's formulas and logic.
