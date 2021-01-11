import React from 'react'
import { View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Button, TextInput } from 'react-native'
import { useAppProvider } from '../../AppContext'

export const Note = (props: { id: string; content: any; navigation: any }) => {
    const [title, setTitle] = React.useState(props.content?.title || '')
    const { notes, setNotes } = useAppProvider()

    React.useEffect(() => {
        console.log('Inner use effect', props)
        setTitle(props.content?.title || '')
    }, [props.id, props.content])

    return (
        <View>
            <TextInput placeholder='заглавие (título)' value={title} onChangeText={setTitle} />
            <Button
                title='Save'
                onPress={async () => {
                    const _notes = Array.from(notes)

                    const index = _notes.findIndex((note) => note.id === props.id)
                    if (index !== -1) {
                        _notes[index].title = title
                    } else {
                        _notes.push({ id: props.id, title })
                    }
                    await AsyncStorage.setItem(`@note-${props.id}`, JSON.stringify({ title }))
                    props.navigation.setParams({ exists: true, id: props.id, title })
                    setNotes(_notes)
                }}
            />
        </View>
    )
}
