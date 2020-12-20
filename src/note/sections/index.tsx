import React, { useState } from 'react'
import { Button, TextInput, View } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { ISection, useDispatch, useSections } from './Context'
import Section from './Section'

export default () => {
    const { sections } = useSections()
    const dispatch = useDispatch()
    const [selectedSection, setSection] = useState('@native/translation')
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
            <View key='add-sections' accessibilityRole='addSections'>
                <Picker
                    testID='add-section'
                    selectedValue={selectedSection}
                    onValueChange={(value) => setSection(value.toString())}
                >
                    <Picker.Item testID='add-section-option' label='Translation' value='@native/translation' />
                </Picker>
                <Button
                    testID='add-section-button'
                    title='Add section'
                    onPress={() => {
                        dispatch({ type: 'add-section', event: { type: selectedSection } })
                    }}
                />
            </View>
            <View key='submit-view'>
                <Button title='Save' accessibilityLabel='Save note' disabled />
                <Button title='Cancel' accessibilityLabel='Cancel' disabled />
            </View>
        </View>
    )
}
