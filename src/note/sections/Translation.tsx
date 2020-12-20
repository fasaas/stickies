import React, { useState } from 'react'
import { Button, Text, TextInput, View } from 'react-native'
import { AntDesign, FontAwesome } from '@expo/vector-icons'

export const Translation = () => {
    console.log('Translation')
    const [showTranslation, setShowTranslation] = useState(true)
    return showTranslation ? (
        <View testID='@native/translation' data-sectiontType='@native/translation'>
            <FontAwesome
                testID='remove-section'
                name='trash-o'
                size={24}
                color='black'
                onPress={() => {
                    console.log('Remove section pressed')
                    setShowTranslation(false)
                }}
            />
            <Text>На русском</Text>
            <TextInput placeholder='Например ...' />
            <Text>A castellano</Text>
            <TextInput placeholder='Por ejemplo ...' />
        </View>
    ) : (
        <View key='undo'>
            <Button
                title='Undo'
                testID='undo'
                onPress={() => {
                    setShowTranslation(true)
                }}
            />
            <AntDesign testID='close-undo' name='close' size={24} color='grey' />
        </View>
    )
}
