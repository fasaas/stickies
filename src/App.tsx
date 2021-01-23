import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { INote, IPot, IPots, IUser, NOTE_PREFIX, POT_PREFIX, USER_FILE } from './constants'
import { FirstTime } from './FirstTime'
import { UserProvider } from './contexts/user'
import { MainScreenNavigator } from './screens/main/Navigation'
import { PotsProvider } from './contexts/pots'

enum State {
    IDLE = 'idle',
    FIRST_TIME = 'first-time',
    SHOW_APP = 'show-app',
}

const getAllPots = async (): Promise<IPots | undefined> => {
    try {
        const allKeys = await AsyncStorage.getAllKeys()
        const allPotKeys = allKeys.filter((key) => key.startsWith(POT_PREFIX))
        const allStoredPots = await AsyncStorage.multiGet(allPotKeys)
        const allPots: IPots = allStoredPots.map(([_, potContent]) => ({ ...JSON.parse(potContent) }))

        const allNoteKeys = allKeys.filter((key) => key.startsWith(NOTE_PREFIX))
        const allStoredNotes = await AsyncStorage.multiGet(allNoteKeys)
        const allNotes: INote[] = allStoredNotes.map(([_, noteContent]) => ({ ...JSON.parse(noteContent) }))

        allNotes.forEach((note) => {
            const { locale } = note
            allPots.find((pot) => pot.locale === locale)?.notes.push(note)
        })

        console.log("🚀 ~ file: App.tsx ~ line 38 ~ getAllPots ~ allPots", allPots)
        return allPots
    } catch (e) {
        console.error("Error getting all pots", e)
        return undefined
    }
}

export default () => {
    const [appState, setAppState] = React.useState(State.IDLE)
    const [user, setUser] = React.useState<IUser | undefined>(undefined)
    const [pots, setPots] = React.useState<IPots | undefined>(undefined)

    React.useEffect(() => {
        const effect = async () => {
            const item = await AsyncStorage.getItem(USER_FILE)
            if (item) {
                setUser(JSON.parse(item))
                const allPots = await getAllPots()
                setPots(allPots)
                setAppState(State.SHOW_APP)
            } else {
                setAppState(State.FIRST_TIME)
            }
        }

        effect()
    }, [])

    switch (appState) {
        case State.IDLE: {
            return <AppSplash />
        }
        case State.FIRST_TIME: {
            return <FirstTime nextStep={() => setAppState(State.SHOW_APP)} setUser={setUser} />
        }
        case State.SHOW_APP: {
            return (
                <UserProvider user={user}>
                    <PotsProvider pots={pots}>
                        <MainScreenNavigator />
                    </PotsProvider>
                </UserProvider>
            )
        }
    }
}

// Before useeffect kicks in, show a splash
const AppSplash = () => null
