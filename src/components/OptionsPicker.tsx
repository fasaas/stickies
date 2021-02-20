import React from 'react'
import { Picker } from '@react-native-picker/picker'
import { StyleProp, TextStyle } from 'react-native'

type OptionsPickerProps = {
    onValueChange: (selection: string) => void
    options: { label: string; value: string }[]
    selection: string
    styleOverride?: StyleProp<TextStyle>
}

export const OptionsPicker = ({ onValueChange, selection, options, styleOverride }: OptionsPickerProps) => {
    const styles = styleOverride || {}
    return (
        <Picker
            {...styles}
            selectedValue={selection}
            onValueChange={(value) => { onValueChange(value.toString()) }}
        >
            {
                options.map(({ label, value }, index) =>
                    <Picker.Item key={index} label={label} value={value} />
                )
            }
        </Picker >
    )
}