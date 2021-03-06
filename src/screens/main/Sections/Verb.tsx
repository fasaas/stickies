import React from 'react'
import { ISection } from '../../../constants'
import { Text } from '../../../components/Text'
import { TextInput } from '../../../components/TextInput'
import { Pressable, View } from 'react-native'
import { Entypo } from '@expo/vector-icons';

const pronouns = ['я', 'ты', 'он/оно', 'она', 'мы', 'вы', 'они']

export const Verb = ({ section, setSections, sections }: { section: ISection, setSections: React.Dispatch<React.SetStateAction<ISection[]>>, sections: ISection[] }) => {
    const [isVerbViewable, toggleVerb] = React.useReducer((visible) => !visible, false);

    return (
        <View>
            <View key='collapsible' style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TextInput value={section.props.infinitive} onChangeText={(text: string) => {
                    const _sections = Array.from(sections)
                    _sections.find((s) => s.id === section.id).props.infinitive = text
                    setSections(_sections)
                }} />
                <Pressable style={{ borderWidth: 1 }} onPress={() => toggleVerb()}>
                    <Entypo name={isVerbViewable ? "chevron-down" : 'chevron-right'} size={24} color="black" />
                </Pressable>
            </View>
            {
                isVerbViewable
                    ? <View>
                        <Tense displayTense='Настоящее' tense='present' section={section} setSections={setSections} sections={sections} />
                        <Tense displayTense='Прошлое' tense='past' section={section} setSections={setSections} sections={sections} />
                        <Tense displayTense='Будующее' tense='future' section={section} setSections={setSections} sections={sections} />
                    </View>
                    : null
            }
        </View>
    )
}

const Tense = ({ displayTense, tense, section, setSections, sections }: { displayTense: string, tense: string, section: ISection, setSections: React.Dispatch<React.SetStateAction<ISection[]>>, sections: ISection[] }) => {
    const [isTenseVisible, toggleVisibility] = React.useReducer((visible) => !visible, false)

    return (
        <View>
            <View key={tense} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>{displayTense}</Text>

                <Pressable style={{ borderWidth: 1 }} onPress={() => toggleVisibility()}>
                    <Entypo name={isTenseVisible ? 'chevron-down' : 'chevron-right'} size={24} color="black" />

                </Pressable>
            </View>
            {
                isTenseVisible
                    ? <Pronouns tense={tense} section={section} sections={sections} setSections={setSections} />
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
                        <View key={`${tense}-${pronoun}-${index}`} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>{pronoun} : </Text>
                            <TextInput value={section.props[tense][pronoun]} onChangeText={(text: string) => {
                                const _sections = Array.from(sections)
                                _sections.find((s) => s.id === section.id).props[tense][pronoun] = text
                                setSections(_sections)
                            }} />
                        </View>
                    )
                })
            }
        </View>
    )

}