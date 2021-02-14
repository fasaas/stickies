import React from 'react'
import { NavigationProp, RouteProp } from '@react-navigation/native'
import { Button, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { INote, ISection, MAIN_NAV, NOTE_PREFIX } from '../../constants'
import { usePots } from '../../contexts/pots'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { OptionsPicker } from '../../components/LocalePicker'

type RouteProps = {
    'Note': {
        potId?: string,
        noteId?: string
    }
}

const sectionOptions: { label: string; value: string }[] = [
    { label: 'Which section', value: '' },
    { label: 'Sentence', value: '@native/sentence' }
]

export const Note = ({ navigation, route }: { navigation: NavigationProp<any>, route: RouteProp<RouteProps, 'Note'> }) => {
    const [hasParams, setHasParams] = React.useState(!!route.params)
    const [potId, setPotId] = React.useState(route?.params?.potId || undefined)
    const [note, setNote] = React.useState<INote | undefined>(undefined)
    const [title, setTitle] = React.useState<string>('')
    const { pots, dispatch } = usePots()

    React.useEffect(() => {
        const hasParams = !!route.params
        if (hasParams) {
            const { potId, noteId } = route.params
            const foundNote = pots?.find((pot) => pot.id === potId)?.notes.find((note) => note.id === noteId)

            setPotId(potId)
            setNote(foundNote)
            setTitle(foundNote?.title)

        } else {
            setPotId(undefined)
            setNote(undefined)
            setTitle('')

        }
        setHasParams(!!route.params)

    }, [route.params])

    if (!hasParams) {
        return (
            <SafeAreaView>
                <View>
                    <Text>Create a new note in the Home screen</Text>
                    <Button title='Take me there' onPress={() => navigation.navigate(MAIN_NAV.Home)} />
                </View>
            </SafeAreaView>
        )
    }

    const newSection = (type: string) => {
        switch (type) {
            case '@native/sentence': {
                const _sections = Array.from(note.sections)
                _sections.push({ id: Date.now().toString(), type, props: { from: '', to: '' } })
                setNote({ ...note, sections: _sections })
            }

            default: { }
        }
    }

    return (
        <SafeAreaView>
            <Text>Here you'll see the content for pot {potId} - {note?.id}</Text>
            <View>
                <Button title='Save' onPress={async () => {
                    const newNote: INote = {
                        id: note?.id,
                        locale: note?.locale,
                        title
                    }

                    await AsyncStorage.setItem(`${NOTE_PREFIX}-${note?.id}`, JSON.stringify(newNote))
                    dispatch({ type: 'update-note', event: { note: newNote } })
                    console.log(`Note ${note?.id} updated`)
                }} />
            </View>
            <ScrollView>
                <Text>Title</Text>
                <TextInput style={{ borderBottomWidth: 1 }} value={title} onChangeText={setTitle} />
                <OptionsPicker selection='' onValueChange={newSection} options={sectionOptions} />
                {
                    note?.sections.length
                        ? note.sections.map((section, index) => {
                            return (
                                <View key={index}>
                                    <Text>From</Text>
                                    <TextInput style={{ borderBottomWidth: 1 }} value={section.props.from} onChangeText={(text) => section.props.from = text} />
                                    <Text>To</Text>
                                    <TextInput value={section.props.to} onChangeText={(text) => section.props.to = text} />
                                </View>
                            )
                        })
                        : <Text>This note has no content, add some sections to it</Text>
                }
                <Text>{JSON.stringify(note?.sections, null, 3)}</Text>
            </ScrollView>
        </SafeAreaView>
    )
}
