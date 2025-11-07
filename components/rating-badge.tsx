import type { Rating } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RatingBadgeProps {
  rating: Rating
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
}

export function RatingBadge({ rating, showLabel = true, size = "md" }: RatingBadgeProps) {
  const colorMap = {
    Green: "bg-green-100 text-green-800 border-green-300",
    Amber: "bg-amber-100 text-amber-800 border-amber-300",
    Red: "bg-red-100 text-red-800 border-red-300",
    "N/A": "bg-gray-100 text-gray-700 border-gray-300",
  }

  const sizeMap = {
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1.5 text-sm",
    lg: "px-3 py-2 text-base",
  }

  const dotMap = {
    Green: "bg-green-600",
    Amber: "bg-amber-600",
    Red: "bg-red-600",
    "N/A": "bg-gray-500",
  }

  return (
    <span
      className={cn("inline-flex items-center gap-2 rounded-full border font-medium", colorMap[rating], sizeMap[size])}
      role="status"
      aria-label={`Rating: ${rating}`}
    >
      <span className={cn("inline-block h-2 w-2 rounded-full", dotMap[rating])} />
      {showLabel && rating}
    </span>
  )
}
