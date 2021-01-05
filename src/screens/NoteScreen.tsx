import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Note } from './note/Note'

export const NoteScreen = ({ navigation, route }) => {
    const noteType = route?.params?.type || 'new'
    return (
        <SafeAreaView>
            <Note />
        </SafeAreaView>
    )
}
