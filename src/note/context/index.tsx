import React, { createContext, ReactNode, useContext } from 'react'
import { useContextReducer } from './Reducer'
import { State, Dispatch, ISection } from '../Types'

const SectionsContext = createContext<State | undefined>(undefined)
const SectionsDispatchContext = createContext<Dispatch | undefined>(undefined)

type SectionsProviderProps = {
    title?: string
    sections?: ISection[]
    children: ReactNode
}

const NoteProvider = ({ title, sections, children }: SectionsProviderProps) => {
    const [state, dispatch] = useContextReducer({ title, sections })

    return (
        <SectionsContext.Provider value={state}>
            <SectionsDispatchContext.Provider value={dispatch}>{children}</SectionsDispatchContext.Provider>
        </SectionsContext.Provider>
    )
}

const useNote = () => {
    const ctx = useContext(SectionsContext)
    if (!ctx) {
        throw new Error('useNote must be used within <NoteProvider>')
    }

    return ctx
}

const useDispatch = () => {
    const ctx = useContext(SectionsDispatchContext)
    if (!ctx) {
        throw new Error('useDispatch must be used within <NoteProvider>')
    }

    return ctx
}

export { NoteProvider, useNote, useDispatch }
