import React from 'react'
import { ISection } from '../../../constants'
import { TextInput } from '../../../components/TextInput'
import { View } from 'react-native'

export const Text = ({ section, setSections, sections }: { section: ISection, setSections: React.Dispatch<React.SetStateAction<ISection[]>>, sections: ISection[] }) => {

    return (
        <View>
            <TextInput value={section.props.text} onChangeText={(text: string) => {
                const _sections = Array.from(sections)
                _sections.find((s) => s.id === section.id).props.text = text
                setSections(_sections)
            }} />
        </View>
    )
}