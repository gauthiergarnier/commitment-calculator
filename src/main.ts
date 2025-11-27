import './style.css'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { createGrid, GridApi, GridOptions, ColDef, ValueFormatterParams, CellClassParams, RowClassParams, ModuleRegistry, AllCommunityModule } from 'ag-grid-community'

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule])

// Constants
const DEFAULT_MONTHLY_USAGE = [1512, 1800, 1200, 1500, 5000, 500, 1500, 1500, 1500, 1500, 1500, 1500]
const DEFAULT_YEAR_COMMITMENTS = [14000, 15000, 14000]

// Currency pricing (license + advanced user management)
const CURRENCY_PRICING = {
  USD: { symbol: '$', code: 'USD', license: 10, advanced: 9, total: 19 },
  EUR: { symbol: '€', code: 'EUR', license: 10, advanced: 9, total: 19 },
  GBP: { symbol: '£', code: 'GBP', license: 8.5, advanced: 7.5, total: 16 },
  CAD: { symbol: 'C$', code: 'CAD', license: 14.5, advanced: 13, total: 27.5 },
  AUD: { symbol: 'A$', code: 'AUD', license: 16.5, advanced: 15, total: 31.5 },
}

type Currency = keyof typeof CURRENCY_PRICING

// Types
interface CalculatorInputs {
  agencyTier: string
  commitmentType: string
  commitmentDuration: string
  contractType: string
  freeUserLicenses: number
  supportLevel: string
  yearCommitments: number[]
  monthlyUsage: number[][]
}

interface Discounts {
  resellerDiscount: number
  commitmentDiscount: number
  commitmentBonus: number
  referralYear1: number
  referralFollowing: number
}

interface GridRow {
  period: string
  rowType: 'year' | 'month'
  yearIndex?: number
  monthIndex?: number
  usage: number
  freeLicenses: number
  supportDiscount: number
  resellerDiscount: number
  usageAfterDiscount: number
  committedAmount: number
  trueUp: number
  overage: number
  monthlyCost: number
  blendedDiscount: number
}

// Application state
let monthlyUsage: number[][] = [
  [...DEFAULT_MONTHLY_USAGE],
  [...DEFAULT_MONTHLY_USAGE],
  [...DEFAULT_MONTHLY_USAGE],
]
let yearCommitments: number[] = [...DEFAULT_YEAR_COMMITMENTS]
let grid: GridApi | null = null
let currentCurrency: Currency = 'USD'
let currentTheme: 'light' | 'dark' = 'dark'

// Utility functions
function formatCurrency(params: ValueFormatterParams): string {
  if (params.value == null || isNaN(params.value)) return '-'
  const pricing = CURRENCY_PRICING[currentCurrency]
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: pricing.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(params.value)
}

function formatPercent(params: ValueFormatterParams): string {
  if (params.value == null || isNaN(params.value)) return '-'
  return (params.value * 100).toFixed(1) + '%'
}

