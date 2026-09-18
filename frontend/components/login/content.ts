// All copy and imagery for the login page. Edit here to swap content without touching layout.
import type { FormFieldConfig } from '@/components/register/form-field'
import type { TermsNoticeContent } from '@/components/login/terms-notice'
import type { OtpFormContent } from '@/components/login/otp-form'
import { AUTH_LINKS } from '@/components/home/content'

export const LOGIN = {
  // The email form submits here as ?email=… until Supabase sends the code.
  verifyHref: '/auth/login/verifikasi',
  backLink: { href: '/', label: 'Kembali ke Beranda' },
  illustration: {
    src: '/images/login/illustration.jpg',
    alt: 'Ilustrasi dua nelayan memilah hasil tangkapan di atas kapal kayu di laut',
  },
  tagline: {
    headline: ['Laut yang Sehat,', 'Masa Depan yang Kuat'],
    body: 'Bersama ByCatch Loop, kita menghubungkan nelayan, pembeli, dan industri untuk mengelola hasil laut dengan lebih baik.',
  },
  title: 'Selamat Datang Kembali',
  subtitle: 'Masuk untuk melanjutkan ke akun ByCatch Loop Anda.',
  // Email only for now; the export's Nomor HP tab is left out.
  emailField: {
    kind: 'text',
    inputType: 'email',
    autoComplete: 'email',
    id: 'email',
    label: 'Email',
    icon: 'mail',
    placeholder: 'Contoh: rina@usahaanda.co.id',
    helper: 'Kami akan mengirim kode OTP 6 digit ke email Anda.',
    required: true,
    hideRequiredMark: true,
  } satisfies FormFieldConfig,
  submitLabel: 'Kirim kode OTP',
  terms: {
    intro: 'Dengan melanjutkan, Anda menyetujui',
    terms: 'Syarat & Ketentuan',
    connector: 'dan',
    privacy: 'Kebijakan Privasi.',
  } satisfies TermsNoticeContent,
  signupQuestion: 'Belum punya akun?',
  signupLink: { href: AUTH_LINKS.register.href, label: 'Daftar di sini' },
}

// Step two: the "Verifikasi OTP" state, reworded for email. Its "Masuk dengan email" fallback is left out.
export const LOGIN_OTP = {
  changeEmailLink: { href: '/auth/login', label: 'Ganti email' },
  title: 'Masukkan Kode OTP',
  // "{email}" is replaced with the address the code went to.
  subtitle: 'Kode 6 digit telah dikirim ke {email}.',
  form: {
    otp: { name: 'otp', label: 'Kode OTP', length: 6, digitLabel: 'Digit {n} dari {total}' },
    resendText: 'Kirim ulang kode dalam 00:45',
    submitLabel: 'Verifikasi & masuk',
  } satisfies OtpFormContent,
}
