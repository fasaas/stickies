import React, { createContext, ReactNode, useContext, useReducer } from 'react'

export type ISection = {
    type: String
    name: String
    id: String
    props: any
}

type State = { sections: ISection[] }
type Action = {
    type: 'prop-update' | 'remove-section' | 'add-section'
    event: any
}
type Dispatch = (action: Action) => void

const init = (initialValue?: ISection[]) => {
    const defaultValue: ISection[] = [
        { type: '@native/translation', name: 'Translation', id: '1', props: { from: '', to: '' } },
    ]
    return !!initialValue ? { sections: initialValue } : { sections: defaultValue }
}
const noteReducer = (state: State, action: Action) => {
    const { type, event } = action

    switch (type) {
        case 'prop-update': {
            const { id, path, value } = event
            const section: ISection | undefined = state.sections.find((section) => section.id === id)
            if (section) {
                section.props[path] = value
            }
            return { ...state }
        }
        case 'remove-section': {
            const { id } = event
            state.sections.filter((section) => section.id !== id)

            return { ...state }
        }
        case 'add-section': {
            const { type } = event
            state.sections.push({
                type: '@native/translation',
                name: 'Translation',
                id: '2',
                props: { from: 'From text', to: '' },
            })

            return { ...state }
        }
        default: {
            throw new Error(`Type ${type} unsupported`)
        }
    }
}

const SectionsContext = createContext<State | undefined>(undefined)
const SectionsDispatchContext = createContext<Dispatch | undefined>(undefined)

const SectionsProvider = ({ value, children }: { value?: ISection[]; children: ReactNode }) => {
    const [state, dispatch] = useReducer(noteReducer, value, init)

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
