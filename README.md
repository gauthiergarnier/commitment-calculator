# Agency Commitment & Discount Calculator

A web-based calculator that helps Agencies and System Integrators (SIs) decide which commitment amount fits best with their needs.

## Features

- Calculate discounts based on agency tier, commitment type, and duration
- Support for multiple contract types (Reseller/Direct)
- Monthly usage tracking across 3 years
- Automated calculations for:
  - Reseller discounts
  - Commitment discounts and bonuses
  - Referral commissions
  - True-up and overage amounts
  - Blended discount rates
- Interactive results table showing monthly and yearly breakdowns

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
# Type check
npm run type-check

# Build for production
npm run build
```

The production build will be output to the `dist/` directory.

### Preview

```bash
# Preview production build
npm run preview
```

## How It Works

The calculator uses the following formula logic based on the reference Excel file (`doc/Ref-calc.xlsx`):

### Discounts

1. **Reseller Discount**: 10% if contract type is Reseller and agency tier is not Registered (applied on all usage)
2. **Commitment Discount**: Based on commitment type and duration (applied on the commitment amount)
   - Monthly Spending: 10% (12mo), 15% (24mo), 20% (36mo)
   - Annual Spending: 5% (12mo), 10% (24mo), 15% (36mo)
3. **Commitment Bonus**: For Reseller contracts with Monthly Spending (applied on the commitment amount)
   - Gold: 5%
   - Platinum/Diamond: 7%

### Monthly Calculations

For each month, the calculator computes:

- **Usage After Discount** = Usage + Free Licenses + Support Discount + Reseller Discount
- **True Up** = Committed Amount - Usage After Discount (if positive)
- **Overage** = Usage After Discount - Committed Amount (if positive)
- **Monthly Cost** = (Yearly Commitment Cost / 12) + Overage
- **Blended Discount** = (Monthly Cost - Usage) / Usage

## Project Structure

```
commitment-calculator/
├── doc/
│   └── Ref-calc.xlsx          # Reference Excel file with calculation logic
├── src/
│   ├── main.ts                # Main TypeScript application logic
│   └── style.css              # Application styles
├── index.html                 # Main HTML file
├── package.json               # Project dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite build configuration
└── README.md                  # This file
```

## License

GPL-3.0
