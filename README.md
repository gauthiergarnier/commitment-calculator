# Agency Commitment & Discount Calculator

A modern, interactive web application that helps Agencies and System Integrators calculate optimal commitment levels and visualize potential savings with Upsun.

## 🚀 Version 2.0 - Complete Rewrite

This is a complete front-end rewrite featuring:
- **Modern Tech Stack**: Next.js, React, TypeScript, Tailwind CSS
- **Premium UI**: Shadcn/UI components with Vercel-style design
- **Smart Templates**: 6 quick-start templates for common use cases
- **Cost Patterns**: 5 variation patterns (stable, seasonal, growth, variable)
- **Real-time Calculations**: Instant feedback with smooth animations
- **Multi-currency Support**: USD, EUR, GBP, CAD, AUD
- **Dark/Light Mode**: System-aware theme with smooth transitions

## 📋 Features

### Quick Start Templates
Choose from 6 preset configurations:
- **1 Marketing Website** - Single site with moderate traffic
- **5 Marketing Websites** - Multiple brand sites
- **1 E-commerce Website** - Single online store
- **5 E-commerce Websites** - Multiple online stores
- **Small Agency** - 10-15 client websites
- **Large Agency** - 50+ client websites

### Cost Variation Patterns
Model your usage with 5 realistic patterns:
- **Super Stable** (<5% variation) - Predictable, consistent usage
- **Seasonal** (50-100% peaks) - 4 months of higher costs (holidays)
- **Highly Seasonal** (500% peaks) - Valentine's Day and Mother's Day spikes
- **Steady Growth** (+5%/month) - Consistent monthly growth
- **Highly Variable** (±30%) - Unpredictable month-to-month changes

### Partner Configuration
Full control over:
- Partner Level (Registered, Gold, Platinum, Diamond)
- Contract Type (Direct, Reseller)
- Commitment Type (Monthly/Annual Spending)
- Commitment Duration (12/24/36 months)
- Support Level (None, Advanced, Premium)
- Free User Licenses (0-5)

### Real-time Price Summary
Sticky sidebar showing:
- Total 3-year cost
- Average monthly cost
- Total savings
- Active discounts breakdown
- Yearly cost breakdown
- Referral commissions

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) (strict mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Components**: Radix UI primitives

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run type-check

# Lint code
npm run lint
```

The application will be available at `http://localhost:3000`

## 🏗 Project Structure

```
commitment-calculator/
├── app/
│   ├── globals.css          # Tailwind + theme variables
│   ├── layout.tsx            # Root layout with fonts
│   └── page.tsx              # Main calculator page
├── components/
│   ├── ui/                   # Shadcn/UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── select.tsx
│   │   ├── slider.tsx
│   │   ├── radio-group.tsx
│   │   ├── label.tsx
│   │   └── separator.tsx
│   ├── currency-selector.tsx
│   ├── partner-variables.tsx
│   ├── price-summary.tsx
│   ├── template-selector.tsx
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   └── variation-pattern-selector.tsx
├── lib/
│   ├── calculations.ts       # Core calculation logic
│   ├── templates.ts          # Template definitions
│   ├── types.ts              # TypeScript interfaces
│   ├── utils.ts              # Utility functions
│   └── variation-patterns.ts # Pattern definitions & usage generation
├── doc/
│   └── Ref-calc.xlsx         # Reference Excel file (source of truth)
├── docs/
│   ├── BUSINESS_RULES.md     # Calculation formulas
│   ├── UX_PRINCIPLES.md      # Design guidelines
│   ├── TECH_STACK.md         # Technology decisions
│   └── FEATURES.md           # Feature specifications
├── components.json           # Shadcn/UI config
├── next.config.js            # Next.js config (static export)
├── tailwind.config.ts        # Tailwind config (Upsun colors)
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies
```

## 🎨 Design System

### Upsun Brand Colors
- **Purple**: `#6046FF` (primary)
- **Yellow**: `#D5F800` (accent)
- **Dark**: `#0E1113` (light mode text)
- **Light**: `#E1E3E4` (dark mode text)

### Typography
- **Body**: Instrument Sans
- **Headings**: Space Grotesk
- **Fallback**: System UI stack

### Rounded Corners (Upsun Style)
- Major sections: `2rem`
- Cards: `1rem`
- Inputs: `0.5rem`
- Buttons: `0.5rem`

## 💡 How It Works

### 1. Template Selection
User selects a template (e.g., "5 E-commerce Websites")

### 2. Average Cost Adjustment
Interactive slider sets average monthly cost ($1k-$20k)

### 3. Variation Pattern
User selects how costs vary over time (stable, seasonal, growth, variable)

### 4. Usage Generation
System generates 36 months of realistic usage based on:
- Selected template's base usage
- Average monthly cost
- Chosen variation pattern

### 5. Optimal Commitment Calculation
System calculates optimal yearly commitments:
- Analyzes usage patterns
- Balances commitment discount vs. overage costs
- Recommends ~90% of average to maximize savings

### 6. Real-time Results
All calculations update instantly:
- Monthly costs
- Yearly summaries
- Total savings
- Discount breakdowns

## 🧮 Calculation Logic

### Discounts

1. **Reseller Discount**: 10% if contract type is Reseller and agency tier is not Registered
2. **Commitment Discount**: Based on commitment type and duration
   - Monthly Spending: 10% (12mo), 15% (24mo), 20% (36mo)
   - Annual Spending: 5% (12mo), 10% (24mo), 15% (36mo)
3. **Commitment Bonus**: For Reseller contracts with Monthly Spending
   - Gold: 5%
   - Platinum/Diamond: 7%

### Monthly Calculations

For each month:
- **Usage After Discount** = Usage + Free Licenses + Support Discount + Reseller Discount
- **True Up** = max(0, Committed - Usage After Discount)
- **Overage** = max(0, Usage After Discount - Committed)
- **Monthly Cost** = (Yearly Commitment × (1 - Discounts)) / 12 + Overage
- **Blended Discount** = (Monthly Cost - Usage) / Usage

### Source of Truth
All formulas must match `doc/Ref-calc.xlsx` exactly.

## 🚀 Deployment

### Static Export
The app is configured for static export:
```bash
npm run build
# Outputs to ./out directory
```

### Hosting Options
- **Vercel**: `vercel deploy`
- **Netlify**: Drop `out/` folder
- **Upsun**: See `.upsun/` configuration
- **Any Static Host**: Upload `out/` directory

## 🔄 Migration from v1

### What Changed
- ❌ **Removed**: AG Grid spreadsheet interface
- ❌ **Removed**: Vite build system
- ❌ **Removed**: Vanilla TypeScript approach
- ✅ **Added**: Next.js with React
- ✅ **Added**: Shadcn/UI + Tailwind
- ✅ **Added**: Smart templates
- ✅ **Added**: Cost variation patterns
- ✅ **Added**: Framer Motion animations
- ✅ **Added**: Modern, guided UX

### Calculation Logic
✅ **Preserved**: All calculation logic from v1 maintained in `lib/calculations.ts`

### Old Files
The old Vite-based files are preserved in `src/` for reference but are now gitignored.

## 📝 License

GPL-3.0

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run type-check` and `npm run lint`
5. Submit a pull request

## 📧 Support

For questions or issues, please open a GitHub issue.

---

**Built with ❤️ for Agencies and System Integrators**
