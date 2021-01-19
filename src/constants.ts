export const NOTE_PREFIX = '@note-'

export const POT_PREFIX = '@pot-'

export const USER_FILE = '@user'

export type IUser = {
    userLocale: string
    sysLocale: string
}

export type IPots = IPot[]

export type IPot = {
    id: string
    locale: string
}

export const supportedLocales = [
    { label: 'Español', locale: 'es-ES' },
    { label: 'English (Irish)', locale: 'en-IE' },
    { label: 'Pусский', locale: 'ru-RU' },
]