function formatCurrencyValue(value: number): string {
  const pricing = CURRENCY_PRICING[currentCurrency]
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: pricing.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPercentValue(value: number): string {
  return (value * 100).toFixed(1) + '%'
}

// Row class rules for row styling
function getRowClass(params: RowClassParams): string {
  const row = params.data as GridRow
  return row.rowType === 'year' ? 'year-row' : ''
}

// Calculate discounts
function calculateDiscounts(inputs: CalculatorInputs): Discounts {
  const resellerDiscount =
    inputs.contractType === 'Reseller' && inputs.agencyTier !== 'Registered' ? 0.1 : 0

  let commitmentDiscount = 0
  if (inputs.commitmentType === 'Monthly Spending') {
    if (inputs.commitmentDuration === '12 months') commitmentDiscount = 0.1
    else if (inputs.commitmentDuration === '24 months') commitmentDiscount = 0.15
    else if (inputs.commitmentDuration === '36 months') commitmentDiscount = 0.2
  } else if (inputs.commitmentType === 'Annual Spending') {
    if (inputs.commitmentDuration === '12 months') commitmentDiscount = 0.05
    else if (inputs.commitmentDuration === '24 months') commitmentDiscount = 0.1
    else if (inputs.commitmentDuration === '36 months') commitmentDiscount = 0.15
  }

  let commitmentBonus = 0
  if (inputs.contractType === 'Reseller' && inputs.commitmentType === 'Monthly Spending') {
    if (inputs.agencyTier === 'Gold') commitmentBonus = 0.05
    else if (inputs.agencyTier === 'Platinum' || inputs.agencyTier === 'Diamond')
      commitmentBonus = 0.07
  }

  const referralYear1 = inputs.agencyTier !== 'Registered' ? 0.1 : 0

  let referralFollowing = 0
  if (inputs.agencyTier === 'Gold') referralFollowing = 0.02
  else if (inputs.agencyTier === 'Platinum') referralFollowing = 0.035
  else if (inputs.agencyTier === 'Diamond') referralFollowing = 0.05

  return {
    resellerDiscount,
    commitmentDiscount,
    commitmentBonus,
    referralYear1,
    referralFollowing,
  }
}

// Calculate grid rows
function calculateGridData(inputs: CalculatorInputs, discounts: Discounts): GridRow[] {
  const rows: GridRow[] = []

  for (let yearIndex = 0; yearIndex < 3; yearIndex++) {
    const yearlyCommitment = inputs.yearCommitments[yearIndex]
    const committedMonthly = yearlyCommitment / 12
    const costOfCommitment =
      yearlyCommitment * (1 - (discounts.commitmentDiscount + discounts.commitmentBonus))
    const monthlyCommitmentCost = costOfCommitment / 12

    let yearTotalUsage = 0
    let yearTotalUsageAfterDiscount = 0
    let yearTotalTrueUp = 0
    let yearTotalOverage = 0
    let yearTotalMonthlyCost = 0

    // Calculate monthly rows first
    const monthlyRows: GridRow[] = []
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const usage = inputs.monthlyUsage[yearIndex][monthIndex]
      const freeLicenses = -CURRENCY_PRICING[currentCurrency].total * inputs.freeUserLicenses

      let supportDiscount = 0
      if (inputs.supportLevel === 'Advanced Support') {
        supportDiscount = -usage * 0.05
      } else if (inputs.supportLevel === 'Premium Support') {
        supportDiscount = -usage * 0.04
      }

      const resellerDiscountAmount = -discounts.resellerDiscount * usage
      const usageAfterDiscount = usage + freeLicenses + supportDiscount + resellerDiscountAmount

      const trueUp = Math.max(0, committedMonthly - usageAfterDiscount)
      const overage = Math.max(0, usageAfterDiscount - committedMonthly)
      const monthlyCost = monthlyCommitmentCost + overage
      const blendedDiscount = (monthlyCost - usage) / usage

      yearTotalUsage += usage
      yearTotalUsageAfterDiscount += usageAfterDiscount
      yearTotalTrueUp += trueUp
      yearTotalOverage += overage
      yearTotalMonthlyCost += monthlyCost

      monthlyRows.push({
        period: `Month ${monthIndex + 1}`,
        rowType: 'month',
        yearIndex,
        monthIndex,
        usage,
        freeLicenses,
        supportDiscount,
        resellerDiscount: resellerDiscountAmount,
        usageAfterDiscount,
        committedAmount: committedMonthly,
        trueUp,
        overage,
        monthlyCost,
        blendedDiscount,
      })
    }

    const yearBlendedDiscount = (yearTotalMonthlyCost - yearTotalUsage) / yearTotalUsage

    // Add year summary row
    rows.push({
      period: `Year ${yearIndex + 1}`,
      rowType: 'year',
      yearIndex,
      usage: yearTotalUsage,
      freeLicenses: 0,
      supportDiscount: 0,
      resellerDiscount: 0,
      usageAfterDiscount: yearTotalUsageAfterDiscount,
      committedAmount: yearlyCommitment,
      trueUp: yearTotalTrueUp,
      overage: yearTotalOverage,
      monthlyCost: yearTotalMonthlyCost,
      blendedDiscount: yearBlendedDiscount,
    })

    // Add monthly rows
    rows.push(...monthlyRows)
  }

  return rows
}

