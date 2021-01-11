import React from 'react'
import { Button, Text, View } from 'react-native'
import { locale } from 'expo-localization'
import { Picker } from '@react-native-picker/picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { USER_FILE } from './constants'

const localizations = {
    'es-ES': 'Algún texto de bienvenida',
    'en-IE': 'Some welcome text',
}

export const FirstTime = ({ nextStep }) => {
    const [selection, setSelection] = React.useState(locale)

    return (
        <View>
            <Text>
                {localizations[selection]} in {selection}
            </Text>
            <Picker
                selectedValue={selection}
                onValueChange={(value, _) => setSelection(value.toString())}
            >
                <Picker.Item label={locale} value={locale} />
                <Picker.Item label='en-IE' value='en-IE' />
            </Picker>

            <Button
                title='Save and start'
                onPress={async () => {
                    await AsyncStorage.setItem(
                        USER_FILE,
                        JSON.stringify({ userLocale: selection, sysLocale: locale })
                    )

                    nextStep()
                }}
            />
        </View>
    )
}
