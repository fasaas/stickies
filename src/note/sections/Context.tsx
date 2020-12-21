import React, { createContext, ReactNode, useContext, useReducer } from 'react'

export type ISection = {
    type: string
    name: string
    id: string
    props: any
}

type State = { sections: ISection[]; initial: { sections: string }; isChanged: boolean }
type Action = {
    type: 'prop-update' | 'remove-section' | 'add-section' | 'cancel' | 'save'
    event?: any
}
type Dispatch = (action: Action) => void

const init = ({ sections }: { sections?: ISection[] }): State => {
    const defaultValue: ISection[] = [
        { type: '@native/translation', name: 'Translation', id: Date.now().toString(), props: { from: '', to: '' } },
    ]
    return !!sections
        ? { sections: sections, initial: { sections: JSON.stringify(sections) }, isChanged: false }
        : { sections: defaultValue, initial: { sections: JSON.stringify(defaultValue) }, isChanged: false }
}
const noteReducer = (state: State, action: Action): State => {
    const { type, event } = action

    switch (type) {
        case 'prop-update': {
            const { id, path, value } = event
            const { initial, sections } = state
            const section: ISection | undefined = sections.find((section) => section.id === id)
            if (section) {
                section.props[path] = value
            }

            const isChanged = JSON.stringify(sections) !== initial.sections

            return { sections, initial, isChanged }
        }
        case 'remove-section': {
            const { sections, initial } = state

            const { id } = event
            const filteredSections = sections.filter((section) => section.id !== id)

            return { sections: filteredSections, initial, isChanged: true }
        }
        case 'add-section': {
            const { sections, initial } = state
            const { type } = event
            sections.push({
                type: '@native/translation',
                name: 'Translation',
                id: Date.now().toString(),
                props: { from: '', to: '' },
            })

            return { sections, initial, isChanged: true }
        }

        case 'cancel': {
            const { initial } = state
            return { sections: JSON.parse(initial.sections), initial, isChanged: false }
        }
        case 'save': {
            const { sections } = state
            return { sections, initial: { sections: JSON.stringify(sections) }, isChanged: false }
        }
        default: {
            throw new Error(`Type ${type} unsupported`)
        }
    }
}

const SectionsContext = createContext<State | undefined>(undefined)
const SectionsDispatchContext = createContext<Dispatch | undefined>(undefined)

const SectionsProvider = ({ sections, children }: { sections?: ISection[]; children: ReactNode }) => {
    const [state, dispatch] = useReducer(noteReducer, { sections }, init)

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
