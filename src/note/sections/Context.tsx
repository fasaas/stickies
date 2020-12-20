import React, { createContext, ReactNode, useContext, useReducer } from 'react'

type ISection = {
    type: String
    id: String
    props: any
}

type State = ISection[]
type Action = { type: '' }
type Dispatch = (action: Action) => void

const init = (initialValue?: ISection[]) => {
    const defaultValue: ISection[] = [{ type: '@native/translation', id: '1', props: { from: '', to: '' } }]
    return !!initialValue ? initialValue : defaultValue
}
const noteReducer = (state: State, action: Action) => {}

const SectionsContext = createContext<State | undefined>(undefined)
const SectionsDispatchContext = createContext<Dispatch | undefined>(undefined)

const SectionsProvider = ({ value, children }: { value: ISection[]; children: ReactNode }) => {
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
