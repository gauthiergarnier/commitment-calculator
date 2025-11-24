# UX Principles

This document outlines the user experience design principles and interaction patterns implemented in the Agency Commitment & Discount Calculator.

## Core UX Philosophy

The calculator is designed as a **spreadsheet-like financial tool** that prioritizes:

1. **Immediate Feedback**: All changes trigger instant recalculation
2. **Clear Visual Hierarchy**: Editable vs. readonly cells are visually distinct
3. **Professional Financial Interface**: Proper number formatting and alignment
4. **Responsive Design**: Optimized layouts for desktop and mobile
5. **Accessibility**: Keyboard navigation, tooltips, and semantic structure

## Visual Differentiation: Editable vs. Calculated Cells

### Editable Cells

**Visual Indicators:**
- Lighter background color (`--cell-bg-input`)
- Text cursor on hover
- Focus outline with brand yellow (`--color-accent-yellow`)
- Hover state with purple tint (`--cell-bg-hover`)

**Keyboard Interaction:**
- Enter: Start editing
- Escape: Cancel editing
- Tab: Move to next editable cell
- Shift+Tab: Move to previous editable cell

**Validation:**
- Inline validation prevents negative values
- Non-numeric input is rejected
- Changes are applied on blur or Enter key

**Which Cells:**
- Monthly Usage (List Price) - in month rows
- Committed Amount - in year rows only

### Readonly/Calculated Cells

**Visual Indicators:**
- Transparent background (`--cell-bg-readonly`)
- Muted text color (`--color-text-secondary`)
- Default cursor (no pointer)
- Optional tooltip indicating "Auto-calculated"

**Behavior:**
- Cannot be edited
- Do not respond to click or keyboard editing
- Values update automatically when inputs change

**Which Cells:**
- All discount columns
- Usage After Discount
- True Up
- Overage
- Monthly Cost
- Blended Discount
- Period labels
- Yearly totals

### Year Row Styling

**Special Treatment:**
- Bold white text on brand purple background
- Higher visual weight to indicate summary data
- Editable commitment amount stands out with input styling
- Grouped visually with subsequent month rows

## Layout & Scrolling Optimization

### Desktop Layout (≥769px)

**Maximized Content Area:**
- Full-width container up to 1600px
- Centered layout with balanced padding
- AG Grid height: 800px with internal scrolling

**Frozen Elements:**
- **Period Column**: Pinned left (`pinned: 'left'`)
  - Always visible during horizontal scrolling
  - Provides context for which row is being viewed

**Visual Grouping:**
- Year rows act as section headers
- 12 month rows grouped under each year
- Clear visual separation via background color

**Scrolling Behavior:**
- Horizontal scroll for wide tables
- Internal grid scrolling (not page scroll)
- Sticky header row remains visible

### Mobile Layout (<768px)

**Card-Based Interface:**
- AG Grid hidden on mobile
- Vertical card layout replaces table
- Each year and month gets its own card
- Simplified metrics per card (3-4 key values)

**Card Design:**
- Year cards: Purple gradient background
- Month cards: Elevated surface styling
- Touch-friendly input sizes
- Stacked layout for easy scrolling

**Interaction:**
- Native number inputs for touch devices
- No complex grid navigation
- Simple top-to-bottom flow

## Interaction Patterns

### Auto-Calculation

**Trigger Points:**
- Any configuration change (dropdowns, number inputs)
- Any data grid cell edit
- Mobile card input changes

**Feedback:**
- AG Grid cell flash animation on value change
- Instant update (no delay)
- No loading indicators needed (calculations are fast)

**Debouncing:**
- None applied - calculations are synchronous and performant
- Each keystroke does not trigger recalc - only on blur/Enter

### Keyboard Navigation (Desktop)

**Grid Navigation:**
- Arrow keys: Move between cells
- Tab: Move to next focusable cell
- Shift+Tab: Move to previous focusable cell
- Enter: Start editing (if editable)
- Escape: Cancel editing
- F2: Edit mode (AG Grid standard)

**Form Navigation:**
- Tab through configuration inputs in logical order
- Enter on select opens dropdown

