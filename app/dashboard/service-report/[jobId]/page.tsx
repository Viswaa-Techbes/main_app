"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Share2, 
  Star, 
  User, 
  Calendar, 
  Wrench, 
  DollarSign, 
  CheckCircle2, 
  Camera,
  Layers,
  MapPin,
  ClipboardList
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageStatus } from "@/shared/components/feedback/page-status";
import { InlineAlert } from "@/shared/components/feedback/inline-alert";
import { useToast } from "@/hooks/use-toast";


export default function ServiceReportPage() {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const [worksheet, setWorksheet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lightbox State
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        setLoading(true);
        const res = await fetch(`/api/worksheets/job/${jobId}`);
        const payload = await res.json();
        
        if (!res.ok) {
          throw new Error(payload.message || "Failed to load service worksheet.");
        }
        
        setWorksheet(payload.data);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    if (jobId) {
      fetchReport();
    }
  }, [jobId]);

  const handleShare = () => {
    if (!worksheet?.pdfUrl) return;
    navigator.clipboard.writeText(worksheet.pdfUrl);
    toast({
      title: "Link Copied",
      description: "PDF Report download link copied to clipboard!",
    });
  };


  if (loading) {
    return <PageStatus message="Retrieving Digital Service Worksheet..." className="min-h-[80vh]" />;
  }

  if (error || !worksheet) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <InlineAlert message={error || "Service report not found."} />
        <div className="mt-6 text-center">
          <Button asChild variant="outline" className="rounded-xl h-10 text-xs font-bold">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  const tech = worksheet.technicianId || {};
  const jobDetails = worksheet.jobId || {};
  const materials = worksheet.materialsUsed || [];
  const photos = [
    ...(_beforePhotos() ? worksheet.beforePhotos : []),
    ...(_duringPhotos() ? worksheet.duringPhotos : []),
    ...(_afterPhotos() ? worksheet.afterPhotos : []),
  ];

  function _beforePhotos() { return worksheet.beforePhotos && worksheet.beforePhotos.length > 0; }
  function _duringPhotos() { return worksheet.duringPhotos && worksheet.duringPhotos.length > 0; }
  function _afterPhotos() { return worksheet.afterPhotos && worksheet.afterPhotos.length > 0; }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 bg-slate-50/30">
      {/* Top Bar Navigation */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="ghost" className="self-start text-xs font-bold text-slate-500 hover:text-blue-600 transition">
          <Link href="/dashboard">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
        
        <div className="flex flex-wrap gap-2">
          {worksheet.pdfUrl ? (
            <>
              <Button asChild variant="outline" className="h-9 rounded-xl border-slate-200 text-xs font-bold">
                <a href={worksheet.pdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center">
                  <Download className="mr-1.5 h-4 w-4 text-blue-600" /> Download PDF
                </a>
              </Button>
              <Button variant="outline" onClick={handleShare} className="h-9 rounded-xl border-slate-200 text-xs font-bold">
                <Share2 className="mr-1.5 h-4 w-4 text-blue-600" /> Share Report
              </Button>
            </>
          ) : (
            <div className="rounded-xl bg-amber-50 border border-amber-100 px-3 py-1.5 text-[10px] text-amber-700 font-bold uppercase tracking-wider">
              Generating report PDF...
            </div>
          )}
        </div>
      </div>

      {/* Main Report Container */}
      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        {/* Header Ribbon */}
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.15),transparent_40%)] pointer-events-none" />
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between relative z-10">
            <div>
              <span className="inline-flex items-center rounded-full bg-blue-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                Official Worksheet
              </span>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Worksheet {worksheet.worksheetNumber}
              </h1>
              <p className="mt-1 text-xs text-slate-400 font-medium">
                Booking ID: {worksheet.bookingId}
              </p>
            </div>
            
            <div className="flex flex-col items-start gap-1 rounded-2xl bg-white/5 p-4 backdrop-blur-md md:items-end border border-white/5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Verification Status</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold capitalize text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> {worksheet.status.replace("_", " ")}
              </span>
              <span className="mt-1 text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                OTP Signature: {worksheet.completionOtpVerified ? "VERIFIED" : "PENDING"}
              </span>
            </div>
          </div>
        </div>

        {/* Report Content Grid */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Customer Details */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
              <h2 className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                <ClipboardList className="h-4 w-4 text-blue-600" /> Customer Information
              </h2>
              <div className="mt-4 space-y-3.5 text-xs text-slate-600 font-semibold">
                <p><span className="text-slate-400 font-semibold">Name:</span> {worksheet.customerName}</p>
                <p><span className="text-slate-400 font-semibold">Mobile:</span> {worksheet.customerMobile}</p>
                <p className="flex items-start gap-1">
                  <span className="text-slate-400 font-semibold min-w-[65px]">Address:</span> 
                  <span className="text-slate-700 leading-relaxed">{worksheet.customerAddress}</span>
                </p>
              </div>
            </div>

            {/* Technician Profile Card */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
              <h2 className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                <User className="h-4 w-4 text-blue-600" /> Service Technician
              </h2>
              
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100 shadow-sm shrink-0">
                  {tech.profilePhoto ? (
                    <img src={tech.profilePhoto} alt="" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800">{tech.name || "Service Engineer"}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{tech.specialty || "Techbes Specialist"}</p>
                  
                  {tech.rating && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span>{tech.rating.toFixed(1)} / 5 Rating</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Job description section */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Service Overview</h2>
            <div className="rounded-2xl border border-slate-100 p-6 space-y-4 text-xs font-semibold">
              <div>
                <h3 className="font-bold mb-1 text-[10px] uppercase tracking-wider text-slate-400">Customer Request</h3>
                <p className="bg-slate-50/50 p-3 rounded-xl border border-slate-100/50 text-slate-600 leading-relaxed">{worksheet.requestedWorkDescription || "No specific request text entered."}</p>
              </div>
              <div>
                <h3 className="font-bold mb-1 text-[10px] uppercase tracking-wider text-slate-400">Technician Observations</h3>
                <p className="bg-slate-50/50 p-3 rounded-xl border border-slate-100/50 text-slate-700 leading-relaxed font-bold">{worksheet.technicianObservations || "No site observations recorded by technician."}</p>
              </div>
            </div>
          </div>

          {/* Materials Table */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Materials Used</h2>
            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5 font-bold">Item Description</th>
                    <th className="px-6 py-3.5 font-bold">Details</th>
                    <th className="px-6 py-3.5 font-bold text-center">Qty</th>
                    <th className="px-6 py-3.5 font-bold">Unit</th>
                    <th className="px-6 py-3.5 text-right font-bold">Rate</th>
                    <th className="px-6 py-3.5 text-right font-bold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                  {materials.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-400 font-bold uppercase tracking-wider">
                        No materials billed for this job.
                      </td>
                    </tr>
                  ) : (
                    materials.map((mat: any, idx: number) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/20"}>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">{mat.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-500">{mat.category || mat.brand || "-"}</p>
                        </td>
                        <td className="px-6 py-4 text-center text-slate-700">{mat.quantity}</td>
                        <td className="px-6 py-4 text-slate-500">{mat.unit || "Unit"}</td>
                        <td className="px-6 py-4 text-right text-slate-700">₹{(mat.unitPrice || mat.unitCost || 0).toLocaleString("en-IN")}</td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900">₹{(mat.total || mat.totalCost || 0).toLocaleString("en-IN")}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Photo Gallery */}
          {photos.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Worksite Gallery</h2>
              
              <div className="grid gap-6 sm:grid-cols-3">
                {/* Before */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Before Work</span>
                  {_beforePhotos() ? (
                    <div 
                      onClick={() => setActivePhoto(worksheet.beforePhotos[0])}
                      className="cursor-pointer overflow-hidden rounded-2xl border border-slate-100 aspect-[4/3] bg-slate-50 hover:opacity-90 hover:scale-101 transition shadow-sm"
                    >
                      <img src={worksheet.beforePhotos[0]} alt="Before Work" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center aspect-[4/3] text-slate-400">
                      <Camera className="h-4.5 w-4.5 mb-1.5 text-slate-300" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">No Photo</span>
                    </div>
                  )}
                </div>

                {/* During */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">During Work</span>
                  {_duringPhotos() ? (
                    <div 
                      onClick={() => setActivePhoto(worksheet.duringPhotos[0])}
                      className="cursor-pointer overflow-hidden rounded-2xl border border-slate-100 aspect-[4/3] bg-slate-50 hover:opacity-90 hover:scale-101 transition shadow-sm"
                    >
                      <img src={worksheet.duringPhotos[0]} alt="During Work" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center aspect-[4/3] text-slate-400">
                      <Camera className="h-4.5 w-4.5 mb-1.5 text-slate-300" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">No Photo</span>
                    </div>
                  )}
                </div>

                {/* After */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">After Work</span>
                  {_afterPhotos() ? (
                    <div 
                      onClick={() => setActivePhoto(worksheet.afterPhotos[0])}
                      className="cursor-pointer overflow-hidden rounded-2xl border border-slate-100 aspect-[4/3] bg-slate-50 hover:opacity-90 hover:scale-101 transition shadow-sm"
                    >
                      <img src={worksheet.afterPhotos[0]} alt="After Work" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center aspect-[4/3] text-slate-400">
                      <Camera className="h-4.5 w-4.5 mb-1.5 text-slate-300" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">No Photo</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Digital Signatures Display */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Authentication Signatures</h2>
            <div className="grid gap-6 md:grid-cols-2">
              
              {/* Customer */}
              <div className="rounded-2xl border border-slate-100 p-5 bg-slate-50/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-3">Customer Signature</span>
                <div className="h-28 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-4">
                  {worksheet.customerSignatureUrl ? (
                    <img src={worksheet.customerSignatureUrl} alt="Customer Signature" className="h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Awaiting Signature</span>
                  )}
                </div>
              </div>

              {/* Technician */}
              <div className="rounded-2xl border border-slate-100 p-5 bg-slate-50/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-3">Technician Signature</span>
                <div className="h-28 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-4">
                  {worksheet.technicianSignatureUrl ? (
                    <img src={worksheet.technicianSignatureUrl} alt="Technician Signature" className="h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Awaiting Signature</span>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Pricing breakdown Summary */}
          <div className="rounded-3xl border border-slate-100 p-6 bg-slate-50/30 flex justify-end">
            <div className="w-full max-w-xs space-y-3.5 text-xs font-semibold text-slate-500">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 mb-4">Invoice Summary</h2>
              
              <div className="flex justify-between">
                <span>Labour Charges</span>
                <span className="text-slate-800">₹{worksheet.labourCost.toLocaleString("en-IN")}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Materials Subtotal</span>
                <span className="text-slate-800">₹{worksheet.materialCost.toLocaleString("en-IN")}</span>
              </div>

              <div className="border-t border-slate-150 pt-3.5 flex justify-between text-sm text-slate-800 font-extrabold">
                <span>Total Amount Charged</span>
                <span className="text-blue-600 font-black">₹{worksheet.totalCost.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Lightbox Overlay */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 transition-opacity duration-300"
          onClick={() => setActivePhoto(null)}
        >
          <div className="relative max-h-screen max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setActivePhoto(null)}
              className="absolute -top-8 right-0 text-white font-bold text-xs uppercase tracking-wider hover:underline"
            >
              Close Viewer (✕)
            </button>
            <img src={activePhoto} alt="Work Photo" className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl" />
          </div>
        </div>
      )}
    </main>
  );
}
