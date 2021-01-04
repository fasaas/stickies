import { Ionicons } from '@expo/vector-icons'
import React, { ReactNode } from 'react'
import { ActivityIndicator, View } from 'react-native'
import AppCommands from '../commands/AppCommands'
import { Note, Notes } from '../interfaces'

const AppContext = React.createContext()

enum AppState {
    Idle,
    Pending,
    Resolved,
    Rejected,
}

const AppProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = React.useState(AppState.Idle)
    const [notes, setNotes] = React.useState<Notes | undefined>(undefined)

    const effect = async () => {
        setState(AppState.Pending)
        const result = await AppCommands.getAllNotes()
        if (result.failed) {
            setState(AppState.Rejected)
        } else {
            setNotes(result.notes)
            setState(AppState.Resolved)
        }
    }

    const deleteNote = async (id: string) => {
        const result = await AppCommands.deleteNote(id)
        if (result.failed) {
            return true
        }

        const filteredNotes = notes?.filter((note) => note.id !== id)
        setNotes(filteredNotes)
    }

    React.useEffect(() => {
        effect()
    }, [])

    switch (state) {
        case AppState.Idle: {
            return <View />
        }

        case AppState.Pending: {
            return (
                <View>
                    <ActivityIndicator testID='loading-app' />
                </View>
            )
        }

        case AppState.Rejected: {
            return (
                <View>
                    <Ionicons
                        name='refresh'
                        size={24}
                        color='black'
                        testID='app-retry'
                        onPress={async () => await effect()}
                    />
                </View>
            )
        }

        case AppState.Resolved: {
            return (
                <AppContext.Provider value={{ notes, delete: deleteNote }}>
                    {children}
                </AppContext.Provider>
            )
        }
    }
}

const useNotes = () => {
    const ctx = React.useContext(AppContext)
    if (ctx === undefined) throw new Error('useNotes() must be used within <AppProvider>')

    return ctx.notes
}

const useDeleteNote = (): ((id: string) => Promise<boolean>) => {
    const ctx = React.useContext(AppContext)
    if (ctx === undefined) throw new Error('useDeleteNote() must be used within <AppProvider>')

    return ctx.delete
}

export { AppProvider, useNotes, useDeleteNote }
