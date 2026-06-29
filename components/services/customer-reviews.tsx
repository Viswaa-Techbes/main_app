import { Star, ShieldCheck } from "lucide-react";

export function CustomerReviews() {
  const reviews = [
    {
      name: "Rajesh Kumar",
      role: "Indiranagar Home Owner",
      text: "Techbes handled my CCTV and home network cabling. The execution is neat, cables are labeled, and the technician was extremely patient.",
      rating: 5,
      verified: true
    },
    {
      name: "Ananya Sen",
      role: "Founder, Sen & Co",
      text: "We booked their Office Networking Service for our new office. They completed structured cabling and AP configuration. Downtime has been absolute zero.",
      rating: 5,
      verified: true
    },
    {
      name: "Vikram Malhotra",
      role: "IT Manager, GreenTech",
      text: "The AMC subscription plan is worth every rupee. Quarterly checkups are scheduled proactively and emergency SLA response is incredibly quick.",
      rating: 5,
      verified: true
    }
  ];

  return (
    <section className="py-12 bg-white rounded-3xl border border-slate-100 px-6 shadow-sm">
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full text-[10px] font-bold text-blue-700 uppercase tracking-wider">
          Testimonials
        </div>
        <h2 className="mt-3.5 text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl">What Our Customers Say</h2>
        <p className="mt-2 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Trusted by homeowners and scaling companies alike. Read verified reviews from real service bookings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {reviews.map((rev, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 flex flex-col justify-between transition duration-200 hover:border-blue-100 hover:shadow-sm">
            <div>
              <div className="flex gap-1 mb-4 text-amber-400">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs leading-relaxed text-slate-600 font-semibold italic">"{rev.text}"</p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100/50 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">{rev.name}</p>
                <p className="text-[10px] text-slate-400 font-semibold">{rev.role}</p>
              </div>
              {rev.verified && (
                <div className="flex items-center gap-1 text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
