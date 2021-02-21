import React from 'react'
import { NavigationProp, RouteProp } from '@react-navigation/native'
import { Button, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { INote, ISection, MAIN_NAV, NOTE_PREFIX } from '../../constants'
import { usePots } from '../../contexts/pots'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { OptionsPicker } from '../../components/OptionsPicker'
import { Text } from '../../components/Text'
import { TextInput } from '../../components/TextInput'

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
    const [note, setNote] = React.useState<INote | undefined>(undefined)
    const [sections, setSections] = React.useState<ISection[]>([])
    const [title, setTitle] = React.useState<string>('')
    const { pots, dispatch } = usePots()

    React.useEffect(() => {
        const hasParams = !!route.params
        if (hasParams) {
            const { potId, noteId } = route.params
            const foundNote = pots?.find((pot) => pot.id === potId)?.notes.find((note) => note.id === noteId)

            setNote(foundNote)
            setTitle(foundNote?.title)
            setSections(foundNote?.sections)

        } else {
            setNote(undefined)
            setTitle('')
            setSections([])

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
                const _sections = Array.from(sections)
                const newSection = { id: Date.now().toString(), type, props: { from: '', to: '' } }
                _sections.push(newSection)
                setSections(_sections)
            }

            default: { }
        }
    }

    return (
        <SafeAreaView>
            <Text>Note {note?.id} content</Text>
            <View>
                <Button title='Save' onPress={async () => {
                    const newNote: INote = {
                        id: note.id,
                        locale: note.locale,
                        title,
                        sections
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
                    sections.length
                        ? sections.map((section, index) => {
                            return (
                                <View key={index}>
                                    <Text>From</Text>
                                    <TextInput style={{ borderBottomWidth: 1 }} value={section.props.from} onChangeText={(text) => {
                                        const _sections = Array.from(sections)
                                        _sections.find((s) => s.id === section.id).props.from = text
                                        setSections(_sections)
                                    }} />
                                    <Text>To</Text>
                                    <TextInput style={{ borderBottomWidth: 1 }} value={section.props.to} onChangeText={(text) => {
                                        const _sections = Array.from(sections)
                                        _sections.find((s) => s.id === section.id).props.to = text
                                        setSections(_sections)
                                    }} />
                                </View>
                            )
                        })
                        : <Text>This note has no content, add some sections to it</Text>
                }
                <Text>{JSON.stringify(sections, null, 3)}</Text>
            </ScrollView>
        </SafeAreaView>
    )
}
