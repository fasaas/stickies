import React, { createContext, ReactNode, useContext, useReducer } from 'react'

export type ISection = {
    type: string
    name: string
    id: string
    props: any
}

type State = {
    title: string
    sections: ISection[]
    initial: { title: string; sections: string }
    can: { save: boolean; reset: boolean }
    isChanged: boolean
}
type Action = {
    type: 'update-prop' | 'remove-section' | 'add-section' | 'reset' | 'save' | 'update-title'
    event?: any
}
type Dispatch = (action: Action) => void

const init = ({ title, sections }: { title?: string; sections?: ISection[] }): State => {
    const defaultSections: ISection[] = [
        { type: '@native/translation', name: 'Translation', id: Date.now().toString(), props: { from: '', to: '' } },
    ]

    const initialTitle = title || ''
    const initialSections = sections || defaultSections
    return {
        title: initialTitle,
        sections: initialSections,
        initial: { sections: JSON.stringify(initialSections), title: initialTitle },
        isChanged: false,
        can: { save: false, reset: false },
    }
}
const noteReducer = (state: State, action: Action): State => {
    const { type, event } = action

    switch (type) {
        case 'update-prop': {
            const { id, path, value } = event
            const { initial, sections, title, can } = state
            const section: ISection | undefined = sections.find((section) => section.id === id)
            if (section) {
                section.props[path] = value
            }

            const isChanged = initial.sections !== JSON.stringify(sections)

            return { title, sections, initial, isChanged, can }
        }
        case 'remove-section': {
            const { sections, initial, title } = state

            const { id } = event
            const filteredSections = sections.filter((section) => section.id !== id)

            return { title, sections: filteredSections, initial, isChanged: true, can: { save: true, reset: true } }
        }
        case 'add-section': {
            const { sections, initial, title } = state
            const { type } = event
            sections.push({
                type: '@native/translation',
                name: 'Translation',
                id: Date.now().toString(),
                props: { from: '', to: '' },
            })

            return { title, sections, initial, isChanged: true, can: { save: true, reset: true } }
        }

        case 'reset': {
            const { initial } = state
            return {
                title: initial.title,
                sections: JSON.parse(initial.sections),
                initial,
                isChanged: false,
                can: { save: false, reset: false },
            }
        }
        case 'save': {
            const { sections, title } = state
            return {
                title,
                sections,
                initial: { sections: JSON.stringify(sections), title },
                isChanged: false,
                can: { save: false, reset: false },
            }
        }
        case 'update-title': {
            const { sections, title, initial, can } = state

            const isChanged = initial.title !== event.title
            return { sections, title: event.title, initial, isChanged, can }
        }
        default: {
            throw new Error(`Type ${type} unsupported`)
        }
    }
}

const SectionsContext = createContext<State | undefined>(undefined)
const SectionsDispatchContext = createContext<Dispatch | undefined>(undefined)

type SectionsProviderProps = {
    title?: string
    sections?: ISection[]
    children: ReactNode
}

const SectionsProvider = ({ title, sections, children }: SectionsProviderProps) => {
    const [state, dispatch] = useReducer(noteReducer, { sections, title }, init)

    return (
        <SectionsContext.Provider value={state}>
            <SectionsDispatchContext.Provider value={dispatch}>{children}</SectionsDispatchContext.Provider>
        </SectionsContext.Provider>
    )
}

const useSections = () => {
    const ctx = useContext(SectionsContext)
    if (!ctx) {
        throw new Error('useSections must be used within <SectionsProvider>')
    }

    return ctx
}

const useDispatch = () => {
    const ctx = useContext(SectionsDispatchContext)
    if (!ctx) {
        throw new Error('useDispatch must be used within <SectionsProvider>')
    }

    return ctx
}

export { SectionsProvider, useSections, useDispatch }
