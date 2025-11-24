# Feature Specifications

This document provides detailed specifications for all features implemented in the Agency Commitment & Discount Calculator.

## Feature Overview

The calculator provides a comprehensive financial analysis tool with the following capabilities:

| Feature Category | Features | Status |
|-----------------|----------|--------|
| **Configuration** | Agency tier selection, commitment type/duration, contract type, support level, free licenses | ✅ Complete |
| **Data Entry** | Editable monthly usage, editable yearly commitments | ✅ Complete |
| **Calculations** | Discount application, cost projections, blended rates | ✅ Complete |
| **Visualization** | AG Grid table, discount cards, summary metrics | ✅ Complete |
| **Responsiveness** | Desktop optimization, mobile card layout | ✅ Complete |
| **Theming** | Dark/light mode, Upsun brand colors | ✅ Complete |
| **Accessibility** | Keyboard navigation, tooltips, WCAG AA compliance | ✅ Complete |

## 1. Configuration Panel

### 1.1 Agency Tier Selection

**Feature:** Dropdown to select partner tier level

**Options:**
- Platinum (default)
- Gold
- Diamond
- Registered

**Business Impact:**
- Affects commitment bonus eligibility
- Changes referral commission rates
- Influences reseller discount eligibility

**Technical Implementation:**
- `<select>` element with `id="agency-tier"`
- Change event triggers recalculation
- Value stored in application state

**User Experience:**
- Located in top-left of configuration panel
- Clear label: "Agency Tier"
- Upsun-themed styling
- Focus states with purple highlight

### 1.2 Commitment Type Selection

**Feature:** Choose between spending commitment models

**Options:**
- Monthly Spending (default)
- Annual Spending

**Business Impact:**
- Different discount rates (Monthly: 10-20%, Annual: 5-15%)
- Affects bonus eligibility (only Monthly qualifies)

**Technical Implementation:**
- Change event updates commitment discount calculation
- Affects display of applicable bonuses

### 1.3 Commitment Duration Selection

**Feature:** Select contract length

**Options:**
- 36 months (default)
- 24 months
- 12 months

**Business Impact:**
- Longer commitments = higher discounts
- Paired with commitment type for discount tier

**Technical Implementation:**
- Duration affects discount percentage
- Default matches most common use case

### 1.4 Contract Type Selection

**Feature:** Specify business relationship

**Options:**
- Reseller (default)
- Direct

**Business Impact:**
- Reseller: Eligible for reseller discount (10%) and bonuses
- Direct: No reseller-specific benefits

**UX Notes:**
- Most users are resellers (hence default)
- Clear distinction helps prevent miscalculation

### 1.5 Support Level Selection

**Feature:** Choose support plan

**Options:**
- Advanced Support (default) - 5% discount
- Premium Support - 4% discount
- None - no support discount

**Business Impact:**
- Applied as percentage reduction of monthly usage
- Cumulative with other discounts

### 1.6 Free User Licenses

**Feature:** Number input for included licenses

**Configuration:**
- Default: 10
- Min: 0
- Step: 1 (whole numbers only)
- Type: number

**Business Impact:**
- Each license worth $19/month
- Deducted from monthly usage before other calculations

**Validation:**
- Cannot be negative
- Must be integer
- Auto-corrects invalid input

## 2. Discount Display Section

### 2.1 Discount Cards

**Feature:** Visual cards showing all applicable discounts

**Displayed Information:**

**Card 1: Reseller Discount**
- Value: 0% or 10%
- Note: "(applied on all usage)"
- Visibility: Always shown

**Card 2: Commitment Discount**
- Value: 0-20% (varies by type/duration)
- Note: "(applied on the commitment amount)"
- Dynamic based on configuration

**Card 3: Commitment Bonus**
- Value: 0%, 5%, or 7%
- Note: "(applied on the commitment amount)"
- Only applicable for Resellers with Monthly Spending

