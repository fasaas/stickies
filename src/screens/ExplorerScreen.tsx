import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNotes } from '../context/AppContext'
import { Explorer } from './explorer/Explorer'

export const ExplorerScreen = ({ navigation }: { navigation: any }) => {
    const notes = useNotes()
    return (
        <SafeAreaView>
            <Explorer notes={notes} navigation={navigation} />
        </SafeAreaView>
    )
}
