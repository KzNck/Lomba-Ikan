// All copy and imagery for the login page. Edit here to swap content without touching layout.
import type { FormFieldConfig } from '@/components/register/form-field'
import type { TermsNoticeContent } from '@/components/login/terms-notice'
import { AUTH_LINKS } from '@/components/home/content'

export const LOGIN = {
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
    required: true,
    hideRequiredMark: true,
  } satisfies FormFieldConfig,
  passwordField: {
    kind: 'text',
    inputType: 'password',
    autoComplete: 'current-password',
    id: 'password',
    label: 'Password',
    icon: 'lock',
    placeholder: 'Masukkan password Anda',
    required: true,
    hideRequiredMark: true,
  } satisfies FormFieldConfig,
  submitLabel: 'Masuk',
  // Shown when the confirmation link in the signup email could not be used.
  confirmFailed: 'Tautan konfirmasi sudah kedaluwarsa atau pernah dipakai. Masuk, dan kami kirimkan tautan baru.',
  terms: {
    intro: 'Dengan melanjutkan, Anda menyetujui',
    terms: 'Syarat & Ketentuan',
    connector: 'dan',
    privacy: 'Kebijakan Privasi.',
  } satisfies TermsNoticeContent,
  signupQuestion: 'Belum punya akun?',
  signupLink: { href: AUTH_LINKS.register.href, label: 'Daftar di sini' },
}

// The "cek email" step, shown after registering when the project requires email confirmation.
export const CONFIRM_EMAIL = {
  title: 'Konfirmasi Email Anda',
  // "{email}" is replaced with the address the link went to.
  subtitle: 'Kami mengirim tautan konfirmasi ke {email}.',
  body: 'Buka email tersebut dan klik tautannya untuk mengaktifkan akun. Periksa folder spam kalau belum masuk dalam beberapa menit.',
  resendLabel: 'Kirim ulang email konfirmasi',
  // "{time}" is replaced with the cooldown left before another send is allowed.
  resendWaitLabel: 'Kirim ulang dalam {time}',
  resentText: 'Email konfirmasi baru sudah dikirim. Tautan yang lama tidak berlaku lagi.',
  question: 'Sudah dikonfirmasi?',
  link: { href: '/auth/login', label: 'Masuk di sini' },
}
