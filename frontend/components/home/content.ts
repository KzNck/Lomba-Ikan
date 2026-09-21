// All copy and imagery for the landing page. Edit here to swap content without touching layout.
// Text lives in messages/*.json under `landing` (and `auth.links`); this file pairs it with links, icons and images.
import type { NavItem } from '@/components/home/navbar'
import type { Step } from '@/components/home/step-card'
import type { Benefit } from '@/components/home/benefit-card'
import type { Stat } from '@/components/home/stat-item'
import type { Sdg } from '@/components/home/sdg-card'
import type { FooterContact, FooterSocial } from '@/components/home/footer'
import type { Translator } from '@/lib/i18n/translator'

type LandingT = Translator<'landing'>

export const SECTION_IDS = {
  home: 'beranda',
  howItWorks: 'cara-kerja',
  impact: 'dampak',
  sdgs: 'sdgs',
}

export function navItems(t: LandingT): NavItem[] {
  return [
    { href: `#${SECTION_IDS.home}`, label: t('nav.home') },
    { href: `#${SECTION_IDS.howItWorks}`, label: t('nav.howItWorks') },
    { href: `#${SECTION_IDS.impact}`, label: t('nav.impact') },
    { href: `#${SECTION_IDS.sdgs}`, label: t('nav.sdgs') },
  ]
}

export const AUTH_HREFS = {
  login: '/auth/login',
  register: '/auth/choose-role',
}

export function authLinks(t: Translator<'auth.links'>) {
  return {
    login: { href: AUTH_HREFS.login, label: t('login') },
    register: { href: AUTH_HREFS.register, label: t('register') },
  }
}

export function hero(t: LandingT) {
  return {
    eyebrow: t('hero.eyebrow'),
    headline: t('hero.headline'),
    subheadline: t('hero.subheadline'),
    image: {
      src: '/images/landing/hero-boat.jpg',
      alt: t('hero.imageAlt'),
    },
    primaryCta: { href: '/auth/register/nelayan', label: t('hero.primaryCta') },
    secondaryCta: { href: '/auth/register?role=pembeli', label: t('hero.secondaryCta') },
  }
}

const STEPS = [
  { key: 'record', icon: 'sailboat' },
  { key: 'freshness', icon: 'shield-check' },
  { key: 'listing', icon: 'file-text' },
  { key: 'buy', icon: 'shopping-cart' },
  { key: 'handover', icon: 'package-check' },
] as const

export function howItWorks(t: LandingT) {
  return {
    eyebrow: t('howItWorks.eyebrow'),
    title: t('howItWorks.title'),
    subtitle: t('howItWorks.subtitle'),
    steps: STEPS.map(({ key, icon }) => ({
      icon,
      title: t(`howItWorks.steps.${key}.title`),
      description: t(`howItWorks.steps.${key}.description`),
    })) satisfies Step[],
  }
}

export function impact(t: LandingT) {
  return {
    eyebrow: t('impact.eyebrow'),
    title: t('impact.title'),
    benefits: [
      {
        icon: 'ship',
        accent: 'blue',
        title: t('impact.nelayan.title'),
        subtitle: t('impact.nelayan.subtitle'),
        image: {
          src: '/images/landing/benefit-nelayan.jpg',
          alt: t('impact.nelayan.imageAlt'),
        },
        points: [
          {
            icon: 'coins',
            title: t('impact.nelayan.income.title'),
            description: t('impact.nelayan.income.description'),
          },
          {
            icon: 'fish',
            title: t('impact.nelayan.noWaste.title'),
            description: t('impact.nelayan.noWaste.description'),
          },
        ],
      },
      {
        icon: 'factory',
        accent: 'green',
        title: t('impact.pembeli.title'),
        subtitle: t('impact.pembeli.subtitle'),
        image: {
          src: '/images/landing/benefit-pembeli.jpg',
          alt: t('impact.pembeli.imageAlt'),
        },
        points: [
          {
            icon: 'leaf',
            title: t('impact.pembeli.supply.title'),
            description: t('impact.pembeli.supply.description'),
          },
          {
            icon: 'shield-check',
            title: t('impact.pembeli.pricing.title'),
            description: t('impact.pembeli.pricing.description'),
          },
        ],
      },
    ] satisfies Benefit[],
    statsLabelLines: [t('impact.statsLabelLines.first'), t('impact.statsLabelLines.second')],
    stats: [
      {
        icon: 'fish',
        accent: 'blue',
        value: t('impact.stats.biomass.value', { kg: 3000 }),
        caption: t('impact.stats.biomass.caption'),
      },
      {
        icon: 'handshake',
        accent: 'blue',
        value: t('impact.stats.closing.value', { percent: 70 }),
        caption: t('impact.stats.closing.caption'),
      },
      {
        icon: 'sprout',
        accent: 'green',
        value: t('impact.stats.speed.value', { minutes: 90 }),
        caption: t('impact.stats.speed.caption'),
      },
    ] satisfies Stat[],
  }
}

const GOALS = [
  { number: 14, badge: '/images/sdgs/goal-14.svg', targets: '14.4' },
  { number: 12, badge: '/images/sdgs/goal-12.svg', targets: '12.3 & 12.5' },
  { number: 2, badge: '/images/sdgs/goal-02.svg', targets: '2.3' },
  { number: 8, badge: '/images/sdgs/goal-08.svg', targets: '8.3' },
  { number: 13, badge: '/images/sdgs/goal-13.svg', targets: '13.2' },
] as const

export function sdgs(t: LandingT) {
  return {
    eyebrow: t('sdgs.eyebrow'),
    title: t('sdgs.title'),
    subtitle: t('sdgs.subtitle'),
    goals: GOALS.map(({ number, badge, targets }) => ({
      number,
      badge,
      title: t(`sdgs.goals.${number}.title`),
      target: t('sdgs.target', { targets }),
      description: t(`sdgs.goals.${number}.description`),
    })) satisfies Sdg[],
  }
}

export function footer(t: LandingT) {
  return {
    tagline: t('footer.tagline'),
    quickLinksHeading: t('footer.quickLinksHeading'),
    quickLinks: navItems(t),
    contactHeading: t('footer.contactHeading'),
    contacts: [
      { icon: 'phone', text: '+62 812-3456-7890' },
      { icon: 'mail', text: 'info@bycatchloop.id' },
      { icon: 'map-pin', text: t('footer.location') },
    ] satisfies FooterContact[],
    socialHeading: t('footer.socialHeading'),
    socials: [
      { icon: 'instagram', label: 'Instagram' },
      { icon: 'youtube', label: 'YouTube' },
      { icon: 'linkedin', label: 'LinkedIn' },
    ] satisfies FooterSocial[],
    copyright: t('footer.copyright', { year: 2025 }),
    legalItems: [t('footer.terms'), t('footer.privacy')],
  }
}
