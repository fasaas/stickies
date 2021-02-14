import React from 'react'
import { INote, IPot, IPots } from '../../constants'

const Context = React.createContext(undefined)

type State = { pots: IPots | undefined }
const potsInit = (pots?: IPots): State => ({ pots: pots })

type Action = {
    type: 'add-pot' | 'remove-note' | 'add-note' | 'update-note'
    event: {
        potId?: string
        pot?: IPot
        noteId?: string
        note?: INote
    }
}
const potsReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'add-pot': {
            const _pots = state.pots ? Array.from(state.pots) : []
            _pots.push(action.event.pot)

            return { pots: _pots }
        }
        case 'remove-note': {
            const _pots = state.pots ? Array.from(state.pots) : []
            const filteredPots = _pots.map((pot) => {
                const { notes, ...rest } = pot
                const filteredNotes = notes.filter((note) => note.id !== action.event.noteId)
                return { ...rest, notes: filteredNotes }
            })

            return { pots: filteredPots }
        }
        case 'add-note': {
            const _pots = state.pots ? Array.from(state.pots) : []
            const mappedPots = _pots.map((pot) => {
                if (pot.id === action.event.pot?.id) {
                    const newNotes = Array.from(pot.notes)
                    newNotes.push(action.event.note);
                    return { ...pot, notes: newNotes }
                }

                return pot
            })
            return { pots: mappedPots }
        }
        case 'update-note': {
            const _pots = state.pots ? Array.from(state.pots) : []
            const mappedPots = _pots.map((pot) => {
                const potNeedingUpdate = pot.notes.find((note) => note.id === action.event.note.id)
                if (potNeedingUpdate) {
                    const newNotes = Array.from(pot.notes).map((note) => {
                        if (note.id !== action.event.note?.id) return note
                        return action.event.note
                    })
                    return { ...pot, notes: newNotes }
                }

                return pot
            })
            return { pots: mappedPots }
        }
    }
}

export const PotsProvider = (props: { pots?: IPots; children: any }) => {
    const [state, dispatch] = React.useReducer(potsReducer, props.pots, potsInit)

    return <Context.Provider value={{ pots: state.pots, dispatch }}>{props.children}</Context.Provider>
}

export const usePots = (): {
    pots: IPots | undefined;
    dispatch: React.Dispatch<Action>
} => {
    const ctx = React.useContext(Context)
    if (ctx === undefined) throw new Error("usePots must be used within <PotsProvider>")

    return ctx
}