// Get form inputs
function getFormInputs(): CalculatorInputs {
  const agencyTier = (document.getElementById('agency-tier') as HTMLSelectElement).value
  const commitmentType = (document.getElementById('commitment-type') as HTMLSelectElement).value
  const commitmentDuration = (
    document.getElementById('commitment-duration') as HTMLSelectElement
  ).value
  const contractType = (document.getElementById('contract-type') as HTMLSelectElement).value
  const freeUserLicenses = parseInt(
    (document.getElementById('free-user-licenses') as HTMLInputElement).value
  )
  const supportLevel = (document.getElementById('support-level') as HTMLSelectElement).value

  return {
    agencyTier,
    commitmentType,
    commitmentDuration,
    contractType,
    freeUserLicenses,
    supportLevel,
    yearCommitments: [...yearCommitments],
    monthlyUsage: monthlyUsage.map(year => [...year]),
  }
}

// Display discounts
function displayDiscounts(discounts: Discounts): void {
  const container = document.getElementById('discounts-display')
  if (!container) return

  container.innerHTML = `
    <div class="discount-item">
      <div>
        <span class="discount-label">Reseller Discount</span>
        <span class="discount-note">(applied on all usage)</span>
      </div>
      <span class="discount-value">${formatPercentValue(discounts.resellerDiscount)}</span>
    </div>
    <div class="discount-item">
      <div>
        <span class="discount-label">Commitment Discount</span>
        <span class="discount-note">(applied on the commitment amount)</span>
      </div>
      <span class="discount-value">${formatPercentValue(discounts.commitmentDiscount)}</span>
    </div>
    <div class="discount-item">
      <div>
        <span class="discount-label">Commitment Bonus</span>
        <span class="discount-note">(applied on the commitment amount)</span>
      </div>
      <span class="discount-value">${formatPercentValue(discounts.commitmentBonus)}</span>
    </div>
    <div class="discount-item">
      <div>
        <span class="discount-label">Referral Commission (1st year)</span>
      </div>
      <span class="discount-value">${formatPercentValue(discounts.referralYear1)}</span>
    </div>
    <div class="discount-item">
      <div>
        <span class="discount-label">Referral Commission (Following years)</span>
      </div>
      <span class="discount-value">${formatPercentValue(discounts.referralFollowing)}</span>
    </div>
  `
}

// Display summary
function displaySummary(avgMonthlyCost: number, discounts: Discounts): void {
  const container = document.getElementById('summary-display')
  if (!container) return

  container.innerHTML = `
    <div class="summary-item">
      <strong>Average Monthly Cost:</strong> ${formatCurrencyValue(avgMonthlyCost)}
      <span class="summary-note">with ${formatPercentValue(discounts.commitmentDiscount)} commitment discount + ${formatPercentValue(discounts.commitmentBonus)} commitment bonus</span>
    </div>
  `
}

