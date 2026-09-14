'use client'

import { useState } from 'react'
import { LandingHeader } from '@/components/landing/landing-header'
import { HeroSection } from '@/components/landing/hero-section'
import { ImpactMetrics } from '@/components/landing/impact-metrics'
import { WorkflowSteps } from '@/components/landing/workflow-steps'
import { RoleEcosystem } from '@/components/landing/role-ecosystem'
import { CtaBanner } from '@/components/landing/cta-banner'
import { LandingFooter } from '@/components/landing/landing-footer'
import { ContactModal } from '@/components/landing/contact-modal'

export default function HomePage() {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Top Header Navigation */}
      <LandingHeader />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section with Headline & Circular Loop Diagram */}
        <HeroSection />

        {/* Impact Metrics Bar */}
        <ImpactMetrics />

        {/* 4-Step Process Section */}
        <WorkflowSteps />

        {/* Role Ecosystem Section */}
        <RoleEcosystem />

        {/* Pre-footer Call to Action Card */}
        <CtaBanner onOpenContact={() => setContactOpen(true)} />
      </main>

      {/* Landing Footer */}
      <LandingFooter onOpenContact={() => setContactOpen(true)} />

      {/* Interactive Contact / Support Dialog */}
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  )
}
