import React from 'react'
import { IPots } from '../../constants'

const Context = React.createContext(undefined)

export const PotsProvider = (props: { pots?: IPots; children: any }) => {
    const [pots, setPots] = React.useState<IPots | undefined>(props.pots)

    return <Context.Provider value={{ pots, setPots }}>{props.children}</Context.Provider>
}

export const usePots = (): { pots: IPots | undefined; setPots: React.Dispatch<React.SetStateAction<IPots | undefined>> } => {
    const ctx = React.useContext(Context)
    if (ctx === undefined) throw new Error("usePots must be used within <PotsProvider>")

    return ctx
}
