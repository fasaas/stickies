import React from 'react'
import { Text as NativeText } from 'react-native'
import { useUserTextSize } from '../contexts/user'

export const Text = (props) => {
    const textSize = useUserTextSize()
    return <NativeText {...props} style={{ fontSize: textSize }} />
}