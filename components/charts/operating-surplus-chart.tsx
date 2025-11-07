"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CharityYear } from "@/lib/types"

interface OperatingSurplusChartProps {
  data: CharityYear[]
}

export function OperatingSurplusChart({ data }: OperatingSurplusChartProps) {
  const chartData = data.map((year) => ({
    year: year.year,
    surplus: (year.finance.operatingSurplusDeficit * 100).toFixed(1),
  }))

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-base">Operating Surplus/Deficit</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            surplus: {
              label: "Surplus %",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-2))" />
              <XAxis dataKey="year" />
              <YAxis label={{ value: "(%)", angle: -90, position: "insideLeft" }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="surplus" fill="hsl(var(--chart-2))" name="Surplus %" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
