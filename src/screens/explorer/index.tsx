import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Button, Text, View } from 'react-native'
import ExplorerCommands from '../../commands/ExplorerCommands'
import { Ionicons } from '@expo/vector-icons'
import NoteCommands from '../../commands/NoteCommands'
import { ExplorerItem } from './ExplorerItem'
import { useNotes } from '../../context/AppContext'

export const Explorer = ({ navigation }: { navigation: any }) => {
    const [notes, setNotes] = useState(useNotes())

    const erase = async (id: string) => {
        const result = await NoteCommands.erase(id)
        if (result.failed) return !!result.failed

        const filteredNotes = notes.filter((note: any) => note.id !== id)
        setNotes(filteredNotes)
    }

    const hasNotes = notes.length > 0
    if (hasNotes) {
        return (
            <View testID='explorer-tree'>
                <Text>Stored notes</Text>
                {notes.map((note, index) => {
                    return <ExplorerItem note={note} key={`note-${index}`} navigation={navigation} erase={erase} />
                })}
                <Button title='Create new note' onPress={() => navigation.navigate('Note')} />
            </View>
        )
    } else {
        return (
            <View>
                <Text>You don't have any saved notes</Text>
                <Button title='Create new note' onPress={() => navigation.navigate('Note')} />
            </View>
        )
    }
}
