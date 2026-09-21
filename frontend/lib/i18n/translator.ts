import type { Messages, NamespaceKeys, NestedKeyOf, createTranslator } from 'next-intl'

type Namespace = NamespaceKeys<Messages, NestedKeyOf<Messages>>

/**
 * The `t` for one message namespace, as both `useTranslations` (client and non-async server components) and
 * `getTranslations` (async server code) return it. Content builders take one of these so the same builder serves
 * both sides.
 */
export type Translator<N extends Namespace> = ReturnType<typeof createTranslator<Messages, N>>
