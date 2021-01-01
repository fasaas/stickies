import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNotes } from '../context/AppContext'
import Note from './note'

export const NoteScreen = ({ navigation, route }) => {
    const { id } = route.params || {}
    const notes = useNotes()
    const [currentNote, setCurrentNote] = useState({ id })

    useEffect(() => {
        const effect = () => {
            if (!id) {
                setCurrentNote({ id })
            } else {
                console.log('TCL: effect -> notes', notes)
                const requestedNote = notes.find((note) => note.id === id)
                console.log('TCL: effect -> requestedNote', requestedNote)
                if (requestedNote) setCurrentNote(requestedNote)
            }
        }

        effect()
    }, [id])

    console.log('TCL: NoteScreen -> currentNote', currentNote)
    return (
        <SafeAreaView>
            <Note {...currentNote} />
        </SafeAreaView>
    )
}
