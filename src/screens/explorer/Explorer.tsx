import React from 'react'
import { Button, Text, View } from 'react-native'
import { Note, Notes } from '../../interfaces'
import { ExplorerNotes } from './ExplorerNotes'
import { Item } from './Item'

export const Explorer = ({ navigation, notes }: { navigation: any; notes: Notes }) => {
    if (notes.length === 0) return <EmptyExplorer navigation={navigation} />
    return <ExplorerWithNotes navigation={navigation} notes={notes} />
}

const EmptyExplorer = ({}: { navigation: any }) => {
    return (
        <View>
            <Text>You don't have any saved notes</Text>
            <Button title='Create new note' />
        </View>
    )
}

const ExplorerWithNotes = ({ notes }: { navigation: any; notes: Notes }) => {
    return (
        <View>
            <Text>Stored notes</Text>
            <ExplorerNotes notes={notes} />

            <Button title='Create new note' />
        </View>
    )
}
