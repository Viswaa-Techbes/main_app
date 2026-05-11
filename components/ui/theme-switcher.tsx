"use client"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export default function ThemeSwitcher({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    setMounted(true)
    // Initialize to dark mode on client by default
    const has = document.documentElement.classList.contains("dark")
    setIsDark(has)
  }, [])

  if (!mounted) return null

  function toggle() {
    const next = !isDark
    setIsDark(next)
    if (next) document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  }

  return (
    <button aria-label="Toggle theme" className={"inline-flex items-center gap-2 rounded-full p-2 bg-white/6 backdrop-blur-sm text-sm " + className} onClick={toggle}>
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
