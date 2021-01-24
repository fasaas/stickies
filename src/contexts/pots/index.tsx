import React from 'react'
import { IPot, IPots } from '../../constants'

const Context = React.createContext(undefined)

type State = { pots: IPots | undefined }
const potsInit = (pots?: IPots): State => ({ pots: pots })

type Action = {
    type: 'add-pot'
    event: {
        pot: IPot
    }
}
const potsReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'add-pot': {
            const _pots = state.pots ? Array.from(state.pots) : []
            _pots.push(action.event.pot)

            return { pots: _pots }
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
