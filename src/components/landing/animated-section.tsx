"use client"

import type { HTMLAttributes, ReactNode } from "react"

interface AnimatedSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  delay?: number
}

export function AnimatedSection({ children, className, delay = 0, ...props }: AnimatedSectionProps) {
  return (
    <div
      className={`animate-in fade-in slide-in-from-bottom-4 duration-1000 ${className || ""}`}
      style={{ animationDelay: `${delay * 1000}ms` }}
      {...props}
    >
      {children}
    </div>
  )
}
