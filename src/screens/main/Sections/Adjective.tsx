import React from 'react'
import { ISection } from '../../../constants'
import { TextInput } from '../../../components/TextInput'
import { Pressable, View } from 'react-native'
import { Entypo } from '@expo/vector-icons';

export const Adjective = ({ section, setSections, sections }: { section: ISection, setSections: React.Dispatch<React.SetStateAction<ISection[]>>, sections: ISection[] }) => {
    const [isAdjectiveViewable, toggleAdjective] = React.useReducer((visible) => !visible, false);

    return (
        <View>
            <View key='collapsible' style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TextInput placeholder='Прилагательное' value={section.props.infinitive} onChangeText={(text: string) => {
                    const _sections = Array.from(sections)
                    _sections.find((s) => s.id === section.id).props.adjective = text
                    setSections(_sections)
                }} />
                <Pressable style={{ borderWidth: 1 }} onPress={() => toggleAdjective()}>
                    <Entypo name={isAdjectiveViewable ? "chevron-down" : 'chevron-right'} size={24} color="black" />
                </Pressable>
            </View>
            {
                isAdjectiveViewable
                    ? <View>
                        <View>
                            <TextInput placeholder='Мужской' value={section.props.infinitive} onChangeText={(text: string) => {
                                const _sections = Array.from(sections)
                                _sections.find((s) => s.id === section.id).props.male = text
                                setSections(_sections)
                            }} />
                        </View>
                        <View>
                            <TextInput placeholder='Женский' value={section.props.infinitive} onChangeText={(text: string) => {
                                const _sections = Array.from(sections)
                                _sections.find((s) => s.id === section.id).props.female = text
                                setSections(_sections)
                            }} />
                        </View>
                        <View>
                            <TextInput placeholder='Средний' value={section.props.infinitive} onChangeText={(text: string) => {
                                const _sections = Array.from(sections)
                                _sections.find((s) => s.id === section.id).props.neutral = text
                                setSections(_sections)
                            }} />
                        </View>
                        <View>
                            <TextInput placeholder='Plural' value={section.props.infinitive} onChangeText={(text: string) => {
                                const _sections = Array.from(sections)
                                _sections.find((s) => s.id === section.id).props.plural = text
                                setSections(_sections)
                            }} />
                        </View>
                    </View>
                    : null
            }
        </View>
    )
}
