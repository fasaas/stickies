import 'react-native-gesture-handler'
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { AppNavigation } from './navigation'
import { ActivityIndicator, View } from 'react-native'
import AppCommands from './commands/AppCommands'

enum AppState {
    Idle,
    Pending,
    Resolved,
    Rejected,
}

export default () => {
    const [state, setState] = useState(AppState.Idle)
    useEffect(() => {
        const effect = async () => {
            setState(AppState.Pending)
            await AppCommands.getItems()
            setState(AppState.Resolved)
        }

        effect()
    }, [])

    switch (state) {
        case AppState.Idle: {
            return <View />
        }

        case AppState.Pending: {
            return (
                <View>
                    <ActivityIndicator testID='loading-stored-notes' />
                </View>
            )
        }

        case AppState.Resolved: {
            return (
                <NavigationContainer>
                    <AppNavigation />
                </NavigationContainer>
            )
        }
    }
}
