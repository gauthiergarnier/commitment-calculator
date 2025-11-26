"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AgencyTier, CommitmentType, CommitmentDuration, ContractType, SupportLevel } from "@/lib/types"

interface PartnerVariablesProps {
  agencyTier: AgencyTier
  commitmentType: CommitmentType
  commitmentDuration: CommitmentDuration
  contractType: ContractType
  supportLevel: SupportLevel
  freeUserLicenses: number
  onAgencyTierChange: (value: AgencyTier) => void
  onCommitmentTypeChange: (value: CommitmentType) => void
  onCommitmentDurationChange: (value: CommitmentDuration) => void
  onContractTypeChange: (value: ContractType) => void
  onSupportLevelChange: (value: SupportLevel) => void
  onFreeUserLicensesChange: (value: number) => void
}

export function PartnerVariables({
  agencyTier,
  commitmentType,
  commitmentDuration,
  contractType,
  supportLevel,
  freeUserLicenses,
  onAgencyTierChange,
  onCommitmentTypeChange,
  onCommitmentDurationChange,
  onContractTypeChange,
  onSupportLevelChange,
  onFreeUserLicensesChange,
}: PartnerVariablesProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="font-heading">Partner Configuration</CardTitle>
        <CardDescription>
          Configure your agency level, commitment type, and contract details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Partner Level */}
          <div className="space-y-2">
            <Label>Partner Level</Label>
            <Select value={agencyTier} onValueChange={onAgencyTierChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Registered">Registered</SelectItem>
                <SelectItem value="Gold">Gold</SelectItem>
                <SelectItem value="Platinum">Platinum</SelectItem>
                <SelectItem value="Diamond">Diamond</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contract Type */}
          <div className="space-y-2">
            <Label>Contract Type</Label>
            <Select value={contractType} onValueChange={onContractTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Direct">Direct</SelectItem>
                <SelectItem value="Reseller">Reseller</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Commitment Type */}
          <div className="space-y-2">
            <Label>Commitment Type</Label>
            <Select value={commitmentType} onValueChange={onCommitmentTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Monthly Spending">Monthly Spending</SelectItem>
                <SelectItem value="Annual Spending">Annual Spending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Commitment Duration */}
          <div className="space-y-2">
            <Label>Commitment Duration</Label>
            <Select value={commitmentDuration} onValueChange={onCommitmentDurationChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12 months">12 months</SelectItem>
                <SelectItem value="24 months">24 months</SelectItem>
                <SelectItem value="36 months">36 months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Support Level */}
          <div className="space-y-2">
            <Label>Support Level</Label>
            <Select value={supportLevel} onValueChange={onSupportLevelChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No Support">No Support</SelectItem>
                <SelectItem value="Advanced Support">Advanced Support</SelectItem>
                <SelectItem value="Premium Support">Premium Support</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Free User Licenses */}
          <div className="space-y-2">
            <Label>Free User Licenses</Label>
            <Select
              value={freeUserLicenses.toString()}
              onValueChange={(val) => onFreeUserLicensesChange(parseInt(val))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
