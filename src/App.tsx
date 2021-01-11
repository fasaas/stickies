import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { AppNavigation } from './navigation'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { USER_FILE } from './constants'
import { FirstTime } from './FirstTime'

enum State {
    IDLE = 'idle',
    FIRST_TIME = 'first-time',
    SHOW_APP = 'show-app',
}

export default () => {
    const [appState, setAppState] = React.useState(State.IDLE)

    React.useEffect(() => {
        const effect = async () => {
            const item = await AsyncStorage.getItem(USER_FILE)
            if (item) {
                setAppState(State.SHOW_APP)
            } else {
                setAppState(State.FIRST_TIME)
            }
        }

        effect()
    }, [])

    switch (appState) {
        case State.IDLE: {
            return <AppSplash />
        }
        case State.FIRST_TIME: {
            return <FirstTime nextStep={() => setAppState(State.SHOW_APP)} />
        }
        case State.SHOW_APP: {
            return (
                <NavigationContainer>
                    <AppNavigation />
                </NavigationContainer>
            )
        }
    }
}

// Before useeffect kicks in, show a splash
const AppSplash = () => null
