"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ChevronDown, Calendar } from "lucide-react"
import { CURRENCY_PRICING } from "@/lib/types"
import { formatCurrency } from "@/lib/calculations"

interface AnnualCommitmentSelectorProps {
  yearCommitments: [number, number, number]
  currency: keyof typeof CURRENCY_PRICING
  onYearCommitmentChange: (yearIndex: number, value: number) => void
}

export function AnnualCommitmentSelector({
  yearCommitments,
  currency,
  onYearCommitmentChange,
}: AnnualCommitmentSelectorProps) {
  const [isExpanded, setIsExpanded] = React.useState(true)

  const handleInputChange = (yearIndex: number, value: string) => {
    const numValue = parseInt(value) || 0
    onYearCommitmentChange(yearIndex, numValue)
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-heading">Annual Commitment</CardTitle>
            <CardDescription>
              Set your annual commitment amount for each year of the 3-year period
            </CardDescription>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 0 : -90 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        </div>
      </CardHeader>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <CardContent className="space-y-4">
              <div className="grid gap-6 md:grid-cols-3">
                {/* Year 1 */}
                <div className="space-y-2">
                  <Label htmlFor="year1-commitment" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Year 1 Commitment
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {CURRENCY_PRICING[currency].symbol}
                    </span>
                    <Input
                      id="year1-commitment"
                      type="number"
                      min="0"
                      step="1000"
                      value={yearCommitments[0]}
                      onChange={(e) => handleInputChange(0, e.target.value)}
                      className="pl-8 text-right font-mono"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(yearCommitments[0], currency)} annually
                  </p>
                </div>

                {/* Year 2 */}
                <div className="space-y-2">
                  <Label htmlFor="year2-commitment" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Year 2 Commitment
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {CURRENCY_PRICING[currency].symbol}
                    </span>
                    <Input
                      id="year2-commitment"
                      type="number"
                      min="0"
                      step="1000"
                      value={yearCommitments[1]}
                      onChange={(e) => handleInputChange(1, e.target.value)}
                      className="pl-8 text-right font-mono"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(yearCommitments[1], currency)} annually
                  </p>
                </div>

                {/* Year 3 */}
                <div className="space-y-2">
                  <Label htmlFor="year3-commitment" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Year 3 Commitment
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {CURRENCY_PRICING[currency].symbol}
                    </span>
                    <Input
                      id="year3-commitment"
                      type="number"
                      min="0"
                      step="1000"
                      value={yearCommitments[2]}
                      onChange={(e) => handleInputChange(2, e.target.value)}
                      className="pl-8 text-right font-mono"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(yearCommitments[2], currency)} annually
                  </p>
                </div>
              </div>

              {/* Total Summary */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Total 3-Year Commitment
                  </span>
                  <span className="text-2xl font-bold font-heading text-primary">
                    {formatCurrency(
                      yearCommitments[0] + yearCommitments[1] + yearCommitments[2],
                      currency
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
