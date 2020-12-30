import 'react-native-gesture-handler'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { AppNavigation } from './navigation'

export default () => {
    return (
        <NavigationContainer>
            <AppNavigation />
        </NavigationContainer>
    )
}
