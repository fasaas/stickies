import React from 'react'

const AppContext = React.createContext()

export const AppProvider = ({ children }) => {
    const [notes, setNotes] = React.useState([
        { id: '1', title: 'qwert' },
        { id: '2', title: 'asdf' },
        { id: '3', title: 'zxcvb' },
        { id: '4', title: '12345' },
    ])

    return <AppContext.Provider value={{ notes, setNotes }}>{children}</AppContext.Provider>
}

export const useAppProvider = () => {
    const ctx = React.useContext(AppContext)

    return ctx
}
