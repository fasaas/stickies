import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NOTE_PREFIX } from './constants'

const AppContext = React.createContext(undefined)

export const AppProvider = ({ children }: { children: any }) => {
    const [notes, setNotes] = React.useState([
        // { id: '1', title: 'qwert' },
        // { id: '2', title: 'asdf' },
        // { id: '3', title: 'zxcvb' },
        // { id: '4', title: '12345' },
    ])

    React.useEffect(() => {
        const effect = async () => {
            const allKeys = await AsyncStorage.getAllKeys()
            const noteKeys = allKeys.filter((key) => key.startsWith(NOTE_PREFIX))
            const allNoteContents = await AsyncStorage.multiGet(noteKeys)

            const notes = allNoteContents.map(([noteId, noteContent]) => ({
                id: noteId.replace(NOTE_PREFIX, ''),
                ...JSON.parse(noteContent),
            }))
            setNotes(notes)
        }

        effect()
    }, [])

    return <AppContext.Provider value={{ notes, setNotes }}>{children}</AppContext.Provider>
}

export const useAppProvider = () => {
    const ctx = React.useContext(AppContext)

    return ctx
}
