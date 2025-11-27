"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { TemplateType, CURRENCY_PRICING } from "@/lib/types"
import { getAllTemplates } from "@/lib/templates"
import { formatCurrency } from "@/lib/calculations"
import { Globe, LayoutGrid, ShoppingCart, Store, Building2, Building, ChevronDown } from "lucide-react"

interface TemplateSelectorProps {
  selectedTemplate: TemplateType
  averageMonthlyCost: number
  currency: keyof typeof CURRENCY_PRICING
  onTemplateChange: (template: TemplateType) => void
  onAverageCostChange: (cost: number) => void
}

const iconMap = {
  Globe,
  LayoutGrid,
  ShoppingCart,
  Store,
  Building2,
  Building,
}

export function TemplateSelector({
  selectedTemplate,
  averageMonthlyCost,
  currency,
  onTemplateChange,
  onAverageCostChange,
}: TemplateSelectorProps) {
  const templates = getAllTemplates()
  const [isExpanded, setIsExpanded] = React.useState(true)

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName as keyof typeof iconMap]
    return Icon ? <Icon className="h-6 w-6" /> : null
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-heading">Monthly Cost Estimate</CardTitle>
            <CardDescription>
              Choose a template to estimate your monthly usage, then adjust the cost estimate
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
              {/* Template Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      onClick={() => {
                        onTemplateChange(template.id)
                        onAverageCostChange(template.defaultMonthlyCost)
                      }}
                      className={`
                        w-full p-4 rounded-xl border-2 transition-all text-left
                        ${
                          selectedTemplate === template.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`
                          p-2 rounded-lg
                          ${selectedTemplate === template.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                        `}>
                          {getIcon(template.icon)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Monthly Cost Estimated Slider */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Monthly Cost Estimated</Label>
                  <span className="text-2xl font-bold font-heading text-primary">
                    {formatCurrency(averageMonthlyCost, currency)}
                  </span>
                </div>
                <Slider
                  value={[averageMonthlyCost]}
                  onValueChange={([value]) => onAverageCostChange(value)}
                  min={100}
                  max={25000}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatCurrency(100, currency)}</span>
                  <span>{formatCurrency(25000, currency)}</span>
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
