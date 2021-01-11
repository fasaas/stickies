import React from 'react'
import { Button, Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAppProvider } from '../AppContext'
import { Octicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const ExplorerScreen = ({ navigation }: { navigation: any }) => {
    const { notes, setNotes } = useAppProvider()
    return (
        <SafeAreaView>
            <Text>Notes</Text>
            <Text>Idioma origen 1 (Origin language 1)</Text>
            {notes.map(({ id, title }, index) => (
                <View key={index}>
                    <Pressable
                        onPress={() => {
                            navigation.navigate('Note', { exists: true, id, title })
                        }}
                    >
                        <Text style={{ fontSize: 16 }}>
                            {id} - {title}
                        </Text>
                    </Pressable>
                    <Octicons
                        name='trashcan'
                        size={24}
                        color='black'
                        onPress={async () => {
                            const _notes = notes.filter((_note) => id !== _note.id)
                            setNotes(_notes)
                            await AsyncStorage.removeItem(`@note-${id}`)
                        }}
                    />
                </View>
            ))}

            <Button
                data-cy='new-note'
                title='Create new note'
                onPress={() => navigation.navigate('Note', { exists: false })}
            />
        </SafeAreaView>
    )
}
