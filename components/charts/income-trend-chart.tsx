"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CharityYear } from "@/lib/types"

interface IncomeTrendChartProps {
  data: CharityYear[]
}

export function IncomeTrendChart({ data }: IncomeTrendChartProps) {
  const chartData = data.map((year) => ({
    year: year.year,
    income: year.finance.incomeTrend,
  }))

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-base">Income Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            income: {
              label: "Income Trend",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-2))" />
              <XAxis dataKey="year" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="income"
                stroke="hsl(var(--chart-1))"
                dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
                name="Income Trend"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
