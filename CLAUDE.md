# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Agency Commitment & Discount Calculator - a professional web-based tool that helps Agencies and System Integrators (SIs) decide which commitment amount fits best with their needs. The calculator replicates the logic from the reference Excel file (`doc/Ref-calc.xlsx`) and provides a spreadsheet-like interface using AG Grid.

## Tech Stack

- **TypeScript** + **Vite** for development and build
- **AG Grid Community** for the data grid interface
- **Vanilla TypeScript** (no frameworks) for application logic
- **CSS with Custom Properties** for theming (dark/light mode support)
- **Upsun Design System** (brand purple #6046FF, accent yellow #D5F800)
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
│   └── Ref-calc.xlsx              # Reference Excel file - source of truth for calculations
├── docs/                           # Comprehensive documentation
│   ├── BUSINESS_RULES.md          # Calculation formulas and business logic
│   ├── UX_PRINCIPLES.md           # Design guidelines and interaction patterns
│   ├── TECH_STACK.md              # Technology choices and architecture
│   └── FEATURES.md                # Feature specifications and roadmap
├── src/
│   ├── main.ts                    # Main application logic (AG Grid integration)
│   └── style.css                  # Upsun-themed styles + AG Grid customization
├── index.html                     # HTML entry point
├── package.json                   # Dependencies (includes ag-grid-community)
├── tsconfig.json                  # TypeScript configuration (strict mode)
├── vite.config.ts                 # Vite build configuration
├── .gitignore                     # Git ignore patterns
├── README.md                      # User-facing documentation
└── CLAUDE.md                      # This file
```

## Architecture

### AG Grid Integration

The calculator uses AG Grid Community for a professional spreadsheet-like interface:

**Grid Features:**
- **Editable Cells**: Monthly usage (in month rows) and yearly commitments (in year rows)
- **Readonly Cells**: All calculated values with "Auto-calculated" tooltips
- **Pinned Column**: Period column stays visible during horizontal scroll
- **Cell Formatting**: Currency ($X,XXX) and percentage (XX.X%) with proper alignment
- **Visual Differentiation**: Editable cells have light background, readonly cells are muted
- **Year Rows**: Purple background with white bold text for visual hierarchy
- **Keyboard Navigation**: Full arrow key, Tab, Enter, Escape support
- **Auto-recalculation**: Any edit triggers instant recalculation with cell flash animation

**Grid Configuration** (src/main.ts:440-467):
- Height: 800px with internal scrolling
- 39 rows: 3 year summaries + 36 month details
- 11 columns: Period, Usage, Discounts, Costs, Metrics
- Custom Upsun theme via CSS variables

### Responsive Design

**Desktop (≥769px):**
- Full AG Grid with all features
- Multi-column configuration panel
- Maximized content area (up to 1600px)

**Mobile (<768px):**
- AG Grid hidden
- Card-based layout with editable inputs
- Vertical scrolling, simplified metrics

### Upsun Design Guidelines

**IMPORTANT**: All design elements must strictly follow Upsun branding guidelines.

**Logo:**
- Use the official Upsun wordmark SVG from upsun.com
- Logo must use `fill="currentColor"` for automatic color inversion
- Light mode: Logo color `#0E1113` (dark)
- Dark mode: Logo color `#E1E3E4` (light)
- Height: 40px, width: auto

**Favicon:**
- Always use: `https://upsun.com/favicon-32x32.png`
- Never use custom or placeholder favicons

**Theme Toggle:**
- Must match the Upsun.com footer style
- Rounded button with `border-radius: 3rem` (Upsun-style large rounded corners)
- Size: 48px × 48px with 12px padding
- SVG sun/moon icons (not emoji)
- Icons switch visibility via CSS opacity (not JavaScript text manipulation)
- Sun icon visible in dark mode (to switch TO light)
- Moon icon visible in light mode (to switch TO dark)

**Rounded Corners (Upsun-style):**
- All major sections: `border-radius: 2rem`
- Theme toggle button: `border-radius: 3rem`
- AG Grid container: `border-radius: 1rem` with `overflow: hidden`
- AG Grid internal elements: `--ag-border-radius: 0.75rem`
- Form inputs and cards: `border-radius: 0.5rem` to `1rem`

**AG Grid Theme:**
- Must support both light and dark modes
- Dark mode (default):
  - Background: `#191C1E`
  - Header background: `#2B3134`
  - Text: `#E1E3E4`
  - Borders: `rgba(100, 111, 117, 0.5)`
- Light mode:
  - Background: `#FFFFFF`
  - Header background: `#F7F8F8`
  - Text: `#2B3134`
  - Borders: `#E1E3E4`
- Year rows: Always purple (`#6046FF`) background with white text in both modes
- Editable cells: Purple tint background with edit icon (✎)
- Theme must switch seamlessly via `data-theme` attribute

**Color Palette:**
- Brand Purple: `#6046FF` (primary interactive color)
- Accent Yellow: `#D5F800` (focus states, highlights)
- All colors defined as CSS custom properties in `:root` and `[data-theme="light"]`

**Typography:**
- Primary font: 'Instrument Sans' (body text, UI elements)
- Secondary font: 'Space Grotesk' (headings)
- System fallback: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

**Theme Switching:**
- JavaScript must use `data-theme` attribute on `<html>` element
- Initialize based on system preference: `window.matchMedia('(prefers-color-scheme: dark)')`
- Never hardcode theme - always respect user's system preference on first load

### Calculator Logic

**Detailed documentation**: See `docs/BUSINESS_RULES.md`

**Quick Reference:**

**Discount Calculations** (src/main.ts:93-129):
1. Reseller Discount: 10% if Reseller + not Registered
2. Commitment Discount: 10-20% (Monthly) or 5-15% (Annual)
3. Commitment Bonus: 5-7% for Reseller + Monthly Spending
4. Referral Commissions: Displayed but not in cost calculations

**Monthly Calculations** (src/main.ts:132-217):
```
Usage After Discount = Usage + Free Licenses + Support + Reseller discounts
True Up = max(0, Committed - Usage After Discount)
Overage = max(0, Usage After Discount - Committed)
Monthly Cost = (Yearly Commitment × (1 - Discounts)) / 12 + Overage
Blended Discount = (Monthly Cost - Usage) / Usage
```

**Constants** (src/main.ts:7-9):
- User License Cost: $19/month
- Default monthly usage: [1512, 1800, 1200, 1500, 5000, 500, ...]
- Default year commitments: [14000, 15000, 14000]

## Making Changes

### Modifying Calculator Logic

**Source of Truth**: Always start with `doc/Ref-calc.xlsx` - all formulas must match Excel exactly.

**Key Functions in src/main.ts:**

1. **`calculateDiscounts(inputs)`** (lines 93-129)
   - Calculates all discount percentages based on configuration
   - Returns: resellerDiscount, commitmentDiscount, commitmentBonus, referral rates
   - Update this when discount rules change

2. **`calculateGridData(inputs, discounts)`** (lines 132-217)
   - Core calculation engine for all 36 months + 3 year summaries
   - Applies formulas: usage after discount, true-up, overage, monthly cost, blended discount
   - Returns array of GridRow objects for AG Grid
   - Update this when calculation formulas change

3. **`recalculate()`** (lines 470-492)
   - Triggered by any input change
   - Orchestrates: get inputs → calculate discounts → calculate grid data → update UI
   - No changes needed unless adding new features

**Constants** (lines 7-9):
- `USER_LICENSE_COST = 19`
- `DEFAULT_MONTHLY_USAGE` array
- `DEFAULT_YEAR_COMMITMENTS` array

### Modifying the Grid

**Column Definitions** (src/main.ts:300-438):
- `getColumnDefs()` returns array of ColDef objects for AG Grid
- Each column specifies: field, headerName, width, editable condition, formatter, cellClass, tooltips
- **Editable columns**: Usage (month rows), Committed Amount (year rows)
- **Readonly columns**: All others (with auto-calculated tooltips)

**Value Setters** (lines 325-334, 387-396):
- Custom `valueSetter` functions handle edits and trigger recalculation
- Updates global state: `monthlyUsage` or `yearCommitments` arrays
- Calls `recalculate()` to update entire grid

### Modifying UI Styles

**CSS Files**:
- **src/style.css**: All styling including Upsun theme
- **Design Tokens** (lines 1-80): CSS custom properties for colors, spacing, typography
- **AG Grid Theme** (lines 250+): Custom `.ag-theme-upsun` overrides
- **Responsive** (lines 400+): Mobile card layout at `<768px` breakpoint

**Key CSS Classes**:
- `.year-row`: Purple background for year summary rows
- `.ag-cell-editable`: Light background for editable cells
- `.ag-cell-readonly`: Muted styling for calculated cells
- `.mobile-card`: Card-based mobile layout

### Adding New Features

**State Management**:
- Global variables: `monthlyUsage` (3×12 array), `yearCommitments` (3-element array), `grid` (AG Grid instance)
- All state changes trigger `recalculate()` for reactive updates

**Adding New Configuration Options**:
1. Add HTML select/input to `index.html` config section
2. Add event listener in `init()` function (lines 577-601)
3. Update `getFormInputs()` to include new value (lines 220-242)
4. Update `CalculatorInputs` interface (lines 12-21)
5. Use new input in `calculateDiscounts()` or `calculateGridData()`

**Adding New Grid Columns**:
1. Add field to `GridRow` interface (lines 31-46)
2. Calculate value in `calculateGridData()` function
3. Add column definition to `getColumnDefs()` array
4. Add styling in `src/style.css` if needed

**Mobile Support**:
- Mobile card rendering: `updateMobileCards()` function (lines 495-574)
- Automatically hidden/shown via CSS media query at 768px
- Edit this function to change mobile layout

## Important Notes

### Calculation Accuracy
- **Source of Truth**: `doc/Ref-calc.xlsx` - all formulas must match Excel exactly
- Verify calculations against Excel after any logic changes
- See `docs/BUSINESS_RULES.md` for complete formula documentation

### Architecture Principles
- **Static Site**: No backend or database required
- **Client-Side Only**: All calculations happen in the browser
- **No Persistence**: State resets on page reload (potential future feature: localStorage)
- **Type Safety**: TypeScript strict mode enabled for catching bugs early
- **Framework-Free**: Vanilla TypeScript + AG Grid (no React/Vue/Svelte needed)

### Documentation
All major aspects are documented in `docs/`:
- **BUSINESS_RULES.md**: Complete calculation formulas and discount logic
- **UX_PRINCIPLES.md**: Design system, interaction patterns, accessibility
- **TECH_STACK.md**: Technology decisions, bundle size, performance metrics
- **FEATURES.md**: Feature specifications, implementation details, roadmap

### AG Grid Guidelines
- Always use `valueSetter` for editable cells (not direct state mutation)
- Cell flash animation provides visual feedback on recalculation
- Pinned columns and frozen headers improve UX on large grids
- Custom theme via CSS variables maintains Upsun brand consistency

### Performance
- Calculations complete in <5ms (synchronous, no debouncing needed)
- AG Grid virtual scrolling handles large datasets efficiently
- Bundle size: ~100KB total (including AG Grid ~70KB)
- Load time: <500ms on fast connection

## License

GPL-3.0 - All code must comply with GPL v3 requirements.

## Deployment

The project is configured for deployment on Upsun platform. Upsun configuration is stored in `.upsun/local/` (local development files, not committed to git).