// Define AG Grid columns
function getColumnDefs(): ColDef[] {
  return [
    {
      field: 'period',
      headerName: 'Period',
      pinned: 'left',
      width: 100,
      editable: false,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: (params: CellClassParams) => {
        const row = params.data as GridRow
        return row.rowType === 'year' ? 'ag-cell-readonly font-bold' : 'ag-cell-readonly'
      },
    },
    {
      field: 'usage',
      headerName: 'Usage\n(List Price)',
      width: 120,
      editable: (params) => params.data.rowType === 'month',
      valueFormatter: formatCurrency,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: (params: CellClassParams) => {
        const row = params.data as GridRow
        return row.rowType === 'month'
          ? 'ag-cell-editable cell-currency'
          : 'ag-cell-readonly cell-currency'
      },
      valueSetter: (params) => {
        const row = params.data as GridRow
        if (row.rowType === 'month' && row.yearIndex !== undefined && row.monthIndex !== undefined) {
          const newValue = parseFloat(params.newValue) || 0
          monthlyUsage[row.yearIndex][row.monthIndex] = newValue
          recalculate()
          return true
        }
        return false
      },
      cellEditorParams: {
        useFormatter: false,
      },
    },
    {
      field: 'freeLicenses',
      headerName: 'Free\nLicenses',
      width: 100,
      editable: false,
      valueFormatter: formatCurrency,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'ag-cell-readonly cell-currency',
      tooltipValueGetter: () => 'Auto-calculated based on Free User Licenses setting',
    },
    {
      field: 'supportDiscount',
      headerName: 'Support\nDiscount',
      width: 110,
      editable: false,
      valueFormatter: formatCurrency,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'ag-cell-readonly cell-currency',
      tooltipValueGetter: () => 'Auto-calculated based on Support Level setting',
    },
    {
      field: 'resellerDiscount',
      headerName: 'Reseller\nDiscount',
      width: 110,
      editable: false,
      valueFormatter: formatCurrency,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'ag-cell-readonly cell-currency',
      tooltipValueGetter: () => 'Auto-calculated based on Contract Type setting',
    },
    {
      field: 'usageAfterDiscount',
      headerName: 'Usage After\nDiscount',
      width: 120,
      editable: false,
      valueFormatter: formatCurrency,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'ag-cell-readonly cell-currency',
      tooltipValueGetter: () => 'Auto-calculated',
    },
    {
      field: 'committedAmount',
      headerName: 'Committed\nAmount',
      width: 120,
      editable: (params) => params.data.rowType === 'year',
      valueFormatter: formatCurrency,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: (params: CellClassParams) => {
        const row = params.data as GridRow
        return row.rowType === 'year'
          ? 'ag-cell-editable cell-currency'
          : 'ag-cell-readonly cell-currency'
      },
      valueSetter: (params) => {
        const row = params.data as GridRow
        if (row.rowType === 'year' && row.yearIndex !== undefined) {
          const newValue = parseFloat(params.newValue) || 0
          yearCommitments[row.yearIndex] = newValue
          recalculate()
          return true
        }
        return false
      },
      cellEditorParams: {
        useFormatter: false,
      },
    },
    {
      field: 'trueUp',
      headerName: 'True Up',
      width: 100,
      editable: false,
      valueFormatter: formatCurrency,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'ag-cell-readonly cell-currency',
      tooltipValueGetter: () => 'Auto-calculated',
    },
    {
      field: 'overage',
      headerName: 'Overage',
      width: 100,
      editable: false,
      valueFormatter: formatCurrency,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'ag-cell-readonly cell-currency',
      tooltipValueGetter: () => 'Auto-calculated',
    },
    {
      field: 'monthlyCost',
      headerName: 'Monthly\nCost',
      width: 110,
      editable: false,
      valueFormatter: formatCurrency,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'ag-cell-readonly cell-currency',
      tooltipValueGetter: () => 'Auto-calculated',
    },
    {
      field: 'blendedDiscount',
      headerName: 'Blended\nDiscount',
      width: 110,
      editable: false,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      valueFormatter: formatPercent,
      cellClass: 'ag-cell-readonly cell-percent',
      tooltipValueGetter: () => 'Auto-calculated',
    },
  ]
}

// Initialize AG Grid
function initializeGrid(): void {
  const gridContainer = document.getElementById('data-grid')
  if (!gridContainer) return

  const gridOptions: GridOptions = {
    columnDefs: getColumnDefs(),
    rowData: [],
    defaultColDef: {
      sortable: true,
      filter: false,
      resizable: true,
      suppressMovable: true,
      enableCellChangeFlash: true,
    },
    suppressCellFocus: false,
    enableRangeSelection: false,
    rowSelection: 'single',
    getRowClass: getRowClass,
    tooltipShowDelay: 500,
    suppressHorizontalScroll: false,
    onCellEditingStopped: () => {
      // Recalculation is handled in valueSetter
    },
  }

  grid = createGrid(gridContainer, gridOptions)
}

// Recalculate and update grid
function recalculate(): void {
  const inputs = getFormInputs()
  const discounts = calculateDiscounts(inputs)
  const gridData = calculateGridData(inputs, discounts)

  // Calculate average monthly cost
  const totalMonthlyCost = gridData
    .filter(row => row.rowType === 'year')
    .reduce((sum, row) => sum + row.monthlyCost, 0)
  const avgMonthlyCost = totalMonthlyCost / 36

  // Update displays
  displayDiscounts(discounts)
  displaySummary(avgMonthlyCost, discounts)

  // Update grid
  if (grid) {
    grid.setGridOption('rowData', gridData)
  }

  // Update mobile cards
  updateMobileCards(gridData, avgMonthlyCost)
}

