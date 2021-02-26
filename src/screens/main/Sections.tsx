import React from 'react'
import { ISection } from '../../constants'
import { Text } from '../../components/Text'
import { TextInput } from '../../components/TextInput'
import { View } from 'react-native'
import { RemoveButton } from '../../components/RemoveButton'

type SectionsProps = {
    sections: ISection[]
    setSections: React.Dispatch<React.SetStateAction<ISection[]>>
}

export const Sections = ({ sections, setSections }: SectionsProps) => {
    return (
        sections.length
            ?
            <View>
                {
                    sections.map((section, index) => {
                        return (
                            <View key={index}>
                                <View style={{ flexDirection: 'row-reverse' }}>
                                    <RemoveButton onTerminate={() => {
                                        const _sections = Array.from(sections).filter((s) => s.id !== section.id)

                                        setSections(_sections)
                                    }} />
                                </View>
                                <Text>From</Text>
                                <TextInput style={{ borderBottomWidth: 1 }} value={section.props.from} onChangeText={(text: string) => {
                                    const _sections = Array.from(sections)
                                    _sections.find((s) => s.id === section.id).props.from = text
                                    setSections(_sections)
                                }} />
                                <Text>To</Text>
                                <TextInput style={{ borderBottomWidth: 1 }} value={section.props.to} onChangeText={(text: string) => {
                                    const _sections = Array.from(sections)
                                    _sections.find((s) => s.id === section.id).props.to = text
                                    setSections(_sections)
                                }} />
                            </View>
                        )
                    })
                }
            </View>
            : <Text>This note has no content, add some sections to it</Text>
    )
}