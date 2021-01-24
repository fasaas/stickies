import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Home } from './Home'
import { PotNavigation } from '../note/Navigation'
import { MAIN_NAV } from '../../constants'
import { Settings } from './Settings'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Note } from './Note'

const { Navigator, Screen } = createBottomTabNavigator()

export const MainScreenNavigator = () => {
    return (
        <NavigationContainer>
            <Navigator>
                <Screen name={MAIN_NAV.Home} component={Home} />
                <Screen name={MAIN_NAV.Note} component={Note} />
                <Screen name={MAIN_NAV.Settings} component={Settings} />
            </Navigator>
        </NavigationContainer>
    )
}
