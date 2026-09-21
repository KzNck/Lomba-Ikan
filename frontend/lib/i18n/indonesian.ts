import { createTranslator } from 'next-intl'
import messages from '@/messages/id.json'

/**
 * Indonesian copy for content that is still Indonesian-only (the Akun pages), where it reuses text that now lives in
 * the message files. Swap for `useTranslations`/`getTranslations` once that screen is translated.
 */
export const registerCopyId = createTranslator({ locale: 'id', messages, namespace: 'auth.register' })
