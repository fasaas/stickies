import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'
import { Button, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAppProvider } from '../AppContext'

export const NoteScreen = ({ navigation, route }: { navigation: any; route: any }) => {
    const [title, setTitle] = React.useState('')
    const [noteId, setNoteId] = React.useState('')
    const { notes, setNotes } = useAppProvider()

    React.useEffect(() => {
        console.log('Use effect', route.params)
        const { exists } = route.params || {}
        if (exists) {
            console.log('Exists')
            setTitle(route.params.title)
            setNoteId(route.params.id)
        } else {
            setTitle('')
            setNoteId(Date.now().toString())
        }
    }, [route.params])

    return (
        <SafeAreaView>
            <TextInput value={title} onChangeText={setTitle} />
            <Button
                title='Save'
                onPress={async () => {
                    const _notes = Array.from(notes)

                    const index = _notes.findIndex((note) => note.id === noteId)
                    if (index !== -1) {
                        _notes[index].title = title
                    } else {
                        _notes.push({ id: noteId, title })
                    }
                    setNotes(_notes)
                    await AsyncStorage.setItem(`@note-${noteId}`, JSON.stringify({ title }))
                    navigation.setParams({ exists: true, id: noteId, title })
                }}
            />
        </SafeAreaView>
    )
}