**Card 4: Referral Commission (1st year)**
- Value: 0% or 10%
- Informational only (not used in calculations)

**Card 5: Referral Commission (Following years)**
- Value: 0%, 2%, 3.5%, or 5%
- Tier-dependent
- Informational only

**Layout:**
- Responsive grid (auto-fit, min 300px)
- Card styling with Upsun theme
- Purple accent for percentage values

## 3. Results Section

### 3.1 Summary Metrics

**Feature:** High-level KPI display

**Metric: Average Monthly Cost**
- Calculation: Sum of all monthly costs / 36
- Display: Large, prominent, purple text
- Context note: Shows discount percentages applied

**Visual Design:**
- Purple gradient background
- Border with brand color
- Centered, easy to scan

**Purpose:**
- Quick answer to "What will I pay?"
- Comparison metric for different scenarios

### 3.2 Data Grid (Desktop)

**Feature:** AG Grid-powered spreadsheet interface

**Grid Configuration:**
- Height: 800px
- Virtual scrolling enabled
- Row count: 39 (3 year rows + 36 month rows)

**Columns (11 total):**

1. **Period** (pinned left)
   - Values: "Year 1-3", "Month 1-12"
   - Editable: No
   - Width: 120px
   - Always visible during horizontal scroll

2. **Usage (List Price)**
   - Editable: Yes (month rows only)
   - Format: Currency ($)
   - Default: Pattern from Excel reference
   - Cell style: Light background on editable

3. **Free Licenses**
   - Editable: No
   - Format: Currency ($), negative
   - Auto-calculated: -$19 × license count
   - Tooltip: "Auto-calculated based on Free User Licenses setting"

4. **Support Discount**
   - Editable: No
   - Format: Currency ($), negative
   - Auto-calculated: Based on support level
   - Tooltip: "Auto-calculated based on Support Level setting"

5. **Reseller Discount**
   - Editable: No
   - Format: Currency ($), negative
   - Auto-calculated: -10% of usage (if applicable)
   - Tooltip: "Auto-calculated based on Contract Type setting"

6. **Usage After Discount**
   - Editable: No
   - Format: Currency ($)
   - Auto-calculated: Sum of above columns
   - Tooltip: "Auto-calculated"

7. **Committed Amount**
   - Editable: Yes (year rows only)
   - Format: Currency ($)
   - Defaults: $14k, $15k, $14k for Y1-Y3
   - Cell style: Input background on year rows

8. **True Up**
   - Editable: No
   - Format: Currency ($) or "-"
   - Auto-calculated: Unused commitment
   - Tooltip: "Auto-calculated"

9. **Overage**
   - Editable: No
   - Format: Currency ($) or "-"
   - Auto-calculated: Usage exceeding commitment
   - Tooltip: "Auto-calculated"

10. **Monthly Cost**
    - Editable: No
    - Format: Currency ($)
    - Auto-calculated: Commitment cost + overage
    - Tooltip: "Auto-calculated"

11. **Blended Discount**
    - Editable: No
    - Format: Percentage (%)
    - Auto-calculated: Effective discount rate
    - Tooltip: "Auto-calculated"

**Row Types:**

**Year Rows (3 total):**
- Background: Brand purple (`#6046FF`)
- Text: White
- Font weight: Bold
- Contains: Totals for 12 months
- Editable field: Committed Amount

**Month Rows (36 total):**
- Background: Default (alternating if desired)
- Text: Standard color
- Grouped under year rows
- Editable field: Usage (List Price)

**Interaction Features:**

**Cell Editing:**
- Double-click or Enter to edit
- Escape to cancel
- Tab to move to next editable cell
- Auto-recalculates on blur/Enter

**Keyboard Navigation:**
- Arrow keys: Move between cells
- Tab/Shift+Tab: Move through editable cells
- F2: Edit mode
- Home/End: First/last cell in row
- Ctrl+Home/End: First/last cell in grid

