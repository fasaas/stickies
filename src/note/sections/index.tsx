import React from 'react'
import { TextInput, View } from 'react-native'
import { FormControl } from '../FormControl'
import { Picker } from '../Picker'
import { ISection, useSections } from './Context'
import Section from './Section'

export default () => {
    const { sections } = useSections()
    return (
        <View key='note-view'>
            <View>
                <TextInput accessibilityRole='header' placeholder='Note title'></TextInput>
            </View>
            <View key='sections-view' accessibilityRole='sectionList'>
                {sections.map((section: ISection, index) => {
                    const { type, id } = section
                    return <Section key={`${type}-${id}-${index}`} section={section} />
                })}
            </View>
            <Picker />
            <FormControl />
        </View>
    )
}
