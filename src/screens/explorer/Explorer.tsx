import { FontAwesome } from '@expo/vector-icons'
import React, { Fragment } from 'react'
import { Button, Pressable, Text, View } from 'react-native'
import { Note, Notes } from '../../interfaces'

export const Explorer = ({ navigation, notes }: { navigation: any; notes: Notes }) => {
    if (notes.length === 0) return <EmptyExplorer navigation={navigation} />
    return <ExplorerWithNotes notes={notes} />
}

const EmptyExplorer = ({ navigation }: { navigation: any }) => {
    return (
        <View>
            <Text>You don't have any saved notes</Text>
            <Button title='Create new note' />
        </View>
    )
}

const ExplorerWithNotes = ({ notes }: { notes: Notes }) => {
    return (
        <View>
            <Text>Stored notes</Text>
            {notes.map((note: Note, index: number) => {
                return (
                    <View key={`note-${index}`} testID={note.id}>
                        <FontAwesome testID='remove-note' name='trash-o' size={24} color='black' />
                        <Pressable>
                            <Text>{note.title}</Text>
                        </Pressable>
                    </View>
                )
            })}
            <Button title='Create new note' />
        </View>
    )
}
