import 'react-native-gesture-handler'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AppNavigation } from './src/navigation'

export default () => {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <AppNavigation />
            </NavigationContainer>
        </SafeAreaProvider>
    )
}
