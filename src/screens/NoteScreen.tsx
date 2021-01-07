import React from 'react'
import { Button, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAppProvider } from '../AppContext'

export const NoteScreen = ({ navigation, route }: { navigation: any; route: any }) => {
    console.log('🚀 ~ file: NoteScreen.tsx ~ line 7 ~ NoteScreen ~ navigation', navigation)
    const { isNew, id } = route.params || {}
    const [isNewNote, setIsNewNote] = React.useState(isNew)
    const { notes, setNotes } = useAppProvider()
    const [title, setTitle] = React.useState(isNew ? '' : route.params.title)

    React.useEffect(() => {
        console.log('Use effect', id, isNew)
        console.log(
            '🚀 ~ file: NoteScreen.tsx ~ line 23 ~ React.useEffect ~ route.params',
            route.params
        )
        setTitle(isNew ? '' : route.params.title)
        setIsNewNote(isNew)
    }, [id, isNew])

    return (
        <SafeAreaView>
            <TextInput value={title} onChangeText={setTitle} />
            <Button
                title='Save'
                onPress={() => {
                    const _notes = Array.from(notes)

                    if (isNewNote) {
                        setIsNewNote(false)
                        _notes.push({ id, title })
                        setNotes(_notes)
                    } else {
                        const index = _notes.findIndex((note) => note.id === id)
                        if (index !== -1) {
                            _notes[index].title = title

                            setNotes(_notes)
                        }
                    }
                }}
            />
        </SafeAreaView>
    )
}