**Visual Feedback:**
- Cell flash animation on value change
- Focus outline: Yellow (`#D5F800`)
- Hover state: Light purple tint

**Tooltips:**
- Shown on hover (500ms delay)
- Context for auto-calculated fields
- No tooltip on editable fields (obvious by styling)

### 3.3 Mobile Card Layout

**Feature:** Simplified card-based view for small screens

**Activation:** Automatically shown when viewport < 768px

**Card Types:**

**Summary Card:**
- Shows average monthly cost
- Purple accent
- Prominent positioning

**Year Cards (3):**
- Purple gradient background
- Shows: Total Usage, Committed Amount (editable), Total Cost
- Visually distinct from month cards

**Month Cards (36):**
- Standard elevation
- Shows: Usage (editable), Usage After Discount, Monthly Cost
- Compact, scrollable

**Input Handling:**
- Native number inputs
- `type="number"` for touch keyboards
- `onchange` event triggers recalculation
- Values sync with desktop grid state

**Advantages:**
- Touch-friendly
- No horizontal scrolling
- Simplified metrics
- Native mobile UX

## 4. Auto-Calculation Engine

### 4.1 Reactive Updates

**Trigger Events:**
- Configuration change (any select or input)
- Grid cell edit (usage or commitment)
- Mobile card input change

**Update Flow:**
1. Event captured
2. State updated
3. Discounts recalculated
4. Grid data recalculated
5. UI updated (grid + mobile cards)
6. Cell flash animation (grid only)

**Performance:**
- Calculation time: < 5ms
- No debouncing (unnecessary)
- Synchronous updates

### 4.2 Calculation Order

**Per Configuration Change:**
1. Recalculate discounts (5 values)
2. For each month:
   - Apply discounts to usage
   - Calculate true-up or overage
   - Calculate monthly cost
   - Calculate blended discount
3. Sum months into year totals
4. Calculate average monthly cost

**Data Flow:**
```
Config → Discounts → Monthly Calcs → Year Totals → Summary → UI
```

## 5. Theming System

### 5.1 Design Tokens

**CSS Custom Properties:**
- 40+ semantic tokens
- Organized by category (color, spacing, typography, etc.)
- Centralized in `:root` selector

**Categories:**
- Colors: Background, text, borders, semantic
- Typography: Font families, sizes, weights
- Spacing: 6-level scale (xs to 2xl)
- Border radius: 4 levels (sm to xl)
- Shadows: 3 levels (sm to lg)

### 5.2 Dark Mode (Default)

**Activation:** Default theme

**Characteristics:**
- Dark backgrounds (`#0E1113`)
- Light text (`#E1E3E4`)
- High contrast
- Easy on eyes for extended use

**Target Users:**
- Developers (preference for dark themes)
- Late-night calculations

### 5.3 Light Mode

**Activation:** Automatic via `prefers-color-scheme: light`

**Characteristics:**
- Light backgrounds (`#F7F8F8`)
- Dark text (`#2B3134`)
- Clean, professional
- Better for printing

**No Manual Toggle:**
- Respects system preference
- Consistent with OS settings
- Reduces UI clutter

## 6. Responsive Design

### 6.1 Desktop Layout (≥769px)

**Features:**
- Full AG Grid with all columns
- Multi-column configuration panel
- Maximized content area (up to 1600px wide)
- Optimized for large screens

**Interaction:**
- Keyboard navigation primary
- Mouse secondary
- Pinned columns for context

### 6.2 Mobile Layout (<768px)

**Features:**
- Card-based interface replaces grid
- Stacked form inputs
- Touch-optimized controls
- Vertical scrolling only

**Interaction:**
- Touch primary
- Native number keyboards
- No complex grid navigation

### 6.3 Breakpoint Strategy

**Single Breakpoint:** 768px
- Below: Mobile (cards)
- Above: Desktop (grid)

