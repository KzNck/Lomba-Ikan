'use client'

import { useState } from 'react'
import { TopNoticeBar } from '@/components/landing/top-notice-bar'
import { LandingHeader } from '@/components/landing/landing-header'
import { HeroSection } from '@/components/landing/hero-section'
import { ProblemSolution } from '@/components/landing/problem-solution'
import { OperationalPillars } from '@/components/landing/operational-pillars'
import { WorkflowSteps } from '@/components/landing/workflow-steps'
import { RoleEcosystem } from '@/components/landing/role-ecosystem'
import { SdgImpact } from '@/components/landing/sdg-impact'
import { CtaBanner } from '@/components/landing/cta-banner'
import { LandingFooter } from '@/components/landing/landing-footer'
import { ContactModal } from '@/components/landing/contact-modal'
import { ReportModal } from '@/components/landing/report-modal'

export default function HomePage() {
  const [contactOpen, setContactOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Top Active Port Network Notice Bar */}
      <TopNoticeBar />

      {/* Primary Sticky Header Navigation */}
      <LandingHeader />

      {/* Main Narrative Flow */}
      <main className="flex-1">
        {/* 1. Hero Section with Circular Diagram & Trust Chips */}
        <HeroSection />

        {/* 2. Problem vs Solution Comparison Matrix */}
        <ProblemSolution />

        {/* 3. Three Operational Pillars & Deep-Dive Circular Journey */}
        <OperationalPillars />

        {/* 4. Four-Step Process Overview */}
        <WorkflowSteps />

        {/* 5. Three-Tier Maritime Role Ecosystem */}
        <RoleEcosystem />

        {/* 6. Measurable Impact Metrics & 5 SDG Contributions */}
        <SdgImpact />

        {/* 7. Unified Blue Economy Final Call-to-Action Banner */}
        <CtaBanner
          onOpenContact={() => setContactOpen(true)}
          onOpenReport={() => setReportOpen(true)}
        />
      </main>

      {/* Expanded 4-Column Footer */}
      <LandingFooter onOpenContact={() => setContactOpen(true)} />

      {/* Interactive Consultation Request Modal */}
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />

      {/* Interactive Impact Report Download Modal */}
      <ReportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  )
}
