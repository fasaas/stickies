import React from 'react'
import { View } from 'react-native'
import { ResetNote } from './Reset'
import { SaveNote } from './Save'

export const FormControl = () => {
    return (
        <View key='submit-view'>
            <SaveNote />
            <ResetNote />
        </View>
    )
}
