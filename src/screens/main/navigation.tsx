import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Home } from './home'
import { PotNavigation } from '../pot/navigation'

const { Navigator, Screen } = createStackNavigator()

export const MainScreenNavigator = () => {
    return (
        <NavigationContainer>
            <Navigator>
                <Screen name='Home' component={Home} />
                <Screen name='Stickies' component={PotNavigation} options={{ headerShown: false }} />
            </Navigator>
        </NavigationContainer>
    )
}