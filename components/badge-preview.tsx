"use client"

import { cn } from "@/lib/utils"

interface BadgePreviewProps {
  theme?: "light" | "dark" | "pastel"
  rating?: "Green" | "Amber" | "Red"
  size?: "small" | "medium" | "large"
  className?: string
}

export function BadgePreview({ 
  theme = "light", 
  rating = "Green",
  size = "medium",
  className 
}: BadgePreviewProps) {
  const sizeClasses = {
    small: "px-3 py-1.5 text-xs",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base",
  }

  const themeClasses = {
    light: {
      Green: "bg-white border-2 border-emerald-200 text-emerald-700",
      Amber: "bg-white border-2 border-amber-200 text-amber-700",
      Red: "bg-white border-2 border-red-200 text-red-700",
    },
    dark: {
      Green: "bg-gray-900 border-2 border-emerald-500 text-emerald-400",
      Amber: "bg-gray-900 border-2 border-amber-500 text-amber-400",
      Red: "bg-gray-900 border-2 border-red-500 text-red-400",
    },
    pastel: {
      Green: "bg-emerald-50 border-2 border-emerald-300 text-emerald-800",
      Amber: "bg-amber-50 border-2 border-amber-300 text-amber-800",
      Red: "bg-red-50 border-2 border-red-300 text-red-800",
    },
  }

  const iconColors = {
    light: {
      Green: "fill-emerald-500",
      Amber: "fill-amber-500",
      Red: "fill-red-500",
    },
    dark: {
      Green: "fill-emerald-400",
      Amber: "fill-amber-400",
      Red: "fill-red-400",
    },
    pastel: {
      Green: "fill-emerald-500",
      Amber: "fill-amber-500",
      Red: "fill-red-500",
    },
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-medium shadow-sm transition-all hover:shadow-md whitespace-nowrap",
        sizeClasses[size],
        themeClasses[theme][rating],
        className
      )}
      role="img"
      aria-label={`Impact Rating: ${rating}`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", iconColors[theme][rating])}
      >
        <path d="M8 1.5L9.5 6H14L10.5 9L12 13.5L8 10.5L4 13.5L5.5 9L2 6H6.5L8 1.5Z" />
      </svg>
      <span className="font-semibold">Impact Rating</span>
      <span className="opacity-80">•</span>
      <span className="font-bold">{rating}</span>
    </div>
  )
}

