import type { AppLocale } from '@/i18n/config'
import type { formats } from '@/i18n/request'
import type messages from '@/messages/id.json'

declare module 'next-intl' {
  interface AppConfig {
    Locale: AppLocale
    Messages: typeof messages
    Formats: typeof formats
  }
}