**Accessibility:**
- All interactive elements are keyboard-accessible
- Focus indicators meet WCAG 2.1 standards
- Screen reader support via semantic HTML and ARIA labels

### Number Formatting

**Currency Fields:**
- Format: `$X,XXX` (no decimals in display)
- Input: Accepts decimals (stored as float)
- Alignment: Right-aligned
- Font: Tabular numbers (`font-variant-numeric: tabular-nums`)

**Percentage Fields:**
- Format: `XX.X%` (one decimal place)
- Alignment: Right-aligned
- Color coding: None (rely on context)

**Input Masking:**
- Applied on blur (when editing ends)
- Raw numbers during edit
- Formatted display after edit

### Tooltips

**Auto-Calculated Fields:**
- Tooltip on hover: "Auto-calculated"
- Additional context where helpful:
  - "Auto-calculated based on Free User Licenses setting"
  - "Auto-calculated based on Support Level setting"
  - "Auto-calculated based on Contract Type setting"

**Tooltip Timing:**
- Show delay: 500ms
- No hide delay (immediate)
- Positioned near cell (AG Grid default)

## Theme & Dark Mode

### Design System: Upsun Brand

**Color Tokens:**
- Brand Purple: `#6046FF` (primary interactive color)
- Accent Yellow: `#D5F800` (focus states)
- Dark Mode: Default (dark background)
- Light Mode: Auto-detected via `prefers-color-scheme`

**CSS Variables:**
- All colors defined as CSS custom properties
- Semantic tokens (e.g., `--cell-bg-input`, `--cell-border-focus`)
- Easy theme switching without code changes

### Branding Assets

**Logo (Upsun Wordmark):**
- Source: Official Upsun wordmark SVG from upsun.com
- Implementation: Inline SVG in HTML with `fill="currentColor"`
- Dimensions: 40px height, auto width
- Color inversion:
  - Dark mode: `color: #E1E3E4` (light on dark background)
  - Light mode: `color: #0E1113` (dark on light background)
- Location: Header, top-left corner
- Must never use raster images (PNG/JPG) for logo

**Favicon:**
- Source: `https://upsun.com/favicon-32x32.png`
- Format: PNG, 32×32 pixels
- Must always reference Upsun's official favicon
- Never use custom or placeholder favicons

**Brand Consistency:**
- All branding assets must match upsun.com exactly
- Colors, shapes, and proportions are non-negotiable
- When in doubt, reference the live Upsun website

### Dark Mode (Default)

**Backgrounds:**
- Primary: `#0E1113`
- Elevated: `#191C1E`
- Cards: `#2B3134`

**Text:**
- Primary: `#E1E3E4`
- Secondary: `#B4BABD`
- Muted: `#899296`

**Borders:**
- Default: `#646F75`
- Muted: `rgba(100, 111, 117, 0.5)`

### Light Mode

**Backgrounds:**
- Primary: `#F7F8F8`
- Elevated: `#FFFFFF`
- Cards: `#FFFFFF`

**Text:**
- Primary: `#2B3134`
- Secondary: `#41484D`
- Muted: `#899296`

**Theme Switching:**
- Manual toggle button in header (Upsun-style)
- Initial theme respects user's OS preference via `prefers-color-scheme`
- Toggle switches via `data-theme` attribute on `<html>` element
- Theme persists during session (resets on page reload)

**Theme Toggle Button:**
- Matches Upsun.com footer design
- Rounded button: `border-radius: 3rem` (48px × 48px)
- SVG sun/moon icons (not emoji text)
- Sun icon: Visible in dark mode (indicates switch TO light)
- Moon icon: Visible in light mode (indicates switch TO dark)
- Icon switching: CSS opacity transition (not JavaScript manipulation)
- Hover and focus states with purple tint

## Typography

### Font Families

**Primary:** Instrument Sans
- Body text
- Form labels
- Table cells
- General UI

**Secondary:** Space Grotesk
- Headings (h1, h2)
- Emphasis elements

