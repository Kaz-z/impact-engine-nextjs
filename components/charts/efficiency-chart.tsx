"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CharityYear } from "@/lib/types"

interface EfficiencyChartProps {
  data: CharityYear[]
  title: string
  dataKey: string
  lowerIsBetter?: boolean
}

export function EfficiencyChart({ data, title, dataKey, lowerIsBetter = false }: EfficiencyChartProps) {
  const chartData = data.map((year) => ({
    year: year.year,
    value: dataKey.includes("Charitable")
      ? year.operationalCosts.charitableSpendingEfficiency
      : year.operationalCosts.fundraisingAndMarketingEfficiency,
  }))

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {lowerIsBetter && <p className="text-xs text-gray-500 mt-2">Lower is better</p>}
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            value: {
              label: "Efficiency",
              color: lowerIsBetter ? "hsl(var(--chart-3))" : "hsl(var(--chart-4))",
            },
          }}
          className="h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-2))" />
              <XAxis dataKey="year" />
              <YAxis domain={[0, 1]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="value"
                fill={lowerIsBetter ? "hsl(var(--chart-3))" : "hsl(var(--chart-4))"}
                name="Efficiency Ratio"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
