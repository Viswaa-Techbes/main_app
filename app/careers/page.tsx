'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Briefcase, MapPin, Clock, CheckCircle2, UploadCloud, ChevronRight, GraduationCap, Laptop } from "lucide-react";
import { toast } from "sonner";

const jobs = [
  {
    id: 1,
    title: "Senior IT Support Technician",
    type: "Full-time",
    location: "Bangalore",
    experience: "3-5 years",
    description: "Lead on-site support and troubleshooting for corporate clients. Expertise in networking and Windows Server required.",
    requirements: ["CCNA Certification", "Experience with Active Directory", "Strong communication skills"]
  },
  {
    id: 2,
    title: "CCTV & Security Specialist",
    type: "Full-time",
    location: "Mumbai",
    experience: "2+ years",
    description: "Install and maintain high-end surveillance systems. Knowledge of IP cameras and NVR configuration is essential.",
    requirements: ["Knowledge of IP/Analog CCTV", "Field installation experience", "Own vehicle preferred"]
  },
  {
    id: 3,
    title: "Junior Network Engineer",
    type: "Full-time",
    location: "Chennai",
    experience: "1-2 years",
    description: "Assist in deploying office networks and firewall configurations. Great opportunity for growth.",
    requirements: ["Basic Networking knowledge", "Eagerness to learn", "Degree in IT/CS"]
  }
];

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<typeof jobs[0] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    if (selectedJob) {
      formData.append('roleApplied', selectedJob.title);
    }

    try {
      const response = await fetch('/api/v2/careers/apply', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setIsSuccess(true);
        toast.success("Application submitted successfully!");
      } else {
        toast.error(data.message || "Failed to submit application");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell>
      <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-sm font-bold tracking-wider uppercase mb-4 inline-block">
              We are Hiring
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              Join the <span className="text-orange-500">Techbes</span> Team
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Help us build the future of IT services. We're looking for passionate experts to join our growing network of professionals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Job Listings */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-orange-500" />
                Open Positions
              </h2>
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  onClick={() => setSelectedJob(job)}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedJob?.id === job.id 
                    ? 'border-orange-500 bg-orange-50/50 ring-4 ring-orange-500/10' 
                    : 'border-white bg-white shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {job.type}</span>
                        <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4" /> {job.experience}</span>
                      </div>
                    </div>
                    <div className={`p-2 rounded-full ${selectedJob?.id === job.id ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-slate-600 line-clamp-2 text-sm leading-relaxed">
                    {job.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Application Form */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {selectedJob ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl"
                  >
                    {!isSuccess ? (
                      <>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Apply for {selectedJob.title}</h3>
                        <p className="text-slate-500 mb-8">Please fill in your details and upload your latest resume.</p>
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Full Name</Label>
                              <Input id="name" name="name" placeholder="John Doe" required className="rounded-xl border-slate-200" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email Address</Label>
                              <Input id="email" name="email" type="email" placeholder="john@example.com" required className="rounded-xl border-slate-200" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input id="phone" name="phone" placeholder="+91 98765 43210" required className="rounded-xl border-slate-200" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="experience">Years of Experience</Label>
                              <Input id="experience" name="experience" placeholder="e.g. 4 years" required className="rounded-xl border-slate-200" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="resume">Resume (PDF, DOC, DOCX)</Label>
                            <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-8 hover:border-orange-400 hover:bg-orange-50/30 transition-all group text-center cursor-pointer">
                              <input 
                                type="file" 
                                id="resume" 
                                name="resume" 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                accept=".pdf,.doc,.docx"
                                required
                              />
                              <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-orange-500 mx-auto mb-2" />
                              <p className="text-sm font-medium text-slate-600 group-hover:text-orange-600">Click to upload or drag and drop</p>
                              <p className="text-xs text-slate-400 mt-1">Maximum file size 5MB</p>
                            </div>
                          </div>

                          <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
                          >
                            {isSubmitting ? "Submitting..." : "Submit Application"}
                          </Button>
                        </form>
                      </>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12"
                      >
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle2 className="w-12 h-12" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Application Sent!</h3>
                        <p className="text-slate-600 mb-8">Thank you for your interest. Our recruitment team will review your profile and contact you soon.</p>
                        <Button 
                          variant="outline" 
                          onClick={() => { setIsSuccess(false); setSelectedJob(null); }}
                          className="rounded-xl"
                        >
                          View Other Positions
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-3xl"
                  >
                    <div className="bg-slate-100 p-6 rounded-full mb-6">
                      <Laptop className="w-12 h-12 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Select a Position</h3>
                    <p className="text-slate-500 max-w-xs">Choose a job from the list to view details and start your application.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