**Fallback:** System fonts
- `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

### Font Sizes

Responsive scale:
- XS: 0.812rem (13px)
- SM: 0.875rem (14px) - Grid cells
- Base: 1rem (16px) - Body text
- LG: 1.125rem (18px) - Summaries
- XL: 1.5rem (24px) - Section headers
- 2XL: 2rem (32px) - Page title

### Font Weights

- Normal: 400 (body text)
- Medium: 500 (labels, emphasis)
- Bold: 700 (headings, year rows)

## Spacing & Layout

### Spacing Scale

- XS: 0.5rem (8px)
- SM: 0.75rem (12px)
- MD: 1rem (16px)
- LG: 1.5rem (24px)
- XL: 2rem (32px)
- 2XL: 3rem (48px)

### Border Radius (Upsun Brand Standards)

**IMPORTANT**: All rounded corners must follow Upsun branding guidelines.

- SM: 0.5rem (form inputs, small elements)
- MD: 1rem (mobile cards, AG Grid container)
- LG: 1.5rem (unused - skip this value)
- XL: 2rem (all major sections - Configuration, Discounts, Results)
- 2XL: 3rem (theme toggle button, large interactive elements)

**Specific Applications:**
- Config/Discounts/Results sections: `border-radius: 2rem`
- AG Grid container (`#data-grid`): `border-radius: 1rem` with `overflow: hidden`
- AG Grid internal elements: `--ag-border-radius: 0.75rem`
- Theme toggle button: `border-radius: 3rem`
- Form inputs/selects: `border-radius: 0.5rem`

### Shadows

Elevation system:
- SM: Subtle elevation
- MD: Card elevation
- LG: Modal/popup elevation

## Responsive Breakpoints

**Mobile:** < 768px
- Card-based layout
- Stacked form inputs
- Hidden AG Grid
- Simplified metrics

**Desktop:** ≥ 769px
- AG Grid visible
- Multi-column configuration
- Full feature set
- Optimized for large screens

## Performance Considerations

**Instant Feedback:**
- No debouncing on calculations (they're fast enough)
- Cell flash animations provide visual feedback
- Synchronous updates (no loading states)

**Optimized Rendering:**
- AG Grid virtualization handles large datasets
- Only visible rows are rendered
- Smooth scrolling even with 39 rows (3 years + months)

**Minimal Re-renders:**
- Value setters update state efficiently
- Grid updates in place (no full re-render)
- Mobile cards re-render fully (acceptable for <40 cards)

## Accessibility Standards

**WCAG 2.1 Level AA Compliance:**

**Color Contrast:**
- All text meets 4.5:1 minimum
- Brand purple on white: Sufficient
- White on brand purple: Sufficient

**Keyboard Navigation:**
- All features accessible via keyboard
- Logical tab order
- Visible focus indicators

**Screen Readers:**
- Semantic HTML structure
- ARIA labels where needed
- Table headers properly associated
- Form labels properly connected

**Touch Targets:**
- Minimum 44x44px on mobile
- Adequate spacing between interactive elements

## Error Handling

**Input Validation:**
- Prevent negative values
- Type checking (numbers only)
- Min/max constraints where applicable

**User Feedback:**
- Invalid inputs are rejected silently
- No intrusive error messages for minor issues
- Values revert to previous valid state if invalid

**Edge Cases:**
- Division by zero: Handled with checks
- Missing data: Defaults applied
- NaN values: Displayed as "-"

## Future UX Enhancements

Potential improvements not yet implemented:

1. **Data Persistence**: Save configurations to localStorage
2. **Export**: Download results as CSV/Excel
3. **Scenarios**: Save and compare multiple commitment configurations
4. **Charts**: Visual representation of costs and discounts over time
5. **Help System**: Interactive tutorial or contextual help
6. **Undo/Redo**: History of changes
7. **Keyboard Shortcuts**: Power user features (Ctrl+S to save, etc.)
8. **Print Stylesheet**: Optimized for printing reports

## Design Inspiration

The UX draws inspiration from:
- **Upsun Pricing Calculator**: Color scheme, modern dark theme
- **Google Sheets**: Inline editing, keyboard navigation
- **Financial Tools**: Professional number formatting, clear hierarchy
- **Modern Web Apps**: Responsive design, instant feedback
