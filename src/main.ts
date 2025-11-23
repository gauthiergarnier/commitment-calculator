import './style.css'

// Constants
const USER_LICENSE_COST = 19
const DEFAULT_MONTHLY_USAGE = [1512, 1800, 1200, 1500, 5000, 500, 1500, 1500, 1500, 1500, 1500, 1500]

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

interface MonthlyResult {
  month: string
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

interface YearResult {
  year: number
  totalUsage: number
  totalUsageAfterDiscount: number
  yearlyCommitment: number
  costOfCommitment: number
  monthlyProjection: number
  totalTrueUp: number
  totalOverage: number
  totalMonthlyCost: number
  blendedDiscount: number
  months: MonthlyResult[]
}

// Utility functions
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatPercent(value: number): string {
  return (value * 100).toFixed(1) + '%'
}

// Calculate discounts based on inputs
function calculateDiscounts(inputs: CalculatorInputs): Discounts {
  // Reseller discount: 10% if Reseller and not Registered tier
  const resellerDiscount =
    inputs.contractType === 'Reseller' && inputs.agencyTier !== 'Registered'
      ? 0.1
      : 0

  // Commitment discount based on type and duration
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

  // Commitment bonus: only for Reseller with Monthly Spending
  let commitmentBonus = 0
  if (inputs.contractType === 'Reseller' && inputs.commitmentType === 'Monthly Spending') {
    if (inputs.agencyTier === 'Gold') commitmentBonus = 0.05
    else if (inputs.agencyTier === 'Platinum' || inputs.agencyTier === 'Diamond')
      commitmentBonus = 0.07
  }

  // Referral commissions
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

// Calculate results for one year
function calculateYear(
  yearIndex: number,
  inputs: CalculatorInputs,
  discounts: Discounts,
  monthlyUsage: number[]
): YearResult {
  const yearlyCommitment = inputs.yearCommitments[yearIndex]
  const committedMonthly = yearlyCommitment / 12
  const costOfCommitment =
    yearlyCommitment * (1 - (discounts.commitmentDiscount + discounts.commitmentBonus))
  const monthlyCommitmentCost = costOfCommitment / 12

  const months: MonthlyResult[] = []
  let totalUsage = 0
  let totalUsageAfterDiscount = 0
  let totalTrueUp = 0
  let totalOverage = 0
  let totalMonthlyCost = 0

  for (let i = 0; i < 12; i++) {
    const usage = monthlyUsage[i]
    const freeLicenses = -USER_LICENSE_COST * inputs.freeUserLicenses

    let supportDiscount = 0
    if (inputs.supportLevel === 'Advanced Support') {
      supportDiscount = -usage * 0.05
    } else if (inputs.supportLevel === 'Premium Support') {
      supportDiscount = -usage * 0.04
    }

    const resellerDiscountAmount = -discounts.resellerDiscount * usage
    const usageAfterDiscount =
      usage + freeLicenses + supportDiscount + resellerDiscountAmount

    const trueUp = Math.max(0, committedMonthly - usageAfterDiscount)
    const overage = Math.max(0, usageAfterDiscount - committedMonthly)
    const monthlyCost = monthlyCommitmentCost + overage
    const blendedDiscount = (monthlyCost - usage) / usage

    months.push({
      month: `Month ${i + 1}`,
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

    totalUsage += usage
    totalUsageAfterDiscount += usageAfterDiscount
    totalTrueUp += trueUp
    totalOverage += overage
    totalMonthlyCost += monthlyCost
  }

  const blendedDiscount = (totalMonthlyCost - totalUsage) / totalUsage

  return {
    year: yearIndex + 1,
    totalUsage,
    totalUsageAfterDiscount,
    yearlyCommitment,
    costOfCommitment,
    monthlyProjection: costOfCommitment / 12,
    totalTrueUp,
    totalOverage,
    totalMonthlyCost,
    blendedDiscount,
    months,
  }
}

// Calculate all years
function calculateResults(inputs: CalculatorInputs): {
  discounts: Discounts
  years: YearResult[]
  avgMonthlyCost: number
} {
  const discounts = calculateDiscounts(inputs)
  const years: YearResult[] = []

  for (let i = 0; i < inputs.yearCommitments.length; i++) {
    const yearResult = calculateYear(i, inputs, discounts, inputs.monthlyUsage[i])
    years.push(yearResult)
  }

  // Calculate average monthly cost across all years
  const totalMonthlyCost = years.reduce((sum, year) => sum + year.totalMonthlyCost, 0)
  const totalMonths = years.reduce((sum, year) => sum + year.months.length, 0)
  const avgMonthlyCost = totalMonthlyCost / totalMonths

  return { discounts, years, avgMonthlyCost }
}

// UI functions
function createMonthlyUsageInputs(): void {
  const container = document.getElementById('monthly-usage-inputs')
  if (!container) return

  container.innerHTML = ''

  for (let year = 0; year < 3; year++) {
    const yearDiv = document.createElement('div')
    yearDiv.style.gridColumn = '1 / -1'
    yearDiv.innerHTML = `<h4 style="margin: 1rem 0 0.5rem 0;">Year ${year + 1}</h4>`
    container.appendChild(yearDiv)

    for (let month = 0; month < 12; month++) {
      const formGroup = document.createElement('div')
      formGroup.className = 'form-group'

      const label = document.createElement('label')
      label.textContent = `M${month + 1}`
      label.htmlFor = `usage-y${year}-m${month}`

      const input = document.createElement('input')
      input.type = 'number'
      input.id = `usage-y${year}-m${month}`
      input.name = `usage-y${year}-m${month}`
      input.min = '0'
      input.step = '1'
      input.value = DEFAULT_MONTHLY_USAGE[month].toString()
      input.required = true

      formGroup.appendChild(label)
      formGroup.appendChild(input)
      container.appendChild(formGroup)
    }
  }
}

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

  const yearCommitments = [
    parseInt((document.getElementById('year1-commitment') as HTMLInputElement).value),
    parseInt((document.getElementById('year2-commitment') as HTMLInputElement).value),
    parseInt((document.getElementById('year3-commitment') as HTMLInputElement).value),
  ]

  const monthlyUsage: number[][] = []
  for (let year = 0; year < 3; year++) {
    const yearUsage: number[] = []
    for (let month = 0; month < 12; month++) {
      const input = document.getElementById(`usage-y${year}-m${month}`) as HTMLInputElement
      yearUsage.push(parseFloat(input.value) || 0)
    }
    monthlyUsage.push(yearUsage)
  }

  return {
    agencyTier,
    commitmentType,
    commitmentDuration,
    contractType,
    freeUserLicenses,
    supportLevel,
    yearCommitments,
    monthlyUsage,
  }
}

function displayDiscounts(discounts: Discounts): void {
  const container = document.getElementById('discounts-display')
  if (!container) return

  container.innerHTML = `
    <div class="discount-item">
      <div>
        <span class="discount-label">Reseller Discount</span>
        <span class="discount-note">(applied on all usage)</span>
      </div>
      <span class="discount-value">${formatPercent(discounts.resellerDiscount)}</span>
    </div>
    <div class="discount-item">
      <div>
        <span class="discount-label">Commitment Discount</span>
        <span class="discount-note">(applied on the commitment amount)</span>
      </div>
      <span class="discount-value">${formatPercent(discounts.commitmentDiscount)}</span>
    </div>
    <div class="discount-item">
      <div>
        <span class="discount-label">Commitment Bonus</span>
        <span class="discount-note">(applied on the commitment amount)</span>
      </div>
      <span class="discount-value">${formatPercent(discounts.commitmentBonus)}</span>
    </div>
    <div class="discount-item">
      <span class="discount-label">Referral Commission (1st year)</span>
      <span class="discount-value">${formatPercent(discounts.referralYear1)}</span>
    </div>
    <div class="discount-item">
      <span class="discount-label">Referral Commission (Following years)</span>
      <span class="discount-value">${formatPercent(discounts.referralFollowing)}</span>
    </div>
  `

  document.getElementById('discounts-section')?.classList.add('visible')
}

function displayResults(
  years: YearResult[],
  discounts: Discounts,
  avgMonthlyCost: number
): void {
  const summaryContainer = document.getElementById('summary-display')
  const tableContainer = document.getElementById('results-table')

  if (!summaryContainer || !tableContainer) return

  // Display summary
  summaryContainer.innerHTML = `
    <div class="summary-item">
      <strong>Average Monthly Cost:</strong> ${formatCurrency(avgMonthlyCost)}
      <span class="discount-note">with ${formatPercent(discounts.commitmentDiscount)} commitment discount + ${formatPercent(discounts.commitmentBonus)} commitment bonus</span>
    </div>
  `

  // Build results table
  let tableHTML = `
    <div class="results-table-container">
      <table>
        <thead>
          <tr>
            <th>Period</th>
            <th>Usage (List Price)</th>
            <th>Free Licenses</th>
            <th>Support Discount</th>
            <th>Reseller Discount</th>
            <th>Usage After Discount</th>
            <th>Committed Amount</th>
            <th>True Up</th>
            <th>Overage</th>
            <th>Monthly Cost</th>
            <th>Blended Discount</th>
          </tr>
        </thead>
        <tbody>
  `

  years.forEach((year) => {
    // Year summary row
    tableHTML += `
      <tr class="year-row">
        <td>Year ${year.year}</td>
        <td>${formatCurrency(year.totalUsage)}</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>${formatCurrency(year.totalUsageAfterDiscount)}</td>
        <td>${formatCurrency(year.yearlyCommitment)}</td>
        <td>${formatCurrency(year.totalTrueUp)}</td>
        <td>${formatCurrency(year.totalOverage)}</td>
        <td>${formatCurrency(year.totalMonthlyCost)}</td>
        <td>${formatPercent(year.blendedDiscount)}</td>
      </tr>
    `

    // Monthly rows
    year.months.forEach((month) => {
      tableHTML += `
        <tr>
          <td>${month.month}</td>
          <td>${formatCurrency(month.usage)}</td>
          <td>${formatCurrency(month.freeLicenses)}</td>
          <td>${formatCurrency(month.supportDiscount)}</td>
          <td>${formatCurrency(month.resellerDiscount)}</td>
          <td>${formatCurrency(month.usageAfterDiscount)}</td>
          <td>${formatCurrency(month.committedAmount)}</td>
          <td>${month.trueUp > 0 ? formatCurrency(month.trueUp) : '-'}</td>
          <td>${month.overage > 0 ? formatCurrency(month.overage) : '-'}</td>
          <td>${formatCurrency(month.monthlyCost)}</td>
          <td>${formatPercent(month.blendedDiscount)}</td>
        </tr>
      `
    })
  })

  tableHTML += `
        </tbody>
      </table>
    </div>
  `

  tableContainer.innerHTML = tableHTML
  document.getElementById('results-section')?.classList.add('visible')
}

function handleFormSubmit(e: Event): void {
  e.preventDefault()

  try {
    const inputs = getFormInputs()
    const { discounts, years, avgMonthlyCost } = calculateResults(inputs)

    displayDiscounts(discounts)
    displayResults(years, discounts, avgMonthlyCost)

    // Scroll to results
    document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' })
  } catch (error) {
    alert('Error calculating results: ' + (error as Error).message)
  }
}

// Initialize the application
function init(): void {
  createMonthlyUsageInputs()

  const form = document.getElementById('calculator-form')
  if (form) {
    form.addEventListener('submit', handleFormSubmit)
  }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
