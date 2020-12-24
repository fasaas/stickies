import React, { useState } from 'react'
import { TextInput as NativeTextInput, TextInputProps as NativeTextInputProps } from 'react-native'

export const TextInput = (props: NativeTextInputProps) => {
    const { onChangeText, ...nativeProps } = props

    const wrapOnChangeText = (text: string) => {
        if (onChangeText && text.trim().length) onChangeText(text)
    }
    return <NativeTextInput {...nativeProps} onChangeText={wrapOnChangeText} />
}
