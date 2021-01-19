import React from 'react'
import { Button, Text, View } from 'react-native'
import { locale } from 'expo-localization'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { IUser, USER_FILE } from '../../constants'
import { LocalePicker } from '../../components/LocalePicker'

enum State {
    DISPLAY = 'display',
    SAVING = 'saving',
    SAVED = 'saved'
}

export const FirstTime = ({ nextStep, setUser }: { nextStep: () => void; setUser: (user: IUser) => void }) => {
    const [state, setState] = React.useState(State.DISPLAY)
    const [selection, setSelection] = React.useState(locale)

    return (
        <View>
            <Text>
                We have detected your language is {locale}
            </Text>
            <LocalePicker onValueChange={setSelection} />

            <Button
                title='Save and start'
                disabled={state !== State.DISPLAY}
                onPress={async () => {
                    setState(State.SAVING)
                    await AsyncStorage.setItem(
                        USER_FILE,
                        JSON.stringify({ userLocale: selection, sysLocale: locale })
                    )
                    setState(State.SAVED)

                    setUser({ userLocale: selection, sysLocale: locale })
                    nextStep()
                }}
            />
        </View>
    )
}
