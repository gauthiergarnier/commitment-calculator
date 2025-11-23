# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Agency Commitment & Discount Calculator - a web-based tool that helps Agencies and System Integrators (SIs) decide which commitment amount fits best with their needs. The calculator replicates the logic from the reference Excel file (`doc/Ref-calc.xlsx`).

## Tech Stack

- TypeScript + Vite for development and build
- Vanilla TypeScript (no frameworks) for the application logic
- CSS for styling (no preprocessor)
- Static site deployment

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Type check TypeScript without building
npm run type-check

# Build for production (outputs to dist/)
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
commitment-calculator/
├── doc/
│   └── Ref-calc.xlsx          # Reference Excel file - source of truth for calculations
├── src/
│   ├── main.ts                # Main application logic and calculations
│   └── style.css              # Application styles
├── index.html                 # Main HTML entry point
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite build configuration
├── .gitignore                 # Git ignore patterns
├── README.md                  # User-facing documentation
└── CLAUDE.md                  # This file
```

## Calculator Logic

The calculator implements the exact formulas from `doc/Ref-calc.xlsx`. The core calculation logic is in `src/main.ts`:

### Discount Calculations

Located in the `calculateDiscounts()` function (src/main.ts:70-112):

1. **Reseller Discount**: 10% if Reseller contract AND not Registered tier (applied to all usage)
2. **Commitment Discount**: Varies by commitment type and duration (applied to commitment amount)
   - Monthly Spending: 12mo=10%, 24mo=15%, 36mo=20%
   - Annual Spending: 12mo=5%, 24mo=10%, 36mo=15%
3. **Commitment Bonus**: For Reseller + Monthly Spending only (applied to commitment amount)
   - Gold: 5%
   - Platinum/Diamond: 7%
4. **Referral Commissions**: Based on agency tier

### Monthly Calculations

Located in the `calculateYear()` function (src/main.ts:115-190):

For each month:
- Usage After Discount = Usage + Free Licenses (-$19 each) + Support Discount (-5% or -4%) + Reseller Discount
- Committed Amount = Yearly Commitment / 12
- True Up = max(0, Committed - Usage After Discount)
- Overage = max(0, Usage After Discount - Committed)
- Monthly Cost = (Yearly Commitment Cost / 12) + Overage
- Blended Discount = (Monthly Cost - Usage) / Usage

Cost of Commitment (yearly prepayment) = Yearly Commitment × (1 - (Commitment Discount + Commitment Bonus))

### Constants

- User License Cost: $19 per license (src/main.ts:4)
- Default monthly usage pattern is defined in DEFAULT_MONTHLY_USAGE array (src/main.ts:5)

## Making Changes

### Modifying Calculator Logic

If the calculation logic needs to change:
1. Update the reference Excel file in `doc/Ref-calc.xlsx` first
2. Then update the TypeScript functions in `src/main.ts` to match
3. Key functions to update:
   - `calculateDiscounts()` for discount percentages
   - `calculateYear()` for monthly calculations
   - Constants at the top of the file

### Modifying UI

- HTML structure: `index.html`
- Styles: `src/style.css`
- UI logic and event handlers: `src/main.ts` (functions starting with `display*`, `create*`, `handleFormSubmit`)

### Adding New Features

- The calculator dynamically generates monthly usage inputs for 3 years in `createMonthlyUsageInputs()`
- Results are displayed in a table format in `displayResults()`
- All calculations are performed client-side with no backend required

## Important Notes

- The calculator must match the Excel file calculations exactly - it's the source of truth
- This is a static site with no backend or database
- All calculations happen in the browser
- The app uses TypeScript strict mode for type safety

## License

GPL-3.0 - All code must comply with GPL v3 requirements.

## Deployment

The project is configured for deployment on Upsun platform. Upsun configuration is stored in `.upsun/local/` (local development files, not committed to git).
