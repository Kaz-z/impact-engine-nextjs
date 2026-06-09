"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  FUND_CRITERIA_CATALOG,
  formatCriterionLabel,
  type FundCriteriaConfig,
  type FundCriteriaValues,
  type FundCriterionCategory,
  type FundCriterionId,
} from "@/lib/fund-preferences"

const CATEGORY_ORDER: FundCriterionCategory[] = [
  "Financial",
  "Governance",
  "Compliance",
  "Operational",
]

interface FundCriteriaConfiguratorProps {
  config: FundCriteriaConfig
  onChange: (config: FundCriteriaConfig) => void
}

function ValueInput({
  label,
  value,
  onChange,
  suffix,
  min = 0,
  max,
  step = 1,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  suffix?: string
  min?: number
  max?: number
  step?: number
}) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <Label className="text-xs text-gray-500 shrink-0 w-16">{label}</Label>
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          const parsed = Number(e.target.value)
          if (!Number.isNaN(parsed)) onChange(parsed)
        }}
        className="h-8 w-24 text-sm"
        onClick={(e) => e.stopPropagation()}
      />
      {suffix && <span className="text-xs text-gray-500">{suffix}</span>}
    </div>
  )
}

function CriterionValueInputs({
  criterionId,
  config,
  onValueChange,
}: {
  criterionId: FundCriterionId
  config: FundCriteriaConfig
  onValueChange: (key: keyof FundCriteriaValues, value: number) => void
}) {
  const { values } = config

  switch (criterionId) {
    case "reserves-min":
      return (
        <ValueInput
          label="Minimum"
          value={values.minReservesMonths}
          onChange={(v) => onValueChange("minReservesMonths", v)}
          suffix="months"
          min={1}
        />
      )
    case "operating-years":
      return (
        <ValueInput
          label="Minimum"
          value={values.minOperatingYears}
          onChange={(v) => onValueChange("minOperatingYears", v)}
          suffix="years"
          min={1}
        />
      )
    case "min-income":
      return (
        <ValueInput
          label="Threshold"
          value={values.minIncomeGbp}
          onChange={(v) => onValueChange("minIncomeGbp", v)}
          suffix="GBP"
          min={1000}
          step={1000}
        />
      )
    case "charitable-spend":
      return (
        <ValueInput
          label="Minimum"
          value={values.minCharitableSpendPercent}
          onChange={(v) => onValueChange("minCharitableSpendPercent", v)}
          suffix="%"
          min={1}
          max={100}
        />
      )
    case "trustees":
      return (
        <div className="flex flex-wrap gap-4 mt-2">
          <ValueInput
            label="Min"
            value={values.minTrustees}
            onChange={(v) => onValueChange("minTrustees", v)}
            min={1}
          />
          <ValueInput
            label="Max"
            value={values.maxTrustees}
            onChange={(v) => onValueChange("maxTrustees", v)}
            min={1}
          />
        </div>
      )
    case "fundraising":
      return (
        <ValueInput
          label="Maximum"
          value={values.maxFundraisingPercent}
          onChange={(v) => onValueChange("maxFundraisingPercent", v)}
          suffix="%"
          min={1}
          max={100}
        />
      )
    default:
      return null
  }
}

export function FundCriteriaConfigurator({ config, onChange }: FundCriteriaConfiguratorProps) {
  function toggleCriterion(id: FundCriterionId) {
    onChange({
      ...config,
      enabled: { ...config.enabled, [id]: !config.enabled[id] },
    })
  }

  function updateValue(key: keyof FundCriteriaValues, value: number) {
    onChange({
      ...config,
      values: { ...config.values, [key]: value },
    })
  }

  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: FUND_CRITERIA_CATALOG.filter((c) => c.category === category),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="space-y-8">
      {groups.map(({ category, items }) => (
        <div key={category}>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {category}
          </h3>
          <div className="space-y-3">
            {items.map((criterion) => {
              const enabled = config.enabled[criterion.id]
              const hasValues = Boolean(criterion.valueKey || criterion.valueKeys)

              return (
                <div
                  key={criterion.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    enabled
                      ? "border-violet-200 bg-violet-50/40"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={criterion.id}
                      checked={enabled}
                      onCheckedChange={() => toggleCriterion(criterion.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <Label
                        htmlFor={criterion.id}
                        className="text-sm font-medium text-gray-900 cursor-pointer"
                      >
                        {formatCriterionLabel(criterion.id, config.values)}
                      </Label>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        {criterion.description}
                      </p>
                      {enabled && hasValues && (
                        <CriterionValueInputs
                          criterionId={criterion.id}
                          config={config}
                          onValueChange={updateValue}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
