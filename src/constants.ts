export const NOTE_PREFIX = '@note-'
export const POT_PREFIX = '@pot-'
export const USER_FILE = '@user'

export const MAIN_NAV = { Home: 'Home', Note: 'Note', Settings: 'Settings' }
export const POT_NAV = { Explorer: 'Explorer', Note: 'Note' }

export type IUser = {
    userLocale: string
    sysLocale: string
}

export type IPots = IPot[]

export type IPot = {
    id: string
    locale: string
    notes: INote[]
}

export type INote = {
    id: string
    locale: string
    title: string
    sections: ISection[]
}

export type ISection = {
    id: string
    type: string
    props: any
}

export const supportedLocales = [
    { label: 'Español', value: 'es-ES' },
    { label: 'English (Irish)', value: 'en-IE' },
    { label: 'Pусский', value: 'ru-RU' },
]
