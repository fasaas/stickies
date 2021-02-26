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
import { Sections } from './Sections'

type RouteProps = {
    'Note': {
        potId?: string,
        noteId?: string
    }
}

const sectionOptions: { label: string; value: string }[] = [
    { label: 'Which section', value: '' },
    { label: 'Sentence', value: '@native/sentence' },
    { label: 'Verb', value: '@native/verb' }
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

            case '@native/verb': {
                const _sections = Array.from(sections)
                const newSection = {
                    id: Date.now().toString(), type, props: {
                        infinitive: '',
                        present: { 'я': '', 'ты': '', 'он/оно': '', 'она': '', 'мы': '', 'вы': '', 'они': '' },
                        past: { 'я': '', 'ты': '', 'он/оно': '', 'она': '', 'мы': '', 'вы': '', 'они': '' },
                        future: { 'я': '', 'ты': '', 'он/оно': '', 'она': '', 'мы': '', 'вы': '', 'они': '' }
                    }
                }
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
                <Sections sections={sections} setSections={setSections} />
            </ScrollView>
        </SafeAreaView>
    )
}
