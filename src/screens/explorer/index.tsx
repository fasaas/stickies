import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Button, Text, View } from 'react-native'
import ExplorerCommands from '../../commands/ExplorerCommands'
import { Ionicons } from '@expo/vector-icons'
import NoteCommands from '../../commands/NoteCommands'
import { ExplorerItem } from './ExplorerItem'

enum ExplorerState {
    Idle,
    Pending,
    Rejected,
    Resolved,
}

export const Explorer = ({ navigation }: { navigation: any }) => {
    const [state, setState] = useState(ExplorerState.Idle)
    const [notes, setNotes] = useState([])

    const effect = async () => {
        setState(ExplorerState.Pending)
        const result = await ExplorerCommands.getItems()
        if (result.failed) {
            setState(ExplorerState.Rejected)
        }

        if (result.notes) {
            setNotes(result.notes)
            setState(ExplorerState.Resolved)
        }
    }

    const erase = async (id: string) => {
        const result = await NoteCommands.erase(id)
        if (result.failed) return true

        const filteredNotes = notes.filter((note: any) => note.id !== id)
        setNotes(filteredNotes)
    }

    useEffect(() => {
        effect()
    }, [])

    if (state === ExplorerState.Pending) {
        return <ActivityIndicator testID='pending-content' />
    }

    if (state === ExplorerState.Rejected) {
        return (
            <View>
                <Ionicons
                    name='refresh'
                    size={24}
                    color='black'
                    testID='retry-fetching-notes'
                    onPress={async () => {
                        await effect()
                    }}
                />
                <Text>Unable to retrieve notes</Text>
            </View>
        )
    }

    if (state === ExplorerState.Resolved) {
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

    return <View testID='idle' />
}
