import React, { createContext, ReactNode, useContext } from 'react'
import { useContextReducer } from './Reducer'
import { State, Dispatch, ISection } from '../Types'

const NoteStateContext = createContext<State | undefined>(undefined)
const NoteDispatchContext = createContext<Dispatch | undefined>(undefined)

type SectionsProviderProps = {
    title?: string
    sections?: ISection[]
    children: ReactNode
}

const NoteProvider = ({ title, sections, children }: SectionsProviderProps) => {
    const [state, dispatch] = useContextReducer({ title, sections })

    return (
        <NoteStateContext.Provider value={state}>
            <NoteDispatchContext.Provider value={dispatch}>{children}</NoteDispatchContext.Provider>
        </NoteStateContext.Provider>
    )
}

const useNote = () => {
    const ctx = useContext(NoteStateContext)
    if (!ctx) {
        throw new Error('useNote must be used within <NoteProvider>')
    }

    return ctx
}

const useDispatch = () => {
    const ctx = useContext(NoteDispatchContext)
    if (!ctx) {
        throw new Error('useDispatch must be used within <NoteProvider>')
    }

    return ctx
}

export { NoteProvider, useNote, useDispatch }
