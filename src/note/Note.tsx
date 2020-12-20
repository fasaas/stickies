import React, { useReducer } from 'react'
import { Button, TextInput, View } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { Translation } from './sections/Translation'

export default () => {
    return (
        <View key='note-view'>
            <View>
                <TextInput accessibilityRole='header' placeholder='Note title'></TextInput>
            </View>
            <View key='sections-view' accessibilityRole='sectionList'>
                {state.map((note: { type: String; id: String; props: any }) => {
                    return <Translation {...note.props} />
                })}
            </View>
            <View key='add-sections' accessibilityRole='addSections'>
                <Picker testID='add-section'>
                    <Picker.Item label='Translation' value='translation' />
                </Picker>
            </View>
            <View key='submit-view'>
                <Button title='Save' accessibilityLabel='Save note' disabled />
                <Button title='Cancel' accessibilityLabel='Cancel' disabled />
            </View>
        </View>
    )
}
