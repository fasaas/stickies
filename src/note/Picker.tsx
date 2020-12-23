import React, { useState } from 'react'
import { Button, View } from 'react-native'
import { Picker as NativePicker } from '@react-native-picker/picker'
import { useDispatch } from './context'

export const Picker = () => {
    const dispatch = useDispatch()
    const [selectedSection, setSection] = useState('@native/translation')
    return (
        <View key='add-sections'>
            <NativePicker selectedValue={selectedSection} onValueChange={(value) => setSection(value.toString())}>
                <NativePicker.Item label='Translation' value='@native/translation' />
            </NativePicker>
            <Button
                title='Add section'
                onPress={() => {
                    dispatch({ type: 'add-section', event: { type: selectedSection } })
                }}
            />
        </View>
    )
}
