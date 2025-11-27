"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { VariationPattern } from "@/lib/types"
import { getAllVariationPatterns } from "@/lib/variation-patterns"
import { Activity, TrendingUp, Zap, Waves, Minus, ChevronDown } from "lucide-react"

interface VariationPatternSelectorProps {
  selectedPattern: VariationPattern
  enableVariations: boolean
  onPatternChange: (pattern: VariationPattern) => void
  onEnableVariationsChange: (enabled: boolean) => void
}

const iconComponents = {
  'super-stable': Minus,
  'seasonal': Waves,
  'highly-seasonal': Zap,
  'steady-growth': TrendingUp,
  'highly-variable': Activity,
}

export function VariationPatternSelector({
  selectedPattern,
  enableVariations,
  onPatternChange,
  onEnableVariationsChange,
}: VariationPatternSelectorProps) {
  const patterns = getAllVariationPatterns()
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <Card className="rounded-2xl">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-heading">Cost Variation Pattern</CardTitle>
            <CardDescription>
              How does your monthly usage vary throughout the year?
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
            <CardContent className="space-y-6">
              {/* Enable/Disable Checkbox */}
              <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-primary/20 bg-primary/5">
                <input
                  type="checkbox"
                  id="enable-variations"
                  checked={enableVariations}
                  onChange={(e) => onEnableVariationsChange(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary focus:ring-2 cursor-pointer"
                />
                <Label htmlFor="enable-variations" className="text-base font-medium cursor-pointer">
                  Apply cost variations to monthly usage
                </Label>
              </div>

              {/* Pattern Selection */}
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 ${!enableVariations ? 'opacity-50 pointer-events-none' : ''}`}>
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
                          {React.createElement(iconComponents[pattern.id], { className: 'h-5 w-5' })}
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
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