// Update mobile card layout
function updateMobileCards(gridData: GridRow[], avgMonthlyCost: number): void {
  const container = document.getElementById('mobile-cards')
  if (!container) return

  let html = `
    <div class="mobile-card">
      <div class="mobile-card-header">Summary</div>
      <div class="mobile-card-row">
        <span class="mobile-card-label">Average Monthly Cost</span>
        <span class="mobile-card-value font-bold text-primary">${formatCurrencyValue(avgMonthlyCost)}</span>
      </div>
    </div>
  `

  gridData.forEach((row) => {
    if (row.rowType === 'year') {
      html += `
        <div class="mobile-card year-card">
          <div class="mobile-card-header">${row.period}</div>
          <div class="mobile-card-row">
            <span class="mobile-card-label">Total Usage</span>
            <span class="mobile-card-value">${formatCurrencyValue(row.usage)}</span>
          </div>
          <div class="mobile-card-row">
            <span class="mobile-card-label">Committed Amount</span>
            <span class="mobile-card-value">
              <input type="number" value="${row.committedAmount}" data-year="${row.yearIndex}" class="mobile-commitment-input" />
            </span>
          </div>
          <div class="mobile-card-row">
            <span class="mobile-card-label">Total Cost</span>
            <span class="mobile-card-value font-bold">${formatCurrencyValue(row.monthlyCost)}</span>
          </div>
        </div>
      `
    } else {
      html += `
        <div class="mobile-card">
          <div class="mobile-card-header">${row.period}</div>
          <div class="mobile-card-row">
            <span class="mobile-card-label">Usage</span>
            <span class="mobile-card-value">
              <input type="number" value="${row.usage}" data-year="${row.yearIndex}" data-month="${row.monthIndex}" class="mobile-usage-input" />
            </span>
          </div>
          <div class="mobile-card-row">
            <span class="mobile-card-label">Usage After Discount</span>
            <span class="mobile-card-value">${formatCurrencyValue(row.usageAfterDiscount)}</span>
          </div>
          <div class="mobile-card-row">
            <span class="mobile-card-label">Monthly Cost</span>
            <span class="mobile-card-value font-bold">${formatCurrencyValue(row.monthlyCost)}</span>
          </div>
        </div>
      `
    }
  })

  container.innerHTML = html

  // Attach mobile input listeners
  container.querySelectorAll('.mobile-commitment-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement
      const yearIndex = parseInt(target.dataset.year || '0')
      yearCommitments[yearIndex] = parseFloat(target.value) || 0
      recalculate()
    })
  })

  container.querySelectorAll('.mobile-usage-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement
      const yearIndex = parseInt(target.dataset.year || '0')
      const monthIndex = parseInt(target.dataset.month || '0')
      monthlyUsage[yearIndex][monthIndex] = parseFloat(target.value) || 0
      recalculate()
    })
  })
}

// Initialize the application
function init(): void {
  // Initialize grid
  initializeGrid()

  // Add change listeners to configuration inputs
  const configInputs = [
    'agency-tier',
    'commitment-type',
    'commitment-duration',
    'contract-type',
    'support-level',
    'free-user-licenses',
  ]

  configInputs.forEach(id => {
    const element = document.getElementById(id)
    if (element) {
      element.addEventListener('change', recalculate)
      element.addEventListener('input', recalculate)
    }
  })

  // Currency selector
  const currencySelector = document.getElementById('currency') as HTMLSelectElement
  if (currencySelector) {
    currencySelector.addEventListener('change', (e) => {
      currentCurrency = (e.target as HTMLSelectElement).value as Currency
      recalculate()
    })
  }

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle') as HTMLButtonElement
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', currentTheme)
      // Icons switch automatically via CSS
    })
  }

  // Initialize theme based on system preference if not already set
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  currentTheme = prefersDark ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', currentTheme)

  // Initial calculation
  recalculate()
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
