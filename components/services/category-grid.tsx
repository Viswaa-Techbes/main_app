import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/marketplace-data";

export function CategoryGrid() {
  return (
    <section className="py-10 bg-white rounded-3xl border border-slate-100 px-6 shadow-sm">
      <div className="text-center max-w-xl mx-auto mb-10">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Our Solutions & Services</h2>
        <p className="mt-1 text-[10px] text-blue-600 font-bold uppercase tracking-wider">Choose a category to get started</p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.id}
              href={`/services?category=${category.id}`}
              className="group flex flex-col items-center text-center p-5 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-blue-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="rounded-2xl bg-blue-50 text-blue-600 p-4 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-103 shadow-sm">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate w-full">{category.title}</h3>
              <p className="mt-1.5 text-[9px] leading-relaxed text-slate-400 font-medium line-clamp-2 h-7">{category.description}</p>
              <span className="mt-3 inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition duration-150">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
