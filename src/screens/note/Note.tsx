import React, { useState } from 'react'
import { Button, TextInput, View } from 'react-native'
import { useAddNote } from '../../context/AppContext'

export const Note = () => {
    const [title, setTitle] = useState('')
    const [saveTitle, setSaveTitle] = useState('Save')
    const addNote = useAddNote()
    return (
        <View testID='note-view'>
            <TextInput placeholder='Note title' value={title} onChangeText={setTitle} />

            <Button
                title={saveTitle}
                onPress={async () => {
                    setSaveTitle('Saved!')
                    addNote(title)
                }}
            />
        </View>
    )
}
