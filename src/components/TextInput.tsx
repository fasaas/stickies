import React from 'react'
import { TextInput as NativeTextInput } from 'react-native'
import { useUserTextSize } from '../contexts/user'

export const TextInput = (props) => {
    const textSize = useUserTextSize()
    const { styles, ...rest } = props
    const mergedStyles = { ...styles || {}, fontSize: textSize }
    return <NativeTextInput {...rest} style={mergedStyles} />
}