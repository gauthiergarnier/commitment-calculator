"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { VariationPattern } from "@/lib/types"
import { getAllVariationPatterns } from "@/lib/variation-patterns"
import { Activity, TrendingUp, Zap, Waves, Minus } from "lucide-react"

interface VariationPatternSelectorProps {
  selectedPattern: VariationPattern
  onPatternChange: (pattern: VariationPattern) => void
}

const iconMap: Record<VariationPattern, React.ReactNode> = {
  'super-stable': <Minus className="h-5 w-5" />,
  'seasonal': <Waves className="h-5 w-5" />,
  'highly-seasonal': <Zap className="h-5 w-5" />,
  'steady-growth': <TrendingUp className="h-5 w-5" />,
  'highly-variable': <Activity className="h-5 w-5" />,
}

export function VariationPatternSelector({
  selectedPattern,
  onPatternChange,
}: VariationPatternSelectorProps) {
  const patterns = getAllVariationPatterns()

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="font-heading">Cost Variation Pattern</CardTitle>
        <CardDescription>
          How does your monthly usage vary throughout the year?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {patterns.map((pattern) => (
            <motion.div
              key={pattern.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <button
                onClick={() => onPatternChange(pattern.id)}
                className={`
                  w-full p-4 rounded-xl border-2 transition-all text-left
                  ${
                    selectedPattern === pattern.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }
                `}
              >
                <div className="space-y-2">
                  <div className={`
                    inline-flex p-2 rounded-lg
                    ${selectedPattern === pattern.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                  `}>
                    {iconMap[pattern.id]}
                  </div>
                  <h3 className="font-semibold text-sm">{pattern.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {pattern.description}
                  </p>
                  <div className={`
                    text-xs font-medium px-2 py-1 rounded inline-block
                    ${selectedPattern === pattern.id ? 'bg-primary/10 text-primary' : 'bg-muted'}
                  `}>
                    {pattern.variationPercentage}
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
