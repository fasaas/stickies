import React from 'react'
import { TextInput as NativeTextInput } from 'react-native'
import { useUserTextSize } from '../contexts/user'

export const TextInput = (props) => {
    const textSize = useUserTextSize()
    const mergedStyles = { fontSize: textSize }
    return <NativeTextInput  {...props} style={mergedStyles} />
}