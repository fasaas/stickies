import React from 'react'
import { useAppProvider } from './note/AppContext'
import { Note } from './note/Note'

export const NoteScreen = ({ navigation, route }: { navigation: any; route: any }) => {
    const [noteContent, setNoteContent] = React.useState(undefined)
    const [noteId, setNoteId] = React.useState('')
    const { notes } = useAppProvider()

    React.useEffect(() => {
        console.log('Use effect', route.params)
        const { exists } = route.params || {}
        if (exists) {
            const { id } = route.params
            setNoteContent(notes.find((note) => note.id === id))
            setNoteId(route.params.id)
        } else {
            setNoteContent(undefined)
            setNoteId(Date.now().toString())
        }
    }, [route.params])

    return (
        <View>
            <Note id={noteId} content={noteContent} navigation={navigation} />
        </View>
    )
}
