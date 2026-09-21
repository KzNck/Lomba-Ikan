// All copy and imagery for the login page. Edit here to swap content without touching layout.
// Text lives in messages/*.json under `auth.login` and `auth.confirmEmail`.
import type { FormFieldConfig } from '@/components/register/form-field'
import type { TermsNoticeContent } from '@/components/login/terms-notice'
import { AUTH_HREFS } from '@/components/home/content'
import type { Translator } from '@/lib/i18n/translator'

export function loginContent(t: Translator<'auth.login'>) {
  return {
    backLink: { href: '/', label: t('backLink') },
    illustration: {
      src: '/images/login/illustration.jpg',
      alt: t('illustrationAlt'),
    },
    tagline: {
      headline: [t('taglineFirst'), t('taglineSecond')],
      body: t('taglineBody'),
    },
    title: t('title'),
    subtitle: t('subtitle'),
    // Email only for now; the export's Nomor HP tab is left out.
    emailField: {
      kind: 'text',
      inputType: 'email',
      autoComplete: 'email',
      id: 'email',
      label: t('emailLabel'),
      icon: 'mail',
      placeholder: t('emailPlaceholder'),
      required: true,
      hideRequiredMark: true,
    } satisfies FormFieldConfig,
    passwordField: {
      kind: 'text',
      inputType: 'password',
      autoComplete: 'current-password',
      id: 'password',
      label: t('passwordLabel'),
      icon: 'lock',
      placeholder: t('passwordPlaceholder'),
      required: true,
      hideRequiredMark: true,
    } satisfies FormFieldConfig,
    submitLabel: t('submit'),
    // Shown when the confirmation link in the signup email could not be used.
    confirmFailed: t('confirmFailed'),
    terms: {
      intro: t('termsIntro'),
      terms: t('terms'),
      connector: t('termsConnector'),
      privacy: t('privacy'),
    } satisfies TermsNoticeContent,
    signupQuestion: t('signupQuestion'),
    signupLink: { href: AUTH_HREFS.register, label: t('signupLink') },
  }
}

// The "cek email" step, shown after registering when the project requires email confirmation.
export const CONFIRM_EMAIL_HREF = AUTH_HREFS.login

export function confirmEmailContent(t: Translator<'auth.confirmEmail'>, email: string) {
  return {
    title: t('title'),
    subtitle: t('subtitle', { email }),
    body: t('body'),
    question: t('question'),
    link: { href: CONFIRM_EMAIL_HREF, label: t('link') },
  }
}
