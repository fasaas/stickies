import React from 'react'
import { Picker } from '@react-native-picker/picker'

type OptionsPickerProps = {
    onValueChange: (selection: string) => void
    options: { label: string; value: string }[]
    selection: string
}

export const OptionsPicker = ({ onValueChange, selection: selection, options }: OptionsPickerProps) => {
    return (
        <Picker
            selectedValue={selection}
            onValueChange={(value) => { onValueChange(value.toString()) }}
        >
            {
                options.map(({ label, value }, index) =>
                    <Picker.Item key={index} label={label} value={value} />
                )
            }
        </Picker>
    )
}