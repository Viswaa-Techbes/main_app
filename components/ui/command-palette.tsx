"use client"
import { useEffect, useState, useCallback } from "react"
import Link from "@/components/ui/link"
import { Search, X } from "lucide-react"
import { services } from "@/lib/services-data"

function normalize(s: string) { return s?.toLowerCase?.() || "" }

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); setOpen((o) => !o)
      }
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (!query) { setResults([]); return }
    const q = normalize(query)
    const list = (services || []).filter((s: any) => normalize(s.title).includes(q) || normalize(s.category).includes(q)).slice(0, 12)
    setResults(list)
  }, [query])

  const handleClose = useCallback(() => { setOpen(false); setQuery(""); setResults([]) }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div className="mt-24 w-full max-w-2xl rounded-2xl bg-background backdrop-blur-lg border border-border p-4 glass-card">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-foreground-muted" />
            <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search services, categories, actions... (Ctrl/Cmd+K)" className="flex-1 bg-transparent placeholder:text-muted-foreground outline-none text-foreground p-3 rounded-xl" />
            <button onClick={handleClose} className="p-2 rounded-md text-foreground-muted"><X className="h-5 w-5" /></button>
          </div>

        <div className="mt-3 max-h-72 overflow-auto">
          {results.length === 0 && <div className="p-6 text-sm text-foreground-muted">No results</div>}
          {results.map((r: any) => (
            <Link key={r.id} href={`/services/${r.slug}`} onClick={handleClose} className="block">
              <div className="flex items-center gap-3 p-3 rounded-md hover:bg-surface">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-foreground font-semibold">{r.title.charAt(0)}</div>
                <div>
                  <div className="text-foreground font-medium">{r.title}</div>
                  <div className="text-foreground-muted text-sm">{r.category}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
