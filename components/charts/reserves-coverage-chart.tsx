"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CharityYear } from "@/lib/types"

interface ReservesCoverageChartProps {
  data: CharityYear[]
}

export function ReservesCoverageChart({ data }: ReservesCoverageChartProps) {
  const chartData = data.map((year) => ({
    year: year.year,
    months: year.finance.reservesCoverage,
  }))

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-base">Reserves Coverage</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            months: {
              label: "Months of Coverage",
              color: "hsl(var(--chart-5))",
            },
          }}
          className="h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-2))" />
              <XAxis dataKey="year" />
              <YAxis label={{ value: "(months)", angle: -90, position: "insideLeft" }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="months"
                stroke="hsl(var(--chart-5))"
                dot={{ fill: "hsl(var(--chart-5))", r: 4 }}
                name="Coverage"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
