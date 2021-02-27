import React from 'react'
import { ISection } from '../../../constants'
import { Text } from '../../../components/Text'
import { TextInput } from '../../../components/TextInput'
import { View } from 'react-native'

export const Translation = ({ section, setSections, sections }: { section: ISection, setSections: React.Dispatch<React.SetStateAction<ISection[]>>, sections: ISection[] }) => {

    return (
        <View>
            <Text>From</Text>
            <TextInput value={section.props.from} onChangeText={(text: string) => {
                const _sections = Array.from(sections)
                _sections.find((s) => s.id === section.id).props.from = text
                setSections(_sections)
            }} />
            <Text>To</Text>
            <TextInput value={section.props.to} onChangeText={(text: string) => {
                const _sections = Array.from(sections)
                _sections.find((s) => s.id === section.id).props.to = text
                setSections(_sections)
            }} />
        </View>
    )
}