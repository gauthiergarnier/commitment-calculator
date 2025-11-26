"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CalculationResult, Currency } from "@/lib/types"
import { formatCurrency, formatPercent } from "@/lib/calculations"
import { TrendingDown, DollarSign, Calendar } from "lucide-react"

interface PriceSummaryProps {
  result: CalculationResult | null
  currency: Currency
}

export function PriceSummary({ result, currency }: PriceSummaryProps) {
  if (!result) {
    return (
      <Card className="rounded-2xl sticky top-6">
        <CardHeader>
          <CardTitle className="font-heading">Price Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Configure your settings to see price estimates
          </p>
        </CardContent>
      </Card>
    )
  }

  const { yearlySummaries, totalCost, totalSavings, discounts } = result
  const totalUsage = yearlySummaries.reduce((sum, year) => sum + year.totalUsage, 0)
  const avgMonthly = totalCost / 36
  const totalDiscount = totalCost > 0 ? (totalUsage - totalCost) / totalUsage : 0

  return (
    <Card className="rounded-2xl sticky top-6">
      <CardHeader>
        <CardTitle className="font-heading">Price Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Cost */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>Total 3-Year Cost</span>
          </div>
          <div className="text-4xl font-bold font-heading text-primary">
            {formatCurrency(totalCost, currency)}
          </div>
        </motion.div>

        <Separator />

        {/* Average Monthly */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Average Monthly</span>
          </div>
          <div className="text-xl font-semibold font-heading">
            {formatCurrency(avgMonthly, currency)}
          </div>
        </div>

        {/* Total Savings */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingDown className="h-4 w-4" />
            <span>Total Savings</span>
          </div>
          <div className="text-xl font-semibold text-green-600 dark:text-green-400">
            {formatCurrency(totalSavings, currency)}
          </div>
        </div>

        <Separator />

        {/* Discounts Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Active Discounts</h4>

          {discounts.resellerDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Reseller Discount</span>
              <span className="font-medium">{formatPercent(discounts.resellerDiscount)}</span>
            </div>
          )}

          {discounts.commitmentDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Commitment Discount</span>
              <span className="font-medium">{formatPercent(discounts.commitmentDiscount)}</span>
            </div>
          )}

          {discounts.commitmentBonus > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Commitment Bonus</span>
              <span className="font-medium">{formatPercent(discounts.commitmentBonus)}</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between text-sm font-semibold">
            <span>Blended Discount</span>
            <span className="text-primary">{formatPercent(totalDiscount)}</span>
          </div>
        </div>

        {/* Yearly Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Yearly Breakdown</h4>
          {yearlySummaries.map((year) => (
            <div key={year.year} className="flex justify-between text-sm">
              <span className="text-muted-foreground">Year {year.year}</span>
              <span className="font-medium">{formatCurrency(year.totalMonthlyCost, currency)}</span>
            </div>
          ))}
        </div>

        {/* Referral Info */}
        {(discounts.referralYear1 > 0 || discounts.referralFollowing > 0) && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Referral Commissions</h4>
              {discounts.referralYear1 > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">First Year</span>
                  <span className="font-medium">{formatPercent(discounts.referralYear1)}</span>
                </div>
              )}
              {discounts.referralFollowing > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Following Years</span>
                  <span className="font-medium">{formatPercent(discounts.referralFollowing)}</span>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
