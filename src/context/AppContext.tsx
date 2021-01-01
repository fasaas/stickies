import { Ionicons } from '@expo/vector-icons'
import React, { ReactNode } from 'react'
import { ActivityIndicator, View } from 'react-native'
import AppCommands from '../commands/AppCommands'

const AppContext = React.createContext()

enum AppState {
    Idle,
    Pending,
    Resolved,
    Rejected,
}

const AppProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = React.useState(AppState.Idle)
    const [notes, setNotes] = React.useState(undefined)

    const effect = async () => {
        setState(AppState.Pending)
        const result = await AppCommands.getItems()
        if (result.failed) {
            setState(AppState.Rejected)
        } else {
            setNotes(result.notes)
            setState(AppState.Resolved)
        }
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
            return <AppContext.Provider value={{ notes }}>{children}</AppContext.Provider>
        }
    }
}

const useNotes = () => {
    const ctx = React.useContext(AppContext)
    if (ctx === undefined) throw new Error('useNotes() must be used within <AppProvider>')

    return ctx.notes
}

export { AppProvider, useNotes }
