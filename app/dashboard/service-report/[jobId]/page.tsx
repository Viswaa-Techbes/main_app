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

export default function ServiceReportPage() {
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
    alert("PDF Report download link copied to clipboard!");
  };

  if (loading) {
    return <PageStatus message="Retrieving Digital Service Worksheet..." className="min-h-[80vh]" />;
  }

  if (error || !worksheet) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <InlineAlert message={error || "Service report not found."} />
        <div className="mt-6 text-center">
          <Button asChild variant="outline">
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
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Bar Navigation */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="ghost" className="self-start text-slate-600 hover:text-slate-900">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
        
        <div className="flex flex-wrap gap-2">
          {worksheet.pdfUrl ? (
            <>
              <Button asChild variant="outline" className="border-slate-300">
                <a href={worksheet.pdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center">
                  <Download className="mr-2 h-4 w-4" /> Download PDF
                </a>
              </Button>
              <Button variant="outline" onClick={handleShare} className="border-slate-300">
                <Share2 className="mr-2 h-4 w-4" /> Share Report
              </Button>
            </>
          ) : (
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs text-amber-700 font-medium">
              PDF generating upon admin approval
            </div>
          )}
        </div>
      </div>

      {/* Main Report Container */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 text-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex items-center rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 backdrop-blur-sm">
                Official Service Report
              </span>
              <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Worksheet {worksheet.worksheetNumber}
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Booking Reference: {worksheet.bookingId}
              </p>
            </div>
            
            <div className="flex flex-col items-start gap-1 rounded-2xl bg-white/5 p-4 backdrop-blur-md md:items-end">
              <span className="text-xs text-slate-400">Completion Status</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold capitalize text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> {worksheet.status.replace("_", " ")}
              </span>
              <span className="mt-1 text-[11px] text-slate-400">
                Verified: {worksheet.completionOtpVerified ? "Yes (Customer OTP)" : "No"}
              </span>
            </div>
          </div>
        </div>

        {/* Report Content Grid */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Customer Details */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider">
                <ClipboardList className="h-4 w-4 text-blue-600" /> Customer Information
              </h2>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <p><span className="font-semibold text-slate-500">Name:</span> {worksheet.customerName}</p>
                <p><span className="font-semibold text-slate-500">Mobile:</span> {worksheet.customerMobile}</p>
                <p className="flex items-start gap-1">
                  <span className="font-semibold text-slate-500 min-w-[65px]">Address:</span> 
                  <span>{worksheet.customerAddress}</span>
                </p>
              </div>
            </div>

            {/* Technician Profile Card */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider">
                <User className="h-4 w-4 text-blue-600" /> Assigned Technician
              </h2>
              
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  {tech.profilePhoto ? (
                    <img src={tech.profilePhoto} alt="" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <User className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-950">{tech.name || "Field Engineer"}</h3>
                  <p className="text-xs text-slate-500 font-semibold">{tech.specialty || "Senior Service Technician"}</p>
                  
                  {tech.rating && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-amber-500" />
                      <span className="font-bold">{tech.rating.toFixed(1)} / 5</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Job description section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Service Description</h2>
            <div className="rounded-2xl border border-slate-200 p-6 space-y-4 text-sm text-slate-700">
              <div>
                <h3 className="font-bold text-slate-900 mb-1 text-xs uppercase tracking-wider text-slate-500">Original Requested Description</h3>
                <p className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">{worksheet.requestedWorkDescription || "No job description linked."}</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1 text-xs uppercase tracking-wider text-slate-500">Technician Observations & Diagnostic Findings</h3>
                <p className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 font-medium text-slate-800">{worksheet.technicianObservations || "No diagnostic findings recorded."}</p>
              </div>
            </div>
          </div>

          {/* Materials Table */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Materials & Spare Parts Installed</h2>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-white text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3.5 font-bold">Item Name</th>
                    <th className="px-6 py-3.5 font-bold">Category</th>
                    <th className="px-6 py-3.5 font-bold text-center">Qty</th>
                    <th className="px-6 py-3.5 font-bold">Unit</th>
                    <th className="px-6 py-3.5 text-right font-bold">Unit Price</th>
                    <th className="px-6 py-3.5 text-right font-bold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {materials.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-medium">
                        No materials were reported or charged.
                      </td>
                    </tr>
                  ) : (
                    materials.map((mat: any, idx: number) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-950">{mat.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-800">{mat.category || mat.brand || "-"}</p>
                        </td>
                        <td className="px-6 py-4 text-center font-medium text-slate-700">{mat.quantity}</td>
                        <td className="px-6 py-4 font-medium text-slate-700">{mat.unit || "Piece"}</td>
                        <td className="px-6 py-4 text-right font-medium text-slate-700">₹{(mat.unitPrice || mat.unitCost || 0).toLocaleString("en-IN")}</td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900">₹{(mat.total || mat.totalCost || 0).toLocaleString("en-IN")}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Photo Gallery (Click Thumbnail Opens lightbox) */}
          {photos.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Work Verification Photos</h2>
              <p className="text-xs text-slate-500">Click on any image to open full screen photo viewer.</p>
              
              <div className="grid gap-6 sm:grid-cols-3">
                {/* Before */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Before Work</span>
                  {_beforePhotos() ? (
                    <div 
                      onClick={() => setActivePhoto(worksheet.beforePhotos[0])}
                      className="cursor-pointer overflow-hidden rounded-2xl border border-slate-200 aspect-[4/3] bg-slate-100 hover:opacity-90 transition"
                    >
                      <img src={worksheet.beforePhotos[0]} alt="Before Work" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center aspect-[4/3] text-slate-400">
                      <Camera className="h-5 w-5 mb-1 text-slate-300" />
                      <span className="text-xs font-medium">No photo uploaded</span>
                    </div>
                  )}
                </div>

                {/* During */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">During Work</span>
                  {_duringPhotos() ? (
                    <div 
                      onClick={() => setActivePhoto(worksheet.duringPhotos[0])}
                      className="cursor-pointer overflow-hidden rounded-2xl border border-slate-200 aspect-[4/3] bg-slate-100 hover:opacity-90 transition"
                    >
                      <img src={worksheet.duringPhotos[0]} alt="During Work" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center aspect-[4/3] text-slate-400">
                      <Camera className="h-5 w-5 mb-1 text-slate-300" />
                      <span className="text-xs font-medium">No photo uploaded</span>
                    </div>
                  )}
                </div>

                {/* After */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">After Work</span>
                  {_afterPhotos() ? (
                    <div 
                      onClick={() => setActivePhoto(worksheet.afterPhotos[0])}
                      className="cursor-pointer overflow-hidden rounded-2xl border border-slate-200 aspect-[4/3] bg-slate-100 hover:opacity-90 transition"
                    >
                      <img src={worksheet.afterPhotos[0]} alt="After Work" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center aspect-[4/3] text-slate-400">
                      <Camera className="h-5 w-5 mb-1 text-slate-300" />
                      <span className="text-xs font-medium">No photo uploaded</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Digital Signatures Display */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Work Authentication Signatures</h2>
            <div className="grid gap-6 md:grid-cols-2">
              
              {/* Customer */}
              <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">Customer Signature</span>
                <div className="h-32 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-4">
                  {worksheet.customerSignatureUrl ? (
                    <img src={worksheet.customerSignatureUrl} alt="Customer Signature" className="h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Awaiting Signature</span>
                  )}
                </div>
              </div>

              {/* Technician */}
              <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">Technician Signature</span>
                <div className="h-32 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-4">
                  {worksheet.technicianSignatureUrl ? (
                    <img src={worksheet.technicianSignatureUrl} alt="Technician Signature" className="h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Awaiting Signature</span>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Pricing breakdown Summary */}
          <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50 flex justify-end">
            <div className="w-full max-w-sm space-y-3 text-sm">
              <h2 className="text-base font-bold text-slate-900 border-b pb-2 mb-4 uppercase tracking-wider">Invoice Cost Summary</h2>
              
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Labour Charges:</span>
                <span className="font-bold text-slate-900">₹{worksheet.labourCost.toLocaleString("en-IN")}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Materials Subtotal:</span>
                <span className="font-bold text-slate-900">₹{worksheet.materialCost.toLocaleString("en-IN")}</span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between text-base">
                <span className="font-bold text-slate-900">Total Charged Amount:</span>
                <span className="font-extrabold text-blue-600">₹{worksheet.totalCost.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Lightbox / Overlay Modal */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 transition-opacity duration-300"
          onClick={() => setActivePhoto(null)}
        >
          <div className="relative max-h-screen max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setActivePhoto(null)}
              className="absolute -top-10 right-0 text-white font-semibold text-sm hover:underline"
            >
              Close Viewer (✕)
            </button>
            <img src={activePhoto} alt="Fullscreen Work Photo" className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl" />
          </div>
        </div>
      )}
    </main>
  );
}
