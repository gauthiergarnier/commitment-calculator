"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CalculationResult, Currency } from "@/lib/types"
import { formatCurrency, formatPercent } from "@/lib/calculations"
import { ChevronDown, ChevronRight } from "lucide-react"
import { YearChart } from "@/components/year-chart"

interface DetailedBreakdownProps {
  result: CalculationResult | null
  currency: Currency
}

export function DetailedBreakdown({ result, currency }: DetailedBreakdownProps) {
  const [expandedYears, setExpandedYears] = React.useState<Set<number>>(new Set([1]))

  if (!result) {
    return null
  }

  const toggleYear = (year: number) => {
    const newExpanded = new Set(expandedYears)
    if (newExpanded.has(year)) {
      newExpanded.delete(year)
    } else {
      newExpanded.add(year)
    }
    setExpandedYears(newExpanded)
  }

  const { monthlyCalculations, yearlySummaries, discounts } = result

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="font-heading">Detailed 3-Year Breakdown</CardTitle>
        <CardDescription>
          Monthly and yearly cost projections with full calculation details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {yearlySummaries.map((yearSummary) => {
            const isExpanded = expandedYears.has(yearSummary.year)
            const yearMonths = monthlyCalculations.filter((m) => m.year === yearSummary.year)

            return (
              <div key={yearSummary.year} className="border rounded-xl overflow-hidden">
                {/* Year Summary Header */}
                <button
                  onClick={() => toggleYear(yearSummary.year)}
                  className="w-full bg-primary text-primary-foreground p-4 flex items-center justify-between hover:bg-primary/90 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-lg">Year {yearSummary.year}</span>
                      <span className="text-xs opacity-80 font-normal">
                        with {formatPercent(discounts.commitmentDiscount)} commitment discount + {formatPercent(discounts.commitmentBonus)} commitment bonus
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-right">
                      <div className="opacity-80">Total Cost</div>
                      <div className="font-bold">
                        {formatCurrency(yearSummary.totalMonthlyCost, currency)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="opacity-80">Avg Discount</div>
                      <div className="font-bold">
                        {formatPercent(yearSummary.averageBlendedDiscount)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="opacity-80">Commitment</div>
                      <div className="font-bold">
                        {formatCurrency(yearSummary.yearlyCommitment, currency)}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Monthly Details Table */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-card"
                  >
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr className="border-b">
                            <th className="text-left p-3 font-medium">Month</th>
                            <th className="text-right p-3 font-medium">Base Usage</th>
                            <th className="text-right p-3 font-medium">Cost Variation</th>
                            <th className="text-right p-3 font-medium">Total Usage</th>
                            <th className="text-right p-3 font-medium">Free Licenses</th>
                            <th className="text-right p-3 font-medium">Support Disc.</th>
                            <th className="text-right p-3 font-medium">Reseller Disc.</th>
                            <th className="text-right p-3 font-medium">After Disc.</th>
                            <th className="text-right p-3 font-medium">Committed</th>
                            <th className="text-right p-3 font-medium">Cost of Commitment (yearly)</th>
                            <th className="text-right p-3 font-medium">Cost of Commitment (monthly)</th>
                            <th className="text-right p-3 font-medium">True-Up</th>
                            <th className="text-right p-3 font-medium">Overage</th>
                            <th className="text-right p-3 font-medium">Monthly Cost</th>
                            <th className="text-right p-3 font-medium">Blended Disc.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {yearMonths.map((month) => (
                            <tr key={month.month} className="border-b hover:bg-muted/30 transition-colors">
                              <td className="p-3 font-medium">Month {month.month}</td>
                              <td className="p-3 text-right tabular-nums text-muted-foreground">
                                {formatCurrency(month.baseUsage, currency)}
                              </td>
                              <td className={`p-3 text-right tabular-nums font-medium ${month.costVariation > 0 ? 'text-orange-600 dark:text-orange-400' : month.costVariation < 0 ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'}`}>
                                {month.costVariation > 0 ? '+' : ''}{formatCurrency(month.costVariation, currency)}
                              </td>
                              <td className="p-3 text-right tabular-nums font-semibold">
                                {formatCurrency(month.usage, currency)}
                              </td>
                              <td className="p-3 text-right tabular-nums text-green-600 dark:text-green-400">
                                {formatCurrency(month.freeLicenses, currency)}
                              </td>
                              <td className="p-3 text-right tabular-nums text-green-600 dark:text-green-400">
                                {formatCurrency(month.supportDiscount, currency)}
                              </td>
                              <td className="p-3 text-right tabular-nums text-green-600 dark:text-green-400">
                                {formatCurrency(month.resellerDiscount, currency)}
                              </td>
                              <td className="p-3 text-right tabular-nums">
                                {formatCurrency(month.usageAfterDiscount, currency)}
                              </td>
                              <td className="p-3 text-right tabular-nums font-medium">
                                {formatCurrency(month.committedAmount, currency)}
                              </td>
                              <td className="p-3 text-right tabular-nums text-muted-foreground">
                                {formatCurrency(month.costOfCommitmentYearly, currency)}
                              </td>
                              <td className="p-3 text-right tabular-nums text-muted-foreground">
                                {formatCurrency(month.costOfCommitmentMonthly, currency)}
                              </td>
                              <td className="p-3 text-right tabular-nums text-amber-600 dark:text-amber-400">
                                {formatCurrency(month.trueUp, currency)}
                              </td>
                              <td className="p-3 text-right tabular-nums text-orange-600 dark:text-orange-400">
                                {formatCurrency(month.overage, currency)}
                              </td>
                              <td className="p-3 text-right tabular-nums font-bold text-primary">
                                {formatCurrency(month.monthlyCost, currency)}
                              </td>
                              <td className="p-3 text-right tabular-nums font-medium">
                                {formatPercent(month.blendedDiscount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-muted/50 font-semibold">
                          <tr className="border-t-2">
                            <td className="p-3">Year Total</td>
                            <td colSpan={2}></td>
                            <td className="p-3 text-right tabular-nums">
                              {formatCurrency(yearSummary.totalUsage, currency)}
                            </td>
                            <td colSpan={3}></td>
                            <td className="p-3 text-right tabular-nums">
                              {formatCurrency(yearSummary.totalUsageAfterDiscount, currency)}
                            </td>
                            <td className="p-3 text-right tabular-nums">
                              {formatCurrency(yearSummary.yearlyCommitment, currency)}
                            </td>
                            <td colSpan={2}></td>
                            <td className="p-3 text-right tabular-nums">
                              {formatCurrency(yearSummary.totalTrueUp, currency)}
                            </td>
                            <td className="p-3 text-right tabular-nums">
                              {formatCurrency(yearSummary.totalOverage, currency)}
                            </td>
                            <td className="p-3 text-right tabular-nums text-primary">
                              {formatCurrency(yearSummary.totalMonthlyCost, currency)}
                            </td>
                            <td className="p-3 text-right tabular-nums">
                              {formatPercent(yearSummary.averageBlendedDiscount)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4 p-4">
                      {yearMonths.map((month) => (
                        <div key={month.month} className="border rounded-lg p-4 space-y-2 bg-muted/20">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-bold text-lg">Month {month.month}</span>
                            <span className="font-bold text-primary">
                              {formatCurrency(month.monthlyCost, currency)}
                            </span>
                          </div>
                          <Separator />
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <div className="text-muted-foreground">Base Usage</div>
                              <div className="font-medium text-muted-foreground">{formatCurrency(month.baseUsage, currency)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Cost Variation</div>
                              <div className={`font-medium ${month.costVariation > 0 ? 'text-orange-600 dark:text-orange-400' : month.costVariation < 0 ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'}`}>
                                {month.costVariation > 0 ? '+' : ''}{formatCurrency(month.costVariation, currency)}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Total Usage</div>
                              <div className="font-semibold">{formatCurrency(month.usage, currency)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Committed</div>
                              <div className="font-medium">{formatCurrency(month.committedAmount, currency)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Cost (yearly)</div>
                              <div className="font-medium text-muted-foreground">{formatCurrency(month.costOfCommitmentYearly, currency)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Cost (monthly)</div>
                              <div className="font-medium text-muted-foreground">{formatCurrency(month.costOfCommitmentMonthly, currency)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Free Licenses</div>
                              <div className="font-medium text-green-600 dark:text-green-400">
                                {formatCurrency(month.freeLicenses, currency)}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">After Discount</div>
                              <div className="font-medium">{formatCurrency(month.usageAfterDiscount, currency)}</div>
                            </div>
                            {month.trueUp > 0 && (
                              <div>
                                <div className="text-muted-foreground">True-Up</div>
                                <div className="font-medium text-amber-600 dark:text-amber-400">
                                  {formatCurrency(month.trueUp, currency)}
                                </div>
                              </div>
                            )}
                            {month.overage > 0 && (
                              <div>
                                <div className="text-muted-foreground">Overage</div>
                                <div className="font-medium text-orange-600 dark:text-orange-400">
                                  {formatCurrency(month.overage, currency)}
                                </div>
                              </div>
                            )}
                            <div>
                              <div className="text-muted-foreground">Blended Discount</div>
                              <div className="font-medium">{formatPercent(month.blendedDiscount)}</div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Year Total Card */}
                      <div className="border-2 border-primary rounded-lg p-4 space-y-2 bg-primary/5">
                        <div className="font-bold text-lg mb-3">Year {yearSummary.year} Total</div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="text-muted-foreground">Total Usage</div>
                            <div className="font-medium">{formatCurrency(yearSummary.totalUsage, currency)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Total Cost</div>
                            <div className="font-bold text-primary">
                              {formatCurrency(yearSummary.totalMonthlyCost, currency)}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Commitment</div>
                            <div className="font-medium">{formatCurrency(yearSummary.yearlyCommitment, currency)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Avg Discount</div>
                            <div className="font-medium">{formatPercent(yearSummary.averageBlendedDiscount)}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Year Chart */}
                    <YearChart monthlyData={yearMonths} currency={currency} />
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