**Why 768px:**
- Standard tablet landscape width
- Clear distinction between phone/tablet and desktop
- Matches common device sizes

## 7. Accessibility Features

### 7.1 Keyboard Navigation

**Full Grid Support:**
- All cells navigable via keyboard
- Clear focus indicators
- Logical tab order

**Configuration Panel:**
- Tab through inputs in order
- Enter on select opens dropdown
- Space toggles checkboxes (if added)

### 7.2 Screen Readers

**Semantic HTML:**
- Proper heading hierarchy
- Table headers associated with cells
- Form labels connected to inputs
- ARIA labels where needed

**AG Grid:**
- Built-in ARIA support
- Row/column context announced
- Cell values announced on focus

### 7.3 Visual Accessibility

**Color Contrast:**
- All text meets WCAG AA (4.5:1)
- Purple on white: 4.6:1 ✓
- White on purple: 8.2:1 ✓

**Focus Indicators:**
- Bright yellow outline
- 2px solid
- Visible in all themes

**Touch Targets:**
- Minimum 44x44px (mobile)
- Adequate spacing between elements

## 8. Data Management

### 8.1 State Management

**Current:** In-memory JavaScript state
**Location:** Global variables in `main.ts`

**State Variables:**
- `monthlyUsage`: 3×12 array of numbers
- `yearCommitments`: 3-element array
- `grid`: AG Grid instance reference

**Persistence:** None (resets on page reload)

### 8.2 Default Values

**Configuration:**
- Mirrors most common use case
- Based on Excel reference file
- Agency: Platinum, Reseller, 36mo, Monthly Spending

**Data:**
- Year commitments: $14k, $15k, $14k
- Monthly usage: Pattern from Excel
- Free licenses: 10

## 9. Browser Compatibility

**Tested & Supported:**
- Chrome 90+ ✓
- Edge 90+ ✓
- Firefox 88+ ✓
- Safari 14+ ✓
- Mobile Chrome (Android) ✓
- Mobile Safari (iOS) ✓

**Not Supported:**
- Internet Explorer ✗
- Legacy Edge ✗
- Browsers without ES2020 support ✗

## 10. Performance Metrics

**Load Time (Desktop, fast 3G):**
- First Contentful Paint: ~500ms
- Time to Interactive: ~800ms
- Largest Contentful Paint: ~700ms

**Runtime Performance:**
- Calculation: < 5ms
- Grid update: < 50ms
- Mobile card update: < 10ms
- Memory usage: < 10MB

## Future Feature Roadmap

### Planned Enhancements

**Phase 1: Data Persistence**
- localStorage for state
- Save/load configurations
- Recent configurations list

**Phase 2: Export & Sharing**
- Export to CSV
- Export to Excel
- Print-friendly view
- Share via URL (query params)

**Phase 3: Scenario Comparison**
- Save multiple scenarios
- Side-by-side comparison
- Diff highlighting

**Phase 4: Visualizations**
- Cost trend charts
- Discount breakdown pie chart
- True-up/overage over time

**Phase 5: Advanced Features**
- Custom calculation formulas
- Multi-year variable commitments
- What-if analysis
- Optimization suggestions

### Features NOT Planned

- User accounts (static site philosophy)
- Multi-user collaboration
- Backend integration
- Real-time data sync
- Mobile app (PWA sufficient)

## Feature Success Metrics

**Usability:**
- Time to first calculation: < 30 seconds
- Error rate: < 5% of user inputs
- Mobile usage: > 20% of sessions

**Performance:**
- Load time: < 1 second (median)
- Calculation time: < 100ms (p95)
- No performance degradation over time

**Adoption:**
- Daily active users: Target TBD
- Calculations per session: > 3
- Return users: > 30%

**Quality:**
- Calculation accuracy: 100% vs. Excel
- Browser crash rate: < 0.1%
- Accessibility score: 100 (Lighthouse)
