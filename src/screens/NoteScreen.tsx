import React from 'react'
import { Button, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAppProvider } from '../AppContext'

export const NoteScreen = ({ navigation, route }: { navigation: any; route: any }) => {
    const [noteExists, setNoteExists] = React.useState(false)
    const [title, setTitle] = React.useState('')
    const [noteId, setNoteId] = React.useState(Date.now().toString())
    const { notes, setNotes } = useAppProvider()

    React.useEffect(() => {
        console.log('Use effect', route.params)
        const { exists } = route.params || {}
        if (exists) {
            console.log('Exists')
            setTitle(route.params.title)
            setNoteExists(true)
            setNoteId(route.params.id)
        } else {
            console.log('doesnot exist')

            setTitle('')
            setNoteExists(false)
            setNoteId(Date.now().toString())
        }
    }, [route.params])

    return (
        <SafeAreaView>
            <TextInput value={title} onChangeText={setTitle} />
            <Button
                title='Save'
                onPress={() => {
                    const _notes = Array.from(notes)

                    if (!noteExists) {
                        _notes.push({ id: noteId, title })
                        setNotes(_notes)
                    } else {
                        const index = _notes.findIndex((note) => note.id === noteId)
                        if (index !== -1) {
                            _notes[index].title = title

                            setNotes(_notes)
                        } else {
                            //I need this case for: If I go to a Note clicking on an existing note
                            // Then I delete the note from explorer, I want to save it
                            _notes.push({ id: noteId, title })
                            setNotes(_notes)
                        }
                    }
                    navigation.setParams({ exists: true, id: noteId, title })
                }}
            />
        </SafeAreaView>
    )
}
