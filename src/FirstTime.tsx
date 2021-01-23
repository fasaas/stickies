import React from 'react'
import { Button, Text, View } from 'react-native'
import { locale } from 'expo-localization'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { IUser, supportedLocales, USER_FILE } from './constants'
import { OptionsPicker } from './components/LocalePicker'

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
            <OptionsPicker selection={selection} onValueChange={setSelection} options={supportedLocales} />

            <Button
                title='Save and start'
                disabled={state !== State.DISPLAY}
                onPress={async () => {
                    setState(State.SAVING)
                    const user: IUser = { userLocale: selection, sysLocale: locale }
                    await AsyncStorage.setItem(USER_FILE, JSON.stringify(user))
                    setUser(user)
                    setState(State.SAVED)
                    nextStep()
                }}
            />
        </View>
    )
}
