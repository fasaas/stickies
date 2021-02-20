import React from 'react'
import { State } from 'react-native-paper/lib/typescript/components/TextInput/types'
import { IUser } from '../../constants'

const UserContext = React.createContext(undefined)

type Action = {
    type: 'set-user' | 'update-text-size'
    user?: IUser
    newTextSize?: number
}

const userReducer = (state: IUser, action: Action): IUser => {
    switch (action.type) {
        case 'set-user': {
            return action.user
        }
        case 'update-text-size': {
            return { ...state, textSize: action.newTextSize }
        }
    }
}

export const UserProvider = ({ children, user }: { children: any; user?: IUser }) => {
    const [state, dispatch] = React.useReducer(userReducer, user)

    return <UserContext.Provider value={{ state, dispatch }} >{children}</UserContext.Provider>
}

export const useUserContext = (): { state: IUser; dispatch: React.Dispatch<Action> } => {
    const ctx = React.useContext(UserContext)
    if (ctx === undefined) throw new Error('useUserContext must be used within <UserProvider>')

    return ctx
}