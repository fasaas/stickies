import React from 'react'
import { ISection } from '../../../constants'
import { Text } from '../../../components/Text'
// import { TextInput } from '../../../components/TextInput'
import { Pressable, TextInput, View } from 'react-native'

const pronouns = ['я', 'ты', 'он/оно', 'она', 'мы', 'вы', 'они']

export const Verb = ({ section, setSections, sections }: { section: ISection, setSections: React.Dispatch<React.SetStateAction<ISection[]>>, sections: ISection[] }) => {

    const [isPresentVisible, togglePresent] = React.useReducer((visible) => !visible, true)
    const [isPastVisible, togglePast] = React.useReducer((visible) => !visible, false)
    const [isFutureVisible, toggleFuture] = React.useReducer((visible) => !visible, false)
    return (
        <View>
            <Text>Infinitivo</Text>
            <TextInput value={section.props.infinitive} onChangeText={(text) => {
                const _sections = Array.from(sections)
                _sections.find((s) => s.id === section.id).props.infinitive = text
                setSections(_sections)
            }} />
            <Pressable key='present' onPress={() => togglePresent()}>
                <Text>Present</Text>
            </Pressable>
            {
                isPresentVisible
                    ? <Pronouns tense='present' section={section} sections={sections} setSections={setSections} />
                    : <Text>Present collapsed</Text>
            }
            <Pressable key='past' onPress={() => togglePast()}>
                <Text>Past</Text>
            </Pressable>
            {
                isPastVisible
                    ? <Pronouns tense='past' section={section} sections={sections} setSections={setSections} />
                    : <Text>Past collapsed</Text>
            }
            <Pressable key='future' onPress={() => toggleFuture()}>
                <Text>Future</Text>
            </Pressable>
            {
                isFutureVisible
                    ? <Pronouns tense='future' section={section} sections={sections} setSections={setSections} />
                    : <Text>Future collapsed</Text>
            }
        </View>
    )
}

const Pronouns = ({ tense, section, setSections, sections }: { tense: string, section: ISection, setSections: React.Dispatch<React.SetStateAction<ISection[]>>, sections: ISection[] }) => {
    return (
        <View>
            {
                pronouns.map((pronoun: string, index) => {
                    return (
                        <View key={`present-${pronoun}-${index}`}>
                            <Text>{pronoun}</Text>
                            <TextInput value={section.props[tense][pronoun]} onChangeText={(text) => {
                                const _sections = Array.from(sections)
                                _sections.find((s) => s.id === section.id).props.present[pronoun] = text
                                setSections(_sections)
                            }} />
                        </View>
                    )
                })
            }
        </View>
    )

}