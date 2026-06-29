import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function GeneralFaq() {
  const faqs = [
    {
      question: "How do I book a technician on Techbes?",
      answer: "Select the desired category or service catalog item, configure your requirements, select a preferred date and time slot, and pay a 50% advance via our secure Razorpay gateway. A certified specialist is auto-allocated to your job."
    },
    {
      question: "How are materials and spare parts billed?",
      answer: "Technicians carry tools and common diagnostic spares. If any additional materials are required, the specialist logs them on the digital worksheet. You will review and approve the labor + material costs prior to signing off."
    },
    {
      question: "What is the 30-day workmanship warranty?",
      answer: "Every on-demand job carries a 30-day workmanship guarantee. If any cabling, repair, or configuration issue recurs within 30 days, we assign a specialist to rectify it free of charge."
    },
    {
      question: "How do commercial Annual Maintenance Contracts (AMC) work?",
      answer: "AMC plans cover preventive checkups, diagnostic reviews, emergency SLA turnarounds (typically 4 hours), and priority ticketing. You can subscribe directly on the dashboard or request a custom audit."
    }
  ];

  return (
    <section className="py-12 bg-white rounded-3xl border border-slate-100 px-6 shadow-sm">
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full text-[10px] font-bold text-blue-700 uppercase tracking-wider">
          Support FAQ
        </div>
        <h2 className="mt-3.5 text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl">Frequently Asked Questions</h2>
        <p className="mt-2 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Quick answers about service execution, advance payments, billing worksheets, and warranties.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`} className="border-slate-100">
              <AccordionTrigger className="text-xs font-bold text-slate-800 hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-xs leading-relaxed text-slate-500 pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
