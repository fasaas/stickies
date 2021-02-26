import React from 'react'
import { ISection } from '../../constants'
import { Text } from '../../components/Text'
import { TextInput } from '../../components/TextInput'
import { View } from 'react-native'
import { RemoveButton } from '../../components/RemoveButton'
import { Section } from './Sections/Section'

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
                                <Section section={section} setSections={setSections} sections={sections} />
                            </View>
                        )
                    })
                }
                <Text>{JSON.stringify(sections, null, 3)}</Text>
            </View>
            : <Text>This note has no content, add some sections to it</Text>
    )
}