"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { CurrencySelector } from "@/components/currency-selector"
import { PartnerVariables } from "@/components/partner-variables"
import { TemplateSelector } from "@/components/template-selector"
import { VariationPatternSelector } from "@/components/variation-pattern-selector"
import { AnnualCommitmentSelector } from "@/components/annual-commitment-selector"
import { PriceSummary } from "@/components/price-summary"
import { DetailedBreakdown } from "@/components/detailed-breakdown"
import {
  Currency,
  AgencyTier,
  CommitmentType,
  CommitmentDuration,
  ContractType,
  SupportLevel,
  TemplateType,
  VariationPattern,
  CalculationResult,
} from "@/lib/types"
import { calculateProjection, calculateOptimalCommitments } from "@/lib/calculations"
import { generateMonthlyUsage } from "@/lib/variation-patterns"

export default function Home() {
  // State
  const [currency, setCurrency] = React.useState<Currency>('USD')
  const [agencyTier, setAgencyTier] = React.useState<AgencyTier>('Gold')
  const [commitmentType, setCommitmentType] = React.useState<CommitmentType>('Monthly Spending')
  const [commitmentDuration, setCommitmentDuration] = React.useState<CommitmentDuration>('36 months')
  const [contractType, setContractType] = React.useState<ContractType>('Reseller')
  const [supportLevel, setSupportLevel] = React.useState<SupportLevel>('Advanced Support')
  const [freeUserLicenses, setFreeUserLicenses] = React.useState(5)
  const [selectedTemplate, setSelectedTemplate] = React.useState<TemplateType>('1-marketing-website')
  const [averageMonthlyCost, setAverageMonthlyCost] = React.useState(1200)
  const [variationPattern, setVariationPattern] = React.useState<VariationPattern>('super-stable')
  const [enableVariations, setEnableVariations] = React.useState(false)
  const [yearCommitments, setYearCommitments] = React.useState<[number, number, number]>([60000, 60000, 60000])
  const [calculationResult, setCalculationResult] = React.useState<CalculationResult | null>(null)

  // Handler for updating year commitments
  const handleYearCommitmentChange = (yearIndex: number, value: number) => {
    const newCommitments: [number, number, number] = [...yearCommitments]
    newCommitments[yearIndex] = value
    setYearCommitments(newCommitments)
  }

  // Auto-adjust commitments when cost estimate or variation pattern changes
  React.useEffect(() => {
    const monthlyUsage = generateMonthlyUsage(averageMonthlyCost, variationPattern, enableVariations)

    const inputs = {
      agencyTier,
      commitmentType,
      commitmentDuration,
      contractType,
      freeUserLicenses,
      supportLevel,
      currency,
      template: selectedTemplate,
      averageMonthlyCost,
      variationPattern,
    }

    // Calculate with temporary commitments to determine optimal values
    const tempCommitments: [number, number, number] = [60000, 60000, 60000]
    const tempResult = calculateProjection(inputs, monthlyUsage, tempCommitments)
    const optimalCommitments = calculateOptimalCommitments(tempResult)

    setYearCommitments(optimalCommitments)
  }, [
    averageMonthlyCost,
    variationPattern,
    enableVariations,
    agencyTier,
    commitmentType,
    commitmentDuration,
    contractType,
    supportLevel,
    freeUserLicenses,
    currency,
    selectedTemplate,
  ])

  // Recalculate when inputs change
  React.useEffect(() => {
    const monthlyUsage = generateMonthlyUsage(averageMonthlyCost, variationPattern, enableVariations)

    const inputs = {
      agencyTier,
      commitmentType,
      commitmentDuration,
      contractType,
      freeUserLicenses,
      supportLevel,
      currency,
      template: selectedTemplate,
      averageMonthlyCost,
      variationPattern,
    }

    const result = calculateProjection(inputs, monthlyUsage, yearCommitments)
    setCalculationResult(result)
  }, [
    currency,
    agencyTier,
    commitmentType,
    commitmentDuration,
    contractType,
    supportLevel,
    freeUserLicenses,
    selectedTemplate,
    averageMonthlyCost,
    variationPattern,
    enableVariations,
    yearCommitments,
  ])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="120" height="40" viewBox="0 0 120 40" fill="currentColor" className="text-foreground">
                <text x="0" y="30" fontSize="32" fontWeight="bold" fontFamily="Space Grotesk, sans-serif">
                  Upsun
                </text>
              </svg>
            </div>
            <div className="flex items-center gap-3">
              <CurrencySelector value={currency} onValueChange={setCurrency} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold font-heading mb-4">
            Agency Commitment Calculator
          </h1>
          <p className="text-xl text-muted-foreground">
            Find the perfect commitment level for your agency with our interactive calculator
          </p>
        </motion.div>

        {/* Calculator Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <PartnerVariables
                agencyTier={agencyTier}
                commitmentType={commitmentType}
                commitmentDuration={commitmentDuration}
                contractType={contractType}
                supportLevel={supportLevel}
                freeUserLicenses={freeUserLicenses}
                onAgencyTierChange={setAgencyTier}
                onCommitmentTypeChange={setCommitmentType}
                onCommitmentDurationChange={setCommitmentDuration}
                onContractTypeChange={setContractType}
                onSupportLevelChange={setSupportLevel}
                onFreeUserLicensesChange={setFreeUserLicenses}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                averageMonthlyCost={averageMonthlyCost}
                currency={currency}
                onTemplateChange={setSelectedTemplate}
                onAverageCostChange={setAverageMonthlyCost}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <VariationPatternSelector
                selectedPattern={variationPattern}
                enableVariations={enableVariations}
                onPatternChange={setVariationPattern}
                onEnableVariationsChange={setEnableVariations}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <AnnualCommitmentSelector
                yearCommitments={yearCommitments}
                currency={currency}
                onYearCommitmentChange={handleYearCommitmentChange}
              />
            </motion.div>
          </div>

          {/* Right Column - Price Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-1"
          >
            <PriceSummary result={calculationResult} currency={currency} />
          </motion.div>
        </div>

        {/* Detailed Breakdown Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <DetailedBreakdown result={calculationResult} currency={currency} />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Upsun. All rights reserved.</p>
            <p className="mt-2">
              This calculator provides estimates based on your inputs. Actual costs may vary.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
