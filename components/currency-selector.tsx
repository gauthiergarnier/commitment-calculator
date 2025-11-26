"use client"

import * as React from "react"
import { Currency, CURRENCY_PRICING } from "@/lib/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CurrencySelectorProps {
  value: Currency
  onValueChange: (value: Currency) => void
}

export function CurrencySelector({ value, onValueChange }: CurrencySelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Currency" />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(CURRENCY_PRICING) as Currency[]).map((curr) => (
          <SelectItem key={curr} value={curr}>
            {CURRENCY_PRICING[curr].symbol} {curr}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
