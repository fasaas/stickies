import React from 'react'
import { IUser } from '../../constants'

const UserContext = React.createContext(undefined)

type Action = {
    type: 'set-user'
    user?: IUser
}

const userReducer = (state: IUser, action: Action) => {
    switch (action.type) {
        case 'set-user': {
            return action.user
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