"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"

interface CodeBlockProps {
  code: string
  language: string
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="relative group">
      <div className="absolute right-2 top-2 z-10">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          className="h-8 w-8 p-0 opacity-70 hover:opacity-100 hover:bg-white/10"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span className="sr-only">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy code</span>
            </>
          )}
        </Button>
      </div>
      <pre className="bg-gray-900 text-gray-100 rounded-2xl p-4 overflow-x-auto text-sm leading-relaxed">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      {copied && (
        <div className="absolute right-12 top-2 bg-gray-900 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
          Copied! ✨
        </div>
      )}
    </div>
  )
}

