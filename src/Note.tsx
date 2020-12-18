import React from 'react'
import { Button, Text, TextInput, View } from 'react-native'

export default () => {
    return (
        <View key='note-view'>
            <View>
                <TextInput
                    accessibilityRole='header'
                    placeholder='Note title'
                ></TextInput>
            </View>
            <View key='sections-view' accessibilityRole='sectionList'>
                <View
                    testID='@native/translation'
                    data-sectiontType='@native/translation'
                >
                    <Text>На русском</Text>
                    <TextInput placeholder='Например ...' />
                    <Text>A castellano</Text>
                    <TextInput placeholder='Por ejemplo ...' />
                </View>
            </View>
            <View key='submit-view'>
                <Button title='Save' accessibilityLabel='Save note' disabled />
                <Button title='Cancel' accessibilityLabel='Cancel' disabled />
            </View>
        </View>
    )
}
