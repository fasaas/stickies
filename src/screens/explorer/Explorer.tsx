import React from 'react'
import { Button, Text, View } from 'react-native'
import { TABS } from '../../constants'
import { Notes } from '../../interfaces'
import { ExplorerNotes } from './ExplorerNotes'

export const Explorer = ({ navigation, notes }: { navigation: any; notes: Notes }) => {
    if (notes.length === 0) return <EmptyExplorer navigation={navigation} />
    return <ExplorerWithNotes navigation={navigation} notes={notes} />
}

const EmptyExplorer = ({ navigation }: { navigation: any }) => {
    return (
        <View>
            <Text>You don't have any saved notes</Text>
            <Button
                title='Create new note'
                onPress={() => navigation.navigate(TABS.Note, { type: 'new' })}
            />
        </View>
    )
}

const ExplorerWithNotes = ({ navigation, notes }: { navigation: any; notes: Notes }) => {
    return (
        <View testID='explorer-tree'>
            <Text>Stored notes</Text>
            <ExplorerNotes notes={notes} />
            <Button
                title='Create new note'
                onPress={() => navigation.navigate(TABS.Note, { type: 'new' })}
            />
        </View>
    )
}
