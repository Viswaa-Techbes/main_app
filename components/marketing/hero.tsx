"use client"

import React from 'react'
import Section from './section'
import { motion } from 'framer-motion'
import ServiceCard from './service-card'
import TechnicianCard from './technician-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Heading from '@/components/design-system/heading'
import Text from '@/components/design-system/text'

export default function Hero() {
  return (
    <header className="bg-[var(--bg-muted)]">
      <Section className="pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div>
              <Badge className="rounded-full">Trusted technicians · Verified profiles</Badge>

              <Heading as="h1" className="mt-6">Book verified technicians for every home and business need</Heading>

              <Text className="mt-4 max-w-xl">Premium service marketplace — curated professionals, transparent pricing, and seamless scheduling.</Text>

              <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="w-full sm:w-96">
                  <div className="flex items-center gap-3 rounded-xl border px-3 py-2 bg-[var(--input)]" style={{borderColor: 'var(--border)'}}>
                    <input placeholder="Search services, e.g. AC repair" className="flex-1 bg-transparent outline-none text-sm text-[var(--text-700)]" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="primary">Search</Button>
                  <Button variant="secondary">Get a Quote</Button>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[var(--text-700)]">
                <span>2,430+ bookings this week</span>
                <span className="mx-2">•</span>
                <span>4.8/5 average rating</span>
                <span className="mx-2">•</span>
                <span>Verified technicians across 8 cities</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="ds-card p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Popular services</h3>
                <span className="text-sm text-[var(--text-700)]">Best sellers</span>
              </div>

              <div className="mt-4 grid gap-3">
                <ServiceCard title="AC Installation" price="₹1,999" duration="2 hrs" rating={4.7} />
                <ServiceCard title="CCTV Setup" price="₹2,499" duration="3 hrs" rating={4.8} />
                <TechnicianCard name="Rahul" role="AC Technician" rating={4.9} />
              </div>
            </motion.div>
          </div>
        </div>
      </Section>
    </header>
  )
}
