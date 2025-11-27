"use client"

import * as React from "react"
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { MonthlyCalculation, Currency } from "@/lib/types"
import { formatCurrency } from "@/lib/calculations"

interface YearChartProps {
  monthlyData: MonthlyCalculation[]
  currency: Currency
}

export function YearChart({ monthlyData, currency }: YearChartProps) {
  // Prepare chart data - monthly values only
  // True-Up is shown as negative (unused capacity below commitment)
  const chartData = monthlyData.map((month) => ({
    month: `M${month.month}`,
    usage: month.usage,
    commitmentCost: month.costOfCommitmentMonthly,
    trueUp: -month.trueUp, // Negative to show as unused capacity
    trueUpActual: month.trueUp, // Keep actual value for tooltip
    overage: month.overage,
    totalCost: month.monthlyCost,
  }))

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">{data.month}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Usage:</span>
              <span className="font-semibold">{formatCurrency(data.usage, currency)}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Commitment Cost:</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(data.commitmentCost, currency)}</span>
            </div>
            {data.trueUpActual > 0 && (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">True-Up (unused):</span>
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  {formatCurrency(data.trueUpActual, currency)}
                </span>
              </div>
            )}
            {data.overage > 0 && (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Overage:</span>
                <span className="font-medium text-rose-600 dark:text-rose-400">
                  {formatCurrency(data.overage, currency)}
                </span>
              </div>
            )}
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Total Cost:</span>
              <span className="font-bold text-primary">{formatCurrency(data.totalCost, currency)}</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-[400px] mt-6 p-4 bg-muted/20 rounded-xl">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/20" />
          <XAxis
            dataKey="month"
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          <ReferenceLine y={0} stroke="hsl(var(--border))" strokeWidth={1} strokeDasharray="3 3" />

          {/* Usage Line (reference) */}
          <Line
            type="monotone"
            dataKey="usage"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Usage"
            dot={false}
          />

          {/* Area Charts - Stacked: Commitment Cost + True-Up (negative) + Overage */}
          {/* Commitment Cost - Base */}
          <Area
            type="monotone"
            dataKey="commitmentCost"
            stackId="cost"
            stroke="#10b981"
            fill="#10b981"
            name="Commitment Cost"
            fillOpacity={0.7}
            strokeWidth={2}
          />

          {/* True-Up - Stacked as negative (appears below commitment) */}
          <Area
            type="monotone"
            dataKey="trueUp"
            stackId="cost"
            stroke="#f59e0b"
            fill="#f59e0b"
            name="True-Up (unused)"
            fillOpacity={0.7}
            strokeWidth={2}
          />

          {/* Overage - Stacked on top of commitment */}
          <Area
            type="monotone"
            dataKey="overage"
            stackId="cost"
            stroke="#f43f5e"
            fill="#f43f5e"
            name="Overage"
            fillOpacity={0.7}
            strokeWidth={2}
          />

          {/* Total Cost Line (bold, prominent) */}
          <Line
            type="monotone"
            dataKey="totalCost"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            name="Total Cost"
            dot={{ fill: 'hsl(var(--primary))', r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
