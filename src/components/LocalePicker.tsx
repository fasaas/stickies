import React from 'react'
import { Picker } from '@react-native-picker/picker'
import { supportedLocales } from '../constants'

type LocalePickerProps = {
    onValueChange: (selection: string) => void
    defaultSelection?: string
}

export const LocalePicker = ({ onValueChange, defaultSelection }: LocalePickerProps) => {
    return (
        <Picker
            selectedValue={defaultSelection}
            onValueChange={(value) => {
                onValueChange(value.toString())
            }}
        >
            {
                supportedLocales.map(({ label, locale }, index) =>
                    <Picker.Item key={index} label={label} value={locale} />
                )
            }
        </Picker>
    )
}