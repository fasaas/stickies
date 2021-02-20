import React from 'react'
import { Text as NativeText } from 'react-native'
import { useUserTextSize } from '../contexts/user'

export const Text = (props) => {
    const textSize = useUserTextSize()
    const { styles, ...rest } = props
    const mergedStyles = { ...styles || {}, fontSize: textSize }
    return <NativeText {...rest} style={mergedStyles} />
}