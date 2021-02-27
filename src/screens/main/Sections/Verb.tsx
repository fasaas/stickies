import React from 'react'
import { ISection } from '../../../constants'
import { Text } from '../../../components/Text'
import { TextInput } from '../../../components/TextInput'
import { Pressable, View } from 'react-native'

const pronouns = ['я', 'ты', 'он/оно', 'она', 'мы', 'вы', 'они']

export const Verb = ({ section, setSections, sections }: { section: ISection, setSections: React.Dispatch<React.SetStateAction<ISection[]>>, sections: ISection[] }) => {

    const [isPresentVisible, togglePresent] = React.useReducer((visible) => !visible, true)
    const [isPastVisible, togglePast] = React.useReducer((visible) => !visible, false)
    const [isFutureVisible, toggleFuture] = React.useReducer((visible) => !visible, false)
    return (
        <View>
            <Text>Infinitivo</Text>
            <TextInput value={section.props.infinitive} onChangeText={(text: string) => {
                const _sections = Array.from(sections)
                _sections.find((s) => s.id === section.id).props.infinitive = text
                setSections(_sections)
            }} />
            <Pressable key='present' onPress={() => togglePresent()}>
                <Text>{isPresentVisible ? 'Present' : 'Present collapsed'}</Text>
            </Pressable>
            {
                isPresentVisible
                    ? <Pronouns tense='present' section={section} sections={sections} setSections={setSections} />
                    : null
            }
            <Pressable key='past' onPress={() => togglePast()}>
                <Text>{isPastVisible ? 'Past' : 'Past collapsed'}</Text>
            </Pressable>
            {
                isPastVisible
                    ? <Pronouns tense='past' section={section} sections={sections} setSections={setSections} />
                    : null
            }
            <Pressable key='future' onPress={() => toggleFuture()}>
                <Text>{isFutureVisible ? 'Future' : 'Future collapsed'}</Text>
            </Pressable>
            {
                isFutureVisible
                    ? <Pronouns tense='future' section={section} sections={sections} setSections={setSections} />
                    : null
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
                        <View key={`present-${pronoun}-${index}`} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>{pronoun} : </Text>
                            <TextInput value={section.props[tense][pronoun]} onChangeText={(text: string) => {
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