import React, { useState } from 'react'
import { Button, View } from 'react-native'
import { Picker as NativePicker } from '@react-native-picker/picker'
import { useDispatch } from './sections/Context'

export const Picker = () => {
    const dispatch = useDispatch()
    const [selectedSection, setSection] = useState('@native/translation')
    return (
        <View key='add-sections' accessibilityRole='addSections'>
            <NativePicker
                testID='add-section'
                selectedValue={selectedSection}
                onValueChange={(value) => setSection(value.toString())}
            >
                <NativePicker.Item testID='add-section-option' label='Translation' value='@native/translation' />
            </NativePicker>
            <Button
                testID='add-section-button'
                title='Add section'
                onPress={() => {
                    dispatch({ type: 'add-section', event: { type: selectedSection } })
                }}
            />
        </View>
    )
}
